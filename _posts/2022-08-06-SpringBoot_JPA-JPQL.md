---
layout: post
title: JPQL
categories: spring
tags: jpa
---

## <span style="color:gray">Java Persistence Query Language</span>

---

#### ***JPQL 문법***

• 엔티티와 속성은 대소문자 구분O

• JPQL 키워드는 대소문자 구분X

• 엔티티 이름 사용, 테이블 이름이 아님

• ***<span style="background-color:yellow">별칭은 필수</span>***

<br>

#### ***TypeQuery, Query***

**TypeQuery**

> 반환 타입이 명확할 때 사용

```java
TypeQuery<Member> query1 = 
            em.createQuery("SELECT m FROM Member m", Member.class);
```

<br>

**Query**

> 반환 타입이 명확하지 않을 때 사용

```java
Query<Member> query1 = 
         em.createQuery("SELECT m.username, m.age FROM Member m");
```

<br>

#### ***결과 조회 API***

**`query.getResultList();`**

> 결과가 하나 이상일 떄, 리스트 반환

• 결과가 없으면 빈 리스트 반환

```java

```

<br>

**`query.getSingleResult();`**

> 결과가 정확히 하나, 단일 객체 반환

• 결과가 없으면 **`javax.persistence.NoResultException`**

• 결과가 둘 이상이면 **`javax.persistence.NonUniqueResultException`**

```java

```

<br>

#### ***파라미터 바인딩 - 이름 기준, 위치 기준***

위치 기반은 쓰지 않는 걸 추천. 나중에 새로운 값이 추가됐을 때 유지보수 힘듬.

```java
String query = "SELECT m FROM Member m WHERE m.username = :username";

Member result = em.createQuery(query, Member.class)
                    .setParameter("username", "member1")
                    .getSingleResult();
```