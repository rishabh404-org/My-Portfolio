/**
 * Direct Email Contact Module
 * Handles client-side validation, asynchronous dispatch to /api/contact,
 * honeypot protection, draft auto-saving, accessibility alerts, and fallback direct email.
 */

class ContactModule {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.nameInput = document.getElementById('contact-name');
    this.emailInput = document.getElementById('contact-email');
    this.subjectInput = document.getElementById('contact-subject');
    this.messageInput = document.getElementById('contact-message');
    this.gotchaInput = document.getElementById('contact-gotcha');
    this.submitBtn = document.getElementById('contact-submit-btn');
    this.statusAlert = document.getElementById('contact-status-alert');
    this.confettiCanvas = document.getElementById('confetti-canvas');

    this.init();
  }

  init() {
    this.loadDraft();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Auto-save draft on typing
    const inputs = [this.nameInput, this.emailInput, this.subjectInput, this.messageInput];
    inputs.forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          this.clearInputError(input);
          this.saveDraft();
        });
      }
    });

    // Form submission
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }

    // 1-Click Copy email buttons
    document.querySelectorAll('[data-action="copy-email"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.copyEmail();
      });
    });
  }

  saveDraft() {
    const draft = {
      name: this.nameInput?.value || '',
      email: this.emailInput?.value || '',
      subject: this.subjectInput?.value || '',
      message: this.messageInput?.value || ''
    };
    try {
      localStorage.setItem('portfolio_contact_draft', JSON.stringify(draft));
    } catch (e) {}
  }

  loadDraft() {
    try {
      const saved = localStorage.getItem('portfolio_contact_draft');
      if (saved) {
        const draft = JSON.parse(saved);
        if (this.nameInput && draft.name) this.nameInput.value = draft.name;
        if (this.emailInput && draft.email) this.emailInput.value = draft.email;
        if (this.subjectInput && draft.subject) this.subjectInput.value = draft.subject;
        if (this.messageInput && draft.message) this.messageInput.value = draft.message;
      }
    } catch (e) {}
  }

  clearAlert() {
    if (this.statusAlert) {
      this.statusAlert.className = 'contact-status-alert';
      this.statusAlert.innerHTML = '';
    }
  }

  showAlert(type, title, message) {
    if (!this.statusAlert) return;
    this.statusAlert.className = `contact-status-alert show ${type}`;
    this.statusAlert.innerHTML = `
      <div class="alert-icon">${type === 'success' ? '✓' : '⚠️'}</div>
      <div class="alert-content">
        <div class="alert-title">${title}</div>
        <div class="alert-msg">${message}</div>
      </div>
    `;
    this.statusAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  async handleSubmit() {
    this.clearAlert();

    const name = this.nameInput?.value.trim() || '';
    const email = this.emailInput?.value.trim() || '';
    const subject = this.subjectInput?.value.trim() || '';
    const message = this.messageInput?.value.trim() || '';
    const gotcha = this.gotchaInput?.value.trim() || '';

    // --- CLIENT-SIDE VALIDATION ---
    let hasError = false;

    if (!name || name.length < 2) {
      this.showInputError(this.nameInput, "Please enter your full name (minimum 2 characters).");
      hasError = true;
    } else if (name.length > 100) {
      this.showInputError(this.nameInput, "Name cannot exceed 100 characters.");
      hasError = true;
    } else {
      this.clearInputError(this.nameInput);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      this.showInputError(this.emailInput, "Please provide a valid email address.");
      hasError = true;
    } else if (email.length > 150) {
      this.showInputError(this.emailInput, "Email cannot exceed 150 characters.");
      hasError = true;
    } else {
      this.clearInputError(this.emailInput);
    }

    if (!subject || subject.length < 3) {
      this.showInputError(this.subjectInput, "Please enter a subject (minimum 3 characters).");
      hasError = true;
    } else if (subject.length > 150) {
      this.showInputError(this.subjectInput, "Subject cannot exceed 150 characters.");
      hasError = true;
    } else {
      this.clearInputError(this.subjectInput);
    }

    if (!message || message.length < 10) {
      this.showInputError(this.messageInput, "Please enter a detailed message (minimum 10 characters).");
      hasError = true;
    } else if (message.length > 5000) {
      this.showInputError(this.messageInput, "Message cannot exceed 5000 characters.");
      hasError = true;
    } else {
      this.clearInputError(this.messageInput);
    }

    if (hasError) {
      if (window.soundFX) window.soundFX.play('click');
      return;
    }

    // Protocol Check: Ensure user is running via HTTP server (not file://)
    if (window.location.protocol === 'file:') {
      console.warn('Portfolio is currently opened via file:// protocol.');
      this.showAlert(
        'error',
        'Local Server Required',
        'To send emails, please run the portfolio with a local server: run <code>npm start</code> in your terminal and open <code>http://localhost:3000</code> in your browser.'
      );
      return;
    }

    // --- LOADING STATE ---
    const originalBtnContent = this.submitBtn.innerHTML;
    this.submitBtn.disabled = true;
    this.submitBtn.innerHTML = `
      <span class="spinner-icon"></span> <span>Sending...</span>
    `;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          _gotcha: gotcha
        })
      });

      let result = {};
      try {
        result = await response.json();
      } catch (e) {
        throw new Error(`Server returned status ${response.status} (${response.statusText})`);
      }

      if (response.ok && result.success) {
        // --- SUCCESS STATE ---
        this.submitBtn.innerHTML = `<span>✓ Message Sent!</span>`;
        this.submitBtn.classList.add('success');
        if (window.soundFX) window.soundFX.play('success');

        this.showAlert(
          'success',
          'Message sent successfully!',
          result.message || "Thanks for reaching out! I'll get back to you as soon as possible."
        );

        this.triggerConfetti();

        // Clear form and stored draft ONLY on success
        localStorage.removeItem('portfolio_contact_draft');
        if (this.form) this.form.reset();

        setTimeout(() => {
          this.submitBtn.disabled = false;
          this.submitBtn.classList.remove('success');
          this.submitBtn.innerHTML = originalBtnContent;
        }, 5000);

      } else {
        // --- SERVER VALIDATION / REJECTION ERROR ---
        if (result.errors) {
          if (result.errors.name) this.showInputError(this.nameInput, result.errors.name);
          if (result.errors.email) this.showInputError(this.emailInput, result.errors.email);
          if (result.errors.subject) this.showInputError(this.subjectInput, result.errors.subject);
          if (result.errors.message) this.showInputError(this.messageInput, result.errors.message);
        }

        const serverError = result.error || `Server responded with HTTP ${response.status}: Failed to send message.`;
        const err = new Error(serverError);
        err.statusCode = response.status;
        err.details = result;
        throw err;
      }

    } catch (error) {
      console.error('❌ [Contact Form Submission Error]:', error);
      if (window.soundFX) window.soundFX.play('click');

      // --- ERROR STATE (PRESERVES ENTERED FORM WORK) ---
      const displayMsg = error.message || "Your message couldn't be sent right now. Please try again or contact me directly by email at rishabhkumar3800@gmail.com.";
      this.showAlert(
        'error',
        'Message Delivery Failed',
        displayMsg
      );

      this.submitBtn.disabled = false;
      this.submitBtn.innerHTML = originalBtnContent;
    }
  }

  showInputError(input, message) {
    if (!input) return;
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
    const parent = input.closest('.form-group');
    if (parent) {
      let errEl = parent.querySelector('.form-error-msg');
      if (!errEl) {
        errEl = document.createElement('div');
        errEl.className = 'form-error-msg';
        errEl.setAttribute('role', 'alert');
        parent.appendChild(errEl);
      }
      errEl.textContent = message;
    }
  }

  clearInputError(input) {
    if (!input) return;
    input.classList.remove('error');
    input.removeAttribute('aria-invalid');
    const parent = input.closest('.form-group');
    if (parent) {
      const errEl = parent.querySelector('.form-error-msg');
      if (errEl) errEl.remove();
    }
  }

  copyEmail() {
    const email = (typeof PORTFOLIO_DATA !== 'undefined' && PORTFOLIO_DATA?.profile?.email) || "rishabhkumar3800@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
      if (window.soundFX) window.soundFX.play('success');
      if (window.portfolioApp && window.portfolioApp.showToast) {
        window.portfolioApp.showToast(`Copied ${email} to clipboard!`);
      }
    }).catch(() => {
      if (window.portfolioApp && window.portfolioApp.showToast) {
        window.portfolioApp.showToast(`Email: ${email}`);
      }
    });
  }

  triggerConfetti() {
    if (!this.confettiCanvas) return;
    const canvas = this.confettiCanvas;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';

    const particles = [];
    const colors = ['#6366f1', '#8b5cf6', '#10b981', '#38bdf8', '#f59e0b'];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.7,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 15 - 7,
        gravity: 0.4,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        opacity: 1
      });
    }

    let frame = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotSpeed;
        p.opacity -= 0.013;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore;
        }
      });

      frame++;
      if (alive && frame < 120) {
        requestAnimationFrame(render);
      } else {
        canvas.style.display = 'none';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    render();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.contactModule = new ContactModule();
});
