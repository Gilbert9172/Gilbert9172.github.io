---
layout: post
title: 순수 JPA와 Querydsl
categories: spring
tags: querydsl
---

## <span style="color:gray">JPAQueryFactory 스프링 빈 등록</span>

---

#### <span style="background-color:black; color:white">별도의 Config파일 만들어서 등록하기</span>

```java
@Configuration
public class QuerydslConfig {

    @PersistenceContext EntityManager em;

    @Bean
    public JPAQueryFactory jpaQueryFactory() {
        return new JPAQueryFactory(em);
    }

}
```

```java
@RestController
@RequiredArgsConstructor
public class MemberJpaRepository {

    private final EntityManager em;
    private final JPAQueryFactory queryFactory;

    //...

}
```

<br>

## <span style="color:gray">JPA → Querydsl(정적)</span>

---

#### <span style="background-color:black; color:white">전체 회원 조회</span>

**<u>▷ 순수 JPA / JPQL</u>**

```java
public List<Member> findAll() {

    String jpql = "select m from Member m";
    return em.createQuery(jpql, Member.class).getResultList();

}
```

<br>

**<u>▷ Querydsl</u>**

```java
import static ...QMember.member;

public List<Member> findAll() {
    return queryFactory.selectFrom(member).fetch();
}
```

<br>

#### <span style="background-color:black; color:white">이름으로 전체 회원 검색</span>

**<u>▷ 순수 JPA / JPQL</u>**

```java
public List<Member> findByUsername(String username) {

    String jpql = "select m from Member m where m.username = :username";

    return em.createQuery(jpql,Member.class)
            .setParameter("username", username).getResultList();

}
```

<br>

**<u>▷ Querydsl</u>**

```java
public List<Member> findByUsername(String username) {

    return queryFactory
            .selectFrom(member)
            .where(member.username.eq(username))
            .fetch();

}
```

<br>

## <span style="color:gray">JPA → Querydsl(동적)</span>

---

#### <span style="background-color:black; color:white">Builder 사용</span>

**<u>▷ Querydsl</u>**

```java
import com.querydsl.core.BooleanBuilder;
import static org.springframework.util.StringUtils.hasText;
import static study.querydsl.entity.QMember.member;
import static study.querydsl.entity.QTeam.team;

public List<Member> searchByCondition(MemberSearchCondition condition) {

    BooleanBuilder builder = new BooleanBuilder();

    if (hasText(condition.getUsername)) {
        return builder.and(member.username.eq(condition.getUsername()))
    }

    if (hasText(condition.getTeamName())) {
        builder.and(team.name.eq(condition.getTeamName()));
    } else {
        builder.and(team.name.eq("teamA"));
    }

    if (condition.getAgeGoe() != null) {
        builder.and(member.age.goe(condition.getAgeGoe()));
    } else {
        builder.and(member.age.goe(20));
    }


    if (condition.getAgeLoe() != null) {
        builder.and(member.age.loe(condition.getAgeLoe()));
    } else {
        builder.and(member.age.loe(40));
    }

    return queryFactory
            .select(new QMemberTeamDto(
                        member.id,
                        member.username,
                        member.age,
                        team.id.as("teamId"),
                        team.name.as("teamName")))
            .from(member)
            .join(member.team, team)
            .where(builder)
            .fetch();

}

```

<br>

#### <span style="background-color:black; color:white">Where절에 파라미터를 사용</span>

**<u>▷ Querydsl</u>**

```java
public List<Member> searchByCondition(MemberSearchCondition condition) {

    return queryFactory
        .select(new QMemberTeamDto(
                    member.id,
                    member.username,
                    member.age,
                    team.id.as("teamId"),
                    team.name.as("teamName")))
        .from(member)
        .join(member.team, team)
        .where(
            usernameEq(condition.getUsername()),
            teamNameEq(condition.getTeamname()),
            ageGoe(condition.getAgeGoe()),
            ageLoe(condition.getAgeLoe())
        )
        .fetch();

}
```

```java
private BooleanExpressions usernameEq(String username) {
    return hasText(username) ? member.username.eq(username) : null;
}

private BooleanExpression teamNameEq(String teamName) {
    return isEmpty(teamName) ? null : team.name.eq(teamName);
}

private BooleanExpression ageGoe(Integer ageGoe) {
    return ageGoe == null ? null : member.age.goe(ageGoe);
}

private BooleanExpression ageLoe(Integer ageLoe) {
    return ageLoe == null ? null : member.age.loe(ageLoe);
}
```

<br>

#### <span style="background-color:black; color:white">참고</span>

만약 condition에 아무 조건도 없으면 그냥 모든 데이터를 가져온다.

물론 데이터가 적을 때는 상관없겠지만 데이터가 10만건 이상이라면 어떨까?

아무 조건도 없는 최초의 페이지로 접근할 때 매번 10만건 이상의 데이터를

요청하는 쿼리가 실행 될 것이다.

따라서 이런 경우에는 default값을 설정 해주거나, limit을 걸어주는 것이 

좋은 설계가 될 수 있다.