import { TocMobile as mobile } from './toc/toc-mobile';
import { TocDesktop as desktop } from './toc/toc-desktop';

const desktopMode = matchMedia('(min-width: 1200px)');
const hasDesktopToc = Boolean(document.getElementById('toc-wrapper'));

function refresh(e) {
  if (e.matches && hasDesktopToc) {
    if (mobile.popupOpened) {
      mobile.hidePopup();
    }

    desktop.refresh();
  } else {
    mobile.refresh();
  }
}

function init() {
  if (document.querySelector('main>article[data-toc="true"]') === null) {
    return;
  }

  // Avoid create multiple instances of Tocbot. Ref: <https://github.com/tscanlin/tocbot/issues/203>
  if (desktopMode.matches && hasDesktopToc) {
    desktop.init();
  } else {
    mobile.init();
  }

  const $tocWrapper = document.getElementById('toc-wrapper');
  $tocWrapper?.classList.remove('invisible');

  desktopMode.onchange = refresh;
}

export { init as initToc };
