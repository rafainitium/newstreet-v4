/**
 * POST /api/contact
 *
 * Vercel serverless function backing the contact form on contact.html.
 * Sends the submission as an email via Resend (https://resend.com).
 *
 * Setup (one-time, in the Vercel dashboard for this project):
 *   1. Create a free Resend account and grab an API key
 *      (Vercel → Integrations → Resend is the fastest way to connect
 *      the two — it creates the key and env var for you).
 *   2. Project Settings → Environment Variables, add:
 *        RESEND_API_KEY      = re_xxxxxxxx   (required)
 *        CONTACT_TO_EMAIL    = info@newst.com   (optional — this is
 *                               already the default below)
 *        CONTACT_FROM_EMAIL  = "Newstreet Website <onboarding@resend.dev>"
 *                               (optional — swap in a verified sending
 *                               domain once one is set up in Resend, e.g.
 *                               "Newstreet Website <noreply@newst.com>")
 *   3. Redeploy so the new env vars take effect.
 *
 * Until RESEND_API_KEY is set, this endpoint responds with a clear 500
 * so the form's error state shows instead of silently failing.
 *
 * ESM, NOT `module.exports`. This file came over from V3, which had no
 * package.json and so ran it as CommonJS. V4's package.json declares
 * "type": "module", which makes every .js in the package ESM — and there
 * `module.exports = handler` does not throw, it quietly assigns onto an
 * unrelated global and exports nothing at all. Vercel then finds no handler
 * and the route 500s with nothing in the logs to say why. Keep this an
 * `export default`.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  const inquiryType = String(body.inquiryType || '').trim();
  const fullName = String(body.fullName || '').trim();
  const organization = String(body.organization || '').trim();
  const email = String(body.email || '').trim();
  const message = String(body.message || '').trim();

  if (!fullName || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[api/contact] RESEND_API_KEY is not set in this environment');
    return res.status(500).json({ error: 'Email service is not configured yet' });
  }

  const to = process.env.CONTACT_TO_EMAIL || 'info@newst.com';
  const from = process.env.CONTACT_FROM_EMAIL || 'Newstreet Website <onboarding@resend.dev>';

  const esc = (s) => String(s || '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));

  const html = `
    <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #111;">
      <h2 style="margin: 0 0 16px; font-size: 18px;">New ${esc(inquiryType) || 'website'} inquiry</h2>
      <p style="margin: 0 0 8px;"><strong>Name:</strong> ${esc(fullName)}</p>
      <p style="margin: 0 0 8px;"><strong>Organization:</strong> ${esc(organization) || '—'}</p>
      <p style="margin: 0 0 8px;"><strong>Email:</strong> ${esc(email)}</p>
      <p style="margin: 16px 0 0;"><strong>Message:</strong></p>
      <p style="margin: 4px 0 0; white-space: pre-wrap;">${esc(message)}</p>
    </div>
  `;

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `New ${inquiryType || 'website'} inquiry from ${fullName}`,
        html
      })
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error('[api/contact] Resend error:', resendRes.status, errText);
      return res.status(502).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[api/contact] Unexpected error:', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
