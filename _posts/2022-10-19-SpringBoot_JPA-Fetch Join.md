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

• 갹채 구랴푸룰 하나의 SQL로 조회하는 개념

• SQL의 조인 종류가 아니다.

• JPQL에서 **<span style="background-color:#F0E68C">성능 최적화</span>** 를 위해 제공하는 기능이다. ▷ N + 1 문제

• 연관된 엔티티나 컬렉션을 **<span style="background-color:#F0E68C">하나의 SQL로 함께 조회하는 기능</span>**

• `join fetch` 명령어 사용 ▷ LEFT, OUTER, INNER

• 지연로딩이 설정이 되어 있어도 Fetch Join이 항상 우선

<br>

기존 처럼 아래와 같이 JPQL을 짠다고 하면, 지연로딩이든 즉시로딩이든

각각의 member각 서로 다른 team에 소속되어 있을 경우 N+1 문제가 발생하게 된다.

```java
String query = "SELECT m FROM Member m";
List<Member> result = em.createQuery(query, Member.class).getResultList();

// Team은 프록시 객체를 반환한다. Team$HibernateProxy$gea0mNRU
```

**Fetch Join**은 이 문제를 해결해 줄수 있는 방법이다!!!

<br>

#### <span style="background-color:black; color:white">Entity Fetch Join</span>

**<u>JPQL</u>**

