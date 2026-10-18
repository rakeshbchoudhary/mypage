// ==========================================================================
// SOUNDBOARD CANVAS & EQUALIZER SCRIPT
// Audio waves and interactive soundboard dynamics
// ==========================================================================
(function initSoundboard() {
  const canvas = document.getElementById('soundCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let step = 0;

  function drawWave(yOffset, amplitude, frequency, speed, color) {
    ctx.beginPath();
    ctx.moveTo(0, yOffset);

    for (let x = 0; x < width; x += 10) {
      const y = Math.sin(x * frequency + step * speed) * amplitude + yOffset;
      ctx.lineTo(x, y);
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    step += 0.03;

    // Subtle audio wave lines across the screen
    drawWave(height * 0.25, 20, 0.005, 1.2, 'rgba(255, 75, 114, 0.12)');
    drawWave(height * 0.45, 35, 0.008, 0.8, 'rgba(16, 231, 178, 0.15)');
    drawWave(height * 0.7, 25, 0.004, 1.5, 'rgba(157, 78, 221, 0.10)');

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  // Equalizer bar dynamic randomness on hover
  document.querySelectorAll('.telemetry-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const bars = card.querySelectorAll('.eq-bar');
      bars.forEach(bar => {
        bar.style.animationDuration = (0.4 + Math.random() * 0.5) + 's';
      });
    });
  });

  // Dynamic copyright year
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
