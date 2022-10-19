---
layout: post
title: JPQL 중급문법 - 경로 표현식
categories: spring
tags: jpa
---

## <span style="color:gray">경로 표현식</span>

---

#### <span style="background-color:black; color:white">경로식 표현이란?</span>

> .(점)을 찍어 객체 그래프를 탐색하는 것

**<u>상태 필드(stateField)</u>**

✔︎ 단순히 값을 저장하기 위한 필드 (ex. m.username)

✔︎ 경로 탐색의 끝, 더 이상 탐색을 할 수 없다.

<br>

**<u>단일 값 연관 필드</u>**

✔︎ **<span style="background-color:#F0E68C">@ManyToOne</span>**, **<span style="background-color:#F0E68C">@OneToOne</span>** (대상이 엔티티)

✔︎ 묵시적 내부 조인(Inner Join) 발생, 탐색 가능

<br>

**<u>컬렉션 값 연관 필드</u>**

```java
// 더 이상 탐색 불가능
String query = "SELECT t.members FROM Team t";

// FROM 절에서 명시적 JOIN
String query = "SELECT m.usernane FROM Team t JOIN t.members m";
```

✔︎ **<span style="background-color:#F0E68C">@OneToMany</span>**, **<span style="background-color:#F0E68C">@ManyToMany</span>** (대상이 컬렉션)

✔︎ **<span style="background-color:#F0E68C">묵시적 내부 조인 발생</span>**, 탐색 불가능

✔︎ FROM 절에서 명시적 조인을 통해 별칭을 얻으면 별칭을 통해 탐색 가능.

<br>

**<u>로 탐색을 사용한 묵시적 조인 시 주의사항</u>**

✔︎ 항상 inner join이다.

✔︎ 컬렉션은 경로 탐색의 끝, 명시적 조인을 통해 별칭을 얻어야 한다.

✔︎ 경로 탐색은 주로 SELECT, WHERE 절에 영향을 준다. 

✔︎ 하지만 묵시적 조인으로 인해 SQL의 FROM(JOIN) 절에 영향을 준다.

<br>

**<u>실무 조언</u>**

✔︎ 가급적 묵시적 조인 대신에 ***<span style="color:red">명시적 조인 사용해라</span>***

✔︎ 조인은 SQL 튜닝에 중요 포인트

✔︎ 묵시적 조인은 조인이 일어나는 상황을 한 눈에 파악하기 어려움

<br>

## <span style="color:gray">명시적 조인, 묵시적 조인</span>

---

#### <span style="background-color:black; color:white">명시적 조인</span>

```sql
select m from Member m join m.team t
```

✔︎ join 키워드를 직접 사용하는 것.

<br>

#### <span style="background-color:black; color:white">묵시적 조인</span>

```sql
select m.team from Member m
```

✔︎ 경로 표현식에 의해 묵시적으로 SQL조인 발생

✔︎ ***<span style="color:red">inner join만 가능</span>***

<br>

#### <span style="background-color:black; color:white">경로 표현식 - 예제</span>

```sql
select o.member.team from Order o               //=> 성공, 무시적 조인 발생(2번)

select t.members from Team                      //=> 성공

select t.members.username from Team t           //=> 실패

select m.username from Team t join t.member m   //=> 성공, 명시적 조인
```