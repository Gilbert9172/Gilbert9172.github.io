---
layout: post
title: 엔티티 설계시 주의사항
categories: spring
tags: jpa
---

## <span style="color:gray">엔티티 설계시 주의사항</span>

---

#### <span style="background-color:black; color:white">엔티티에는 가급적 Setter를 사용하지 말자</span>

setter가 모두 열려있다면 변경 포인트가 너무 많아서 **<span style="background-color:#F0E68C">유지보수가 어렵다.</span>**

<br>

#### <span style="background-color:black; color:white">모든 연관관계는 지연로딩으로 설정!</span>

즉시로딩(EAGER)는 예측이 어렵고, 어떤 SQL이 실행될지 추적하기 어렵다.

특히 JPQL을 실행할 때 **<span style="color:red">N+1 문제</span>** 가 자주 발생한다.

결국 실무에서는 모든 연관관계는 지연로딩(LAZY)으로 설정해야 한다.

<br>

`@XToOne` 관계는 기본이 즉시로딩이므로 직접 지연로딩으로 설정해야 한다.

<br>

연관된 엔티티를 함께 DB에서 조회해야 하면, fetch join 또는 엔티티 그래프 기능을

사용한다.

<br>

#### <span style="background-color:black; color:white">컬렉션은 필드에서 초기화 하자.</span>

**<span style="background-color:#F0E68C">컬렉션은 필드에서 바로 초기화 하는 것이 안전하다.</span>**

<br>

하이버네이트는 엔티티를 영속화 할 때, 컬렉션을 감싸서 하이버네이트가 제공하는

내장 컬렉션으로 변경한다. 만약 `getOrders()` 처럼 임의의 메서드에서 컬렉션을 잘못

생성하면 하이버네이트 내부 메커니즘에 문제가 발생할 수 있다.

따라서 필드레벨에서 생성하는 것이 null문제에도 안전하고, 코드도 간결하다.

<br>

```java
Member member = new Member();
System.out.println(member.getOrders().getClass());
// 출력결과 => class java.util.ArrayList
em.persist(team);

System.out.println(member.getOrders().getClass());
//출력 결과 => class org.hibernate.collection.internal.PersistentBag
```

<br>

#### <span style="background-color:black; color:white">테이블, 컬럼명 생성 전략</span>

**<u>▷ SpringPhysicalNamingStrategy</u>**

하이버네이트 기존 구현으로 엔티티의 필드명을 그대로 테이블의 컬럼명으로 사용한다.

<br>

**<u>▷ 스프링 부터 신규 설정</u>**

• 카멜 케이스 : 언더스코어(memberPoint → member_point)

• .(점) : _(언더스코어)

• 대문자 : 소문자