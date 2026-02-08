---
layout: page
icon: fas fa-newspaper
order: 1
---

{% assign posts = site.posts | where_exp: 'item', 'item.hidden != true' %}

<style>
  .post-filter {
    background-color: var(--button-bg);
    color: var(--text-color);
    border: 1px solid var(--btn-border-color);
    border-radius: 0.375rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    width: 5.5rem;
    transition: border-color 0.15s ease-in-out;
  }

  .post-filter:hover {
    border-color: var(--input-focus-border-color);
  }

  .post-filter:focus {
    color: var(--text-color);
    border-color: var(--input-focus-border-color);
    outline: 0;
  }

  .post-filter option {
    background-color: var(--button-bg);
    color: var(--text-color);
  }

  @media (max-width: 400px) {
    .post-filter {
      font-size: 0.8rem;
      padding: 0.25rem 0.5rem;
    }
  }

  /* Theme-integrated empty state panel */
  .empty-state-panel {
    display: none;
  }

  .empty-state-panel.visible {
    display: block;
    background-color: var(--main-border-color);
    border: 1px solid var(--btn-border-color);
    border-radius: 10px;
    padding: 2rem;
    margin: 2rem 0;
    text-align: center;
  }

  .empty-state-icon {
    font-size: 2.5rem;
    color: var(--text-muted-color);
    margin-bottom: 1rem;
    display: block;
  }

  .empty-state-text {
    color: var(--text-color);
    font-size: 1rem;
    line-height: 1.6;
    margin: 0;
  }

  .empty-state-text strong {
    font-weight: 600;
  }

  .empty-state-link {
    display: inline-block;
    margin-top: 1.25rem;
    padding: 0.625rem 1.5rem;
    background-color: var(--button-bg);
    color: var(--link-color);
    border: 1px solid var(--btn-border-color);
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .empty-state-link:hover {
    background-color: var(--card-hover-bg);
    border-color: var(--input-focus-border-color);
  }

  .empty-state-link i {
    margin-left: 0.5rem;
  }
</style>

<!-- Filters -->
<div class="mb-4 px-xl-1 d-flex justify-content-end align-items-center flex-wrap gap-2">
  <select id="year-filter" class="form-select post-filter">
    <option value="all">전체</option>
    {% assign currentYear = site.time | date: "%Y" | plus: 0 %}
    {% for year in (2021..2099) reversed %}
      {% if year <= currentYear %}
        <option value="{{ year }}">{{ year }}년</option>
      {% endif %}
    {% endfor %}
  </select>
  <select id="month-filter" class="form-select post-filter">
    <option value="all">전체</option>
    <option value="01">1월</option>
    <option value="02">2월</option>
    <option value="03">3월</option>
    <option value="04">4월</option>
    <option value="05">5월</option>
    <option value="06">6월</option>
    <option value="07">7월</option>
    <option value="08">8월</option>
    <option value="09">9월</option>
    <option value="10">10월</option>
    <option value="11">11월</option>
    <option value="12">12월</option>
  </select>
</div>

<!-- Empty state panel -->
<div id="empty-panel" class="empty-state-panel px-xl-1">
  <p class="empty-state-text">
    <strong id="empty-message">해당 년도의 글은 티스토리 블로그에 있습니다.</strong>
  </p>
  <a href="https://gilbert9172.tistory.com/" target="_blank" rel="noopener noreferrer" class="empty-state-link">
    티스토리 블로그 방문 <i class="fas fa-arrow-right"></i>
  </a>
</div>

<div id="post-list" class="flex-grow-1 px-xl-1">
  {% for post in posts %}
    <article class="card-wrapper card" data-post-index="{{ forloop.index0 }}" data-year="{{ post.date | date: '%Y' }}" data-month="{{ post.date | date: '%m' }}">
      <a href="{{ post.url | relative_url }}" class="post-preview row g-0 flex-md-row-reverse">
        <div class="col-12">
          <div class="card-body d-flex flex-column">
            <h1 class="card-title my-2 mt-md-0">{{ post.title }}</h1>
            <div class="card-text content mt-0 mb-3">
              <p>{% include post-summary.html %}</p>
            </div>
            <div class="post-meta flex-grow-1 d-flex align-items-end">
              <div class="me-auto">
                <i class="far fa-calendar fa-fw me-1"></i>
                <span>{{ post.date | date: "%Y-%m-%d" }}</span>
                {% if post.categories.size > 0 %}
                  <i class="far fa-folder-open fa-fw me-1 ms-3"></i>
                  <span class="categories">
                    {% for category in post.categories %}
                      {{ category }}
                      {%- unless forloop.last -%},{%- endunless -%}
                    {% endfor %}
                  </span>
                {% endif %}
              </div>
            </div>
          </div>
        </div>
      </a>
    </article>
  {% endfor %}
</div>

<!-- Pagination -->
<nav id="pagination-nav" class="d-flex justify-content-center mt-5" aria-label="Page Navigation">
  <ul class="pagination">
    <li class="page-item">
      <button class="page-link" id="prev-btn" aria-label="Previous page">이전</button>
    </li>
    <li id="page-numbers" class="d-flex gap-1">
      <!-- Page numbers will be inserted here -->
    </li>
    <li class="page-item">
      <button class="page-link" id="next-btn" aria-label="Next page">다음</button>
    </li>
  </ul>
</nav>

<script>
(function() {
  const POSTS_PER_PAGE = 10;
  const MONTH_NAMES = ['', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  let currentPage = 1;
  let selectedYear = 'all';
  let selectedMonth = 'all';

  const allPosts = document.querySelectorAll('[data-post-index]');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const pageNumbersContainer = document.getElementById('page-numbers');
  const yearFilter = document.getElementById('year-filter');
  const monthFilter = document.getElementById('month-filter');
  const emptyMessage = document.getElementById('empty-message');
  const tistoryLink = document.querySelector('#empty-panel .empty-state-link');

  let visiblePosts = Array.from(allPosts);
  let totalPages = Math.ceil(visiblePosts.length / POSTS_PER_PAGE);

  function getVisiblePosts() {
    return Array.from(allPosts).filter(post => {
      const yearMatch = selectedYear === 'all' || post.dataset.year === selectedYear;
      const monthMatch = selectedMonth === 'all' || post.dataset.month === selectedMonth;
      return yearMatch && monthMatch;
    });
  }

  function updateEmptyMessage() {
    const monthName = selectedMonth !== 'all' ? MONTH_NAMES[parseInt(selectedMonth, 10)] : '';

    if (selectedYear !== 'all' && selectedMonth !== 'all') {
      emptyMessage.textContent = selectedYear + '년 ' + monthName + '의 글이 없습니다.';
      tistoryLink.style.display = 'none';
    } else if (selectedYear !== 'all') {
      emptyMessage.textContent = selectedYear + '년의 글은 티스토리 블로그에 있습니다.';
      tistoryLink.style.display = '';
    } else if (selectedMonth !== 'all') {
      emptyMessage.textContent = monthName + '의 글이 없습니다.';
      tistoryLink.style.display = 'none';
    }
  }

  function showPage(page) {
    visiblePosts = getVisiblePosts();
    totalPages = Math.ceil(visiblePosts.length / POSTS_PER_PAGE);

    const start = (page - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;

    // 결과가 없는 경우 패널 표시
    const emptyPanel = document.getElementById('empty-panel');
    const paginationNav = document.getElementById('pagination-nav');

    if (visiblePosts.length === 0) {
      updateEmptyMessage();
      emptyPanel.classList.add('visible');
      paginationNav.style.display = 'none';
    } else {
      emptyPanel.classList.remove('visible');
      paginationNav.style.display = '';
    }

    allPosts.forEach(post => {
      post.style.display = 'none';
    });

    visiblePosts.forEach((post, index) => {
      if (index >= start && index < end) {
        post.style.display = 'block';
      }
    });

    currentPage = Math.min(page, totalPages) || 1;
    updatePaginationUI();
  }

  function updatePaginationUI() {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    pageNumbersContainer.innerHTML = '';

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      const li = document.createElement('li');
      li.className = 'page-item disabled';
      const span = document.createElement('span');
      span.className = 'page-link';
      span.textContent = '...';
      li.appendChild(span);
      pageNumbersContainer.appendChild(li);
    }

    for (let i = startPage; i <= endPage; i++) {
      const li = document.createElement('li');
      li.className = 'page-item';
      if (i === currentPage) li.classList.add('active');

      const button = document.createElement('button');
      button.className = 'page-link';
      button.textContent = i;
      button.onclick = (e) => {
        e.preventDefault();
        showPage(i);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };

      li.appendChild(button);
      pageNumbersContainer.appendChild(li);
    }

    if (endPage < totalPages) {
      const li = document.createElement('li');
      li.className = 'page-item disabled';
      const span = document.createElement('span');
      span.className = 'page-link';
      span.textContent = '...';
      li.appendChild(span);
      pageNumbersContainer.appendChild(li);
    }
  }

  yearFilter.addEventListener('change', (e) => {
    selectedYear = e.target.value;
    selectedMonth = 'all';
    monthFilter.value = 'all';
    currentPage = 1;
    showPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  monthFilter.addEventListener('change', (e) => {
    selectedMonth = e.target.value;
    currentPage = 1;
    showPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      showPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      showPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  showPage(1);
})();
</script>
