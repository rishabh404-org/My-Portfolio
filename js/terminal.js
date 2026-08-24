/**
 * Interactive Developer Terminal
 * Provides an embedded UNIX-style CLI inside the portfolio with rich commands,
 * autocompletion, history, and secret easter eggs.
 */

class InteractiveTerminal {
  constructor(containerId = 'terminal-container') {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.output = this.container.querySelector('.terminal-output');
    this.input = this.container.querySelector('.terminal-input');
    this.prompt = this.container.querySelector('.terminal-prompt');
    this.history = [];
    this.historyIndex = -1;

    this.commands = {
      help: {
        desc: "List all available interactive CLI commands",
        exec: () => this.cmdHelp()
      },
      whoami: {
        desc: "Display brief engineer profile and identity",
        exec: () => this.cmdWhoami()
      },
      bio: {
        desc: "Read background summary, philosophy, and focus",
        exec: () => this.cmdBio()
      },
      skills: {
        desc: "View core tech stack and proficiency matrix",
        exec: () => this.cmdSkills()
      },
      projects: {
        desc: "List featured open-source and production projects",
        exec: () => this.cmdProjects()
      },
      exp: {
        desc: "Print employment history and career milestones",
        exec: () => this.cmdExperience()
      },
      stats: {
        desc: "View quantifiable engineering statistics & metrics",
        exec: () => this.cmdStats()
      },
      contact: {
        desc: "Display direct email, socials, and booking link",
        exec: () => this.cmdContact()
      },
      hire: {
        desc: "Quickly navigate to project inquiry / contact form",
        exec: () => this.cmdHire()
      },
      theme: {
        desc: "Switch active theme [obsidian | cyber | emerald | light]",
        exec: (args) => this.cmdTheme(args)
      },
      matrix: {
        desc: "Trigger a digital falling matrix rain effect",
        exec: () => this.cmdMatrix()
      },
      easteregg: {
        desc: "Unlock hidden developer easter egg",
        exec: () => this.cmdEasterEgg()
      },
      clear: {
        desc: "Clear terminal console buffer",
        exec: () => this.cmdClear()
      }
    };

    this.init();
  }

  init() {
    this.printBanner();
    this.setupEventListeners();
  }

  printBanner() {
    const banner = `
<span class="term-cyan">┌───────────────────────────────────────────────────────────┐</span>
<span class="term-cyan">│</span>  <span class="term-bold term-indigo">Rishabh Developer Terminal v2.6.4 (x86_64-portfolio-core)</span> <span class="term-cyan">│</span>
<span class="term-cyan">│</span>  Type <span class="term-green">'help'</span> for command list or try <span class="term-yellow">'projects'</span>, <span class="term-yellow">'skills'</span>.   <span class="term-cyan">│</span>
<span class="term-cyan">└───────────────────────────────────────────────────────────┘</span>
`;
    this.appendOutput(banner);
  }

  setupEventListeners() {
    if (!this.input) return;

    this.container.addEventListener('click', () => {
      this.input.focus();
    });

    this.input.addEventListener('keydown', (e) => {
      if (window.soundFX) window.soundFX.play('terminal');

      if (e.key === 'Enter') {
        const line = this.input.value.trim();
        this.input.value = '';
        if (line) {
          this.history.push(line);
          this.historyIndex = this.history.length;
          this.processCommand(line);
        } else {
          this.appendOutput(`<div class="term-line"><span class="term-prompt">guest@portfolio:~$</span></div>`);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.history.length > 0 && this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.handleTabCompletion();
      }
    });
  }

  handleTabCompletion() {
    const val = this.input.value.trim().toLowerCase();
    if (!val) return;
    const matches = Object.keys(this.commands).filter(cmd => cmd.startsWith(val));
    if (matches.length === 1) {
      this.input.value = matches[0];
    } else if (matches.length > 1) {
      this.appendOutput(`<div class="term-muted">Suggestions: ${matches.join('  ')}</div>`);
    }
  }

  processCommand(rawInput) {
    const parts = rawInput.split(' ');
    const cmdName = parts[0].toLowerCase();
    const args = parts.slice(1);

    this.appendOutput(`<div class="term-line"><span class="term-prompt">guest@portfolio:~$</span> <span class="term-cmd">${this.escapeHtml(rawInput)}</span></div>`);

    if (this.commands[cmdName]) {
      this.commands[cmdName].exec(args);
    } else {
      this.appendOutput(`<div class="term-error">command not found: "${cmdName}". Type <span class="term-green">'help'</span> for a list of valid commands.</div>`);
    }

    this.scrollToBottom();
  }

  appendOutput(html) {
    if (!this.output) return;
    const div = document.createElement('div');
    div.innerHTML = html;
    this.output.appendChild(div);
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.output) {
      this.output.scrollTop = this.output.scrollHeight;
    }
  }

  escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // COMMAND IMPLEMENTATIONS
  cmdHelp() {
    let out = `<div class="term-header">Available Commands:</div><div class="term-grid">`;
    for (const [name, meta] of Object.entries(this.commands)) {
      out += `<div><span class="term-green">${name.padEnd(12, ' ')}</span> <span class="term-muted">${meta.desc}</span></div>`;
    }
    out += `</div><div class="term-muted" style="margin-top:6px">Tip: Press [Tab] for autocompletion, [↑/↓] for command history.</div>`;
    this.appendOutput(out);
  }

