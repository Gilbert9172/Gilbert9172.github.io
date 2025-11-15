---
layout: post
title: 싱글톤 컨테이너
categories: spring
tags: springBoot
---

## <span style="color:gray">싱글톤 전의 문제점</span>

스프링 없는 순수한 DI 컨테이너는 클라이언트의 요청이 올 때마다 새로운 객체를

생성했다. 그런데 만약 우리 서비스 사용자가 많아서 초당 10000개의 요청이 온다고 

하면 순수한DI 컨테이너는 굉장히 많은 메모리를 낭비하게 된다.

이 문제에 대한 해결방안은 ***<span style="background-color:yellow">객체를 딱 1개만 생성하고, 공유하도록 설계하면 된다.</span>***

이것을 가능케 하는 것이 바로 ***<span style="background-color:yellow">싱글톤 패턴</span>*** 이다.

---

<br>

## <span style="color:gray">싱글톤 패턴</span>

싱글톤 패턴이란 ***<span style="background-color:yellow">클래스의 인스턴스가 딱 1개만 생성되는 것을 보장하는 디자인 패턴이다.</span>***

그래서 객체 인스턴스를 2개 이상 생성하지 못하도록 한다. 

> private 생성자를 사용해서 외부에서 임의로 new 키워드를 사용하지 못하도록 막아야 한다.

스프링의 가장 큰 장점 중 하나는 ***<span style="background-color:yellow">스프링 컨테이너가 기본적으로 객체를 싱글톤으로 만들어서</span>***

***<span style="background-color:yellow">관리해주는 부분이다.</span>*** 싱글톤 패턴을 적용하면 고객의 요청이 올 때 마다 객체를 생성하는 것이

 아니라, ***<span style="color:red">이미 만들어진 객체를 공유해서</span>*** 효율적으로 사용할 수 있다.

---

<br>

## <span style="color:gray">싱글톤 패턴의 문제점</span>

✓ 싱글톤 패턴을 구현하는 코드 자체가 많이 들어간다.

✓ 의존관계상 클라이언트가 구체 클래스에 의존하다. → **`DIP 위반`**

✓ 클라이언트가 구체 클래스에 의존해서 **`OCP 원칙을 위반`** 할 가능할 가능성이 높다.

✓ 테스트하기가 어렵다.

✓ 내부 속성을 변경하거나 초기화 하기 어렵다.

✓ private 생성자로 자식 클래스를 만들기 어렵다.

✓ 결론적으로 유연성이 떨어진다.

✓ 안티패턴으로 불리기도 한다.

---

<br>

## <span style="color:gray">싱글톤 컨테이너</span>

스프링 컨테이너는 싱글톤 패턴의 문제점을 해결하면서, 객체 인스턴스를 싱글톤(1개만 생성)으로

관리한다. 지금까지 사용한 스프링 빈이 바로 싱글톤으로 관리되는 빈이다. 

스프링 컨테이너는 싱글톤 컨테이너의 역할을 한다. 이렇게 싱글톤 객체를 생성하고 관리하는 기능을

싱글톤 레지스트리라고 한다. 이러한 기능 덕분에 싱글톤 패턴의 모든 단점을 해결하면서 객체를

싱글톤으로 유지할 수 있다. 결론적으로 싱글톤 패턴을 위한 지저분한 코드가 들어가지 않아도 된다.

또한 DIP, OCP, 테스트, private 생성자로 부터 자유롭게 싱글톤을 사용할 수 있다.

<br>

**싱글톤 컨테이너 적용 전, 후**

싱글톤 컨테이너를 적용하기 전에는 각 요청마다 인스턴스를 만들어야 했지만, 

적용 후에는 이미 만들어진 객체를 공유해서 효율적으로 재사용 할 수 있다.

---

<br>

## <span style="color:gray">싱글톤 방식의 주의점</span>

싱글톤 패턴이든, 스프링 같은 싱글톤 컨테이너를 사용하든, 객체 인스턴스를 하나만 생성해서

공유하는 싱글톤 방식은 여러 클라이언트가 ***<span style="background-color:yellow">하나의 같은 객체 인스턴스를 공유</span>*** 하기 때문에 

싱글톤 객체는 상태를 유지하게 설계하면 안된다. 즉, ***<span style="background-color:yellow">무상태</span>*** 로 설계해야 한다.

|무상태(stateless)|
|------|
|특정 클라이언트에 의존적인 필드가 있으면 안된다.|
|특정 클라이언트가 값을 변경할 수 있는 필드가 있으면 안된다.|
|가급적 읽기만 가능해야 한다.|
|필드 대신에 자바에서 공유되지 않는, 지역변수, 파라미터, ThreadLocal 등을 사용해야 한다|

<br>

**예시 코드**

아래의 코드의 경우 손님 1이 1만원을 주문하고, 손님2가 2만원을 주문하면

손님1도 2만원을 결제해야 하는 상황이 발생한다. 

```java
public class StartfullService {

    private int price;

    public void order (String name, int price) {    
        System.out.println("name = " + name + " price = " + price);
        this.price = price;
    }

    public int getPrice() {
        return price;
    }
}
```

따라서 아래와 같이 재설계를 해야한다.

```java
public class StartFullService {
    public void order(String name, int price) {
        return price;
    }
}
```

---

<br>

## <span style="color:gray">@Configuration과 싱글톤</span>

아래의 코드를 보면 `memberService()`를 빈에 등록할 때도 `memberRepository()`가 생기고

`orderService()`를 빈에 등록할 때도 `memberRepository()`가 생긴다. 그리고 마지막으로

`memberRepository()`를 빈에 등록될 때도 마찬가지다. 총 3번 빈이 생성된 것인데...

