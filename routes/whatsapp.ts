import { Router, Request, Response } from 'express';
import { baileysWhatsApp } from '../services/baileysWhatsApp';

const router = Router();

/**
 * GET /api/whatsapp/status
 * Returns current bot connection state, phone number, and QR data URL
 */
router.get('/status', (req: Request, res: Response) => {
  const status = baileysWhatsApp.getStatus();
  res.json({
    success: true,
    data: status,
  });
});

/**
 * POST /api/whatsapp/test
 * Sends a sample test message to the configured owner numbers
 */
router.post('/test', async (req: Request, res: Response) => {
  try {
    const rawPhones = process.env.OWNER_PHONE || process.env.SHOP_PHONE_NUMBER || '917305063062';
    const testMessage =
      req.body.message ||
      `🔔 *WhatsApp Notification Test*\n\nYour automated WhatsApp bot service for Kamars Khyra is working perfectly!\nTimestamp: ${new Date().toLocaleString()}`;

    const phoneList = rawPhones.split(',').map((p) => p.trim()).filter(Boolean);
    const results = [];

    for (const phone of phoneList) {
      const dispatchResult = await baileysWhatsApp.sendMessage(phone, testMessage);
      results.push({ phone, ...dispatchResult });
    }

    res.json({
      success: true,
      message: 'Test message dispatch attempted.',
      results,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to dispatch test notification.',
    });
  }
});

/**
 * POST /api/whatsapp/logout
 * Clears the session directory and triggers fresh QR generation
 */
router.post('/logout', async (req: Request, res: Response) => {
  try {
    await baileysWhatsApp.logout();
    res.json({
      success: true,
      message: 'Logged out successfully. Auth session cleared and fresh pairing initiated.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to logout session.',
    });
  }
});

/**
 * GET /whatsapp-qr or GET /api/whatsapp/view-qr
 * Visual dark-mode web page displaying live auto-refreshing QR code
 */
