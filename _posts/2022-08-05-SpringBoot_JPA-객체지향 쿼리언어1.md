---
layout: post
title: 객체지향 쿼리 언어 - 기본문법
categories: spring
tags: jpa
---

## <span style="color:gray">JPA의 다양한 쿼리 방법</span>

---

> 실무에서는 대부분 JPQL로 해결이 된다.

• **JPQL**

• JPA Criteria

• **QueryDSL**

• 네이티브 SQL

• JDBC API 직접 적용, MyBatis, SpringJdbcTemplate 사용

<br>

## <span style="color:gray">JPQL</span>

---

#### ***JPQL이란?***

JPA를 사용하면 엔티티 객체를 중심으로 개발을 진행한다. 여기서 문제는 검색 쿼리인데,

검색을 할 때도 테이블이 아닌 **엔티티 객체를 대상으로 검색을 한다.**

모든 DB 데이터를 개체ㅐ로 변환해서 검색하는 것은 불가능하다. 따라서 애플리케이션이

필요한 데이터만 DB에서 불러오려면 결국 검색 조건이 포함된 SQL이 필요하다.

이런 문제들을 해결하기 위해서 JPA는 ***<span style="background-color:yellow">SQL을 추상화한 JPQL</span>*** 이라는 객체 지향 쿼리 언어를 

제공한다. JPQL은 SQL에서 제공해주는 SELECT, FROM, WHERE, GROUP BY, HAVING, 

JOIN을 지원한다(ANSI 표준). 결국 JPQL을 작성하면 SQL로 번역이 되어 실행된다.

JPQL과 SQL의 가장 큰 차이는 JPQL은 엔티티 객체를 대상으로 쿼리를 하고, 

SQL은 데이터베이스 테이블을 대상으로 쿼리를 한다는 점이다.

<br>

#### ***예제 코드***

**엔티티 객체를 대상으로 쿼리**
```java
EntityManagerFactory emf = Persistence.createEntityManagerFactory("hello");
EntityManager em = emf.createEntityManager();   // DB connection
EntityTransaction tx = em.getTransaction();

String query = "SELECT m FROM Member m WHERE m.name LIKE '%Jung%'"
List<Member> memberList = em.createQuery(query).getResultList();
```

보통은 `SELECT *`을 사용하는데 여기서는 Member의 alias인 `m`을 사용하였는데,

이 뜻은 "member 엔티티의 모든 필드를 조회해" 라는 의미로 해석하면 될 것 같다.

<br>

위에서 작성한 JPQL은 아래와 같은 SQL문으로 번역된다.

```sql
select
    member0_.MEMBER_ID as member_i1_9_,
    member0_.city as city2_9_,
    member0_.street as street3_9_,
    member0_.zipcode as zipcode4_9_,
    member0_.USERNAME as username5_9_,
    member0_.endDate as enddate6_9_,
    member0_.startDate as startdat7_9_ 
from
    Member member0_ 
where
    member0_.USERNAME like '%Jung%';
```

<br>

#### ***JPQL 정리***

• 테이블이 아닌 객채ㅔ를 대상으로 검색하는 객체 지향 쿼리

• SQL을 추상화해서 특정 데이터베이스 SQL에 의존하지 않는다.

• JPQL을 한마디로 정의하면 ***<span style="background-color:yellow">객체 지향 SQL</span>*** 이라고 할 수 있다.

• ***<span style="color:Red">동적 쿼리를 만들기가 매우 힘들다.</span>***

<br>

## <span style="color:gray">Criteria</span>

---

#### ***Criteria이란?***

• 문자가 아닌 자바코드로 JPQL을 작성할 수 있음

• JPQL 빌더 역할

• JPA 공식 기능

• ***<span style="color:Red">너무 복잡하고 실용성이 없다.</span>***

• QueryDSL 사용 권장.