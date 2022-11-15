---
layout: post
title: 중급 문법 Part2
categories: spring
tags: querydsl
---

## <span style="color:gray">동적쿼리</span>

---

#### <span style="background-color:black; color:white">BooleanBuilder 사용</span>

BooleanBuilder 클래스를 사용하는 방식이다.

```java

@Test
@DisplayName("동적쿼리 : BooleanBuilder")
public void test1() {

    String usernameParam = "member1";
    Integer ageParam = 10;

    List<Member> resulst = searchMember1(usernameParam, ageParam);

}
```

조건이 `null`이 아닐 때만 and 조건이 붙는다.

```java
private List<Member> searchMember1(String usernameCond, Integer ageCond) {

        BooleanBuilder builder = new BooleanBuilder();

        if (usernameCond != null) {
            builder.and(member.username.eq(usernameCond));
        }

        if (ageCond != null) {
            builder.and(member.age.eq(ageCond));
        }

        return queryFactory
                .selectFrom(member)
                .where(builder)
                .fetch();
    }
```

<br>

#### <span style="background-color:black; color:white">Where 다중 파라미터 사용</span>

BooleanBuilder 클래스를 사용하는 방식보다 깔끔하게 작성할 수 있어

가독성이 좋아지고, 다양한 조건들을 조립할 수 있다는 큰 장점이 있다.

<br>

`성인 남성만 선택해야 한다.` 와 같이 복합적인 조건이 들어가는 경우를 

코드로 작성해 보겠다.

<br>

우선 성인이면 20살 이상이고, 성별은 남성(M)일 것이다.

**<u>▷ 성별(남) 여부확인</u>**

```java
private BooleanExpression genderEq(String genderCond) {
    return genderCond != null ? member.gender.eq(genderCond) : null;
}
```

<br>

**<u>▷ 나이 20살 이상 여부확인 </u>**

```java
private BooleanExpression ageGoe(Integer ageCond) {
    return ageCond != null ? member.age.goe(ageCond) : null;
}
```

<br>

**<u>▷ 전체 코드 확인 </u>**

```java
private List<Member> maleAdultList(String genderCond, Integer ageCond) {
    return queryFactory
                .selectFrom(member)
                .where(
                        genderEq(genderCond),
                        ageGoe(ageCond)
                )
                .fetch();
}
```

<br>

그런데 성인 남성의 경우에는 어떤 경우에도 `20살 이상 + 남성` 이므로 

아래의 코드 처럼 다시 작성해서 가독성과 재사용성을 증가시킬 수 있다.

```java
private List<Member> maleAdultList(String genderCond, Integer ageCond) {
    return queryFactory
                .selectFrom(member)
                .where(isAdultMale(genderCond,ageCond))
                .fetch();
}
```
```java
private BooleanExpression isAdultMale(String genderCond, Integer ageCond) {
    return genderEq(genderCond).and(ageGoe(ageCond));
}
```
이 경우에도 null 처리를 주의해야 한다. 

고정적으로 들어가야 하는 값이면 이렇게 넣어줘도 될 것 같다는 생각이다.

```java
genderCond = "M"
ageCond = 20;
```