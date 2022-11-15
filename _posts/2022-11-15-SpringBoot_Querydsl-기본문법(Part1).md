---
layout: post
title: 기본 문법 - Part1
categories: spring
tags: querydsl
---

## <span style="color:gray">들어가기 앞서...</span>

---

#### <span style="background-color:black; color:white">Querydsl란?</span>

• Querydsl은 JPQL 빌더

| |오류 시점|파라미터|
|-|---------|--------|
|JPQL|실행 시|직접 바인딩|
|Querydsl|컴파일 시|자동 바인딩|

<br>

#### <span style="background-color:black; color:white">동시성 문제</span>

JPAQueryFactory를 필드로 제공하면 동시성 문제는 어떻게 될까?

동시성 문제는 JPAQueryFactory를 생성할 때 제공하는 EntityManager에 달려있다.

스프링 프레임워크는 여러 쓰레드에서 동시에 같은 EntityManager에 접근해도, 

트랜잭션 마다 별도의 영속성 컨텍스트를 제공하기 때문에, 동시성 문제는 걱정하지

않아도 된다.

<br>

## <span style="color:gray">기본 Q-Type 활용</span>

---

#### <span style="background-color:black; color:white">Q클래스 인스턴스를 사용하는 2가지 방법</span>

같은 테이블을 조인해야 하는 경우가 아니면 기본 인스턴스를 사용한다.

```java
QMember qmember = new QMember("m"); // 별칭 직접 지정
QMember qmember = QMember.member;   // 기본 인스턴스 사용 
```

<br>

#### <span style="background-color:black; color:white">기본 인스턴스를 static import와 함께 사용</span>

```java
import static study.querydsl.entity.QMember.*;

@SpringBootTest
@Transactional
@Rollback(value = false)
public class QuerydslBasicTest {

    @PersistenceContext EntityManager em;
    JPAQueryFactory queryFactory = new JPAQueryFactory(em);

    @Test
    public void qTypeTest() {

        Member findMember = queryFactory
                        .selectFrom(member)
                        .where(member.username.eq("member1"))
                        .fetchOne();

    }
}
```

<br>

## <span style="color:gray">검색 조건</span>

---

#### <span style="background-color:black; color:white">기본</span>

검색조건은 `and()`, `or()` 메서드 체인으로 연결할 수 있다.

```java
@Test
public void search() {

    Member findMember = queryFactory
            .selectFrom(member)
            .where(member.username.eq("member1").and(member.age.eq(10)))
            .fetchOne();

    assert findMember != null;
    assertThat(findMember.getUsername()).isEqualTo("member1");
}
```

<br>

#### <span style="background-color:black; color:white">AND 조건을 파라미터로 처리</span>

`where()` 의 경우에 파라미터로 검색조건을 추가하면 AND조건이 추가된다.

```java
@Test
public void searchAndParam() {

    Member findMember = queryFactory.selectFrom(member)
            .where(
                    member.username.eq("member1"),
                    (member.age.eq(10))
            ).fetchOne();

    assert findMember != null;
    assertThat(findMember.getUsername()).isEqualTo("member1");
}
```

<br>

## <span style="color:gray">결과 조회</span>

---

#### <span style="background-color:black; color:white">기본</span>

|메소드|설명|비고|
|------|----|----|
|`fetch()`|리스트 조회|데이터 없으면 빈 리스트 반환|
|`fetchOne()`|단 건 조회|결과 없다 : null / 둘 이상 : NonuniqueResultException|
|`fetchFirst()`|`limit(1).fetchOne()`|-|
|<del>`fetchResults()`</del>|<del>페이징 정보 포함, total count 쿼리 추가 실행</del>|<span style="color:red">deprecated(from 5.0.0)</span>|
|<del>`fetchCount()`</del>|<del>count 쿼리로 변경해서 count 수 조회</del>|<span style="color:red">deprecated(from 5.0.0)</span>|

<br>

#### <span style="background-color:black; color:white">deprecated</span>

우선 더 이상 지원하지 않는 이유를 알아봤다.

