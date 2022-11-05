---
layout: post
title: 벌크 연산
categories: spring
tags: jpa
---

## <span style="color:gray">벌크 연산</span>

---

#### <span style="background-color:black; color:white">왜 사용할까?</span>

만약 재고가 10개 미만인 모든 상품의 가격을 10% 상승한다고 해보자.

그러면 JPA는 더티체킹을 통해 10개의 SQL문을 내보낼 것이다. 

그러나 10개가 아니고 100만건이라면? **너무 많은 SQL**로 인해서 성능 이슈가

생길 것이다. 이런 문제를 해결하기 위해서는 **벌크 연산**을 사용해야 한다.

• **<span style="background-color:#F0E68C">애플리케이션 로딩 시점에 쿼리를 검증</span>**

<br>

#### <span style="background-color:black; color:white">특징</span>

• 쿼리 한 번으로 여러 테이블의 로우를 변경

• `executeUpdate()` 메소드는 영향받은 엔티티의 수를 반환한다.

• UPDATE, DELETE 지원

<br>

#### <span style="background-color:black; color:white">예시 코드</span>

```java
int resultCount = em.createQuery("update Member m set m.age=20")
    .executeUpdate();
```

<br>

#### <span style="background-color:black; color:white">주의 사항</span>

벌크 연산은 **<span style="color:red">영속성 컨텍스트를 무시</span>** 하고 데이터베이스에 직접 쿼리한다.

따라서 이 주위 사항을 피하기 위해선 아래의 해결책 중 하나를 따르면 된다.

• 벌크 연산을 제일 먼저한다.
 
• 중간에 벌크 연산을 수행 했다면 영속성 컨텍스트를 초기화해 줘야 한다.

<br>

영속성 컨텍스트를 초기화 해주지 않으면 아래와 같이 데이터 정합성이

맞지 않게 된다.

```java
Member member1 = new Member("member1", 20);
em.persist(member1);

int resultCount = em.createQuery("update Member m set m.age=25")
    .executeUpdate();

System.out.println(member1.getAge()); // 20
```

위 코드의 결과를 보면 어플리케이션에서는 member1의 나이가 변하지 않았다.

하지만 DB를 조회해보면 나이가 20살에서 25살로 변했다.


|ID|AGE|USERNAME|
|--|---|--------|
|1|25|member1|

<br>

이번에는 영속성 컨텍스트를 초기화하고 진행해보겠다.

```java
Member member1 = new Member("member1", 20);
em.persist(member1);

//=> 이 시점에 flush() 호출
int resultCount = em.createQuery("update Member m set m.age=25")
    .executeUpdate();

/* 영속성 컨텍스트 초기화 */
em.clear();

Member findMember = em.find(Member.class, member1.getId());
System.out.println(findMember.getAge()); // 25
```

|ID|AGE|USERNAME|
|--|---|--------|
|1|25|member1|

DB데이터와 어플리케이션 데이터가 일치함을 확인할 수 있다.