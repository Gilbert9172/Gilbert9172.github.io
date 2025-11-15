---
layout: page
icon: fas fa-newspaper
order: 1
---

{% assign posts = site.posts | where_exp: 'item', 'item.hidden != true' %}

<div id="post-list" class="flex-grow-1 px-xl-1">
  {% for post in posts %}
    <article class="card-wrapper card" data-post-index="{{ forloop.index0 }}">
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
  let currentPage = 1;

  const posts = document.querySelectorAll('[data-post-index]');
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const pageNumbersContainer = document.getElementById('page-numbers');

  function showPage(page) {
    const start = (page - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;

    posts.forEach((post, index) => {
      post.style.display = index >= start && index < end ? 'block' : 'none';
    });

    currentPage = page;
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
