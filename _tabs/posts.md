---
layout: page
title: 글 목록
description: 관심 있는 글을 찾거나, 작성 시기로 지난 기록을 살펴보세요.
icon: fas fa-newspaper
order: 1
---

{% assign posts = site.posts | where_exp: 'item', 'item.hidden != true' %}

<div class="post-filters">
  <div class="post-filter-group">
    <label for="year-filter">연도</label>
    <select id="year-filter" class="form-select post-filter">
      <option value="all">전체 연도</option>
      {% assign years = posts | group_by_exp: 'post', "post.date | date: '%Y'" %}
      {% for year in years %}<option value="{{ year.name }}">{{ year.name }}년</option>{% endfor %}
    </select>
  </div>
  <div class="post-filter-group">
    <label for="month-filter">월</label>
    <select id="month-filter" class="form-select post-filter">
      <option value="all">전체 월</option>
      {% for month in (1..12) %}
        {% assign month_value = month | prepend: '0' | slice: -2, 2 %}
        <option value="{{ month_value }}">{{ month }}월</option>
      {% endfor %}
    </select>
  </div>
  <button type="button" id="filter-reset">필터 초기화</button>
</div>
<p id="post-results" class="post-results" role="status" aria-live="polite" tabindex="-1"></p>
<div id="empty-panel" class="empty-state-panel" hidden>
  <p>선택한 기간에 작성된 글이 없습니다. 기간을 바꾸거나 필터를 초기화해 주세요.</p>
  <button type="button" id="empty-reset">전체 글 보기</button>
</div>

<div id="post-list" class="flex-grow-1 px-xl-1">
  {% for post in posts %}
    <article class="card-wrapper card" data-post-index="{{ forloop.index0 }}" data-year="{{ post.date | date: '%Y' }}" data-month="{{ post.date | date: '%m' }}">
      <a href="{{ post.url | relative_url }}" class="post-preview row g-0 flex-md-row-reverse">
        <div class="col-12">
          <div class="card-body d-flex flex-column">
            <h2 class="card-title my-2 mt-md-0">{{ post.title }}</h2>
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

<nav id="pagination-nav" class="reading-pagination" aria-label="글 목록 페이지">
  <button type="button" id="prev-btn">이전</button>
  <ul id="page-numbers" class="pagination"></ul>
  <button type="button" id="next-btn">다음</button>
</nav>
<script src="{{ '/assets/js/post-list.js' | relative_url }}" defer></script>
