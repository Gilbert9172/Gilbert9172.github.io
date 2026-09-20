const STORAGE_KEY = 'sidebar-collapsed';

export function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const trigger = document.getElementById('sidebar-trigger');
  const mask = document.getElementById('mask');
  const collapseButton = document.getElementById('sidebar-collapse-btn');
  const expandButton = document.getElementById('sidebar-expand-btn');
  if (!sidebar || !trigger || !mask || !collapseButton || !expandButton) return;

  // Keep this breakpoint aligned with abstracts/_breakpoints.scss.
  const desktop = window.matchMedia('(min-width: 850px)');
  let collapsed = false;
  let mobileOpen = false;
  const inertBackground = new Map();

  try {
    collapsed = localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    // The controls still work when browser storage is unavailable.
  }

  function sync() {
    const modal = !desktop.matches && mobileOpen;
    const visible = desktop.matches ? !collapsed : mobileOpen;
    document.body.toggleAttribute('sidebar-collapsed', collapsed);
    document.body.toggleAttribute('sidebar-display', modal);
    sidebar.inert = !visible;
    sidebar.setAttribute('aria-hidden', String(!visible));
    [trigger, collapseButton, expandButton].forEach((button) => {
      button.setAttribute('aria-expanded', String(visible));
    });
    const label = desktop.matches ? '메뉴 접기' : '메뉴 닫기';
    collapseButton.setAttribute('aria-label', label);
    collapseButton.title = label;
    collapseButton.querySelector('.sidebar-close-label').textContent =
      desktop.matches ? '접기' : '닫기';
    mask.classList.toggle('d-none', !modal);

    if (modal) {
      sidebar.setAttribute('role', 'dialog');
      sidebar.setAttribute('aria-modal', 'true');
      Array.from(document.body.children).forEach((element) => {
        if (element === sidebar || element === mask ||
            ['SCRIPT', 'STYLE', 'LINK'].includes(element.tagName)) return;
        if (!inertBackground.has(element)) {
          inertBackground.set(element, element.inert);
          element.inert = true;
        }
      });
    } else {
      sidebar.removeAttribute('role');
      sidebar.removeAttribute('aria-modal');
      inertBackground.forEach((wasInert, element) => { element.inert = wasInert; });
      inertBackground.clear();
    }
  }

  function setDesktopCollapsed(value) {
    collapsed = value;
    // Move focus out of a panel before making it inaccessible.
    if (collapsed) document.activeElement?.blur();
    sync();
    (collapsed ? expandButton : collapseButton).focus({ preventScroll: true });
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch {
      // Remember the preference for this page even without localStorage.
    }
  }

  function closeMobile(restoreFocus = true) {
    if (!mobileOpen) return;
    document.activeElement?.blur();
    mobileOpen = false;
    sync();
    if (restoreFocus) trigger.focus({ preventScroll: true });
  }

  trigger.addEventListener('click', () => {
    mobileOpen = true;
    trigger.blur();
    sync();
    collapseButton.focus({ preventScroll: true });
  });
  collapseButton.addEventListener('click', () => {
    if (desktop.matches) setDesktopCollapsed(true);
    else closeMobile();
  });
  expandButton.addEventListener('click', () => setDesktopCollapsed(false));
  mask.addEventListener('click', () => closeMobile());

  sidebar.addEventListener('click', (event) => {
    if (event.target.closest('a[href]') && !desktop.matches) closeMobile(false);
  });

  document.addEventListener('keydown', (event) => {
    if (!mobileOpen || desktop.matches) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMobile();
    } else if (event.key === 'Tab') {
      const focusable = Array.from(sidebar.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex="0"]'
      )).filter((element) => element.getClientRects().length && !element.closest('[inert]'));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === sidebar)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  });

  desktop.addEventListener('change', () => {
    const focusInSidebar = sidebar.contains(document.activeElement);
    const focusOnOpener = document.activeElement === expandButton || document.activeElement === trigger;
    if (focusInSidebar || focusOnOpener) document.activeElement.blur();
    mobileOpen = false;
    sync();
    if (focusInSidebar || focusOnOpener) {
      const target = desktop.matches ? (collapsed ? expandButton : collapseButton) : trigger;
      target.focus({ preventScroll: true });
    }
  });

  sync();
}
