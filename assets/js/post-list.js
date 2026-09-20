/* URL-backed filters preserve a reading trail across reloads and back/forward. */
(() => {
  const posts = [...document.querySelectorAll('[data-post-index]')];
  const year = document.getElementById('year-filter');
  const month = document.getElementById('month-filter');
  if (!year || !month) return;
  const reset = document.getElementById('filter-reset');
  const status = document.getElementById('post-results');
  const empty = document.getElementById('empty-panel');
  const pagination = document.getElementById('pagination-nav');
  const numbers = document.getElementById('page-numbers');
  const previous = document.getElementById('prev-btn');
  const next = document.getElementById('next-btn');
  const perPage = 10;
  let currentPage = 1;
  let totalPages = 1;

  function save(replace = false) {
    const url = new URL(location.href);
    for (const [name, value] of [['year', year.value], ['month', month.value], ['page', String(currentPage)]]) {
      if (value === 'all' || (name === 'page' && value === '1')) url.searchParams.delete(name);
      else url.searchParams.set(name, value);
    }
    if (url.href !== location.href) history[replace ? 'replaceState' : 'pushState'](null, '', url);
  }

  function render() {
    const matches = posts.filter(post => (year.value === 'all' || post.dataset.year === year.value)
      && (month.value === 'all' || post.dataset.month === month.value));
    totalPages = Math.max(1, Math.ceil(matches.length / perPage));
    currentPage = Math.max(1, Math.min(currentPage, totalPages));
    posts.forEach(post => { post.hidden = true; });
    matches.slice((currentPage - 1) * perPage, currentPage * perPage).forEach(post => { post.hidden = false; });
    status.textContent = `${matches.length}개의 글${matches.length ? ` · ${currentPage} / ${totalPages} 페이지` : ''}`;
    reset.disabled = year.value === 'all' && month.value === 'all';
    empty.hidden = matches.length > 0;
    pagination.hidden = matches.length <= perPage;
    previous.disabled = currentPage === 1;
    next.disabled = currentPage === totalPages;
    numbers.replaceChildren();
    const pages = [...new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages])]
      .filter(value => value >= 1 && value <= totalPages).sort((a, b) => a - b);
    let last = 0;
    pages.forEach(value => {
      if (last && value - last > 1) {
        const gap = document.createElement('li'); gap.textContent = '…'; gap.setAttribute('aria-hidden', 'true'); numbers.append(gap);
      }
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button'; button.textContent = value;
      button.setAttribute('aria-label', `${value} 페이지`);
      if (value === currentPage) button.setAttribute('aria-current', 'page');
      button.addEventListener('click', () => changePage(value));
      item.append(button); numbers.append(item); last = value;
    });
  }

  function announce() {
    status.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  function changePage(value) { currentPage = value; render(); save(); announce(); }
  function restore() {
    const params = new URLSearchParams(location.search);
    for (const [select, key] of [[year, 'year'], [month, 'month']]) {
      const value = params.get(key);
      select.value = [...select.options].some(option => option.value === value) ? value : 'all';
    }
    const requested = Number(params.get('page') || 1);
    currentPage = Number.isSafeInteger(requested) && requested > 0 ? requested : 1;
    render(); save(true);
  }
  year.addEventListener('change', () => changePage(1));
  month.addEventListener('change', () => changePage(1));
  const clear = () => { year.value = month.value = 'all'; changePage(1); };
  reset.addEventListener('click', clear);
  document.getElementById('empty-reset').addEventListener('click', clear);
  previous.addEventListener('click', () => changePage(currentPage - 1));
  next.addEventListener('click', () => changePage(currentPage + 1));
  window.addEventListener('popstate', restore);
  restore();
})();