  cmdWhoami() {
    const p = PORTFOLIO_DATA.profile;
    this.appendOutput(`
<div class="term-card">
  <div class="term-bold term-indigo">${p.name} — ${p.title}</div>
  <div class="term-muted">${p.tagline}</div>
  <div style="margin-top:4px;">📍 <span class="term-cyan">${p.location}</span></div>
  <div>⚡ <span class="term-green">${p.availability}</span></div>
</div>
`);
  }

  cmdBio() {
    const p = PORTFOLIO_DATA.profile;
    this.appendOutput(`<div class="term-text">${p.bio}</div>`);
  }

  cmdSkills() {
    let out = `<div class="term-header">Technical Competency Stack:</div>`;
    PORTFOLIO_DATA.skills.categories.forEach(cat => {
      out += `<div style="margin-top:6px;"><span class="term-bold term-yellow">${cat.name}</span>:</div>`;
      out += `<div class="term-pills">`;
      cat.skills.forEach(s => {
        out += `<span class="term-pill"><span class="term-white">${s.name}</span> <span class="term-muted">(${s.level}%)</span></span> `;
      });
      out += `</div>`;
    });
    this.appendOutput(out);
  }

  cmdProjects() {
    let out = `<div class="term-header">Featured Production Projects:</div>`;
    PORTFOLIO_DATA.projects.forEach((proj, i) => {
      out += `
<div class="term-proj-item">
  <div><span class="term-bold term-indigo">[${i + 1}] ${proj.title}</span> <span class="term-badge">${proj.categoryLabel}</span></div>
  <div class="term-muted">${proj.description}</div>
  <div class="term-tech">Stack: ${proj.tech.slice(0, 5).join(', ')}</div>
</div>`;
    });
    out += `<div class="term-muted" style="margin-top:6px">Scroll to the Projects section to open deep-dive architectural case studies.</div>`;
    this.appendOutput(out);
  }

  cmdExperience() {
    let out = `<div class="term-header">Career Milestones & Experience:</div>`;
    PORTFOLIO_DATA.experience.forEach(exp => {
      out += `
<div style="margin-top:8px;">
  <div class="term-bold term-yellow">${exp.role} @ <span class="term-cyan">${exp.company}</span></div>
  <div class="term-muted">${exp.period} • ${exp.location}</div>
  <div class="term-text">${exp.description}</div>
</div>`;
    });
    this.appendOutput(out);
  }

  cmdStats() {
    let out = `<div class="term-header">Key Engineering Metrics:</div><div class="term-stats-grid">`;
    PORTFOLIO_DATA.profile.stats.forEach(st => {
      out += `<div class="term-stat-box"><div class="term-stat-num term-green">${st.value}</div><div class="term-stat-lbl">${st.label}</div></div>`;
    });
    out += `</div>`;
    this.appendOutput(out);
  }

  cmdContact() {
    const p = PORTFOLIO_DATA.profile;
    this.appendOutput(`
<div class="term-card">
  <div class="term-bold term-indigo">Get in Touch:</div>
  <div>📧 Email: <a href="mailto:${p.email}" class="term-cyan">${p.email}</a></div>
  <div>🐙 GitHub: <a href="${p.github}" target="_blank" class="term-cyan">${p.github}</a></div>
  <div>💼 LinkedIn: <a href="${p.linkedin}" target="_blank" class="term-cyan">${p.linkedin}</a></div>
  <div>🐦 Twitter/X: <a href="${p.twitter}" target="_blank" class="term-cyan">${p.twitter}</a></div>
</div>`);
  }

  cmdHire() {
    this.appendOutput(`<div class="term-green">Navigating to contact module...</div>`);
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  cmdTheme(args) {
    const targetTheme = args[0]?.toLowerCase();
    const validThemes = ['dark', 'light', 'obsidian', 'cyber', 'emerald'];
    if (!targetTheme || !validThemes.includes(targetTheme)) {
      this.appendOutput(`<div class="term-muted">Usage: theme [dark | light]</div>`);
      return;
    }
    const resolvedTheme = targetTheme === 'dark' || targetTheme === 'obsidian' ? 'dark' : (targetTheme === 'light' ? 'light' : targetTheme);
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    localStorage.setItem('portfolio_theme', resolvedTheme);
    if (window.portfolioApp && window.portfolioApp.updateThemeButtonIcons) {
      window.portfolioApp.updateThemeButtonIcons(resolvedTheme);
    }
    if (window.soundFX) window.soundFX.play('success');
    this.appendOutput(`<div class="term-green">✓ Active theme switched to: <span class="term-bold">${resolvedTheme}</span></div>`);
  }

  cmdMatrix() {
    this.appendOutput(`<div class="term-green">Entering the Matrix... Look at the canvas background.</div>`);
    document.documentElement.setAttribute('data-theme', 'emerald');
    if (window.soundFX) window.soundFX.play('success');
  }

  cmdEasterEgg() {
    const eggs = [
      "🚀 Tip: Press [Cmd+K] or [Ctrl+K] anywhere to trigger the global command palette!",
      "☕ 418: I'm a teapot. (Just kidding, I convert coffee directly into high-concurrency microservices).",
      "✨ Fun fact: This portfolio is rendered with pure Vanilla HTML5/CSS3 & native Web Audio with zero heavy bundle bloat!",
      "🎮 Up, Up, Down, Down, Left, Right, Left, Right, B, A -> Developer Godmode Activated."
    ];
    const pick = eggs[Math.floor(Math.random() * eggs.length)];
    this.appendOutput(`<div class="term-yellow">${pick}</div>`);
  }

  cmdClear() {
    if (this.output) {
      this.output.innerHTML = '';
      this.printBanner();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.portfolioTerminal = new InteractiveTerminal();
});
