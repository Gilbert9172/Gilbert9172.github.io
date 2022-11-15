---
layout: post
title: 기본 문법 - Part2
categories: spring
tags: querydsl
---

## <span style="color:gray">조인</span>

---

#### <span style="background-color:black; color:white">기본 조인</span>

조인의 기본 문법은 첫 번째 파라미터에 조인 대상을 지정하고,

두 번째 파라미터에 별칭으로 사용할 `Q타입`을 지정하면 된다.

```java
join(조인 대상, 별칭으로 사용할 Q타입)
```

• `join()`, `innerJoin()` : 내부 조인

• `leftJoin()` : left 외부 조인

• `rightJoin()` : right 외부 조인

<br>

**<u>▷ Querydsl</u>**

```java
@Test
public void join() throws Exception {
    List<Member> result = queryFactory
        .selectFrom(member)
        .join(member.team, team)           // leftJoin, rightJoin
        .where(team.name.eq("teamA"))
        .fetch();

    assertThat(result)
        .extracting("username")
        .containsExactly("member1", "member2");
}
```

<br>

**<u>▷ JPQL</u>**

```sql
select member1
from Member member1
inner join member1.team as team
where team.name = 'teamA'
```

<br>

**<u>▷ SQL</u>**

```sql
select
    --...
from member member0_ 
inner join team team1_ 
    on member0_.team_id=team1_.team_id 
where team1_.name=NULL;
```

<br>

참고로 `inner join`을 사용하면, where 절에서 필터링 하는 것과 기능이 동일하다.

위의 쿼리를 보면 JPQL은 where절을, SQL은 on절을 사용한 걸 볼 수 있다.

<br>

#### <span style="background-color:black; color:white">세타 조인</span>

연관관계가 없는 필드로 조인하는 방식이다.

```java
@Test
public void theta_join() throws Exception {
    
    em.persist(Member.of("teamA"));
    em.persist(Member.of("teamB"));

    // cross - join나간다.
    List<Member> fetch = queryFactory
            .select(member)
            .from(member, team)
            .where(member.username.eq(team.name))
            .fetch();

    assertThat(fetch)
            .extracting("username")
            .containsExactly("teamA", "teamB");
}
```
• from절에 여러 엔티티를 선택해서 세타조인을 할 수 있다.

• Outer Join은 불가능하다. → On절을 사용하면 가능해진다.

<br>

**<u>▷ JPQL</u>**

```sql
select 
    member1
from 
    Member member1, Team team
where 
    member1.username = team.name
```

<br>

**<u>▷ SQL</u>**

내부적으로 `cross join`을 사용한다.

```sql
select
    --...
from 
    member member0_ 
cross join team team1_ 
where member0_.username=team1_.name;
```

<br>

## <span style="color:gray">조인 - on절</span>

---

ON절을 활용한 조인은 `JPA 2.1`부터 지원하며 2가지 기능을 제공한다.

    1. 조인 대상 필터링
    2. 연관관계 없는 엔티티 외부 조인

<br>

#### <span style="background-color:black; color:white">조인 대상 필터링</span>

**<u>▷ Querydsl</u>**

```java
@Test
@DisplayName("조인 대상 필터링")
public void simpleJoinTest1() {

    List<Tuple> result1 = queryFactory
                    .select(member,team)
                    .from(member)
                    .leftJoin(member.team, team).on(team.name.eq("teamA"))
                    .fetch();

    List<Tuple> result2 = queryFactory
                    .select(member,team)
                    .from(member)
                    .join(member.team, team)
                    .where(team.name.eq("teamA"))
                    .fetch();

}

```

<br>

**<u>▷ JPQL</u>**

```sql
--result1 Query
select
    member1, team 
from
    Member member1   
left join
    member1.team as team 
        with team.name = 'teamA'

--result2 Query
select 
    member1, team
from 
    Member member1
inner join member1.team as team
where team.name = 'teamA'
```

<br>

**<u>▷ SQL</u>**

result2 Query의 가독성이 훨씬 좋다.

