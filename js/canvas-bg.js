/**
 * Subtle Ambient Background Engine
 * Creates a soft, elegant radial glow following the cursor with subtle ambient depth.
 * Zero clutter, highly optimized 60fps performance.
 */

class AmbientBackground {
  constructor(canvasId = 'bg-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 3, targetX: window.innerWidth / 2, targetY: window.innerHeight / 3 };
    this.animationFrameId = null;

    this.init();
  }

  init() {
    this.resize();
    this.setupEventListeners();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      this.mouse.targetX = this.width / 2;
      this.mouse.targetY = this.height / 3;
    });
  }

  animate() {
    // Smooth easing towards cursor
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    this.ctx.clearRect(0, 0, this.width, this.height);

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    // 1. Subtle top ambient light dome
    const topGlow = this.ctx.createRadialGradient(
      this.width / 2, 0, 50,
      this.width / 2, 0, this.width * 0.7
    );
    if (isLight) {
      topGlow.addColorStop(0, 'rgba(99, 102, 241, 0.06)');
      topGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    } else {
      topGlow.addColorStop(0, 'rgba(99, 102, 241, 0.12)');
      topGlow.addColorStop(0.5, 'rgba(139, 92, 246, 0.04)');
      topGlow.addColorStop(1, 'rgba(9, 10, 15, 0)');
    }
    this.ctx.fillStyle = topGlow;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 2. Soft, luxurious cursor follower spotlight
    const cursorGlow = this.ctx.createRadialGradient(
      this.mouse.x, this.mouse.y, 0,
      this.mouse.x, this.mouse.y, 450
    );
    if (isLight) {
      cursorGlow.addColorStop(0, 'rgba(99, 102, 241, 0.04)');
      cursorGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    } else {
      cursorGlow.addColorStop(0, 'rgba(99, 102, 241, 0.08)');
      cursorGlow.addColorStop(0.6, 'rgba(56, 189, 248, 0.02)');
      cursorGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }
    this.ctx.fillStyle = cursorGlow;
    this.ctx.beginPath();
    this.ctx.arc(this.mouse.x, this.mouse.y, 450, 0, Math.PI * 2);
    this.ctx.fill();

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.ambientBg = new AmbientBackground();
});
