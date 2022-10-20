---
layout: post
title: JPQL 중급문법 - Fetch Join
categories: spring
tags: jpa
---

## <span style="color:gray">Fetch Join</span>

**<span style="background-color:#F0E68C">실무에서 엄청엄청 중요하다!!!</span>**

---

#### <span style="background-color:black; color:white">Fetch Join이란?</span>

• SQL의 조인 종류가 아니다.

• JPQL에서 **<span style="background-color:#F0E68C">성능 최적화</span>** 를 위해 제공하는 기능이다. ▷ N + 1 문제

• 연관된 엔티티나 컬렉션을 **<span style="background-color:#F0E68C">하나의 SQL로 함께 조회하는 기능</span>**

• `join fetch` 명령어 사용 ▷ LEFT, OUTER, INNER

<br>

#### <span style="background-color:black; color:white">Entity Fetch Join</span>

**<u>JPQL</u>**

```sql
String jpql = "select m from Member m join fetch m.team";
```

**<u>SQL</u>**

```sql
SELECT 
     m.*
    ,t.*
FROM MEMBER m
INNER JOIN Team t
    ON t.TEAM_ID = m.TEAM_ID;
```

• ManyToOne fetch join

• 회원을 조회하면 연관된 팀도 함께 조회한다.

• SQL을 보면 `t.*`로 Team의 정보도 함께 SELECT 된다.

<br>

#### <span style="background-color:black; color:white">Collection Fetch Join</span>

**<u>JPQL</u>**

```sql
String jpql = "SELECT t FROM Team t JOIN FETCH t.members WHERE t.name='TeamA'";
```

```sql
/** 출력결과
teamName =TeamA, team = com.example.hellojpql.jpql.Team@29050de5
    -> username = 회원1, member = com.example.hellojpql.jpql.Member@3610f277
    -> username = 회원2, member = com.example.hellojpql.jpql.Member@57a6a933

teamName =TeamA, team = com.example.hellojpql.jpql.Team@29050de5
    -> username = 회원1, member = com.example.hellojpql.jpql.Member@3610f277
    -> username = 회원2, member = com.example.hellojpql.jpql.Member@57a6a933

teamName =TeamA, team = com.example.hellojpql.jpql.Team@5b5b59
    -> username = 회원3, member = com.example.hellojpql.jpql.Member@1934ad7c
 */
```

**<u>SQL</u>**

```sql
SELECT *
FROM Team t
INNER JOIN Member m
    ON m.TEAM_ID = t.TEAM_ID
WHERE t.TEAM_NAME = 'TeamA'
```


```sql

/* 출력결과
team = 팀A|2
team = 팀A|2
team = 팀A|1
*/
```

• OneToMany 또는 컬렉션을 fetch join 할 때

• **<span style="color:red">주의 : 데이터가 뻥튀기 될 수 있다.</span>**

<br>

#### <span style="background-color:black; color:white">페치 조인과 DISTINCT</span>

**<u>데이터 뻥튀기?</u>**

바로 위 섹션에서 `데이터 뻥튀기`를 언급했었다. 그래서 데이터 뻥튀기가 뭔지 눈으로

직접 확인해 봤다.

<img src="/assets/img/jpa/데이터뻥튀기(oneToMany).png"><br>

위 이미지는 회사 프로젝트 DB 데이터를 조회한 것인데, Program과 Member는 일대다관계를 

가지고 있다. 그래서 ProgramSeq를 기준으로 조인을 하게 되면 아래와 같이 ProgramSeq가 

뻥튀기? 되는걸 확인할 수 있다. 이런 문제를 해결하기 위해 JPA는 **<span style="background-color:#F0E68C">DISTINCT</span>** 를 제공해준다.

<br>

**<u>Distinct</u>**


<br>

#### <span style="background-color:black; color:white">Fetch Join 특징과 한계</span>

아래 예시와 같이 fetch join 대상에는 별칭을 줄 수 없다. 

```sql
select from Team t join fetch t.members m where m.age > 10
```

왜냐면 fetch join은 기본적으로 연관된 정보를 **<span style="background-color:#F0E68C">전부</span>** 가져오는 것이다.

예를 들면 `10명의 회원 중 나이다 20살 이상인 회원만 조회` 와 같은 쿼리문은 안된다는 뜻이다.

왜냐면 10명중 특정한 인물만 조회하기 때문이다.