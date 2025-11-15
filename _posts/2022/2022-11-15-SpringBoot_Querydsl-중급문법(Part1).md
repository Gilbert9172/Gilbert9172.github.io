---
layout: post
title: 중급 문법 - Part1
categories: spring
tags: querydsl
---

## <span style="color:gray">프로젝션과 결과 반환 - 기본</span>

---

#### <span style="background-color:black; color:white">프로젝션 대상이 하나</span>

프로잭션 대상이 **하나**면 타입을 명확하게 지정할 수 있다.

```java
List<String> result = queryFactory
                .select(member.username)
                .from(member)
                .fetch();
```

<br>

**<u>▷ distinct</u>**

JPQL에서 사용하듯이 사용하면 된다.

```java
List<String> result = queryFactory
        .select(member.username).distinct()
        .from(member)
        .fetch();
```

<br>

#### <span style="background-color:black; color:white">튜플 조회</span>

프로젝션이 **둘 이상일 때** 사용한다.

```java
List<Tuple> result = queryFactory
    .select(member.username, member.age)
    .from(member)
    .fetch();
```
```java
for (Tuple tuple : result) {
    System.out.println(tuple.get(member.username));
    System.out.println(tuple.get(member.age));
}
```

<br>

Tuple을 서비스나 컨트롤러 계층으로 가져가는 거는 좋지 못한 설계이다.

레포지토리 계층에서 쓰는게 가장 좋다. 

**<span style="background-color:#F0E68C">다른 계층으로 보낼 때는 DTO로 변환해서 보내는걸 권장한다.</span>**

<br>

## <span style="color:gray">프로젝션과 결과 반환 - DTO 조회</span>

**<span style="background-color:#F0E68C">매우 많이 사용하고 그만큼 중요하다.</span>**

---

#### <span style="background-color:black; color:white">순수 JPA에서 DTO 조회 코드</span>

```java
List<MemberDto> result = em.createQuery(
                "select new study.querydsl.dto.MemberDto(m.username, m.age)" +
                "from Member m", MemberDto.class)
                .getResultList();
```

<br>

#### <span style="background-color:black; color:white">Querydsl 빈 생성(Bean population)</span>

**<u>▷ 프로퍼티 접근 - Setter</u>**

이 방식은 DTO에 setter 메소드가 꼭 있어야 한다.

```java
List<MemberDto> result = queryFactory
        .select(Projections.bean(MemberDto.class, member.username, member.age))
        .from(member)
        .fetch();
```

<br>

**<u>▷ 필드 직접 접근</u>**

이 방식은 DTO에 setter 메소드가 **없어도 된다.**

```java
List<MemberDto> result = queryFactory
        .select(Projections.fields(MemberDto.class, member.username, member.age))
        .from(member)
        .fetch();
```

<br>

자동으로 매핑 되는게 신기해서 코드를 까봤다.

```java
protected QBean(Class<? extends T> type, boolean fieldAccess, Expression<?>... args) {
    this(type, fieldAccess, createBindings(args));
}
```

<img src="/assets/img/querydsl/createBindings.png">


코드가 복잡한데 간단히 보자면, 올바르게 프로젝션을 했다면 해쉬맵에 

`path.getMetadata().getName() : expr` 형태로 넣고, `UnmodifiableMap()`으로 

read-only 제약을 걸어서 반환해주는 것 같다.

<br>

**<u>▷ 필드 직접 접근 (별칭이 다를 때)</u>**

• `ExpressionUtils.as(source, alias)` : 필드나, 서브쿼리에 별칭 적용

• `as(aliat)` : 필드에 별칭 적용

```java
List<UserDto> result = queryFactory
        .select(fields(UserDto.class,
                member.username.as("name"),
                //→ 서브쿼리의 경우
                ExpressionUtils.as(
                        select(memberSub.age.max())
                        .from(memberSub),"age"
                )))
        .from(member)
        .fetch();
```

<br>

별칭을 주지 않으면 런타임에러는 터지지 않지만, 정확한 데이터를 얻지는 못한다.

```txt
UserDto{name='null', age=10}
UserDto{name='null', age=20}
UserDto{name='null', age=30}
UserDto{name='null', age=40}
```

<br>

**<u>▷ 생성자 사용 접근</u>**

이 방식을 사용하려면 적절한 생성사 생성을 해줘야한다.

```java
List<MemberDto> result = queryFactory
        .select(constructor(MemberDto.class,
                member.username,
                member.age))
        .from(member)
        .fetch();
```

<br>

**<u>▷ 생성자 사용 접근 (별칭이 다를 때)</u>**

```java
List<UserDto> result = queryFactory
        .select(constructor(UserDto.class,
                member.username.as("name"),
                ExpressionUtils.as(
                        select(memberSub.age.max())
                        .from(memberSub),"age"
                )))
        .from(member)
        .fetch();
```

<br>

## <span style="color:gray">프로젝션과 결과 반환 - @QueryProjection</span>

---

#### <span style="background-color:black; color:white">생성자 + @QueryProjection</span>

`@QueryProjection` 어노테이션을 적절한 생성자에 추가해준다.

```java
@Getter @Setter
@NoArgsConstructor
public class MemberDto {

    private String username;
    private int age;

    @QueryProjection
    public MemberDto(String username, int age) {
        this.username = username;
        this.age = age;
    }

}
```

<br>

#### <span style="background-color:black; color:white">@QueryProjection 활용</span>

자바에서 인스턴스를 생성하듯이 작성하면 끝!

이 방법은 컴파일러로 타입을 체크할 수 있기 때문에 가장 안전한 방법이다.

```java
List<MemberDto> result = queryFactory
        .select(new QMemberDto(member.username, member.age))
        .from(member)
        .fetch();
```

<br>

#### <span style="background-color:black; color:white">@QueryProjection 문제점</span>

이 방식을 사용하려면 DTO에 QueryDSL 어노테이션을 유지해야한다.

**<span style="background-color:#F0E68C">즉, DTO가 Querydsl에 의존성을 갖는다!</span>**

DTO는 서비스 계층, 뷰 계층 까지도 이동하는데 (여러 레이어에 걸쳐서 돌아다닌다) 

이런 DTO안에 Querydsl 어노테이션이 있다...? 쫌 부자연스럽다.

그리고 Querydsl에 의존성을 갖고 있기 때문에 Q파일을 생성해야 하는 단점도 있다.

<br>

그래서 어떤 방법을 사용할지는 회사에 따라, 프로젝트에 따라 다르다. 

그냥 DTO가 의존성을 앉고 가게끔 개발할 수도 있고 아닐수도 있다.

만약 아니라면 위에서 학습한 생성자, 필드 접근 방식을 사용하면 된다.


<br>

#### <span style="background-color:black; color:white"></span>

<br>