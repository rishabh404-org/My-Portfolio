const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

// --- LOAD ENVIRONMENT VARIABLES (.env) ---
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split(/\r?\n/);
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (val && (!process.env[key] || process.env[key].trim() === '')) {
            process.env[key] = val;
          }
        }
      }
    });
  }
}
loadEnv();

const PORT = parseInt(process.env.PORT, 10) || 3000;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'rishabhkumar3800@gmail.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

// --- IN-MEMORY RATE LIMITER ---
// Max 5 submissions per 15 minutes per IP
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, firstReq: now });
    return false;
  }

  if (now - record.firstReq > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, firstReq: now });
    return false;
  }

  record.count++;
  return record.count > MAX_REQUESTS_PER_WINDOW;
}

// Clean up stale rate limit entries every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now - record.firstReq > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(ip);
    }
  }
}, 30 * 60 * 1000);

// --- STATIC MIME TYPES ---
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- SEND EMAIL VIA RESEND API ---
function sendResendEmail({ name, email, subject, message, ip }) {
  return new Promise((resolve, reject) => {
    const apiKey = (process.env.RESEND_API_KEY || RESEND_API_KEY || '').trim();

    if (!apiKey || apiKey === '' || apiKey.startsWith('re_your_api_key')) {
      const err = new Error('RESEND_API_KEY is not configured on the server. Please add your Resend API key to the .env file.');
      err.code = 'CONFIG_MISSING';
      console.error('❌ [Resend Error]: Missing or unconfigured RESEND_API_KEY in .env');
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

    const options = {
      hostname: 'api.resend.com',
      port: 443,
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    console.log(`📡 [Resend API] Sending email from "${FROM_EMAIL}" to "${CONTACT_EMAIL}" (Reply-To: ${email})...`);

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`✅ [Resend API] Email sent successfully! Message ID: ${parsed.id}`);
            resolve(parsed);
          } else {
            const errorMsg = parsed.message || parsed.error || `Resend Error (HTTP ${res.statusCode})`;
            console.error(`❌ [Resend API Error ${res.statusCode}]:`, parsed);
            const err = new Error(errorMsg);
            err.statusCode = res.statusCode;
            err.details = parsed;
            reject(err);
          }
        } catch (e) {
          console.error('❌ [Resend API Error] Failed to parse response:', data);
          reject(new Error(`Invalid response from Resend API (HTTP ${res.statusCode}): ${data}`));
        }
      });
    });

    req.on('error', (e) => {
      console.error('❌ [Resend Network Error]:', e.message);
      reject(new Error(`Network error connecting to Resend API: ${e.message}`));
    });

    req.setTimeout(12000, () => {
      req.destroy();
      console.error('❌ [Resend Timeout]: Request timed out after 12 seconds');
      reject(new Error('Resend email delivery request timed out after 12 seconds.'));
    });

    req.write(postData);
    req.end();
  });
}

// --- HTTP SERVER ---
const server = http.createServer(async (req, res) => {
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';

  // --- CORS HEADERS ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  // --- API ROUTE: POST /api/contact ---
  if (req.method === 'POST' && (req.url === '/api/contact' || req.url === '/api/contact/')) {
    // 1. Rate Limiting Check
    if (isRateLimited(clientIp)) {
      console.warn(`⚠️ [Rate Limit] Too many requests from IP: ${clientIp}`);
      res.writeHead(429, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        success: false,
        error: 'Too many requests. Please wait a few minutes before sending another message.'
      }));
    }

    // 2. Read Request Body with Size Limiting (< 50KB)
    let body = '';
    let size = 0;
    const MAX_SIZE = 50 * 1024;

    req.on('data', chunk => {
      size += chunk.length;
      if (size > MAX_SIZE) {
        res.writeHead(413, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Payload exceeds maximum permitted size (50KB).' }));
        req.destroy();
        return;
      }
      body += chunk;
    });

    req.on('end', async () => {
      try {
        let payload = {};
        try {
          payload = JSON.parse(body || '{}');
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload received.' }));
        }

        const { name, email, subject, message, _gotcha } = payload;

        // 3. Honeypot check (Silent spam protection)
        if (_gotcha && String(_gotcha).trim().length > 0) {
          console.warn(`🤖 [SPAM DETECTED] Honeypot triggered from IP: ${clientIp}`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: true, message: 'Message delivered.' }));
        }

        // 4. Server-side Validation
        const errors = {};

        if (!name || typeof name !== 'string' || name.trim().length < 2) {
          errors.name = 'Name must be at least 2 characters.';
        } else if (name.trim().length > 100) {
          errors.name = 'Name cannot exceed 100 characters.';
        }

        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
        if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
          errors.email = 'Please provide a valid email address.';
        } else if (email.trim().length > 150) {
          errors.email = 'Email cannot exceed 150 characters.';
        }

        if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
          errors.subject = 'Subject must be at least 3 characters.';
        } else if (subject.trim().length > 150) {
          errors.subject = 'Subject cannot exceed 150 characters.';
        }

        if (!message || typeof message !== 'string' || message.trim().length < 10) {
          errors.message = 'Message must be at least 10 characters.';
        } else if (message.trim().length > 5000) {
          errors.message = 'Message cannot exceed 5000 characters.';
        }

        if (Object.keys(errors).length > 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, errors, error: 'Please correct the highlighted fields.' }));
        }

        // 5. Send Email via Resend
        const result = await sendResendEmail({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          ip: clientIp
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: "Message sent successfully! I'll get back to you as soon as possible.",
          id: result.id
        }));

      } catch (err) {
        console.error('❌ Server error handling /api/contact:', err.message);
        res.writeHead(err.statusCode || 500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: err.message || "Your message couldn't be sent right now. Please try again or contact me directly by email."
        }));
      }
    });

    return;
  }

  // --- HEALTH CHECK ROUTE ---
  if (req.method === 'GET' && req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      status: 'ok',
      resendConfigured: !!(process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.startsWith('re_your_api_key')),
      recipient: CONTACT_EMAIL
    }));
  }

  // --- STATIC FILE SERVING ---
  const urlPath = req.url.split('?')[0];
  let filePath = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);
  
  // Security check: prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 Portfolio Server running at http://localhost:${PORT}/`);
  console.log(`📬 Direct contact recipient: ${CONTACT_EMAIL}`);
  console.log(`🔑 Resend API Key: ${process.env.RESEND_API_KEY ? 'Configured ✅' : 'Not Configured (Add to .env) ⚠️'}`);
  console.log(`=================================================`);
});
