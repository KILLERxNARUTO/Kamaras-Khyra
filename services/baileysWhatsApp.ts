import path from 'path';
import fs from 'fs';
import {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  ConnectionState,
  WASocket,
  fetchLatestBaileysVersion,
} from '@whiskeysockets/baileys';
import QRCode from 'qrcode';
import { sendCallMeBotMessage } from './whatsappNotification';

export type BotStatus = 'disconnected' | 'connecting' | 'qr_ready' | 'connected';

class BaileysWhatsAppService {
  private sock: WASocket | null = null;
  private status: BotStatus = 'disconnected';
  private qrRaw: string | null = null;
  private qrDataUrl: string | null = null;
  private connectedPhone: string | null = null;
  private reconnectAttempts = 0;
  private authDir: string;
  private isInitializing = false;

  constructor() {
    this.authDir = path.resolve(process.cwd(), 'auth_info_baileys');
  }

  public getStatus() {
    return {
      status: this.status,
      connectedPhone: this.connectedPhone,
      qrDataUrl: this.qrDataUrl,
      reconnectAttempts: this.reconnectAttempts,
    };
  }

  public async initialize(): Promise<void> {
    if (this.isInitializing) return;
    this.isInitializing = true;

    try {
      if (!fs.existsSync(this.authDir)) {
        fs.mkdirSync(this.authDir, { recursive: true });
      }

      const { state, saveCreds } = await useMultiFileAuthState(this.authDir);
      const { version } = await fetchLatestBaileysVersion();

      this.status = 'connecting';

      // Disconnect existing socket if any
      if (this.sock) {
        try {
          this.sock.end(undefined);
        } catch {
          // ignore
        }
      }

      this.sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true,
        browser: ['Kamars Khyra Clinic', 'Chrome', '1.0.0'],
        syncFullHistory: false,
      });

      this.sock.ev.on('creds.update', saveCreds);

      this.sock.ev.on('connection.update', async (update: Partial<ConnectionState>) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          this.qrRaw = qr;
          this.status = 'qr_ready';
          try {
            this.qrDataUrl = await QRCode.toDataURL(qr, {
              margin: 2,
              width: 320,
              color: {
                dark: '#14140F',
                light: '#FFFFFF',
              },
            });
            console.log('\n[BAILEYS] Scan the QR code in browser at /whatsapp-qr or via terminal.\n');
          } catch (qrErr) {
            console.error('[BAILEYS] Failed to generate QR data URL:', qrErr);
          }
        }

        if (connection === 'close') {
          this.qrDataUrl = null;
          this.connectedPhone = null;
          const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

          console.warn(`[BAILEYS] Connection closed. Status code: ${statusCode}. Reconnecting: ${shouldReconnect}`);

          if (shouldReconnect) {
            this.status = 'connecting';
            this.reconnectAttempts += 1;
            const delay = Math.min(this.reconnectAttempts * 3000, 15000);
            setTimeout(() => {
              this.isInitializing = false;
              this.initialize();
            }, delay);
          } else {
            this.status = 'disconnected';
            this.isInitializing = false;
            console.log('[BAILEYS] Logged out from WhatsApp. Clear auth or scan again.');
          }
        } else if (connection === 'open') {
          this.status = 'connected';
          this.reconnectAttempts = 0;
          this.qrRaw = null;
          this.qrDataUrl = null;

          const userJid = this.sock?.user?.id || '';
          this.connectedPhone = userJid.split(':')[0] || userJid.split('@')[0] || 'Unknown';
          console.log(`\n✅ [BAILEYS] WhatsApp client linked successfully! User: +${this.connectedPhone}\n`);
        }
      });
    } catch (error) {
      console.error('[BAILEYS] Initialization error:', error);
      this.status = 'disconnected';
    } finally {
      this.isInitializing = false;
    }
  }

  public async logout(): Promise<void> {
    try {
      if (this.sock) {
        await this.sock.logout().catch(() => {});
        this.sock.end(undefined);
      }
    } catch (e) {
      console.error('[BAILEYS] Error during socket logout:', e);
    }

    this.sock = null;
    this.status = 'disconnected';
    this.qrDataUrl = null;
    this.connectedPhone = null;

    if (fs.existsSync(this.authDir)) {
      try {
        fs.rmSync(this.authDir, { recursive: true, force: true });
        console.log('[BAILEYS] Auth directory wiped. Ready for fresh session pairing.');
      } catch (rmErr) {
        console.error('[BAILEYS] Could not delete auth dir:', rmErr);
      }
    }

    await this.initialize();
  }

  /**
   * Dispatches text alert to owner number(s) via Baileys socket.
   * If socket is offline/logged out, falls back to CallMeBot.
   */
  public async sendMessage(
    targetPhone: string,
    message: string
  ): Promise<{ success: boolean; method: 'baileys' | 'callmebot' | 'none'; error?: string }> {
    const cleanPhone = targetPhone.replace(/\D/g, '');
    if (!cleanPhone) {
      return { success: false, method: 'none', error: 'Invalid recipient phone number.' };
    }

    const jid = `${cleanPhone}@s.whatsapp.net`;

    if (this.status === 'connected' && this.sock) {
      try {
        await this.sock.sendMessage(jid, { text: message });
        return { success: true, method: 'baileys' };
      } catch (err: unknown) {
        console.error(`[BAILEYS] Message send failure to ${cleanPhone}:`, err);
      }
    }

    console.warn(`[BAILEYS] Bot not connected (State: ${this.status}). Engaging CallMeBot fallback...`);
    const fallbackRes = await sendCallMeBotMessage(message, { phone: cleanPhone });
    if (fallbackRes.success) {
      return { success: true, method: 'callmebot' };
    }

    return {
      success: false,
      method: 'none',
      error: fallbackRes.error || 'Baileys not connected and fallback failed.',
    };
  }

  /**
   * Dispatches formatted appointment notification to all owner phone numbers
   */
  public async dispatchBookingAlert(details: {
    customerName: string;
    phone: string;
    serviceName: string;
    date: string;
    time?: string;
    bookingRef: string;
    notes?: string;
  }): Promise<{ phone: string; success: boolean; method: string; error?: string }[]> {
    const rawPhones = process.env.OWNER_PHONE || process.env.SHOP_PHONE_NUMBER || '917305063062';
    const phoneList = rawPhones
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    const timeRow = details.time ? `*Time:* ${details.time}\n` : '';
    const notesRow = details.notes ? `*Notes:* ${details.notes}\n` : '';

    const alertMessage =
      `*NEW APPOINTMENT BOOKED*\n` +
      `--------------------------------\n` +
      `*Client:* ${details.customerName}\n` +
      `*Phone:* ${details.phone}\n` +
      `*Service:* ${details.serviceName}\n` +
      `*Date:* ${details.date}\n` +
      timeRow +
      `*Booking Ref:* ${details.bookingRef}\n` +
      notesRow +
      `--------------------------------`;

    const results = [];
    for (const phone of phoneList) {
      const res = await this.sendMessage(phone, alertMessage);
      results.push({ phone, ...res });
    }

    return results;
  }
}

export const baileysWhatsApp = new BaileysWhatsAppService();
