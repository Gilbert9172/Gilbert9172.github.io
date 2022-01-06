---
layout : post
title : Django raw SQL queries
categories : django
tags : django
---

### 💡 ***django에서 SQL문으로 개발하기***

오늘 [django document](https://docs.djangoproject.com/en/4.0/topics/db/sql/)를 읽는데 우연히 발견하게 됐다. 

Django에는 **`raw()`** manager가 있다. 이 메서드를 사용해서 직접 쿼리문을 작성할 수 있다.

직접 실습을 위해서 djagno shell_plus에 진입했다.

<img src="/assets/img/sql/django_sql.png">

<br>

쿼리문 내에서 매개변수를 넘겨줄 때는 두 가지 방법이 있다.

**⒈ %s**

쿼리문 작성시 WHERE 절에 들어갈 값을 <span style="color:#2E8B57">**리스트**</span>에 넣어서 넘겨준다.

<br>

**⒉ %(key)s**

두 번째 방법은 <span style="color:#2E8B57">**dict(키:값)**</span> 형태로 값을 넘겨주는 방법이다.


<br>

필드의 이름을 다른 이름으로 불러야 할 경우 아래와 같이 작성한다고 한다.

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