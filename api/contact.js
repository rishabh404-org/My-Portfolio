/**
 * Serverless Contact Handler for Vercel / Netlify / AWS Lambda
 * Route: POST /api/contact
 */

const https = require('https');

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'rishabhkumar3800@gmail.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sendEmail({ name, email, subject, message, ip }) {
  return new Promise((resolve, reject) => {
    const apiKey = (process.env.RESEND_API_KEY || RESEND_API_KEY || '').trim();

    if (!apiKey || apiKey === '' || apiKey.startsWith('re_your_api_key')) {
      const err = new Error('RESEND_API_KEY is not configured on the server. Please add your Resend API key to environment variables.');
      err.statusCode = 500;
      return reject(err);
    }

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0d1117; color: #e6edf3; margin: 0; padding: 24px; }
          .container { max-width: 600px; margin: 0 auto; background: #161b22; border: 1px solid #30363d; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
          .header { background: #0b0e14; color: #ffffff; padding: 24px; border-bottom: 3px solid #6366f1; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; }
          .content { padding: 24px; }
          .field-group { margin-bottom: 18px; }
          .field-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #8b949e; margin-bottom: 5px; letter-spacing: 0.06em; }
          .field-val { font-size: 15px; color: #f0f6fc; font-weight: 500; }
          .field-val a { color: #818cf8; text-decoration: none; }
          .message-box { background: #0d1117; border-left: 4px solid #6366f1; padding: 16px; border-radius: 6px; font-size: 15px; line-height: 1.65; color: #e6edf3; white-space: pre-wrap; margin-top: 14px; border-top: 1px solid #21262d; border-right: 1px solid #21262d; border-bottom: 1px solid #21262d; }
          .footer { background: #0b0e14; padding: 16px 24px; border-top: 1px solid #30363d; font-size: 12px; color: #8b949e; text-align: center; }
          .reply-badge { display: inline-block; background: rgba(99, 102, 241, 0.15); color: #a5b4fc; border: 1px solid rgba(99, 102, 241, 0.3); padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-top: 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 New Portfolio Inquiry</h1>
          </div>
          <div class="content">
            <div class="field-group">
              <div class="field-label">Sender Name</div>
              <div class="field-val">${escapeHtml(name)}</div>
            </div>
            <div class="field-group">
              <div class="field-label">Sender Email</div>
              <div class="field-val"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>
              <span class="reply-badge">Click "Reply" to answer directly</span>
            </div>
            <div class="field-group">
              <div class="field-label">Subject</div>
              <div class="field-val">${escapeHtml(subject)}</div>
            </div>
            <div class="field-group">
              <div class="field-label">Message</div>
              <div class="message-box">${escapeHtml(message)}</div>
            </div>
          </div>
          <div class="footer">
            Received via Portfolio Contact API • Sender IP: ${ip} • ${new Date().toUTCString()}
          </div>
        </div>
      </body>
      </html>
    `;

    const textBody = `
New Portfolio Inquiry from ${name}

Sender Name: ${name}
Sender Email: ${email}
Subject: ${subject}
Date: ${new Date().toUTCString()}

Message:
------------------------------------------------------------
${message}
------------------------------------------------------------

* Simply hit "Reply" in your email client to respond to ${email}.
    `.trim();

    const postData = JSON.stringify({
      from: FROM_EMAIL,
      to: [CONTACT_EMAIL],
      reply_to: email,
      subject: `Portfolio Contact: ${subject}`,
      html: htmlBody,
      text: textBody
    });

    const req = https.request({
      hostname: 'api.resend.com',
      port: 443,
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            const err = new Error(parsed.message || parsed.error || `Resend error (HTTP ${res.statusCode})`);
            err.statusCode = res.statusCode;
            err.details = parsed;
            reject(err);
          }
        } catch (e) {
          reject(new Error(`Invalid response from Resend (HTTP ${res.statusCode}): ${data}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error(`Network error connecting to Resend: ${e.message}`));
    });

    req.setTimeout(12000, () => {
      req.destroy();
      reject(new Error('Resend email delivery request timed out.'));
    });

    req.write(postData);
    req.end();
  });
}

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ success: false, error: 'Invalid JSON body' });
      }
    }

    const { name, email, subject, message, _gotcha } = body || {};

    if (_gotcha && String(_gotcha).trim().length > 0) {
      return res.status(200).json({ success: true, message: 'Message delivered.' });
    }

    const errors = {};
    if (!name || typeof name !== 'string' || name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) errors.email = 'Valid email is required.';
    if (!subject || typeof subject !== 'string' || subject.trim().length < 3) errors.subject = 'Subject must be at least 3 characters.';
    if (!message || typeof message !== 'string' || message.trim().length < 10) errors.message = 'Message must be at least 10 characters.';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors, error: 'Please correct the highlighted form fields.' });
    }

    const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
    const result = await sendEmail({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      ip: clientIp
    });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully! I'll get back to you as soon as possible.",
      id: result.id
    });
  } catch (error) {
    console.error('Serverless Contact Handler Error:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Your message couldn't be sent right now. Please try again or contact me directly by email."
    });
  }
};