> QueryResults 형식으로 프로젝션을 가져옵니다. QueryResults.getOffset() 
> 또는 QueryResults.getLimit()에 의존하지 않는 경우 성능이 더 좋으므로 
> fetch()를 사용하십시오. 또한 모든 방언에 대해 개수 쿼리를 제대로 생성할 
> 수 없습니다. 예를 들어 JPA에서 count 쿼리는 여러 group by 표현식 또는 
> having 절이 있는 쿼리에 대해 생성할 수 없습니다.

<br>

결국 Data JPA에서 성능 최적하를 위해 본 쿼리와 카운트 쿼리를 나눠서

실행한다고 공부했었는데 여기서도 그런 방식으로 진행을 해야할 것 같다.

<br>

```java
@Test
public void paging() throws Exception {

    PageRequest pageRequest
        = PageRequest.of(0, 2, Sort.by(Sort.Direction.DESC, "username"));
        
    // 페이징 쿼리
    List<Member> result = queryFactory
            .selectFrom(member)
            .offset(0)
            .limit(9)
            .fetch();
    
    // 카운트 쿼리
    int size = queryFactory
            .selectFrom(member)
            .fetch()
            .size();
    
    PageImpl<Member> members = new PageImpl<>(result, pageRequest, size);

}
```

<br>

추가적으로 Page 인터페이스의 구현체인 `PageImpl<T>` 클래스에서 총 페이지수,

다음 페이지가 있는지 여부, 마지막 페이지인지 여부 등등 다양한 메소드를 제공한다.

> <em>package : org.springframework.data.domain</em>

```java
public class PageImpl<T> extends Chunk<T> implements Page<T> {
        //... 다양한 메서드 제공
}
```




<br>

## <span style="color:gray">정렬</span>

---

#### <span style="background-color:black; color:white">예시 코드</span>

<br>

```java
@Test
@DisplayName("회원 정렬 순서")
public void sorting() throws Exception {
    //given
    em.persist(Member.of(null, 100));
    em.persist(Member.of("member5", 100));
    em.persist(Member.of("member6", 100));

    //when
    List<Member> findMemberList = queryFactory.selectFrom(member)
            .where(member.age.eq(100))
            .orderBy(member.age.desc(), member.username.asc().nullsLast()).fetch();

    //then
    Member member5 = findMemberList.get(0);
    Member member6 = findMemberList.get(1);
    Member memberNull = findMemberList.get(2);
    assertThat(member5.getUsername()).isEqualTo("member5");
    assertThat(member6.getUsername()).isEqualTo("member6");
    assertThat(memberNull.getUsername()).isNull();
}
```

<br>

## <span style="color:gray">페이징</span>

---

#### <span style="background-color:black; color:white">예시 코드</span>

위에 정리해둔 `결과조회 - deprecated`를 보면 된다.

<br>

## <span style="color:gray">집합</span>

---

#### <span style="background-color:black; color:white">예시 코드</span>

```java
@Test
@DisplayName("집합")
public void aggregation() throws Exception {

    List<Tuple> result = queryFactory
            .select(member.count(),
                    member.age.sum(),
                    member.age.avg(),
                    member.age.max(),
                    member.age.min())
            .from(member)
            .fetch();

    Tuple tuple = result.get(0);

    assertThat(tuple.get(member.count())).isEqualTo(4);
    assertThat(tuple.get(member.age.sum())).isEqualTo(100);
    assertThat(tuple.get(member.age.avg())).isEqualTo(25);
    assertThat(tuple.get(member.age.max())).isEqualTo(40);
    assertThat(tuple.get(member.age.min())).isEqualTo(10);

}
```
```java
@Test
@DisplayName("팀의 이름과 각 팀의 평균 연령을 구하기")
public void group() throws Exception {
    //given
    List<Tuple> tupleList = queryFactory
            .select(team.name, member.age.avg())
            .from(member)
            .join(member.team, team)
            .groupBy(team.name)
            .fetch();

    Tuple teamA = tupleList.get(0);
    Tuple teamB = tupleList.get(1);
    assertThat(teamA.get(team.name)).isEqualTo("teamA");
    assertThat(teamA.get(member.age.avg())).isEqualTo(15);
    assertThat(teamB.get(team.name)).isEqualTo("teamB");
    assertThat(teamB.get(member.age.avg())).isEqualTo(35);
}
```