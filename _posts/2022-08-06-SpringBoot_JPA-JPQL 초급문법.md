---
layout: post
title: JPQL 초급문법
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

## <span style="color:gray">TypeQuery, Query</span>

---

***TypeQuery***

> 반환 타입이 명확할 때 사용

```java
TypeQuery<Member> query1 = 
            em.createQuery("SELECT m FROM Member m", Member.class);
```

<br>

***Query***

> 반환 타입이 명확하지 않을 때 사용

```java
Query<Member> query1 = 
         em.createQuery("SELECT m.username, m.age FROM Member m");
```

<br>

## <span style="color:gray">결과 API 조회</span>

---

***`query.getResultList();`***

> 결과가 하나 이상일 때, 리스트 반환

• 결과가 없으면 빈 리스트 반환

```java

```

<br>

***`query.getSingleResult();`***

> 결과가 정확히 하나, 단일 객체 반환

• 결과가 없으면 **`javax.persistence.NoResultException`**

• 결과가 둘 이상이면 **`javax.persistence.NonUniqueResultException`**

```java

```

<br>

## <span style="color:gray">파라미터 바인딩 - 이름 기준, 위치 기준</span>

---

위치 기반은 쓰지 않는 걸 추천. 나중에 새로운 값이 추가됐을 때 유지보수 힘듬.

```java
String query = "SELECT m FROM Member m WHERE m.username = :username";

Member result = em.createQuery(query, Member.class)
                    .setParameter("username", "member1")
                    .getSingleResult();
```

<br>

## <span style="color:gray">프로젝션</span>

---

#### ***프로젝션이란?***

• SELECT 절에 조회할 대상을 지정하는 것

• 프로젝션 대상은 `엔티티`, `임베디드 타입`, `스칼라 타입` 이다.

|프로젝션 대상|쿼리|영속성 컨텍스트 관리|
|-------------|----|--------------------|
|SELECT m FROM Member m|엔티티 프로젝션|O|
|SELECT m.team FROM Member m|엔티티 프로젝션|O|
|SELECT m.address FROM Member m|임베디드 타입 프로젝션|O|
|SELECT m.username, m.age FROM Member m|스칼라 타입 프로젝션|O|

• DISTINCT로 중복 제거 가능

<br>

> 참고

```java
List<Team> result = em.createQuery("select m.team from Member m",Team.class)
                        .getResultList();
```

위와 같이 작성을 할 경우 해당 코드만 봐서는 JPA에서 JOIN쿼리가 나가는걸 

직관적으로 알기가 어렵다. 따라서 아래와 같이 작성해주는게 좋다.

```java
List<Team> result = em.createQuery("select t from Member m join m.team",Team.class)
                        .getResultList();
```

<br>

#### ***프로젝션 여러 값 조회***

`SELECT m.username, m.age FROM Member m` 과 같이 타입이 서로 다른 값을 가져올 떄는

어떻게 해야할까?

• Query 타입으로 조회

```java
List resultList = em.createQuery("SELECT m.username, m.age FROM Member m")
                    .getResultList();

Object o = resultList.get(0);
Object[] result = (Object[]) o;
```

• Object[] 타입으로 조회

```java
List<Object[]> resultList = em.createQuery("SELECT m.username, m.age FROM Member m")
                                .getResultList();
Object[] result = resultList.get(0);
```

• new 명령어로 조회

```java
List<MemberDto> resultList = em.createQuery("SELECT new com.example.hellojpql.jpql.MemberDto(m.username, m.age) FROM Member m", MemberDto.class)
                    .getResultList();

MemberDto memberDto = resultList.get(0);

System.out.println("username = " + memberDto.getUsername());
System.out.println("age = " + memberDto.getAge());
```

`new` 명령어로 조회하는 경우에는 단순 값을 DTO로 바로 조회한다. 

그러나 이 방법을 사용할 경우에는 패키지 명을 포함한 전체 클래스 명을 입력해야 한다.

패키지명이 짧으면 괜찮겠지만 패키지명이 길 경우엔... 쫌 그렇다.

그리고 MemberDto에 순서와 타입이 일치하는 생성자가 필요하다.

<br>

## <span style="color:gray">페이징 API</span>

---

