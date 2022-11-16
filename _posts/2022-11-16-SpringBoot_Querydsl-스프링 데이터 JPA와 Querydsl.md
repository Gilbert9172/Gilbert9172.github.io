---
layout: post
title: 스프링 데이터 JPA와 Querydsl
categories: spring
tags: querydsl
---

## <span style="color:gray">스프링 데이터 JPA → Querydsl (페이징)</span>

---

#### <span style="background-color:black; color:white">사용자 정의 Repository 생성</span>

방법은 어렵지 않다. 별도의 Repository를 생성해서 `스프링 데이터 리포지토리`에 

사용자 정의 인터페이스를 상속하면 된다.

```java
@Repository
public interface MemberRepository 
        extends JpaRepository<Member, Long>, CustomMemberRepository {
    //...
}
```

```java
public class CustomMemberRepository implements CustomMemberRepository {

    @Override
    public Page<MemberDto> searchSimple(MemberSearchCondidtion condition, Pageable pageable) {
        List<MemberTeamDto> contents = getConten(condition, pageable);
        return new PageImpl<>(contents, pageable, contents.size());
    }

    @Override
    public Page<MemberDto> searchComplex(MemberSearchCondidtion condition, Pageable pageable) {
        List<MemberTeamDto> contents = getConten(condition, pageable);

        int size = queryFactory
                .selectFrom(member)
                .join(member.team, team)
                .where(
                        usernameEq(condition.getUsername()),
                        teamNameEq(condition.getTeamName()),
                        ageGoe(condition.getAgeGoe()),
                        ageLoe(condition.getAgeLoe())
                )
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch().size();

        return new PageImpl<>(contents, pageable, size);
    }

}
```

```java
private List<MemberTeamDto> getContent(MemberSearchCondition condition, Pageable pageable) {
    return queryFactory
            .select(new QMemberTeamDto(
                    member.id,
                    member.username,
                    member.age,
                    team.id.as("teamId"),
                    team.name.as("teamName")))
            .from(member)
            .leftJoin(member.team, team)
            .where(
                    usernameEq(condition.getUsername()),
                    teamNameEq(condition.getTeamName()),
                    ageGoe(condition.getAgeGoe()),
                    ageLoe(condition.getAgeLoe())
            )
            .orderBy(member.id.desc())
            .offset(pageable.getOffset())
            .limit(pageable.getPageSize())
            .fetch();
}
```

<br>

참고로 특정 API나 화면에 의존성이 높은 쿼리의 경우에는 굳이 사용자 정의

인터페이스를 만들 필요는 없다. 그냥 별도의 클래스로 만든 후 스프링 빈으로

등록만 해주면 된다.

```java
@Repository
@RequiredArgsConstructor
public class CustomRepository {

    private final JPAQueryFactory queryFactory;

    //...
}
```

<br>

## <span style="color:gray">CountQuery 최적화</span>

---

#### <span style="background-color:black; color:white">CountQuery를 옵션으로!</span>

첫 페이지에 20개의 정보를 표출해야 하는데 데이터가 10개인 경우와, 마지막 페이지인

경우에는 Count쿼리를 수행해야 할까? 스프링 데이터에서 count쿼리 최적화를 위해 

`PageableExecutionUtils` 클래스를 제공해준다. 

<br>

**<u>▷ PageableExecutionUtils</u>**

> <em>package org.springframework.data.support</em>

아래는 이미지는 `PageableExecutionUtils` 클래스에 있는 `getPage()` 메서드다.

<img src="/assets/img/querydsl/PageableExecutionUtils.png"><br>

<br>

우선 **시작지점(offset)이 0** 또는 **페이징 여부**를 확인 한다.

```java
if (pageable.isUnpaged() || pageable.getOffset() == 0) {

    if (pageable.isUnpaged() || pageable.getPageSize() > content.size()) {
        return new PageImpl<>(content, pageable, content.size());
    }

    return new PageImpl<>(content, pageable, totalSupplier.getAsLong());
}
```

<br>

**페이징 여부**, **페이지 사이즈와 컨텐츠 사이즈**를 비교한다. 

예를 들면, 한 페이지에 보여줄 데이터는 5개인데 총 데이터는 4개일 경우

count쿼리를 수행하지 않고, 현재 페이지의 데이터 수를 반환한다.

```java
if (pageable.isUnpaged() || pageable.getPageSize() > content.size()) {
        return new PageImpl<>(content, pageable, content.size());
    }
```


<br>

아래의 현재 페이지가 마지막 페이지인지 아닌지를 확인하는 조건이다.

마지막 페이지라면 `검색을 시작한 지점의 수`와 `현재 페이지의 데이터 수`를 더한다. 

```java
if (content.size() != 0 && pageable.getPageSize() > content.size()) {
    return new PageImpl<>(content, pageable, pageable.getOffset() + content.size());
}
```

<br>

#### <span style="background-color:black; color:white">최적화 적용 리펙토링</span>

```java
@Override
public Page<MemberTeamDto> searchPageComplex(MemberSearchCondition condition, Pageable pageable) {
    List<MemberTeamDto> contents = getContent(condition, pageable);

    JPAQuery<Member> countQuery = queryFactory
            .selectFrom(member)
            .join(member.team, team)
            .where(
                    usernameEq(condition.getUsername()),
                    teamNameEq(condition.getTeamName()),
                    ageGoe(condition.getAgeGoe()),
                    ageLoe(condition.getAgeLoe())
            );
    return PageableExecutionUtils.getPage(contents, pageable, countSupplier(countQuery));
}
```
```java
@NotNull
private LongSupplier countSupplier(JPAQuery<Member> countQuery) {
    return () -> countQuery.fetch().size();
}
```

<br>

#### <span style="background-color:black; color:white">최적화 적용 확인해보기</span>

**<u>▷ Case 1 </u>**

|전체 데이터|page|size(한 페이지 표출 데이터 수)|offset|
|-----------|----|------------------------------|------|
|4건|0|5건|0|

```sql
select 
    --.. 
from 
    member member0_ 
left outer join team team1_ 
    on member0_.team_id=team1_.team_id 
order by member0_.member_id desc 
    limit 5;
```

Count 쿼리는 수행되지 않았다.

<br>

**<u>▷ Case 2</u>**

|전체 데이터|page|size(한 페이지 표출 데이터 수)|offset|
|-----------|----|------------------------------|------|
|5건|1|2건|2|

```sql
-- 메인 쿼리
select
    --..
from 
    member member0_ 
left outer join team team1_ 
    on member0_.team_id=team1_.team_id 
order by member0_.member_id desc 
limit 2 offset 2;

-- count 쿼리
select
    --..
from
    member member0_ 
inner join
    team team1_ 
        on member0_.team_id=team1_.team_id
```

메인 쿼리와 count 쿼리 모두 수행된다.

<br>

**<u>▷ Case 3</u>**

|전체 데이터|page|size(한 페이지 표출 데이터 수)|offset|
|-----------|----|------------------------------|------|
|5건|2|2건|4|

```sql
select 
    --..
from 
    member member0_ 
left outer join team team1_ 
    on member0_.team_id=team1_.team_id 
order by member0_.member_id desc 
limit 2 offset 4;
```

Count 쿼리는 수행되지 않았다.