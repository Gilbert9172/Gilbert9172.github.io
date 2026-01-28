const ATTR_DISPLAY = 'sidebar-display';
const ATTR_COLLAPSED = 'sidebar-collapsed';
const STORAGE_KEY = 'sidebar-collapsed';

const $sidebar = document.getElementById('sidebar');
const $trigger = document.getElementById('sidebar-trigger');
const $mask = document.getElementById('mask');
const $collapseBtn = document.getElementById('sidebar-collapse-btn');
const $expandBtn = document.getElementById('sidebar-expand-btn');

class SidebarUtil {
  static #isExpanded = false;

  static toggle() {
    this.#isExpanded = !this.#isExpanded;
    document.body.toggleAttribute(ATTR_DISPLAY, this.#isExpanded);
    $sidebar.classList.toggle('z-2', this.#isExpanded);
    $mask.classList.toggle('d-none', !this.#isExpanded);
  }
}

class SidebarCollapseUtil {
  static #isCollapsed = false;

  static init() {
    this.#isCollapsed = localStorage.getItem(STORAGE_KEY) === 'true';
    if (this.#isCollapsed) {
      document.body.setAttribute(ATTR_COLLAPSED, '');
    }
  }

  static toggle() {
    this.#isCollapsed = !this.#isCollapsed;
    document.body.toggleAttribute(ATTR_COLLAPSED, this.#isCollapsed);
    localStorage.setItem(STORAGE_KEY, this.#isCollapsed);
  }
}

export function initSidebar() {
  $trigger.onclick = $mask.onclick = () => SidebarUtil.toggle();

  if ($collapseBtn) {
    SidebarCollapseUtil.init();
    $collapseBtn.onclick = () => SidebarCollapseUtil.toggle();
  }

  if ($expandBtn) {
    $expandBtn.onclick = () => SidebarCollapseUtil.toggle();
  }
}
