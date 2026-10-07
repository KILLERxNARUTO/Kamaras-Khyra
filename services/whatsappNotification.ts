/**
 * Optional CallMeBot WhatsApp fallback service
 * https://www.callmebot.com/blog/free-api-whatsapp-messages/
 */

export interface CallMeBotConfig {
  phone?: string;
  apiKey?: string;
}

export async function sendCallMeBotMessage(
  message: string,
  config?: CallMeBotConfig
): Promise<{ success: boolean; error?: string }> {
  const phone = (config?.phone || process.env.CALLMEBOT_PHONE || '').replace(/\D/g, '');
  const apiKey = (config?.apiKey || process.env.CALLMEBOT_API_KEY || '').trim();

  if (!phone || !apiKey) {
    return {
      success: false,
      error: 'CallMeBot credentials (CALLMEBOT_PHONE, CALLMEBOT_API_KEY) are not set.',
    };
  }

  try {
    const encodedText = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedText}&apikey=${apiKey}`;

    const res = await fetch(url, { method: 'GET' });
    const responseText = await res.text();

    if (res.ok && !responseText.toLowerCase().includes('error')) {
      return { success: true };
    }

    return {
      success: false,
      error: `CallMeBot rejected request: ${responseText}`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: `CallMeBot network request failed: ${errorMsg}`,
    };
  }
}
