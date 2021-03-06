---
layout : post
title : Django raw SQL queries
categories : django
tags : django
---

### ๐ก ***django์์ SQL๋ฌธ์ผ๋ก ๊ฐ๋ฐํ๊ธฐ***

์ค๋ [django document](https://docs.djangoproject.com/en/4.0/topics/db/sql/)๋ฅผ ์ฝ๋๋ฐ ์ฐ์ฐํ ๋ฐ๊ฒฌํ๊ฒ ๋๋ค. 

Django์๋ **`raw()`** manager๊ฐ ์๋ค. ์ด ๋ฉ์๋๋ฅผ ์ฌ์ฉํด์ ์ง์  ์ฟผ๋ฆฌ๋ฌธ์ ์์ฑํ  ์ ์๋ค.

์ง์  ์ค์ต์ ์ํด์ djagno shell_plus์ ์ง์ํ๋ค.

<img src="/assets/img/sql/django_sql.png">

<br>

์ฟผ๋ฆฌ๋ฌธ ๋ด์์ ๋งค๊ฐ๋ณ์๋ฅผ ๋๊ฒจ์ค ๋๋ ๋ ๊ฐ์ง ๋ฐฉ๋ฒ์ด ์๋ค.

**โ %s**

์ฟผ๋ฆฌ๋ฌธ ์์ฑ์ WHERE ์ ์ ๋ค์ด๊ฐ ๊ฐ์ <span style="color:#2E8B57">**๋ฆฌ์คํธ**</span>์ ๋ฃ์ด์ ๋๊ฒจ์ค๋ค.

<br>

**โ %(key)s**

๋ ๋ฒ์งธ ๋ฐฉ๋ฒ์ <span style="color:#2E8B57">**dict(ํค:๊ฐ)**</span> ํํ๋ก ๊ฐ์ ๋๊ฒจ์ฃผ๋ ๋ฐฉ๋ฒ์ด๋ค.


<br>

ํ๋์ ์ด๋ฆ์ ๋ค๋ฅธ ์ด๋ฆ์ผ๋ก ๋ถ๋ฌ์ผ ํ  ๊ฒฝ์ฐ ์๋์ ๊ฐ์ด ์์ฑํ๋ค๊ณ  ํ๋ค.

```python
# CASE1
Person.objects.raw(
    '''
    SELECT first AS first_name,
           last AS last_name,
           bd AS birth_date,
           pk AS id,
    FROM some_other_table
    '''
    )

# CASE2
name_map = {
    'first': 'first_name',
    'last': 'last_name',
    'bd': 'birth_date',
    'pk': 'id'
    }

Person.objects.raw(
                    'SELECT * FROM some_other_table',
                     translations=name_map
                  )
```
---