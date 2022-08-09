---
layout: post
title: 관심사의 분리(OCP, DIP 위배 해결)
categories: spring
tags: springBoot
---

## <span style="color:gray">이전 장에서...</span>

---

이전 장에서 순수한 자바 코드로 스프링을 구현하면서 아래와 같은 문제에 마주쳤다.

> 문제 : 할인 정책을 바꾸려면 클라이언트 코드를 수정해야한다...!

위 문제는 OOP설계 원칙 중 ***<span style="color:red">OCP를 위배한다.</span>*** 참고로 OCP원칙은 개방-패쇄 원칙으로 

***<span style="background-color:yellow">확장에는 열려있어야 하나, 변경에는 닫혀 있어야 한다. 즉, 기능을 변경하거나</span>***

***<span style="background-color:yellow">확장할 수 있으면서 그 기능을 사용하는 코드는 수정하지 않는다. 를 뜻한다.</span>***

<br>

다시 본론으로 돌아와서 보면 위 문제를 해결하기 위해서는 구체클래스에 의존해서는 

안되며 오로지 ***<span style="background-color:yellow">추상클래스에 의존해야한다.</span>***

결국 제3자가 구현객체를 대신 생성해주고 주입해줘야 한다는 이야기다.

<br>

## <span style="color:gray">관심사 분리</span>

---

#### ***관심사를 분리하자!***

애플리케이션을 하나의 공연이라고 생각해보자. 각각의 인터페이스를 배우라고 생각하자.

그런데! 실제 배역에 맞는 배우를 선택하는 것은 누가 하는것일까? 배우가 하는 것일까? 

만약 남배우가 상대 여배우를 직접 구한다면 연극에 집중을 못 할 것이다. 

왜냐면, 남배우는 공연도 해야하고 동시에 여자 배우도 직접 구하러 다녀야 하기 때문이다.

<br>

앞선 문제들도 이 예시와 유사하다. `DisconutPolicy` 인터페이스가 직접 어떤 할인을 

적용할지 스스로 결정을 하고 있었기 때문이다!! ***<span style="color:red">(DIP 위배)</span>***

```java
private final DiscountPolicy discountPolicy = new FixDiscountPolicy();
```

결국 남자 배우가 A라는 여배우가 맘이 안들면, 직접 다른 배우를 구하러 다녀야 하는

상황이 발생되는 것과 다르지 않다.

<br>

따라서 ***<span style="background-color:yellow">관심사를 꼭 분리해야 한다.</span>***

배우는 본인의 역할인 배역을 수행하는 것에만 집중해야 하며, 남배우는 여배우가 

누가 오더라도 똑같이 공연을 할 수 있어야 한다. 결국 제3자, 그러니깐 `공연기획자`가

등장해서 여배우를 섭외를 해야한다.

<br>

애플리케이션도 똑같다. 애플리케이션에서 실제 실행되는 객체들은 본인의 역할만

수행하게 해줘야하며, 어떤 구현체들이 인터페이스에 할당 될 지는 제3자가 해줘야 한다.

<br>

#### ***제 3자***

제 3자라는 표현을 사용했는데, ***<span style="background-color:yellow">의존성 주입</span>*** 을 말한 것이다.

생성자를 통해서 순수 자바코드로 의존성을 주입해봤다. 

```java

public class AppConfig {

    public MemberService memberService() {
        return new MemberServiceImpl(new MemoryMemberRepositor);
    }
}
```

이렇게 되면 결국 클라이언트는 인터페이스에만 의존하게 되기 때문에 `OCP`, `DIP`를 지킬수 있다.