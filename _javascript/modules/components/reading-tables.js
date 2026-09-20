/* Progressive enhancement: ordinary tables still scroll without JavaScript. */
export function initReadingTables() {
  const wrappers = document.querySelectorAll(
    '.reading-content > .table-wrapper, .reading-content :is(.notice-box, details) > .table-wrapper'
  );
  if (!wrappers.length) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'reading-table-dialog';
  dialog.setAttribute('aria-labelledby', 'reading-table-title');
  dialog.innerHTML = '<header><h2 id="reading-table-title"></h2><button type="button" aria-label="표 닫기">닫기 ×</button></header><div class="reading-table-scroll" tabindex="0" role="region" aria-label="표 내용"></div>';
  document.body.append(dialog);
  const title = dialog.querySelector('h2');
  const scroller = dialog.querySelector('.reading-table-scroll');
  let opener;
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.classList.remove('table-modal-open');
    scroller.replaceChildren();
    opener?.focus({ preventScroll: true });
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });

  wrappers.forEach((wrapper, index) => {
    const table = wrapper.querySelector('table');
    if (!table || table.classList.contains('rouge-table')) return;
    const heading = [...document.querySelectorAll('.reading-content h2, .reading-content h3, .reading-content h4')]
      .filter(node => node.compareDocumentPosition(wrapper) & Node.DOCUMENT_POSITION_FOLLOWING).at(-1);
    const label = table.caption?.textContent.trim()
      || `${heading ? heading.textContent.trim() + ' · ' : ''}표 ${index + 1}`;
    const tools = document.createElement('div');
    tools.className = 'reading-table-tools';
    tools.hidden = true;
    const hint = document.createElement('span');
    hint.textContent = '좌우로 스크롤해서 볼 수 있습니다 ↔';
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = '넓게 보기';
    button.setAttribute('aria-label', `${label} 넓게 보기`);
    button.setAttribute('aria-haspopup', 'dialog');
    tools.append(hint, button);
    wrapper.before(tools);
    button.addEventListener('click', () => {
      opener = button;
      const copy = table.cloneNode(true);
      copy.removeAttribute('id');
      copy.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
      scroller.replaceChildren(copy);
      title.textContent = label;
      dialog.showModal();
      document.body.classList.add('table-modal-open');
    });
    const update = () => {
      const overflowing = wrapper.clientWidth > 0 && wrapper.scrollWidth > wrapper.clientWidth + 2;
      tools.hidden = !overflowing;
      if (overflowing) {
        wrapper.tabIndex = 0;
        wrapper.setAttribute('role', 'region');
        wrapper.setAttribute('aria-label', `${label}, 가로 스크롤 가능`);
      } else {
        wrapper.removeAttribute('tabindex');
        wrapper.removeAttribute('role');
        wrapper.removeAttribute('aria-label');
      }
    };
    const observer = new ResizeObserver(update);
    observer.observe(wrapper);
    observer.observe(table);
    update();
  });
}
