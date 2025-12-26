/**
 * reCAPTCHA v3 Server-Side Verification
 *
 * Verifies reCAPTCHA tokens received from the client against Google's API.
 *
 * @param {string} token - The reCAPTCHA token from the client
 * @returns {Promise<{success: boolean, score?: number, error?: string}>}
 */
export async function verifyRecaptcha(token) {
  // Check if secret key is configured
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.error('RECAPTCHA_SECRET_KEY is not configured');
    return { success: false, error: 'reCAPTCHA not configured' };
  }

  // Validate token format
  if (!token || typeof token !== 'string') {
    return { success: false, error: 'Invalid token format' };
  }

  try {
    // Call Google's reCAPTCHA verification API
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${encodeURIComponent(process.env.RECAPTCHA_SECRET_KEY)}&response=${encodeURIComponent(token)}`,
    });

    const data = await response.json();

    // Check if verification was successful
    if (!data.success) {
      console.error('reCAPTCHA verification failed:', data['error-codes']);
      return {
        success: false,
        error: 'Verification failed',
        errorCodes: data['error-codes']
      };
    }

    // reCAPTCHA v3 returns a score between 0.0 and 1.0
    // 1.0 is very likely a good interaction, 0.0 is very likely a bot
    const score = data.score || 0;

    // You can adjust this threshold (0.5 is recommended by Google as a starting point)
    const threshold = 0.5;

    if (score < threshold) {
      console.warn(`reCAPTCHA score too low: ${score} (threshold: ${threshold})`);
      return {
        success: false,
        score,
        error: 'Low confidence score'
      };
    }

    return { success: true, score };

  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return {
      success: false,
      error: 'Verification request failed'
    };
  }
}