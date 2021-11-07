---
layout: post
title: select_related & prefetch_related
categories: django
---

### 💡 ***select_related & prefetch_related***

select_related와 prefetch_related는 하나의 QuerySet을 가져올 때,

미리 related_object들 까지 다 불러와주는 함수이다.

비록 query를 복잡하게 만들긴 하지만, 그렇게 불러온 데이터들은 모두 'cache'에 남아있게 되므로 

DB에 다시 접근해야 하는 수고를 덜어줄 수 있다. 이렇게 두 함수 모두 DB에 접근하는 수를 줄여, 

성능을 향상시켜준다는 측면에서는 공통점이 있지만, 그 방식에는 차이점이 있다.

---

<br>

### 💡 ***차이점***

#### 1. select_related

select_related는 SQL의 JOIN을 사용하는 특성상 외래키, one-to-one 필드에서만 사용 가능하다.

select_related는 하나의 Query만으로 related_objects들을 다 가져온다.

<br>

#### 2. prefetch_related

prefetch_related의 경우에는 외래키, 1:1 뿐만 아니라 N:M, N:1 등 모든 경우에 사용 가능하다.

prefetch_related는 원래 main Query가 실행되고, 별도의 query를 실행한다.

다시말해, selected_related 보다 DB접근 수가 1번 많다.

---

<br>

### 📚 ***Reference***

▪ [블로그](https://jupiny.tistory.com/entry/selectrelated%EC%99%80-prefetchrelated)