```sql
--result1 Query
select
    --...
from
    member member0_ 
left outer join
    team team1_ 
        on member0_.team_id=team1_.team_id 
            and (
                team1_.name='teamA'
            )


--result2 Query
select 
    --..
from 
    member member0_ 
inner join team team1_ 
    on member0_.team_id=team1_.team_id
where team1_.name='teamA';
```

<br>

위에서도 잠깐 언급했지만 on절을 활용해 조인 대상을 필터링 할 때, 

외부조인이 아니라 **<span style="background-color:#F0E68C">내부조인(inner join)을 사용하면, where절에서 필터링하는 </span>**

**<span style="background-color:#F0E68C">것과 기능이 동일하다.</span>** 따라서 on절을 활용한 조인 대상 필터링을 사용할 때,

**내부조인 이면 익숙한 where 절**로 해결하고, 정말 외부조인이 필요한 경우에만 

이 기능을 사용하자. 

<br>

> 참고

아래 두 블로그에 Join시 ON절과 WHERE절에서 필터링의 차이에 대해서 확인할 수 있다.

<a href="https://dataschool.com/how-to-teach-people-sql/difference-between-where-and-on-in-sql/" target="_blank">▷ Join시 ON절과 WHERE절에서 필터링의 차이1</a>

<a href="https://blog.leocat.kr/notes/2017/07/28/sql-join-on-vs-where" target="_blank">▷ Join시 ON절과 WHERE절에서 필터링의 차이2</a>

<br>

#### <span style="background-color:black; color:white">연관관계 없는 엔티티 외부 조인</span>

**<u>▷ Querydsl</u>**

```java
@Test
public void joinOnNoRelation() {

    List<Tuple> result = queryFactory
                .select(member, team)
                .from(member)
                .leftJoin(team).on(member.username.eq(team.name))
                .fetch();

}
```

여기서 주의할 점은 `leftJoin()`의 문법을 잘 확인해야 한다.

`leftJoin()` 부분에 일반 조인과 다르게 **<span style="color:red">엔티티 하나만 들어간다.</span>**

    일반 Join : leftJoin(member.team, team).on(~~)

    On Join  : leftJoin(team).on(~~)

<br>

**<u>▷ JPQL</u>**

```sql
select 
    member1, team
from 
    Member member1
left join Team team 
    with member1.username = team.name
```

<br>

**<u>▷ SQL</u>**

```sql
select 
    --..
from 
    member member0_ 
left outer join team team1_ 
    on member0_.username=team1_.name;
```

<br>

## <span style="color:gray">조인 - fetch join</span>

---

#### <span style="background-color:black; color:white">fetch join 적용하기</span>

`join()`,`leftJoin()` 뒤에 `fetchJoin()`이라고 추가하면 된다.

```java
@Test
public void fetchJoinUse() throws Exception {
    em.flush();
    em.clear();

    Member findMember = queryFactory
            .selectFrom(member)
            .join(member.team, team).fetchJoin()        //← 여기가 핵심
            .where(member.username.eq("member1"))
            .fetchOne();

    assert findMember != null;
    boolean loaded = emf.getPersistenceUnitUtil().isLoaded(findMember.getTeam());
    assertThat(loaded).isTrue();

}
```

<br>

**<u>▷ JPQL</u>**

```sql
select
    member1 
from
    Member member1   
inner join fetch 
    member1.team as team 
where
    member1.username = 'member1'
```

<br>

**<u>▷ SQL</u>**

```sql
select 
    --..
from 
    member member0_
inner join team team1_ 
    on member0_.team_id=team1_.team_id 
where member0_.username='member1';
```

<br>

## <span style="color:gray">서브쿼리</span>

---

#### <span style="background-color:black; color:white">서브 쿼리 eq 사용</span>

```java

QMember memberSub = new QMember("memberSub");

List<Member> result = queryFactory
                        .selectFrom(member)
                        .where(member.age.eq(
                            JPAExpressions
                                .select(memberSub.age.max())
                                .from(memberSub)
                        ))
                        .fetch();
```

