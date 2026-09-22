/**
 * This script make #search-result-wrapper switch to unload or shown automatically.
 */

const btnSbTrigger = document.getElementById('sidebar-trigger');
const btnSearchTrigger = document.getElementById('search-trigger');
const btnCancel = document.getElementById('search-cancel');
const content = document.querySelectorAll('#main-wrapper>.container>.row');
const topbarTitle = document.getElementById('topbar-title');
const search = document.getElementById('search');
const resultWrapper = document.getElementById('search-result-wrapper');
const results = document.getElementById('search-results');
const input = document.getElementById('search-input');
const hints = document.getElementById('search-hints');

// CSS class names
const LOADED = 'd-block';
const UNLOADED = 'd-none';
const FLEX = 'd-flex';

/* Actions in mobile screens (Sidebar hidden) */
class MobileSearchBar {
  static on() {
    btnSbTrigger.classList.add(UNLOADED);
    topbarTitle.classList.add(UNLOADED);
    btnSearchTrigger.classList.add(UNLOADED);
    search.classList.add(FLEX);
    btnCancel.classList.add(LOADED);
    btnSearchTrigger.setAttribute('aria-expanded', 'true');
  }

  static off() {
    btnCancel.classList.remove(LOADED);
    search.classList.remove(FLEX);
    btnSbTrigger.classList.remove(UNLOADED);
    topbarTitle.classList.remove(UNLOADED);
    btnSearchTrigger.classList.remove(UNLOADED);
    btnSearchTrigger.setAttribute('aria-expanded', 'false');
  }
}

class ResultSwitch {
  static resultVisible = false;

  static on() {
    if (!this.resultVisible) {
      resultWrapper.classList.remove(UNLOADED);
      content.forEach((el) => {
        el.classList.add(UNLOADED);
      });
      this.resultVisible = true;
    }
  }

  static off() {
    if (this.resultVisible) {
      results.innerHTML = '';

      if (hints.classList.contains(UNLOADED)) {
        hints.classList.remove(UNLOADED);
      }

      resultWrapper.classList.add(UNLOADED);
      content.forEach((el) => {
        el.classList.remove(UNLOADED);
      });
      input.value = '';
      this.resultVisible = false;
    }
  }
}

function isMobileView() {
  return btnCancel.classList.contains(LOADED);
}

export function displaySearch() {
  const desktop = window.matchMedia('(min-width: 850px)');
  const shortcut = document.getElementById('search-shortcut');
  if (shortcut) {
    shortcut.textContent = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K';
  }
  let returnFocus = null;

  function openSearch() {
    if (document.activeElement !== input) returnFocus = document.activeElement;
    if (!desktop.matches) {
      MobileSearchBar.on();
      ResultSwitch.on();
    }
    input.focus();
  }

  function closeSearch() {
    const wasMobile = isMobileView();
    MobileSearchBar.off();
    input.value = '';
    ResultSwitch.off();
    input.blur();
    const target = wasMobile ? btnSearchTrigger : returnFocus;
    if (target?.isConnected && !target.closest('[inert]')) {
      target.focus({ preventScroll: true });
    }
  }

  btnSearchTrigger.addEventListener('click', openSearch);
  btnCancel.addEventListener('click', closeSearch);
  document.addEventListener('keydown', (event) => {
    // Do not steal focus from the mobile drawer or a native modal dialog.
    if (document.body.hasAttribute('sidebar-display') || document.querySelector('dialog[open]')) return;
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && !event.altKey) {
      event.preventDefault();
      openSearch();
      input.select();
    } else if (event.key === 'Escape' && (document.activeElement === input || isMobileView() || ResultSwitch.resultVisible)) {
      event.preventDefault();
      closeSearch();
    }
  });
  desktop.addEventListener('change', () => {
    if (desktop.matches) {
      MobileSearchBar.off();
      if (!input.value) ResultSwitch.off();
    } else if (document.activeElement === input || ResultSwitch.resultVisible) {
      MobileSearchBar.on();
      ResultSwitch.on();
    }
  });

  input.addEventListener('input', () => {
    if (input.value === '') {
      if (isMobileView()) {
        hints.classList.remove(UNLOADED);
      } else {
        ResultSwitch.off();
      }
    } else {
      ResultSwitch.on();
      if (isMobileView()) {
        hints.classList.add(UNLOADED);
      }
    }
  });
}
