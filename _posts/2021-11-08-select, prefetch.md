---
layout: post
title: select_related & prefetch_related
categories: django
tags: django
---

### ๐ก ***select_related & prefetch_related***

select_related์ prefetch_related๋ ํ๋์ QuerySet์ ๊ฐ์ ธ์ฌ ๋,

๋ฏธ๋ฆฌ related_object๋ค ๊น์ง ๋ค ๋ถ๋ฌ์์ฃผ๋ ํจ์์ด๋ค.

๋น๋ก query๋ฅผ ๋ณต์กํ๊ฒ ๋ง๋ค๊ธด ํ์ง๋ง, ๊ทธ๋ ๊ฒ ๋ถ๋ฌ์จ ๋ฐ์ดํฐ๋ค์ ๋ชจ๋ 'cache'์ ๋จ์์๊ฒ 

๋๋ฏ๋ก DB์ ๋ค์ ์ ๊ทผํด์ผ ํ๋ ์๊ณ ๋ฅผ ๋์ด์ค ์ ์๋ค. ์ด๋ ๊ฒ ๋ ํจ์ ๋ชจ๋ DB์ ์ ๊ทผํ๋ 

์๋ฅผ ์ค์ฌ, ์ฑ๋ฅ์ ํฅ์์์ผ์ค๋ค๋ ์ธก๋ฉด์์๋ ๊ณตํต์ ์ด ์์ง๋ง, ๊ทธ ๋ฐฉ์์๋ ์ฐจ์ด์ ์ด ์๋ค.

---

<br>

### ๐ก ***์ฐจ์ด์ ***

#### 1. select_related

select_related๋ SQL์ **`JOIN`** ์ ์ฌ์ฉํ๋ ํน์ฑ์ <span style="color:#4169E1">Foreign Key</span>, <span style="color:#4169E1">one-to-one ํ๋</span>์์๋ง 

์ฌ์ฉ ๊ฐ๋ฅํ๋ค. select_related๋ ํ๋์ Query๋ง์ผ๋ก related_objects๋ค์ ๋ค ๊ฐ์ ธ์จ๋ค.

<br>

#### 2. prefetch_related

prefetch_related์ ๊ฒฝ์ฐ์๋ ์ธ๋ํค, 1:1 ๋ฟ๋ง ์๋๋ผ N:M, N:1 ๋ฑ ๋ชจ๋  ๊ฒฝ์ฐ์ ์ฌ์ฉ 

๊ฐ๋ฅํ๋ค. prefetch_related๋ ์๋ main Query๊ฐ ์คํ๋๊ณ , ๋ณ๋์ query๋ฅผ ์คํํ๋ค.

๋ค์๋งํด, selected_related ๋ณด๋ค DB์ ๊ทผ ์๊ฐ 1๋ฒ ๋ง๋ค.

---

<br>

### ๐ ***Reference***

โช [๋ธ๋ก๊ทธ](https://jupiny.tistory.com/entry/selectrelated%EC%99%80-prefetchrelated)