<br>

**<u>▷ JPQL</u>**

```sql
select 
    m 
from 
    Member m 
where m.age = (
    select max(memberSub.age)
    from Member memberSub
    )
```

<br>

**<u>▷ SQL</u>**

```sql
select
    --..
from
    member member0_ 
where
    member0_.age=(
        select
            max(member1_.age) 
        from
            member member1_
        )
```

<br>

#### <span style="background-color:black; color:white">서브 쿼리 goe 사용</span>

**<u>▷ Querydsl</u>**

```java
import static com.querydsl.jpa.JPAExpressions.*;

QMember memberSub = new QMember("memberSub");

List<Member> result = queryFactory
        .selectFrom(member)
        .where(member.age.goe(
                select(memberSub.age.avg())
                        .from(memberSub)
        ))
        .fetch();
```

<br>

**<u>▷ JPQL</u>**

```sql
select 
    m 
from Member m 
where m.age >= (
    select avg(memberSub.age)
    from Member memberSub
)
```

<br>

**<u>▷ SQL</u>**

```sql
select
    --..
from
    member member0_ 
where
    member0_.age >= (
        select
            avg(cast(member1_.age as double))
        from
            member member1_
        )
```

<br>

#### <span style="background-color:black; color:white">서브쿼리 여러 건 처리 in 사용</span>

**<u>▷ Querydsl</u>**

```java
List<Member> result = queryFactory
                .selectFrom(member)
                .where(member.in(
                    selectFrom(memberSub)
                    .where(memberSub.age.gt(10))
                ))
                .fetch();
```

<br>

**<u>▷ JPQL</u>**

```sql
select 
    m 
from Member m 
where m.age in (
    select memberSub 
    from Member memberSub 
    where memberSub.age > 10
    )
```

<br>

**<u>▷ SQL</u>**

```sql
select 
    --..
from member member0_ 
where member0_.member_id in (
    select member1_.member_id 
    from member member1_ 
    where member1_.age>10
    );
```

<br>

#### <span style="background-color:black; color:white">select 절에 subquery</span>

**<u>▷ Querydsl</u>**

```java
List<Tuple> result = queryFactory
            .select(member.username,
                    select(memberSub.age.avg()).from(memberSub))
            .from(member)
            .fetch();
```

<br>

**<u>▷ JPQL</u>**

```sql
select 
    m
    ,(select avg(memberSub.age) from Member memberSub)
from Member m 
```

<br>

**<u>▷ SQL</u>**

```sql
select
    member0_.username as col_0_0_
    ,(select avg(cast(member1_.age as double)) 
      from member member1_) as col_1_0_ 
from
    member member0_
```

<br>

#### <span style="background-color:black; color:white">from 절의 서브쿼리</span>

**<u>▷ 한계</u>**

JPA JPQL 서브쿼리의 한계점으로 from 절의 서브쿼리(인라인 뷰)는 지원하지 않는다.

당연히 Querydsl도 지원하지 않는다. 

하이버네이트 구현체를 사용하면 select절의 서브쿼리는 지원한다. 

Querydsl도 하이버네이트 구현체를 사용하면 select절의 서브쿼리를 지원한다.

<br>

**<u>▷ 해결방안</u>**

⒈ 서브쿼리를 join으로 변경한다.(가능한 상황도 있고, 아닐수도 있다.)

⒉ 애플리케이션에서 쿼리를 2번 분리해서 실행한다.

⒊ nativeSQL을 사용한다.

<br>

## <span style="color:gray">CASE문</span>

---

#### <span style="background-color:black; color:white">단순한 조건</span>

**<u>▷ Querydsl</u>**

```java
List<String> result = queryFactory
        .select(member.age
                .when(10).then("열살")
                .when(20).then("스무살")
                .otherwise("기타"))
        .from(member)
        .fetch();
```

<br>

**<u>▷ JPQL</u>**

```sql
select
    case
        when m.age = 10 then '열살'
        when m.age = 20 then '스무살'
        else '기타'
    end
from Member m;
```

<br>

