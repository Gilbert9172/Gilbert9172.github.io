---
layout: post
title: 값 타입
categories: spring
tags: jpa
---

## <span style="color:gray">JPA의 데이터 타입 분류</span>

---

#### ***엔티티 타입***

• `@Entity`로 정의하는 객체

• 데이터가 변해도 식별자로 지속해서 추적 가능

<br>

#### ***값 타입***

• int, integer, string 처럼 단순히 값으로 사용하는 자바 기본 타입이나 객체

• 식별자가 없고 값만 있으므로 변경시 추적 불가

<br>

## <span style="color:gray">기본 값 타입</span>

---

생명 주기를 엔티티에 의존

값 타입은 공유하면 안된다.

int, double 같은 기본 타입은 절대 공유하면 안된다.

기본 타입은 항상 값을 복사한다.

Integer 같은 래퍼 클래스나 String 같은 특수한 클래스는 공유 가능한 객체이지만 변경 불가하다.

<br>

## <span style="color:gray">임베디드 타입</span>

---

<br>

## <span style="color:gray">값 타입과 불변 객체</span>

---