이러면 싱글톤을 위배하는 것이 아닐까라는 의문이 든다.

```java
@Configuration
public class AppConfig {

    @Bean
    public MemberService memberService() {
        return new MemberServiceImpl(memberRepository());
    }

    @Bean
    public MemberRepository memberRepository() {
        return new MemoryMemberRepository();
    }

    @Bean
    public OrderService orderService() {
        return new OrderServiceImpl(memberRepository(), discountPolicy());
    }

    @Bean
    public DiscountPolicy discountPolicy() {
        // return new FixDiscountPolicy();
        return new RateDiscountPolicy();
    }
}
```

<br>

그런데 테스트 코드를 짜본 결과...

```java
class AppConfigTest {

    @Test
    public void configurationTest() throws Exception {
        //given
        ApplicationContext ac = new AnnotationConfigApplicationContext(AppConfig.class);
        MemberServiceImpl memberService = ac.getBean("memberService", MemberServiceImpl.class);
        OrderServiceImpl orderService = ac.getBean("orderService", OrderServiceImpl.class);
        MemberRepository memberRepository = ac.getBean("memberRepository", MemberRepository.class);

        //when
        System.out.println("memberService -> memberRepository = " + memberService.getMemberRepository());
        System.out.println("orderService -> memberRepository  = " + orderService.getMemberRepository());
        System.out.println("memberRepository = " + memberRepository);

        //then
        assertThat(memberService.getMemberRepository()).isSameAs(memberRepository);
        assertThat(orderService.getMemberRepository()).isSameAs(memberRepository);
    }

}
```

모두 딱 1번만 출력 됐다.. 무슨 일이지..?

> 모두 참조값이 655ef3232로 같다.

<img src="/assets/img/spring/container/configurationLog.png">

<br>

## <span style="color:gray">@Configuration과 바이트코드 조작의 마법</span>

---

스프링 컨테이너는 싱글톤 레지스트리다. 따라서 스프링 빈이 싱글톤이 되도록 

보장해주어야 한다. 그런데 스프링이 자바 코드까지 어떻게 하기는 어렵다.

그래서 스프링은 클래스의 바이트코드를 조작하는 라이브러리를 사용한다.

모든 비밀은 ***`@Configuration`*** 을 적용한 AppConfig.java에 있다.

<br>

AppConfig 또한 빈으로 등록이 되는데 이때 등록된 AppConfig 빈의 클래스 정보를 보면

<img src="/assets/img/spring/container/appconfigClassmeta.png">

오...? 뒤에 뭔가 붙어서 출력이 된다..?

이것은 내가 만든 클래스가 아니라 스프링이 CGLIB라는 바이트 코드 조작 라이브러리를 

사용해서 AppConfig 클래스를 상속 받은 임의의 다른 클래스를 만들고, 그 다른 클래스를

스프링 빈으로 등록한 것이다!!!

<br>

여기서 잠깐 CGLIB(Code Generate Library)에 대해서 알고 넘어가자면, 

CGLIB라는 구체 클래스(AppConfig)를 상속해서 프록시를 생성해주는 라이브러리다. 

AOP를 공부할 때도 마추쳤던 녀석이라 기억이 난다.

<br>

다시 본론으로 돌아와서~ 임의의 다른 클래스(실제 클래스를 상속 받아 생성된 클래스)가

바로 싱글톤이 보장되도록 해준다. 실제 CGLIB 내부 기술은 매우 복잡하니깐 슈도코드로 

작성해보면 아래와 같이 작성할 수 있다.

```java
// AppConfig@CGLIB 예상코드
// 아래의 메서드는 AppConfig를 오버라이드한 메서드
public MemberRepository memberRepositsory() {
    if (memoryMemberRepository가 이미 스프링 컨테이너에 등록되어 있으면?) {
        return 스프링 컨테이너에서 찾아서 반환;
    } else {
        스프링 컨테이너에 없다면?
        기존 로직을 호출해서 MemoryMemberRepsoritory를 생성하고 스프링 컨테이너에 등록
        return 반환;
    }
}
```

`@Bean`이 붙은 메서드마다 이미 스프링 빈이 존재하면 존재하는 빈을 반환하고, 

스프링 빈이 없으면 생성해서 스프링 빈으로 등록하고 반환하는 코드가 동적으로 만들어진다.

덕분에 싱글톤이 보장되는 것이다.

<br>

그런데 만약 `@Configuration`을 적용하지 않고, `@Bean`만 적용하면 어떻게 될까?

<img src="/assets/img/spring/container/noConfiguration.png">

출력결과를 보면 AppConfig가 CGLIB 기술 없이 순수한 AppConfig로 스프링 빈에 등록된 

것을 확인할 수 있다. 

<br>

앞에서 작서했던 테스트 코드를 돌려보면, `memberRepository()`를 세 번 호출하는

것을 확인할 수 있고,

<img src="/assets/img/spring/container/threeMemberRepository.png">

<br>

서로 다른 참조 값을 갖게 되는 것 또한 확인할 수 있다.

<img src="/assets/img/spring/container/다른참조변수.png">

<br>

정리하자면 ***<span style="background-color:yellow">@Configuration</span>*** 을 적용하면 바이트코드를 조작하는 CGLIB라는

기술을 사용해서 싱글톤을 보장한다. 따라서 스프링 설정 정보는 항상 ***<span style="background-color:yellow">@Configuration</span>*** 을 사용해야 한다.

물론 ***<span style="color:RED">@Bean만 사용해도 스프링 빈으로 등록은 되지만, 싱글톤을 보장하진 않는다.</span>***

고민할 것도 없이 스프링 설정 정보는 항상 ***<span style="background-color:yellow">@Configuration</span>*** 을 사용하자~~