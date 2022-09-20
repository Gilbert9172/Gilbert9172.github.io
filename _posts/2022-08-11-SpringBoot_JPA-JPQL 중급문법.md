---
layout: post
title: JPQL 중급문법
categories: spring
tags: jpa
---

## <span style="color:gray">경로 표현식</span>

---

#### ***경로 표현식이란?***

> .(점)을 찍어 객체 그래프를 탐색하는 것

**상태 필드(stateField)**

✔︎ 단순히 값을 저장하기 위한 필드 (ex. m.username)

✔︎ 경로 탐색의 끝, 더 이상 탐색을 할 수 없다.

<br>

**단일 값 연관 필드**

✔︎ ManyToOne, @OneToOne (대상이 엔티티)

✔︎ 묵시적 내부 조인(Inner Join) 발생, 탐색 가능

<br>

**컬렉션 값 연관 필드**

```java
// 더 이상 탐색 불가능
String query = "SELECT t.members FROM Team t";

// FROM 절에서 명시적 JOIN
String query = "SELECT m.usernane FROM Team t JOIN t.members m";
```

✔︎ @OneToMany, @ManyToMany (대상이 컬렉션)

✔︎ 묵지적 내부 조인 발생, 탐색 불가능

✔︎ FROM 절에서 명시적 조인을 통해 별칭을 얻으면 별칭을 통해 탐색 가능.

<br>

**경로 탐색을 사용한 묵시적 조인 시 주의사항**

✔︎ 항상 내부 조인이다.

✔︎ 컬렉션은 경로 탐색의 끝, 명시적 조인을 통해 별칭을 얻어야 한다.

✔︎ 경로 탐색은 주로 SELECT, WHERE 절에 영향을 준다. 

✔︎ 하지만 묵시적 조인으로 인해 SQL의 FROM(JOIN) 절에 영향을 준다.

<br>

**실무 조언**

✔︎ 가급적 묵지적 조인 대신에 ***<span style="color:red">명시적 조인 사용해라</span>***

✔︎ 조인은 SQL 튜닝에 중요 포인트

✔︎ 묵지적 조인은 조인이 일어나는 상황을 한 눈에 파악하기 어려움

<br>

## <span style="color:gray">명시적 조인, 묵시적 조인</span>

---

#### ***명시적 조인***

✔︎ join 키워드를 직접 사용하는 것.

✔︎ `select m from Member m join m.team t`

<br>

#### ***묵시적 조인***

✔︎ 경로 표현식에 의해 묵지적으로 SQL조인 발생

✔︎ ***<span style="color:red">내부 조인만 가능</span>***

✔︎ `select m.team from Member m`
