---
layout: post
title: JPA란?
categories: spring
tags: jpa
---

## <span style="color:gray">왜 JPA인가?</span>

***<span style="background-color:yellow">객체를 자바 컬렉션에 저장하듯이 DB에 저장할 수는 없을까?🧐</span>***

관계형 데이터베이스를 쓰는 현재에는 SQL에 의존적인 개발을 피하기 어렵다.

그리고 객체와 관계형 데이터베이스는 패러다임이 일치하지 않는다.

```txt
객체 지형 프로그래밍은 추상화, 캡슐화, 정보은닉, 상속, 다형성 등 

시스템의 복잡성을 제어할 수 있는 다양한 장치들을 제공한다.
```

<br>

***객체와 관계형 데이터베이스의 차이***

| |객체|RDBMS|
|-|----|-----|
|상속|O|X|
|연관관계|참조(getXxx)|외래키(FK)|
|데이터 타입|
|데이터 식별 방법|

---

<br>

## <span style="color:gray">JPA란?</span>

> Java Persistence API

✓ 자바 진영의 ORM 기술 표준.

✓ 인터페이스의 모음

✓ JPA 2.1 표준 명세를 구현한 3가지 구현체 : 하이버네이트, EclipseLink, DataNucleus

---

<br>

## <span style="color:gray">JPA 동작 원리</span>

JPA는 애플리케이션과 JDBC 사이에서 동작한다.

<img src="/assets/img/jpa/jpa1.png">

<br>

***저장***

<img src="/assets/img/jpa/jpaSave.png">

<br>

***조회***

<img src="/assets/img/jpa/jpaQuery.png">

---

<br>

## <span style="color:gray">JPA를 왜 사용해야 하는가?</span>

✓ SQL 중심적인 개발에서 객체 중심으로 개발

✓ 생산성

✓ 유지보수 (필드만 추가하면 된다.)

✓ RDBMS와 객체의 불일치 패러다임 해소.

✓ 성능 최적화 (캐싱, 동일성 보장, 버퍼링)

✓ 지연 로딩, 즉시 로딩

---