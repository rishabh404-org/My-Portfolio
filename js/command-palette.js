/**
 * Command Palette Engine (Cmd+K / Ctrl+K)
 * Universal search, quick navigation, and instant action runner.
 */

class CommandPalette {
  constructor() {
    this.modal = document.getElementById('command-palette-modal');
    this.input = document.getElementById('palette-input');
    this.resultsContainer = document.getElementById('palette-results');
    this.isOpen = false;
    this.selectedIndex = 0;
    this.items = [];

    this.init();
  }

  init() {
    this.buildStaticItems();
    this.setupEventListeners();
  }

  buildStaticItems() {
    this.items = [
      // Sections
      { title: "Home / Overview", category: "Navigation", icon: "home", action: () => this.scrollTo('#hero') },
      { title: "About & Engineering Philosophy", category: "Navigation", icon: "user", action: () => this.scrollTo('#about') },
      { title: "Featured Projects & Case Studies", category: "Navigation", icon: "folder", action: () => this.scrollTo('#projects') },
      { title: "Technical Skills & Competency Matrix", category: "Navigation", icon: "cpu", action: () => this.scrollTo('#skills') },
      { title: "Work Experience & Career Timeline", category: "Navigation", icon: "briefcase", action: () => this.scrollTo('#experience') },
      { title: "Services & Scope Estimator", category: "Navigation", icon: "layers", action: () => this.scrollTo('#services') },
      { title: "Client Recommendations & Reviews", category: "Navigation", icon: "message-square", action: () => this.scrollTo('#testimonials') },
      { title: "Contact & Hire Me", category: "Navigation", icon: "mail", action: () => this.scrollTo('#contact') },

      // Projects
      { title: "Nexus AI: Autonomous Agent Workflow Engine", category: "Projects", icon: "zap", action: () => this.openCaseStudy('nexus-ai-orchestrator') },
      { title: "Pulse: Real-Time Infrastructure & Telemetry", category: "Projects", icon: "activity", action: () => this.openCaseStudy('pulse-cloud-monitor') },
      { title: "AuraPay: Next-Gen Global Fintech Core", category: "Projects", icon: "credit-card", action: () => this.openCaseStudy('hyper-fintech-core') },
      { title: "Lumina: Accessible Design System & Studio", category: "Projects", icon: "palette", action: () => this.openCaseStudy('lumina-design-system') },
      { title: "Synapse: Real-Time Collaborative Canvas", category: "Projects", icon: "share-2", action: () => this.openCaseStudy('hyper-chat-collab') },
      { title: "Vortex: Neural Semantic Search Engine", category: "Projects", icon: "search", action: () => this.openCaseStudy('neural-rag-search') },

      // Actions
      { title: "Toggle Light / Dark Mode", category: "Actions", icon: "moon", action: () => this.toggleTheme() },
      { title: "Copy Email to Clipboard", category: "Actions", icon: "copy", action: () => this.copyEmail() },
      { title: "View / Print Full Resume", category: "Actions", icon: "file-text", action: () => this.openResume() },
      { title: "Toggle Micro-Sound Effects", category: "Actions", icon: "volume-2", action: () => this.toggleSound() }
    ];
  }

  setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    document.querySelectorAll('[data-action="open-palette"]').forEach(btn => {
      btn.addEventListener('click', () => this.open());
    });

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });
    }

    if (this.input) {
      this.input.addEventListener('input', () => {
        this.renderResults(this.input.value.trim());
      });

      this.input.addEventListener('keydown', (e) => {
        const resultElements = this.resultsContainer?.querySelectorAll('.palette-item');
        if (!resultElements || resultElements.length === 0) return;

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.selectedIndex = (this.selectedIndex + 1) % resultElements.length;
          this.updateSelection();
          if (window.soundFX) window.soundFX.play('hover');
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.selectedIndex = (this.selectedIndex - 1 + resultElements.length) % resultElements.length;
          this.updateSelection();
          if (window.soundFX) window.soundFX.play('hover');
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const selected = resultElements[this.selectedIndex];
          if (selected) selected.click();
        }
      });
    }
  }

  open() {
    if (!this.modal) return;
    this.isOpen = true;
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (this.input) {
      this.input.value = '';
      setTimeout(() => this.input.focus(), 50);
    }
    this.renderResults('');
    if (window.soundFX) window.soundFX.play('openModal');
  }

  close() {
    if (!this.modal) return;
    this.isOpen = false;
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    if (window.soundFX) window.soundFX.play('click');
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  renderResults(query) {
    if (!this.resultsContainer) return;
    this.selectedIndex = 0;

    let filtered = this.items;
    if (query) {
      const q = query.toLowerCase();
      filtered = this.items.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      this.resultsContainer.innerHTML = `
        <div class="palette-empty">
          <div>No results found for "${this.escapeHtml(query)}"</div>
        </div>
      `;
      return;
    }

    const groups = {};
    filtered.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });

    let html = '';
    let globalIndex = 0;

    for (const [category, items] of Object.entries(groups)) {
      html += `<div class="palette-category-label">${category}</div>`;
      items.forEach(item => {
        html += `
          <div class="palette-item ${globalIndex === 0 ? 'selected' : ''}" data-index="${globalIndex}">
            <div class="palette-item-icon">${this.getIconSvg(item.icon)}</div>
            <div class="palette-item-text">
              <div class="palette-item-title">${this.highlightMatch(item.title, query)}</div>
              <div class="palette-item-badge">${item.category}</div>
            </div>
            <div class="palette-item-hint">↵</div>
          </div>
        `;
        globalIndex++;
      });
    }

    this.resultsContainer.innerHTML = html;

    const renderedItems = this.resultsContainer.querySelectorAll('.palette-item');
    let curIdx = 0;
    for (const [category, items] of Object.entries(groups)) {
      items.forEach(item => {
        const el = renderedItems[curIdx];
        if (el) {
          el.addEventListener('click', () => {
            if (window.soundFX) window.soundFX.play('click');
            this.close();
            setTimeout(() => item.action(), 100);
          });
          el.addEventListener('mouseenter', () => {
            this.selectedIndex = parseInt(el.getAttribute('data-index'), 10);
            this.updateSelection();
          });
        }
        curIdx++;
      });
    }
  }

  updateSelection() {
    const items = this.resultsContainer?.querySelectorAll('.palette-item');
    if (!items) return;
    items.forEach((item, idx) => {
      if (idx === this.selectedIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('selected');
      }
    });
  }

  scrollTo(selector) {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  openCaseStudy(projectId) {
    if (window.portfolioApp && window.portfolioApp.openCaseStudyModal) {
      window.portfolioApp.openCaseStudyModal(projectId);
    } else {
      this.scrollTo('#projects');
    }
  }

  openResume() {
    if (window.portfolioApp && window.portfolioApp.openResumeModal) {
      window.portfolioApp.openResumeModal();
    }
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio_theme', newTheme);
    if (window.portfolioApp && window.portfolioApp.updateThemeButtonIcons) {
      window.portfolioApp.updateThemeButtonIcons(newTheme);
    }
    if (window.soundFX) window.soundFX.play('click');
  }

  toggleSound() {
    if (window.soundFX) {
      const enabled = window.soundFX.toggle();
      const soundBtn = document.getElementById('sound-toggle-btn');
      if (soundBtn) {
        soundBtn.classList.toggle('active', enabled);
      }
      if (window.portfolioApp && window.portfolioApp.showToast) {
        window.portfolioApp.showToast(enabled ? 'Sound Effects Enabled' : 'Sound Effects Muted');
      }
    }
  }

  copyEmail() {
    if (window.portfolioApp && window.portfolioApp.copyEmail) {
      window.portfolioApp.copyEmail();
    }
  }

  highlightMatch(text, query) {
    if (!query) return this.escapeHtml(text);
    const regex = new RegExp(`(${this.escapeRegExp(query)})`, 'gi');
    return this.escapeHtml(text).replace(regex, '<span class="palette-highlight">$1</span>');
  }

  escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  getIconSvg(iconName) {
    const icons = {
      home: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
      user: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
      folder: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>`,
      cpu: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`,
      briefcase: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
      layers: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.9a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>`,
      "message-square": `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
      mail: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
      zap: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
      activity: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
      "credit-card": `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`,
      palette: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
      "share-2": `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>`,
      search: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
      copy: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
      "file-text": `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>`,
      "volume-2": `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`,
      moon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`
    };
    return icons[iconName] || icons.search;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.commandPalette = new CommandPalette();
});
