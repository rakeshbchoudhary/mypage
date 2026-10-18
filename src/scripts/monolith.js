// ==========================================================================
// MONOLITH & BLUEPRINT SCHEMATIC SCRIPT
// CAD Grid interactions and Blueprint Mode toggle
// ==========================================================================
(function initMonolith() {
  const toggleBtn = document.getElementById('blueprintToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('blueprint-mode');
      const isBlueprint = document.body.classList.contains('blueprint-mode');
      toggleBtn.innerHTML = isBlueprint 
        ? '<i class="fas fa-drafting-compass"></i> [MODE: BLUEPRINT ACTIVE]' 
        : '<i class="fas fa-cube"></i> [TOGGLE SCHEMATIC MODE]';
    });
  }

  // Dynamic copyright year
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
