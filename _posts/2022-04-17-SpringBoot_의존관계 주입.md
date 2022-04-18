---
layout: post
title: 다양한 의존관계 주입 방법
categories: spring
tags: springBoot
---

## <span style="color:gray">의존관계 주입</span>

***의존관계 자동 주입은 스프링 컨테이너가 관리하는 스프링 Bean이어야 동작한다.***

> ***@Component이 있는 클래스만 가능***

의존관계 주입은 크게 4가지 방법이 있다.

✓ 생성자 주입

✓ 수정자 주입(setter 주입)

✓ 필드 주입

✓ 일반 메서드 주입

---

<br>

## <span style="color:gray">생성자 주입</span>

✓ 이름 그대로 생성자를 통해서 의존관계를 주입 받는 방법

✓ 생성자 호출시점에 딱 1번만 호출되는 것이 보장된다.

✓ <span style="background-color:#87CEFA">불변, 필수</span> 의존관계에 사용

```java
@Component
public class UserServiceImpl implements UserService {

    private final MemberRespository memberRespositoy;

    @Autowired
    public UserServiceImpl(MemberRespository memberRespositoy) {
        this.memberRepository = memberRepository;
    }

}
```

만약 생성자가 딱 1개만 있다면 <span style="background-color:yellow">@Autowired</span>를 생략해도 자동 주입된다.

<br>

lombok에서 제공해주는 <span style="background-color:yellow">@RequiredArgsConstructor</span>을 사용하면 보다 더 간결하게 코드를 작성할 수 있다.

✓ **`final`** 이 붙은 필드를 가지고 생성자를 만들어준다.

✓ 필드 위에 **`@NonNull`** 이 붙은 필드를 가지고 ~

```java
@Component
@RequiredArgsContructor
public class UserServiceImpl implements UserService {

    private final MemberRespository memberRespositoy;
}
```