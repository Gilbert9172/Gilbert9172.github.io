---
layout: post
title: 중급 문법 - Part3
categories: spring
tags: querydsl
---

## <span style="color:gray">수정, 삭제 벌크 연산</span>

---

> 앞선 학습 내용에서도 정리했지만, 벌크 연산을 하게 되면 영속성 컨텍스트와
> DB의 상태를 동일하게 만들어줘야 한다. 따라서 벌크 연산을 하고 난 후에는
> 반드시 flush와 clear를 해줘야 한다.

<br>

#### <span style="background-color:black; color:white">쿼리 한번으로 대량 데이터 수정</span>

하나의 쿼리로 여러 건의 row를 수정할 수 있다.

```java
@Test
@DisplayName("수정, 삭제 벌크 연산")
public void test10() throws Exception {

    long count = queryFactory
            .update(member)
            .set(member.username, "비회원")
            .where(member.age.lt(28))
            .execute();

    em.flush();
    em.clear();

    List<Member> result = queryFactory.selectFrom(member).fetch();
    for (Member member1 : result) {
        System.out.println(member1);
    }
}
```

```java
@Test
@DisplayName("기존 숫자에 1더하기")
public void test11() throws Exception {
    long count = queryFactory
            .update(member)
            .set(member.age, member.age.add(1))
            .execute();
}
```

<br>

#### <span style="background-color:black; color:white">쿼리 한번으로 대량 데이터 삭제</span>

```java
@Test
@DisplayName("삭제")
public void test12() throws Exception {
        queryFactory.delete(member).where(member.age.gt(18)).execute();
}
```

<br>

## <span style="color:gray">SQL function 호출하기</span>

---


<br>

#### <span style="background-color:black; color:white">SQL function 호출하기</span>

```java
@Test
@DisplayName("replace 함수 사용")
public void test13() throws Exception {

    String result = queryFactory
            .select(
                Expressions.stringTemplate(
                    "function('replace', {0}, {1}, {2})",
                    member.username, "member", "M"))
            .from(member)
            .fetchFirst();
    
}
```

```java
@Test
@DisplayName("lower 함수 사용")
public void test14() throws Exception {

    List<String> result = queryFactory
            .select(member.username).from(member)
            .where(member.username.eq(Expressions.stringTemplate(
                    "function('lower',{0})",
                    member.username
            )))
            .fetch();

}
```

ansi 표준 함수들은 querydsl이 상당부분 내장하고 있기 때문에 아래처럼

작성해도 동일한 동작을 한다.

```java
@Test
@DisplayName("lower 함수 사용")
public void test14() throws Exception {
    
    List<String> result = queryFactory
            .select(member.username).from(member)
            .where(member.username.eq(member.username.lower()))
            .fetch();
            
}
```