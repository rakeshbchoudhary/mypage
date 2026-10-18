// ==========================================================================
// COSMIC LINEAGE CANVAS ANIMATION
// Celestial node network & data lineage constellation
// ==========================================================================
(function initCosmicLineage() {
  const canvas = document.getElementById('cosmicCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initNodes();
  });

  const nodeCount = 55;
  const nodes = [];

  class CelestialNode {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() > 0.85 ? 3 : 1.5;
      this.isGold = Math.random() > 0.6;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.isGold ? 'rgba(243, 208, 121, 0.85)' : 'rgba(99, 102, 241, 0.85)';
      ctx.shadowColor = this.isGold ? 'rgba(243, 208, 121, 1)' : 'rgba(99, 102, 241, 1)';
      ctx.shadowBlur = this.radius > 2 ? 8 : 4;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function initNodes() {
    nodes.length = 0;
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new CelestialNode());
    }
  }

  initNodes();

  // Connect close nodes with starlight lines
  function drawConnections() {
    const maxDist = 130;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.22;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(165, 180, 252, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    drawConnections();

    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update();
      nodes[i].draw();
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  // Dynamic copyright year
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
