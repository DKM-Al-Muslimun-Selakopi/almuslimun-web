/**
 * Fonnte API Wrapper
 * https://api.fonnte.com/send
 */
const fetch = require('node-fetch');

const FONNTE_API = 'https://api.fonnte.com/send';
const MAX_RETRIES = 3;

/**
 * Kirim pesan WA via Fonnte
 * @param {string} token - Fonnte API token
 * @param {string} target - Nomor WA (individu) atau group_id (grup)
 * @param {string} message - Teks pesan
 * @returns {Promise<{success: boolean, id: string|null, error: string|null}>}
 */
async function sendWA(token, target, message) {
  try {
    const resp = await fetch(FONNTE_API, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        target: target,
        message: message,
        delay: 0
      })
    });

    const data = await resp.json();

    if (data.status === true || data.status === 'true') {
      return { success: true, id: data.id || null, error: null };
    } else {
      return { success: false, id: null, error: data.reason || data.message || 'Unknown error' };
    }
  } catch (err) {
    return { success: false, id: null, error: err.message };
  }
}

/**
 * Kirim dengan retry logic
 */
async function sendWithRetry(token, target, message, retries = MAX_RETRIES) {
  let lastError = null;
  for (let i = 0; i < retries; i++) {
    const result = await sendWA(token, target, message);
    if (result.success) return result;
    lastError = result.error;
    // Wait 2s before retry
    await new Promise(r => setTimeout(r, 2000));
  }
  return { success: false, id: null, error: lastError };
}

module.exports = { sendWA, sendWithRetry };
