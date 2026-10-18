// ==========================================================================
// KINETIC STREAM CANVAS ANIMATION
// High-throughput data stream visualization
// ==========================================================================
(function initKineticStream() {
  const canvas = document.getElementById('kineticStreamCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  });

  const particleCount = 45;
  const particles = [];
  const colors = [
    'rgba(0, 245, 160, ',  // Electric Mint
    'rgba(0, 217, 245, ',  // Cyan
    'rgba(255, 184, 0, '   // Kinetic Amber
  ];

  class StreamParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = initial ? Math.random() * width : -100;
      this.y = Math.random() * height;
      this.length = 60 + Math.random() * 120;
      this.speed = 2.5 + Math.random() * 5.5;
      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = 0.15 + Math.random() * 0.45;
      this.lineWidth = 1 + Math.random() * 2;
    }

    update() {
      this.x += this.speed;
      if (this.x - this.length > width) {
        this.reset();
      }
    }

    draw() {
      const grad = ctx.createLinearGradient(this.x - this.length, this.y, this.x, this.y);
      grad.addColorStop(0, this.colorBase + '0)');
      grad.addColorStop(0.8, this.colorBase + this.alpha + ')');
      grad.addColorStop(1, this.colorBase + (this.alpha + 0.3) + ')');

      ctx.beginPath();
      ctx.moveTo(this.x - this.length, this.y);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = this.lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Lead packet dot
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.lineWidth + 0.5, 0, Math.PI * 2);
      ctx.fillStyle = this.colorBase + '0.9)';
      ctx.shadowColor = this.colorBase + '1)';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    }
  }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new StreamParticle());
    }
  }

  initParticles();

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  // Update current year dynamically
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