```java
String jpql = "select m from Member m join fetch m.team";
List<Member> result = em.createQuery(query, Member.class).getResultList();

// Team은 프록시 객체가 아닌 실제 Team인스턴스를 반환
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

• `@ManyToOne` fetch join

• 회원을 조회하면 연관된 팀도 함께 조회한다.

• SQL을 보면 `t.*`로 Team의 정보도 함께 SELECT 된다.

<br>

#### <span style="background-color:black; color:white">Collection Fetch Join</span>

**<u>JPQL</u>**

```java
String jpql = "SELECT t FROM Team t JOIN FETCH t.members WHERE t.name='TeamA'";
List<Team> resultList = em.createQuery(jpql, Team.class).getResultList();
```

```sql
/** 출력결과
teamName =TeamA, team = com.example.hellojpql.jpql.Team@29050de5
    -> username = 회원1, member = com.example.hellojpql.jpql.Member@3610f277
    -> username = 회원2, member = com.example.hellojpql.jpql.Member@57a6a933

teamName =TeamA, team = com.example.hellojpql.jpql.Team@29050de5
    -> username = 회원1, member = com.example.hellojpql.jpql.Member@3610f277
    -> username = 회원2, member = com.example.hellojpql.jpql.Member@57a6a933

teamName =TeamB, team = com.example.hellojpql.jpql.Team@5b5b59
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

## <span style="color:gray">Fetch Join과 DISTINCT</span>

---

#### <span style="background-color:black; color:white">데이터 뻥튀기?</span>

바로 위 섹션에서 `데이터 뻥튀기`를 언급했었다. 그래서 데이터 뻥튀기가 뭔지 눈으로

직접 확인해 봤다.

<img src="/assets/img/jpa/데이터뻥튀기(oneToMany).png"><br>

위 이미지는 회사 프로젝트 DB 데이터를 조회한 것인데, Program과 Member는 일대다관계를 

가지고 있다. 그래서 ProgramSeq를 기준으로 조인을 하게 되면 아래와 같이 ProgramSeq가 

뻥튀기? 되는걸 확인할 수 있다. 이런 문제를 해결하기 위해 JPA는 **<span style="background-color:#F0E68C">DISTINCT</span>** 를 제공해준다.

<br>

#### <span style="background-color:black; color:white">DISTINCT</span>

JPQL의 DISTINCT는 아래의 2가지 기능을 제공한다.

⒈ SQL에 DISTINCT를 추가

⒉ 애플리케이션에서 엔티티 중복제거

<br>

**<u>▷ Before Distinct</u>**

```java
String jpql = "SELECT t FROM Team t JOIN FETCH t.members";
List<Team> resultList = em.createQuery(jpql, Team.class).getResultList();
System.out.println("resultList = " + resultList.size()); //3
```
```sql
select
    team0_.TEAM_ID as team_id1_3_0_,
    members1_.id as id1_0_1_,
    team0_.name as name2_3_0_,
    members1_.age as age2_0_1_,
    members1_.TEAM_ID as team_id5_0_1_,
    members1_.type as type3_0_1_,
    members1_.username as username4_0_1_,
    members1_.TEAM_ID as team_id5_0_0__,
    members1_.id as id1_0_0__ 
from
    Team team0_ 
inner join
    Member members1_ 
        on team0_.TEAM_ID=members1_.TEAM_ID
```

<br>

**<u>▷ After Distinct</u>**

```java
String jpql = "SELECT distinct t FROM Team t JOIN FETCH t.members";
List<Team> resultList = em.createQuery(jpql, Team.class).getResultList();
System.out.println("resultList = " + resultList.size()); //2
```
```sql
select
    distinct team0_.TEAM_ID as team_id1_3_0_,
    members1_.id as id1_0_1_,
    team0_.name as name2_3_0_,
    members1_.age as age2_0_1_,
    members1_.TEAM_ID as team_id5_0_1_,
    members1_.type as type3_0_1_,
    members1_.username as username4_0_1_,
    members1_.TEAM_ID as team_id5_0_0__,
    members1_.id as id1_0_0__ 
from
    Team team0_ 
inner join
    Member members1_ 
        on team0_.TEAM_ID=members1_.TEAM_ID
```

<br>

JPA에서는 DISTINCT가 있으면 추가로 애플리케이션에서 중복제거를 시도한다.

**같은 식별자를 가진 Team 엔티티 제거**

<img src="/assets/img/jpa/고급매핑/fetchJoinAndDistinct.png">

<br>

## <span style="color:gray">Fetch Join과 일반 Join의 차이</span>

---

• **<span style="background-color:#F0E68C">일반 Join 실행시 연관된 엔티티를 함께 조회하지 않는다.</span>**

<br>

JPA가 번역한 쿼리문을 보면 team 프로퍼티만 조회한 것을 알 수 있다.

```java
String jpql = "SELECT t FROM Team t JOIN  t.members m";
List<Team> resultList = em.createQuery(jpql, Team.class).getResultList();
```
```sql
select
    team0_.TEAM_ID as team_id1_3_,
    team0_.name as name2_3_ 
from
    Team team0_ 
inner join
    Member members1_ 
        on team0_.TEAM_ID=members1_.TEAM_ID
```

<br>

이후에 Member에 대한 조회를 시도하면 추가적인 쿼리가 실행된다.

```sql
select
    members0_.TEAM_ID as team_id5_0_0_,
    members0_.id as id1_0_0_,
    members0_.id as id1_0_1_,
    members0_.age as age2_0_1_,
    members0_.TEAM_ID as team_id5_0_1_,
    members0_.type as type3_0_1_,
    members0_.username as username4_0_1_ 
from
    Member members0_ 
where
    members0_.TEAM_ID=?
```


<br>

## <span style="color:gray">Fetch Join 특징과 한계</span>

---

#### <span style="background-color:black; color:white">Fetch Join 한계</span>


**<u>▷ ⒈ Fetch Join 대상에는 별칭을 줄 수 없다.</u>**

```sql
❌ 불가 ❌

select from Team t join fetch t.members m where m.age > 10
```

왜냐면 fetch join은 기본적으로 연관된 정보를 **전부** 가져오는 것이다.

예를 들면 `10명의 회원 중 나이다 20살 이상인 회원만 조회` 와 같은 쿼리문은 안된다는 뜻이다.

왜냐면 10명 중 특정한 인물만 조회하기 때문이다.

<br>

**<u>▷ ⒉ 둘 이상의 컬렉션은 패치 조인 할 수 없다.</u>**

```sql
❌ 불가 ❌

select from Team t join fetch t.members, t.orders
```

<br>

**<u>▷ ⒊ 컬렉션을 페치 조인하면 페이징 API를 사용할 수 없다.</u>**

일대일, 다대일 같은 단일 값 연관 필드들은 fetch join해도 페이징 가능하다.

왜냐면 데이터가 뻥튀기가 안되기 때문이다.

```java
❌ 불가 ❌
String query = "select from Team t join fetch t.members m"
```

<br> 

그렇다면 아예 페이징을 못하는 것일까? 그건 아닌다 

위의 예시는 일대다의 경우였고 이를 뒤집으면 다대일 관계이다.

즉, 이런식으로 관계를 뒤집어서 쿼리문을 날리면 된다.

```java
String query = "SELECT m FROM Member m JOIN FETCH m.team t";

List<Member> result = em.createQuery(query, Member.class)
    .setFirstResult(0).setMaxResults(1).getResultList();
```

<br>

그대도 `나는 일대다에서 페이징을 해야겟어!` 라고 한다면 아래의 방법을 사용하면된다. 

우선 1쪽을 먼저 페이징하여 가져온다.

```java
String query = "select t from Team t";

List<Team> result = em.createQuery(query, Team.class)
    .setFirstResult(0).setMaxResults(2).getResultList();
```

그리고 **<span style="background-color:#F0E68C">@BatchSize</span>** 어노테이션을 사용해준다.

```java
@Entity
public class Team {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="TEAM_ID")
    private Long id;

    private String name;

    @BatchSize(size = 100)
    @OneToMany(mappedBy="team")
    private List<Member> members = new ArrayList<>();

}
```

또는 xml 파일에서 설정을 해준다.

```xml
<property name="hibernate.default_batch_fetch_size" value="100"/>
```

이제 JPA가 내보내는 쿼리를 확인해보자.

```sql
select
    members0_.TEAM_ID as team_id5_0_1_,
    members0_.id as id1_0_1_,
    members0_.id as id1_0_0_,
    members0_.age as age2_0_0_,
    members0_.TEAM_ID as team_id5_0_0_,
    members0_.type as type3_0_0_,
    members0_.username as username4_0_0_ 
from
    Member members0_ 
where
    members0_.TEAM_ID in (
        ?, ?
    )
# 마지막 쯔음에 보니는 ?가 페이징처리를 해서 가져온 Team_Id이다.
```
 
이렇게 batchSize를 활용하면 N+1 문제도 해결하고 최적화도 된다.

<br>

#### <span style="background-color:black; color:white">Fetch Join 특징</span>

• 연관된 엔티티들을 하나이 SQL문으로 조회 → 성능 최적화

• 엔티티에 직접 적용하는 글로벌 로딩 전략보다 우선함.

• 실무에서 글로벌 로딩 전략은 모두 **지연로딩**

• **<span style="background-color:#F0E68C">최적화가 필요한 곳은 Fetch Join 적용</span>** 

<br>

여러 테이블을 조인해서 엔티티가 가진 모양이 아닌 전혀 다른 결과를 내야하면,

fetch join 보다는 일반 조인을 사용하고 필요한 테이터들만 조회해서 DTO로

반환하는 것이 효과적이다.