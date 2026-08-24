/**
 * Main Application Controller (High-End SaaS / Product Portfolio)
 * Orchestrates UI rendering, dynamic filtering, modals, bento interactions,
 * real-time clock, services scope estimator, and scroll animations.
 */

class PortfolioApp {
  constructor() {
    this.activeFilter = 'all';
    this.currentTestimonial = 0;
    this.testimonialInterval = null;

    this.init();
  }

  init() {
    this.applyStoredTheme();
    this.setupThemeToggle();
    this.renderProjects();
    this.renderSkills();
    this.renderExperience();
    this.renderServices();
    this.renderAchievements();
    this.renderTestimonials();
    this.renderFaqs();
    this.initClock();
    this.initHeroRoleRotator();
    this.initEstimator();
    this.setupModals();
    this.setupScrollSpy();
    this.setupNavigation();
    this.setupScrollReveal();
  }

  /* -------------------------------------------------------------
   * THEME CONTROLLER (DARK DEFAULT + LIGHT MODE TOGGLE)
   * ------------------------------------------------------------- */
  applyStoredTheme() {
    const savedTheme = localStorage.getItem('portfolio_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeButtonIcons(savedTheme);
  }

  setupThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio_theme', newTheme);
        this.updateThemeButtonIcons(newTheme);
        if (window.soundFX) window.soundFX.play('click');
        this.showToast(`Switched to ${newTheme.toUpperCase()} mode`);
      });
    }

    // Footer buttons
    document.getElementById('footer-theme-dark')?.addEventListener('click', () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('portfolio_theme', 'dark');
      this.updateThemeButtonIcons('dark');
      if (window.soundFX) window.soundFX.play('click');
    });

    document.getElementById('footer-theme-light')?.addEventListener('click', () => {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('portfolio_theme', 'light');
      this.updateThemeButtonIcons('light');
      if (window.soundFX) window.soundFX.play('click');
    });
  }

  updateThemeButtonIcons(theme) {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (!toggleBtn) return;
    if (theme === 'light') {
      // Show moon icon to switch to dark
      toggleBtn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
      toggleBtn.setAttribute('title', 'Switch to Dark Mode');
    } else {
      // Show sun icon to switch to light
      toggleBtn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
      toggleBtn.setAttribute('title', 'Switch to Light Mode');
    }
  }

  /* -------------------------------------------------------------
   * HERO ROLE ROTATOR
   * ------------------------------------------------------------- */
  initHeroRoleRotator() {
    const el = document.getElementById('hero-rotating-role');
    if (!el) return;

    const roles = [
      "Senior Full-Stack Engineer",
      "UI/UX Systems Architect",
      "Cloud Infrastructure Lead",
      "AI & Distributed Systems Specialist"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    const type = () => {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        el.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 35;
      } else {
        el.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 70;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typingSpeed = 2400; // Rest on full word
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400;
      }

      setTimeout(type, typingSpeed);
    };

    type();
  }

  /* -------------------------------------------------------------
   * LIVE BENTO CLOCK
   * ------------------------------------------------------------- */
  initClock() {
    const clockEl = document.getElementById('bento-live-clock');
    if (!clockEl) return;

    const updateClock = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      clockEl.textContent = `${timeStr} IST`;
    };

    updateClock();
    setInterval(updateClock, 1000);
  }

  /* -------------------------------------------------------------
   * PROJECTS RENDERING & FILTERING
   * ------------------------------------------------------------- */
  renderProjects() {
    const container = document.getElementById('projects-grid');
    if (!container) return;

    const projects = PORTFOLIO_DATA.projects;
    let filtered = projects;

    if (this.activeFilter !== 'all') {
      filtered = projects.filter(p => p.category === this.activeFilter);
    }

    container.innerHTML = filtered.map(p => `
      <div class="project-card bento-glass-card" data-category="${p.category}" data-id="${p.id}">
        <div class="project-card-header">
          <div class="project-category-badge">${p.categoryLabel}</div>
          ${p.featured ? '<div class="project-featured-pill">Featured</div>' : ''}
        </div>

        <div class="project-visual-preview">
          <div class="project-mockup-frame">
            <div class="mockup-browser-bar">
              <span class="mockup-dot red"></span>
              <span class="mockup-dot yellow"></span>
              <span class="mockup-dot green"></span>
              <span class="mockup-url-bar">${p.id}.app</span>
            </div>
            <div class="mockup-screen-content">
              <div class="mockup-hero-text">${p.shortSummary}</div>
              <div class="mockup-metric-pills">
                ${p.metrics.map(m => `
                  <div class="mockup-pill">
                    <span class="mockup-pill-val">${m.value}</span>
                    <span class="mockup-pill-lbl">${m.label}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <div class="project-card-body">
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.description}</p>

          <div class="project-tech-tags">
            ${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>

          <div class="project-metrics-row">
            ${p.metrics.map(m => `
              <div class="metric-item">
                <span class="metric-val">${m.value}</span>
                <span class="metric-lbl">${m.label}</span>
              </div>
            `).join('')}
          </div>

          <div class="project-actions">
            ${p.caseStudyData ? `
              <button class="btn btn-sm btn-primary case-study-btn" data-id="${p.id}">
                <span>Case Study</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            ` : ''}
            <a href="${p.links.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline">
              <span>Demo</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
            <a href="${p.links.github}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-ghost" title="Source Code">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.case-study-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.openCaseStudyModal(id);
      });
    });

    document.querySelectorAll('.project-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.project-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeFilter = btn.getAttribute('data-filter');
        if (window.soundFX) window.soundFX.play('click');
        this.renderProjects();
      });
    });
  }

  /* -------------------------------------------------------------
   * SKILLS MATRIX RENDERING & SEARCH
   * ------------------------------------------------------------- */
  renderSkills() {
    const container = document.getElementById('skills-container');
    if (!container) return;

    const data = PORTFOLIO_DATA.skills;

    container.innerHTML = `
      <div class="skills-search-bar-wrap">
        <div class="skills-search-input-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" id="skill-search-input" placeholder="Search technologies (e.g. Next.js, Go, Docker, PostgreSQL)..." />
        </div>
      </div>

      <div class="skills-categories-grid" id="skills-cats-grid">
        ${data.categories.map(cat => `
          <div class="skills-category-card bento-glass-card" data-cat="${cat.id}">
            <div class="skills-cat-header">
              <div class="skills-cat-title-wrap">
                <div class="skills-cat-icon">${this.getCatIcon(cat.icon)}</div>
                <div>
                  <h3 class="skills-cat-name">${cat.name}</h3>
                  <p class="skills-cat-desc">${cat.description}</p>
                </div>
              </div>
            </div>
            <div class="skills-list">
              ${cat.skills.map(s => `
                <div class="skill-row" data-name="${s.name.toLowerCase()}">
                  <div class="skill-info">
                    <span class="skill-name">${s.name}</span>
                    <span class="skill-badge">${s.tag} • ${s.exp}</span>
                  </div>
                  <div class="skill-bar-track">
                    <div class="skill-bar-fill" style="width: ${s.level}%;"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    const searchInput = document.getElementById('skill-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        const rows = container.querySelectorAll('.skill-row');
        rows.forEach(row => {
          const name = row.getAttribute('data-name');
          if (!query || name.includes(query)) {
            row.style.display = 'block';
          } else {
            row.style.display = 'none';
          }
        });
      });
    }
  }

  getCatIcon(icon) {
    const map = {
      monitor: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>`,
      server: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>`,
      database: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>`,
      cloud: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
      figma: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"/><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"/></svg>`
    };
    return map[icon] || map.monitor;
  }

  /* -------------------------------------------------------------
   * EXPERIENCE TIMELINE
   * ------------------------------------------------------------- */
  renderExperience() {
    const container = document.getElementById('experience-timeline');
    if (!container) return;

    container.innerHTML = PORTFOLIO_DATA.experience.map((exp, idx) => `
      <div class="timeline-item ${idx === 0 ? 'current-role' : ''}">
        <div class="timeline-dot"></div>
        <div class="timeline-card bento-glass-card">
          <div class="timeline-header">
            <div>
              <h3 class="timeline-role">${exp.role}</h3>
              <div class="timeline-company">${exp.company} <span class="timeline-type">• ${exp.type}</span></div>
            </div>
            <div class="timeline-period-pill">${exp.period}</div>
          </div>
          <p class="timeline-desc">${exp.description}</p>

          <div class="timeline-achievements">
            ${exp.achievements.map(a => `
              <div class="timeline-achieve-item">
                <span class="achieve-bullet">▹</span>
                <span>${a}</span>
              </div>
            `).join('')}
          </div>

          <div class="timeline-tech-tags">
            ${exp.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');
  }

  /* -------------------------------------------------------------
   * SERVICES & SCOPE ESTIMATOR
   * ------------------------------------------------------------- */
  renderServices() {
    const container = document.getElementById('services-grid');
    if (!container) return;

    container.innerHTML = PORTFOLIO_DATA.services.map(s => `
      <div class="service-card bento-glass-card">
        <div class="service-card-top">
          <div class="service-badge">${s.badge}</div>
          <h3 class="service-title">${s.title}</h3>
          <p class="service-desc">${s.description}</p>
        </div>

        <div class="service-deliverables">
          <div class="deliverables-title">Key Deliverables:</div>
          ${s.deliverables.map(d => `
            <div class="deliverable-item">
              <span class="deliverable-check">✓</span>
              <span>${d}</span>
            </div>
          `).join('')}
        </div>

        <div class="service-ideal-for">
          <span class="ideal-label">Best for:</span> ${s.idealFor}
        </div>

        <button class="btn btn-sm btn-primary service-inquire-btn" data-service="${s.title}">
          <span>Inquire</span>
        </button>
      </div>
    `).join('');

    container.querySelectorAll('.service-inquire-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const serviceName = btn.getAttribute('data-service');
        const contactSec = document.getElementById('contact');
        if (contactSec) {
          contactSec.scrollIntoView({ behavior: 'smooth' });
          const msg = document.getElementById('contact-message');
          if (msg) {
            msg.value = `Hi Rishabh, I'd like to discuss: "${serviceName}". `;
            msg.focus();
          }
        }
      });
    });
  }

  /* -------------------------------------------------------------
   * INTERACTIVE PROJECT SCOPE ESTIMATOR
   * ------------------------------------------------------------- */
  initEstimator() {
    const estimatorContainer = document.getElementById('project-estimator-box');
    if (!estimatorContainer) return;

    const checkboxes = estimatorContainer.querySelectorAll('input[type="checkbox"]');
    const complexitySelect = document.getElementById('est-complexity');
    const timelineEl = document.getElementById('est-timeline-val');
    const costEl = document.getElementById('est-cost-val');

    const calculate = () => {
      let baseCost = 0;
      let baseDays = 0;

      checkboxes.forEach(cb => {
        if (cb.checked) {
          baseCost += parseInt(cb.getAttribute('data-cost') || '0', 10);
          baseDays += parseInt(cb.getAttribute('data-days') || '0', 10);
        }
      });

      const mult = parseFloat(complexitySelect?.value || '1.0');
      const finalCost = Math.round(baseCost * mult);
      const finalWeeks = Math.max(1, Math.round((baseDays * mult) / 5));

      if (costEl) costEl.textContent = `$${finalCost.toLocaleString()}`;
      if (timelineEl) timelineEl.textContent = `${finalWeeks} - ${finalWeeks + 1} Weeks`;
    };

    checkboxes.forEach(cb => cb.addEventListener('change', () => {
      if (window.soundFX) window.soundFX.play('hover');
      calculate();
    }));

    if (complexitySelect) {
      complexitySelect.addEventListener('change', () => {
        if (window.soundFX) window.soundFX.play('hover');
        calculate();
      });
    }

    calculate();
  }

  /* -------------------------------------------------------------
   * ACHIEVEMENTS & CERTIFICATIONS
   * ------------------------------------------------------------- */
  renderAchievements() {
    const container = document.getElementById('achievements-grid');
    if (!container) return;

    container.innerHTML = PORTFOLIO_DATA.achievements.map(a => `
      <div class="achievement-card bento-glass-card">
        <div class="achieve-icon-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
        </div>
        <div class="achieve-content">
          <div class="achieve-top-row">
            <h3 class="achieve-title">${a.title}</h3>
            <span class="achieve-date">${a.date}</span>
          </div>
          <div class="achieve-issuer">${a.issuer}</div>
          <p class="achieve-desc">${a.desc}</p>
        </div>
      </div>
    `).join('');
  }

  /* -------------------------------------------------------------
   * TESTIMONIALS SLIDER
   * ------------------------------------------------------------- */
  renderTestimonials() {
    const container = document.getElementById('testimonials-slider');
    if (!container) return;

    const data = PORTFOLIO_DATA.testimonials;

    container.innerHTML = `
      <div class="testimonials-viewport">
        ${data.map((t, idx) => `
          <div class="testimonial-card bento-glass-card ${idx === 0 ? 'active' : ''}" data-index="${idx}">
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-quote">"${t.quote}"</p>
            <div class="testimonial-author-wrap">
              <div class="testimonial-avatar">${t.avatar}</div>
              <div>
                <div class="testimonial-author-name">${t.author}</div>
                <div class="testimonial-author-role">${t.role}, <span class="testimonial-company">${t.company}</span></div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="testimonial-controls">
        <button class="test-arrow-btn" id="test-prev-btn" aria-label="Previous Testimonial">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div class="test-dots" id="test-dots-container">
          ${data.map((_, i) => `<span class="test-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`).join('')}
        </div>
        <button class="test-arrow-btn" id="test-next-btn" aria-label="Next Testimonial">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    `;

    const cards = container.querySelectorAll('.testimonial-card');
    const dots = container.querySelectorAll('.test-dot');

    const showSlide = (idx) => {
      this.currentTestimonial = (idx + data.length) % data.length;
      cards.forEach((c, i) => c.classList.toggle('active', i === this.currentTestimonial));
      dots.forEach((d, i) => d.classList.toggle('active', i === this.currentTestimonial));
    };

    document.getElementById('test-prev-btn')?.addEventListener('click', () => {
      if (window.soundFX) window.soundFX.play('hover');
      showSlide(this.currentTestimonial - 1);
    });

    document.getElementById('test-next-btn')?.addEventListener('click', () => {
      if (window.soundFX) window.soundFX.play('hover');
      showSlide(this.currentTestimonial + 1);
    });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const i = parseInt(dot.getAttribute('data-index'), 10);
        showSlide(i);
      });
    });
  }

  /* -------------------------------------------------------------
   * FAQS ACCORDION
   * ------------------------------------------------------------- */
  renderFaqs() {
    const container = document.getElementById('faqs-container');
    if (!container) return;

    container.innerHTML = PORTFOLIO_DATA.faqs.map(faq => `
      <div class="faq-item bento-glass-card">
        <button class="faq-question-btn">
          <span>${faq.question}</span>
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-answer-panel">
          <p class="faq-answer-text">${faq.answer}</p>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.faq-question-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isActive = item.classList.contains('active');
        container.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
        if (window.soundFX) window.soundFX.play('click');
      });
    });
  }

  /* -------------------------------------------------------------
   * CASE STUDY MODAL
   * ------------------------------------------------------------- */
  setupModals() {
    const caseModal = document.getElementById('case-study-modal');
    if (caseModal) {
      caseModal.querySelector('.modal-backdrop')?.addEventListener('click', () => this.closeCaseStudyModal());
      caseModal.querySelector('.modal-close-btn')?.addEventListener('click', () => this.closeCaseStudyModal());
    }

    const resumeModal = document.getElementById('resume-modal');
    if (resumeModal) {
      resumeModal.querySelector('.modal-backdrop')?.addEventListener('click', () => this.closeResumeModal());
      resumeModal.querySelector('.modal-close-btn')?.addEventListener('click', () => this.closeResumeModal());
    }

    document.querySelectorAll('[data-action="open-resume"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openResumeModal();
      });
    });

    document.getElementById('print-resume-btn')?.addEventListener('click', () => {
      window.print();
    });
  }

  openCaseStudyModal(projectId) {
    const project = PORTFOLIO_DATA.projects.find(p => p.id === projectId);
    if (!project || !project.caseStudyData) return;

    const modal = document.getElementById('case-study-modal');
    const content = document.getElementById('case-study-modal-body');
    if (!modal || !content) return;

    const cs = project.caseStudyData;

    content.innerHTML = `
      <div class="cs-header">
        <div class="project-category-badge">${project.categoryLabel}</div>
        <h2 class="cs-title">${project.title}</h2>
        <p class="cs-subtitle">${cs.subtitle}</p>

        <div class="cs-meta-grid">
          <div class="cs-meta-box">
            <span class="cs-meta-label">Role</span>
            <span class="cs-meta-val">Lead Architect & Full-Stack</span>
          </div>
          <div class="cs-meta-box">
            <span class="cs-meta-label">Timeline</span>
            <span class="cs-meta-val">3 Months</span>
          </div>
          <div class="cs-meta-box">
            <span class="cs-meta-label">Platform</span>
            <span class="cs-meta-val">Cloud Web & Microservices</span>
          </div>
        </div>
      </div>

      <div class="cs-metrics-banner">
        ${project.metrics.map(m => `
          <div class="cs-metric-card">
            <div class="cs-metric-num">${m.value}</div>
            <div class="cs-metric-lbl">${m.label}</div>
          </div>
        `).join('')}
      </div>

      <div class="cs-section">
        <h3 class="cs-sec-heading">01. Problem & Challenge</h3>
        <p class="cs-body-p">${cs.challenge}</p>
      </div>

      <div class="cs-section">
        <h3 class="cs-sec-heading">02. Engineering Strategy</h3>
        <p class="cs-body-p">${cs.solution}</p>
        <div class="cs-arch-list">
          ${cs.architecture.map(item => `
            <div class="cs-arch-item">
              <span class="cs-bullet">▹</span>
              <span>${item}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="cs-section">
        <h3 class="cs-sec-heading">03. Technology Stack</h3>
        <div class="project-tech-tags">
          ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      </div>

      <div class="cs-section">
        <h3 class="cs-sec-heading">04. Measurable Outcomes</h3>
        <div class="cs-results-list">
          ${cs.results.map(r => `
            <div class="cs-result-item">
              <span class="cs-check">✓</span>
              <span>${r}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="cs-actions-footer">
        <a href="${project.links.demo}" target="_blank" class="btn btn-primary">
          <span>Live Demo</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
        <a href="${project.links.github}" target="_blank" class="btn btn-outline">
          <span>Source Code</span>
        </a>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.soundFX) window.soundFX.play('openModal');
  }

  closeCaseStudyModal() {
    const modal = document.getElementById('case-study-modal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (window.soundFX) window.soundFX.play('click');
  }

  openResumeModal() {
    const modal = document.getElementById('resume-modal');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.soundFX) window.soundFX.play('openModal');
  }

  closeResumeModal() {
    const modal = document.getElementById('resume-modal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (window.soundFX) window.soundFX.play('click');
  }

  /* -------------------------------------------------------------
   * NAVIGATION & SCROLL SPY
   * ------------------------------------------------------------- */
  setupNavigation() {
    const navToggle = document.getElementById('mobile-nav-toggle');
    const navMenu = document.getElementById('nav-links-wrap');

    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        navToggle.classList.toggle('open');
        if (window.soundFX) window.soundFX.play('click');
      });

      navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('open');
          navToggle.classList.remove('open');
        });
      });
    }

    const soundToggle = document.getElementById('sound-toggle-btn');
    if (soundToggle) {
      soundToggle.classList.toggle('active', window.soundFX?.enabled);
      soundToggle.addEventListener('click', () => {
        if (window.soundFX) {
          const enabled = window.soundFX.toggle();
          soundToggle.classList.toggle('active', enabled);
          this.showToast(enabled ? "Sound FX Enabled" : "Sound FX Muted");
        }
      });
    }
  }

  setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const progressBar = document.getElementById('scroll-progress-indicator');

    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      if (progressBar) progressBar.style.width = `${scrolled}%`;

      let currentSectionId = '';
      sections.forEach(section => {
        const top = section.offsetTop - 120;
        const h = section.offsetHeight;
        if (winScroll >= top && winScroll < top + h) {
          currentSectionId = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }, { passive: true });
  }

  /* -------------------------------------------------------------
   * SCROLL REVEAL (IntersectionObserver)
   * ------------------------------------------------------------- */
  setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
  }

  /* -------------------------------------------------------------
   * TOAST NOTIFICATION
   * ------------------------------------------------------------- */
  showToast(message) {
    let toast = document.getElementById('global-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'global-toast';
      toast.className = 'global-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  copyEmail() {
    if (window.contactModule && window.contactModule.copyEmail) {
      window.contactModule.copyEmail();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.portfolioApp = new PortfolioApp();
});