export function renderQrPage(req: Request, res: Response) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WhatsApp Bot Link | Kamars Khyra</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0d0f0e;
      --card: #151816;
      --border: #232a25;
      --accent: #25d366;
      --accent-glow: rgba(37, 211, 102, 0.2);
      --gold: #f5cf47;
      --text: #f0f2f0;
      --muted: #8b968f;
      --danger: #ef4444;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Space Grotesk', -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      position: relative;
      overflow-x: hidden;
    }
    .background-glow {
      position: absolute;
      top: 20%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 480px;
      height: 480px;
      background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }
    .container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 460px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 36px 28px;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 9999px;
      background: rgba(37, 211, 102, 0.1);
      color: var(--accent);
      border: 1px solid rgba(37, 211, 102, 0.25);
      margin-bottom: 16px;
    }
    h1 {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
      color: #ffffff;
    }
    p.subtitle {
      color: var(--muted);
      font-size: 13.5px;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    .qr-frame {
      width: 280px;
      height: 280px;
      margin: 0 auto 24px;
      background: #ffffff;
      border-radius: 12px;
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px rgba(0,0,0,0.4);
      position: relative;
    }
    .qr-frame img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
      border-radius: 6px;
    }
    .qr-loading {
      color: #14140f;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 600;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid rgba(0,0,0,0.15);
      border-top-color: #14140f;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .status-panel {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 14px 16px;
      margin-bottom: 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .status-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 6px;
    }
    .status-connected { background: var(--accent); box-shadow: 0 0 8px var(--accent); }
    .status-qr_ready { background: var(--gold); box-shadow: 0 0 8px var(--gold); }
    .status-connecting { background: #38bdf8; }
    .status-disconnected { background: var(--danger); }
    .btn-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    button {
      padding: 10px 14px;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 13px;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid transparent;
    }
    .btn-test {
      background: rgba(37, 211, 102, 0.15);
      color: var(--accent);
      border-color: rgba(37, 211, 102, 0.3);
    }
    .btn-test:hover {
      background: rgba(37, 211, 102, 0.25);
    }
    .btn-logout {
      background: rgba(239, 68, 68, 0.12);
      color: var(--danger);
      border-color: rgba(239, 68, 68, 0.3);
    }
    .btn-logout:hover {
      background: rgba(239, 68, 68, 0.22);
    }
    .toast {
      margin-top: 14px;
      font-size: 12px;
      color: var(--muted);
      min-height: 18px;
    }
  </style>
</head>
<body>
  <div class="background-glow"></div>
  <div class="container">
    <div class="badge">WhatsApp Web Bot</div>
    <h1>Kamars Khyra Dispatcher</h1>
    <p class="subtitle">Scan the QR code from WhatsApp &gt; Linked Devices to authorize automated appointment alerts.</p>

    <div class="qr-frame" id="qrContainer">
      <div class="qr-loading">
        <div class="spinner"></div>
        <span>Generating QR Code...</span>
      </div>
    </div>

    <div class="status-panel">
      <span>Status: <strong id="statusText">Connecting...</strong></span>
      <span id="phoneText" style="color: var(--muted);">Checking...</span>
    </div>

    <div class="btn-group">
      <button class="btn-test" onclick="sendTestAlert()">Send Test Alert</button>
      <button class="btn-logout" onclick="logoutSession()">Unlink Device</button>
    </div>

    <div class="toast" id="toastMsg"></div>
  </div>

  <script>
    let pollInterval = null;

    async function checkStatus() {
      try {
        const res = await fetch('/api/whatsapp/status');
        const json = await res.json();
        const data = json.data;

        const qrContainer = document.getElementById('qrContainer');
        const statusText = document.getElementById('statusText');
        const phoneText = document.getElementById('phoneText');

        statusText.innerHTML = \`<span class="status-dot status-\${data.status}"></span>\${data.status.toUpperCase()}\`;

        if (data.status === 'connected') {
          phoneText.innerText = data.connectedPhone ? '+' + data.connectedPhone : 'Active';
          qrContainer.innerHTML = \`
            <div style="color: #1f3a2e; text-align: center; padding: 20px;">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#25d366" stroke-width="2.5" style="margin-bottom: 12px;">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <h3 style="color: #14140f; font-size: 16px;">WhatsApp Connected!</h3>
              <p style="color: #4b5563; font-size: 12px; margin-top: 6px;">Ready to dispatch clinic booking notifications.</p>
            </div>
          \`;
        } else if (data.status === 'qr_ready' && data.qrDataUrl) {
          phoneText.innerText = 'Scan QR';
          qrContainer.innerHTML = \`<img src="\${data.qrDataUrl}" alt="WhatsApp Scan QR" />\`;
        } else {
          phoneText.innerText = 'Awaiting connection';
          qrContainer.innerHTML = \`
            <div class="qr-loading">
              <div class="spinner"></div>
              <span>Connecting WhatsApp...</span>
            </div>
          \`;
        }
      } catch (e) {
        console.error('Error polling status:', e);
      }
    }

    async function sendTestAlert() {
      showToast('Sending test message...');
      try {
        const res = await fetch('/api/whatsapp/test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
        const json = await res.json();
        showToast(json.success ? '✅ Test alert dispatched!' : ('❌ ' + (json.error || 'Failed')));
      } catch (err) {
        showToast('❌ Failed to dispatch test.');
      }
    }

    async function logoutSession() {
      if (!confirm('Unlink this WhatsApp session and regenerate QR?')) return;
      showToast('Unlinking session...');
      try {
        await fetch('/api/whatsapp/logout', { method: 'POST' });
        showToast('Session cleared. Refreshing QR...');
        setTimeout(checkStatus, 1500);
      } catch (err) {
        showToast('❌ Logout error.');
      }
    }

    function showToast(msg) {
      const el = document.getElementById('toastMsg');
      el.innerText = msg;
      setTimeout(() => { if (el.innerText === msg) el.innerText = ''; }, 4000);
    }

    checkStatus();
    pollInterval = setInterval(checkStatus, 3000);
  </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}

export default router;
