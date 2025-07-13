// src/utils/sendEmail.ts

/**
 * Sends a password-reset email via Resend’s HTTP API.
 * Uses fetch directly so it works in both Edge and Node runtimes.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails'
const API_KEY = process.env.RESEND_API_KEY

if (!API_KEY) {
    throw new Error('Missing RESEND_API_KEY in environment')
}

export const sendResetEmail = async (
    email: string,
    link: string
): Promise<boolean> => {
    try {
        const res = await fetch(RESEND_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'onboarding@resend.dev',
                to: email,
                subject: 'BuzzChat – Reset Your Password',
                html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
                      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                      line-height: 1.6; background: #fff9eb; padding: 30px; color: #333;">
            <div style="max-width:600px;margin:auto;border:1px solid #f6e58d;
                        border-radius:8px;box-shadow:0 4px 12px rgba(230,210,120,0.3);
                        background:white;padding:30px;">
              <!-- Logo -->
              <div style="text-align:center;margin-bottom:25px;">
                <img
                  src="https://your-logo-url-here.png"
                  alt="BuzzChat Logo"
                  width="120"
                  style="display:inline-block;border-radius:20px"
                />
              </div>

              <h2 style="color:#f1c40f;font-weight:700;font-size:1.8rem;
                         margin-bottom:20px;text-align:center">
                Password Reset Request
              </h2>

              <p style="font-size:1rem;margin-bottom:16px;">Hello,</p>

              <p style="font-size:1rem;margin-bottom:24px;">
                You recently requested to reset your password. Click the button below to continue:
              </p>

              <p style="text-align:center;margin-bottom:32px;">
                <a href="${link}" target="_blank"
                   style="background-color:#f1c40f;color:#222;
                          padding:12px 28px;border-radius:6px;
                          font-weight:600;text-decoration:none;
                          display:inline-block;box-shadow:0 4px 6px rgba(241,196,15,0.5);">
                  Reset Password
                </a>
              </p>

              <p style="font-size:0.9rem;color:#555;margin-bottom:16px;">
                If you didn’t request this, you can safely ignore this email.
              </p>

              <p style="font-size:0.9rem;color:#555;margin-bottom:0;text-align:center;">
                — The BuzzChat Team —
              </p>
            </div>
          </div>
        `,
            }),
        })

        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}))
            console.error('Resend HTTP error:', res.status, errBody)
            return false
        }

        console.log('✅ Reset email sent to', email)
        return true

    } catch (err) {
        console.error('Network error sending reset email:', err)
        return false
    }
}