**<u>▷ SQL</u>**

```sql
select 
    case 
        when member0_.age=10 then '열살'
        when member0_.age=20 then '스무살' 
        else '기타' 
    end as col_0_0_ 
from member member0_;
```

<br>

#### <span style="background-color:black; color:white">복잡한 조건</span>

**<u>▷ Querydsl</u>**

```java
List<String> result = queryFactory
        .select(new CaseBuilder()
                .when(member.age.between(0,20)).then("열살")
                .when(member.age.between(21,30)).then("스무살")
                .otherwise("기타"))
        .from(member)
        .fetch();
```

<br>

**<u>▷ JPQL</u>**

```sql
select 
    case 
        when (member1.age between 0 and 20) then '열살' 
        when (member1.age between 21 and 30) then '스무살' 
        else '기타' 
    end
from Member member1
```

<br>

**<u>▷ SQL</u>**

```sql
select 
    case 
        when member0_.age between 0 and 20 then '열살' 
        when member0_.age between 21 and 30 then '스무살' 
        else '기타' 
    end as col_0_0_ 
from member member0_;
```

<br>

#### <span style="background-color:black; color:white">orderBy에서 Case 문 함께 사용하기</span>

**<u>▷ Querydsl</u>**

```java
NumberExpression<Integer> rankPath = new CaseBuilder()
                .when(member.age.between(0, 20)).then(2)
                .when(member.age.between(21, 30)).then(1)
                .otherwise(3);

        List<Tuple> result = queryFactory
                .select(member.username, member.age, rankPath)
                .from(member)
                .orderBy(rankPath.desc())
                .fetch();
```

<br>

**<u>▷ JPQL</u>**

```sql
select
    member1.username,
    member1.age,
    case 
        when (member1.age between 0 and 20) then 2 
        when (member1.age between 21 and 30) then 1 
        else 3 
    end 
from
    Member member1 
order by
    case 
        when (member1.age between 0 and 20) then 2 
        when (member1.age between 21 and 30) then 1 
        else 3 
    end desc
```

<br>

**<u>▷ SQL</u>**

```sql
select
    member0_.username as col_0_0_,
    member0_.age as col_1_0_,
    case 
        when member0_.age between 0 and 20 then 2 
        when member0_.age between 21 and 30 then 1 
        else 3 
    end as col_2_0_ 
from
    member member0_ 
order by
    case 
        when member0_.age between 0 and 20 then 2 
        when member0_.age between 21 and 30 then 1 
        else 3 
    end desc
```

<br>

## <span style="color:gray">상수, 문자 더하기</span>

---

#### <span style="background-color:black; color:white">상수 더하기</span>

**<u>▷ Querydsl</u>**

```java
List<Tuple> result = queryFactory
                .select(member.username, Expressions.constant("A"))
                .from(member)
                .fetch();
```

<br>

**<u>▷ JPQL</u>**

최적화가 가능한 경우에는 SQL에 constant값을 넘기지 않는다.

```sql
select
    member1.username
    -- constannt 값 없음.
from
    Member member1
```

<br>

**<u>▷ SQL</u>**

```sql
select
    member0_.username as col_0_0_
    -- constannt 값 없음.
from
    member member0_
```

<br>

#### <span style="background-color:black; color:white">문자 더하기</span>

**<u>▷ Querydsl</u>**

문자가 아닌 다른 타입들은 `stringValue()` 메소드를 사용하여 문자로

변환할 수 있다. **<span style="background-color:#F0E68C">이 방법은 ENUM을 처리할 때도 자주 사용된다.</span>**

```java
List<String> result = queryFactory
                .select(member.username.concat("_").concat(member.age.stringValue()))
                .from(member)
                .fetch();
```

<br>

**<u>▷ JPQL</u>**

```sql
select
    concat(concat(member1.username,'_'), str(member1.age)) 
from
    Member member1
```

<br>

**<u>▷ SQL</u>**

```sql
select
    ((member0_.username||'-')||cast(member0_.age as character varying)) as col_0_0_ 
from
    member member0_
```