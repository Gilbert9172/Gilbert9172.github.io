/**
 * Add listener for theme mode toggle
 */

export function modeWatcher() {
  const toggles = document.querySelectorAll('[data-theme-toggle]');
  if (!toggles.length) return;

  function sync() {
    const dark = Theme.visualState === Theme.DARK;
    const label = dark ? '라이트 모드로 전환' : '다크 모드로 전환';
    toggles.forEach((button) => {
      button.setAttribute('aria-label', label);
      button.title = label;
      const icon = button.querySelector('i');
      icon.classList.remove('fa-adjust');
      icon.classList.toggle('fa-sun', dark);
      icon.classList.toggle('fa-moon', !dark);
    });
  }

  toggles.forEach((button) => {
    button.addEventListener('click', () => {
      Theme.flip();
      sync();
    });
  });
  window.addEventListener('message', (event) => {
    if (event.source === window && event.data?.id === Theme.ID) sync();
  });
  sync();
}
