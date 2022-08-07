---
layout: post
title: 다양한 의존관계 주입 방법
categories: spring
tags: springBoot
---

## <span style="color:gray">의존관계 주입</span>

---

***<span style="background-color:yellow">의존관계 자동 주입은 스프링 컨테이너가 관리하는 스프링 Bean이어야 동작한다.</span>*** 

의존관계 주입은 크게 4가지 방법이 있다.

✔︎ 생성자 주입

✔︎ 수정자 주입(setter 주입)

✔︎ 필드 주입

✔︎ 일반 메서드 주입

<br>

## <span style="color:gray">생성자 주입</span>

---

#### ***생성자 주입이란?***

생성자 주입이란 이름 그대로 생성자를 통해서 의존관계를 주입 받는 방법이다.

생성자 주입의 경우에는 생성자 호출시점에 ***<span style="background-color:yellow">딱 1번만 호출</span>*** 되는 것이 보장된다.

따라서 이 후에는 값을 변경할 수 없다는 장점을 가지고 있다. 그래서 생성자 주입은 

주로 ***<span style="background-color:yellow">불변, 필수</span>*** 의존관계에 사용한다.

<br>

참고로 생성자가 딱 1개만 있다면 `@Autowired`를 생략해도 자동 주입된다.

```java
@Component
public class UserServiceImpl implements UserService {

    private final MemberRespository memberRespositoy;

    @Autowired // 생략가능(단, 생성자가 딱 1개만 있을 경우)
    public UserServiceImpl(MemberRespository memberRespositoy) {
        this.memberRepository = memberRepository;
    }
}
```

<br>

## <span style="color:gray">수정자(setter) 주입</span>

---

#### ***수정자 주입이란***

수정자 주입이란 setter라 불리는 필드의 값을 변경하는 수정자 메서드를 통해서 

의존관계를 주입하는 방법이다. 주로 ***<span style="background-color:yellow">선택, 변경</span>*** 가능성이 있는 의존관계에 사용한다.

참고로 `@Autowired`의 기본 동작은 주입할 대상이 없으면 오류가 발생한다. 주입할 

대상이 없어도 동작하게 하려면 **`@Autowired(required = false)`** 옵셥을 주면 된다.

```java
@Component
public class OrderServiceImpl implements OrderService {

    private MemberRepository memberRepository;
    private DiscountPolicy discountPolicy;

    @Autowired
    public void setMemberRepository(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Autowired
    public void setDiscountPolicy(DiscountPolicy discountPolicy) {
        this.discountPolicy = discountPolicy;
    }
}
```

만약에 `MemberRespository`가 스프링 빈에 등록이 안되어 있더라도, 

수정자 주입방식을 사용하면 주입을 할 수 있다.

<br>

## <span style="color:gray">필드 주입</span>

---

#### ***필드 주입이란?***

필드 주입이란 이름 그대로 필드에 바로 중비하는 방법이다. 필드 주입은 코드가 간결해서 

많은 개발자들은 유혹하지만 ***<span style="color:red">외부에서 변경이 불가능해서 테스트 하기 힘들다는 치명적인 단점이 있다.</span>***

<br>

아래의 코드로 한 번 이해를 해보자.

```java
@Component
public class OrderServiceImpl implements OrderService {
    
    @Autowired
    private MemberRepository memberRepository;
    
    @Autowired
    private DiscountPolicy discountPolicy;

    @Override
    public Order createOrder(Long memberId, String itemName, int itemPrice) {
        Member member = memberRepository.findById(memberId);
        int discountPrice = discountPolicy.discount(member, itemPrice);
        return new Order(memberId, itemName, itemPrice, discountPrice);
    }
}
```

아래와 같이 테스트 코드를 작성할 경우 `NullPointerException` 에러가 반환된다.

```java
@Test
void fieldInjectionTest() {
    OrderServiceImpl orderService = new OrderServiceImpl();
    //...
}
```

왜냐면 `@Autowired`는 스프링 컨테이너 관리하에 있을 때 적용이 되기 때문에

순수한 자바에서는 어떤 Bean이 주입되는지 절대 알 수 없다.

결국 순수한 자바로 테스트하는 방법은 따로 setter메서드를 생성해주는 방법 밖에는 없다. 

***<span style="color:red">결론적으로 필드 주입의 경우에는 DI 프레임워크가 없으면 아무것도 할 수가 없다.</span>***

<br>

그렇다면 필드 주입은 언제 써야할까??

✔︎ `@SpringBootTest` 처럼 스프링 컨테이너를 테스트에 통합한 경우에만 사용.

✔︎ 스프링 설정을 목적으로 하는 `@Configuration` 같은 곳에서만 특별한 용도로 사용

<br>

## <span style="color:gray">일반 메서드 주입</span>

---

#### ***일반 메서드 주입이란?***

이름 그대로 일반 메서드를 통해서 주입 받을 수 있다.

한 번에 여러 필드를 주입 받을 수 있다. 하지만 사실 잘 사용하지 않는다.