```java
//페이징 쿼리
String jpql = "select m from Member m order by m.name desc";
List<Member> resultList = em.createQuery(jpql, Member.class)
                            .setFirstResult(10)
                            .setMaxResults(20)
                            .getResultList();
```

|함수|설명|
|----|----|
|setFirstResult(int startPosition)|조회 시작 위치(0부터시작|
|setMaxResults(int maxResult)|조회할 데이터 수| 

<br>

## <span style="color:gray">JOIN</span>

---

#### ***INNER JOIN***

✔︎ Java Code
```java
String query = "SELECT m FROM Member m INNER JOIN m.team t";

List<Member> resultList = em.createQuery(query, Member.class)
        .getResultList();
```

✔︎ SQL
```sql
select
    member0_.id as id1_0_,
    member0_.age as age2_0_,
    member0_.TEAM_ID as team_id4_0_,
    member0_.username as username3_0_ 
from
    Member member0_ 
inner join Team team1_ 
    on member0_.TEAM_ID=team1_.TEAM_ID
```

<br>

#### ***OUTTER JOIN*** 

✔︎ Java Code
```java
String query = "SELECT m FROM Member m LEFT OUTER JOIN m.team t";

List<Member> resultList = em.createQuery(query, Member.class)
        .getResultList();
```

✔︎ SQL
```sql
select
    member0_.id as id1_0_,
    member0_.age as age2_0_,
    member0_.TEAM_ID as team_id4_0_,
    member0_.username as username3_0_ 
from
    Member member0_ 
left outer join Team team1_ 
        on member0_.TEAM_ID=team1_.TEAM_ID
```

<br>

#### ***THETA JOIN***

✔︎ Java Code
```java
String query = "SELECT m FROM Member m, Team t WHERE m.username = t.name";

List<Member> resultList = em.createQuery(query, Member.class)
        .getResultList();
```

✔︎ SQL
```sql
select
    member0_.id as id1_0_,
    member0_.age as age2_0_,
    member0_.TEAM_ID as team_id4_0_,
    member0_.username as username3_0_ 
from
    Member member0_ 
cross join Team team1_ 
where
    member0_.username=team1_.name
```

<br>

#### ***ON***

JPA 2.1 부터 ON절을 활용한 조인을 지원해준다. 

✔︎ Java Code
```java
// 연관관계 없는 경우
//String query = "SELECT m FROM Member m LEFT OUTER JOIN Team t ON m.username = t.name";

String query = "SELECT m FROM Member m LEFT OUTER JOIN m.team t ON t.name = :teamName";

List<Member> resultList = em.createQuery(query, Member.class)
        .setParameter("teamName", "teamA")
        .getResultList();
```

✔︎ SQL
```sql
select
    member0_.id as id1_0_,
    member0_.age as age2_0_,
    member0_.TEAM_ID as team_id4_0_,
    member0_.username as username3_0_ 
from
    Member member0_ 
left outer join Team team1_ 
    on member0_.TEAM_ID=team1_.TEAM_ID 
        and (
            team1_.name='teamA'
        )
```

<br>

## <span style="color:gray">Sub Query</span>

---

#### ***서브 쿼리 지원 함수***

|함수|설명|
|----|----|
|[NOT] EXISTS|서브쿼리에 결과가 존재하면 참|
|ALL|모두 만족하면 참|
|ANY, SOME|조건을 하나라도 만족하면 참|
|[NOT] IN|서브쿼리의 결과 중 하나라도 같은 것이 있으면 참|

```java
// Exist : 팀A 소속인 회원
em.createQuery(
    "SELECT m FROM Member m Where EXISTS (
        SELECT t FROM m.team t WHERE t.name = 'teamA'
    )"
)

// ALL : 전체 상품 각각의 재고보다 주문량이 많은 주문들
em.createQuery(
    "SELECT o 
    FROM Order o 
    WHERE 
        o.orderAmount > ALL (SELECT p.stockAmount FROM Product p)"
)

// ANY : 어떤 팀이든 팀에 소속된 회원
em.createQuery(
    "SELECT m FROM Member m
    WHERE m.team = ANY(SELECT t FROM Team t)"
)
```

<br>

#### ***JPA 서브 쿼리 한계***

✔︎ JPA는 WHERE, HAVING 절에서만 서브 쿼리를 사용할 수 있다.

✔︎ SELECT 절에서도 가능하다. (Hibernate 지원)

✔︎ ***<span style="color:red">FROM 절의 서브 쿼리는 현재 JPQL에서 불가능하다.</span>***

✔︎ ***<span style="background-color:yellow">따라서 JOIN으로 풀 수 있다면 최대한 JOIN으로 푸는게 좋다.</span>***

<br>

## <span style="color:gray">JPQL 타입 표현</span>

---

|번호|종류|예시|
|----|----|----|
|1|문자|'HELLO'|
|2|숫자|10L(Long), 10D(Double), 10F(Float)|
|3|Boolean|TRUE, FALSE|
|4|ENUM|com.example.MemberType.Admin(패키지명 포함)|
|5|엔티티 타입|TYPE(m) = Member(상속 관계에서 사용)|

> 5번의 엔티티 타입에 대한 추가 설명

Book 엔티티가 Item을 상속 받고 있는 경우이다. 

**Item**

```java
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn
public class Item extends BaseEntity {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ITEM_ID")
    private String id;

    //...
}
```

**Book**

```java
@Entity
@Getter @Setter
public class Book extends Item {

    private String author;
    private String name;
    private String isbn;
}s
```

엔티티 설계가 위와 같이 되어있다면 JPQL은 아래와 같이 작성할 수 있다.

```java
String query = "SELECT i FROM Item i WHERE TYPE(i) = Book";
em.createQuery(query, Item.class).getResultSet();
```

그러면 JPA가 아래와 같이 쿼리문을 번역해준다. (마지막 줄이 핵심)

```sql
select
    ~~~
from
    Item item0_ 
left outer join
    Movie item0_1_ 
        on item0_.ITEM_ID=item0_1_.ITEM_ID 
left outer join
    Book item0_2_ 
        on item0_.ITEM_ID=item0_2_.ITEM_ID 
left outer join
    Album item0_3_ 
        on item0_.ITEM_ID=item0_3_.ITEM_ID 
where item0_.DTYPE='Book'
```

<br>

이 이외에도 SQL에서 쓸수 있는 문법을 사용할 수 있다.

• EXSISTS, IN

• AND, OR, NOT

• 비교 연산자( =, >, >=, <, <=, <>)

• BETWEEN, LIKE, IS NULL

<br>

## <span style="color:gray">조건식 - CASE 식</span>

---

#### ***기본 CASE 절*** 

```java
String query =
            "SELECT " +
                    "CASE WHEN m.age <= 10 THEN '학생요금' " +
                    "     WHEN m.age >= 60 THEN '경로요금' " +
                    "     ELSE '일반요금' " +
                    "END " +
            "FROM Member m";
```

<br>

#### ***COALESCE***

✔︎ 하나씩 조회해서 null이 아니면 반환

```java
member.setUsername("관리자4");  // 반환 결과 : 관리자4
member.setUsername("null");     // 반환 결과 : 이름없는 회원
String query = "select coalesce(m.username,'이름없는 회원') from Member m";
```

<br>

#### ***NULLIF***

✔︎ 두 값이 같으면 NULL 반환, 다르면 첫 번째 값 반환

```java
member.setUsername("관리자4");  // 반환 결과 : 관리자4
member.setUsername("관리자");   // 반환 결과 : null
String query = "select nullif(m.username,'관리자') from Member m";
```

<br>

## <span style="color:gray">JPQL 함수</span>

---

JPQL에서 제공해주는 표준 함수로, JDBC에 관계 없이 사용하면 된다.

|JPQL 기본 함수|
|--------------|
|CONCAT|
|SUBSTRING|
|TRIM|
|LOWER, UPPER|
|LENGTH|
|LOCATE|
|ABS, SQRT, MOD|
|SIZE,INDEX(안 쓰는게 좋음)|

<br>

#### ***사용자 정의 함수***

`H2Dialect`를 상속 받은 클래스를 작성해야 한다.

```java
public class MyH2DIalect extends H2Dialect {
    public MyH2Dialect() {
        registerFunction("test_method", new StandartdSQLFunction("test_method", StandardBasicTypes.STRING);)
    }
}
```

그리고 JPA xml설정 파일에 있는 `hibernate.dialect` 속성에 MyH2DIalect를 등록해준다.

실제로 사용할 때는 아래와 같이 사용하면 된다.

```java
select function('test_method', i.name) from Item i
```