---
layout: post
title: 좋은 객체지향 설계의 5가지 원칙
categories: spring
tags: springBoot
---

## <span style="color:gray">[ SOLID ]</span>

<br>

### <span style="color:gray">SRP (단일 책임 원칙)</span>

---

**Single Responsebility Priciple**

✔︎ 하나의 클래스는 하나의 책임만 가져야한다.

✔︎ 중요한 기준은 변경이다. 변경이 있을 때 파급 효과가 적으면 SRP를 잘 따른 것

<br>

처음에 실습한 예제에서 클라이언트 객체는 직접 구현 객체를 생성하고, 연결하고,

실행하는 다양한 책임을 자기고 있었다. SRP(단일 책임 원칙)을 따르면서 관심사를

분리하였다. 구현 객체를 생성하고 연결하는 역할은 AppConfig가 담당하게 끔 했다.

결국 자연스럽게 클라이언트 객체는 실행하는 책임만 담당하게 끔 구조가 변경됐다.


<br>

### <span style="color:gray">OCP (개방-폐쇄 원칙)</span>

---

**Open Closed Pricipal**

✔︎ ***<span style="background-color:yellow">소프트웨어 요소는 확장에서는 열려있으나, 변경에는 닫혀있어야 한다.</span>***

✔︎ 다형성을 활용해야 한다.

<br>

인터페이스를 구현한 구현객체를 하나 만들어서 새로운 기능을 구현한다 하더라도

OCP를 지키기는 힘들다. 아래와 같은 경우를 보면 

<img src="/assets/img/spring/ocp.png">

memberRepsoitory 인터페이스의 구현객체를 변경하려면 클라이언트의 코드를 

필수적으로 변경해야 한다. 분명히 다형성을 사용했지만, OCP원칙을 지키지는 못한다.

해결 방법으로는 ***<span style="background-color:yellow">객체를 생성하고, 연관관계를 맺어주는 별도의 설정자가 필요하다.</span>*** 

> 강의에서는 AppConfig라는 설정파일을 통해 이 역할을 구현했다. 

여기서 별도의 설정자 역할을 해주는 것이 바로 ***`스프링 컨테이너`*** 이다.

---

<br>

### <span style="color:gray">LSP (리스코프 치환 원칙)</span>

**Liskov Substitution Principle**

✔︎ ***<span style="background-color:yellow">프로그램의 객체는 프로그램의 정확성을 깨뜨리지 않으면서 하위 타입의 인스턴스로 바꿀수 있어야 한다.</span>***

예를 들면 "자동차 인터페이스"의 악셀은 앞으로 가라는 기능이다.

그런데 여기서 악셀의 기능을 "뒤로가기"로 바꿔버리면 규약에 어긋난 것이다. 

즉, LSP에 어긋나게 된다. LSP의 경우는 기능이 변경되지 않는 보장이 필요하다.

추가적으로 LSP는 컴파일 단계에서 말하는게 아니다. 왜냐면 코드에 이상만 없다면

악셀의 기능을 어떻게 바꿔도 컴파일은 진행되기 때문이다.

---

<br>

### <span style="color:gray">ISP (인터페이스 분리 원칙)</span>

**Interface Segregation Principle**

✔︎ ***<span style="background-color:yellow">인터페이스가 명확해지고, 대체 가능성이 높아진다.</span>***

예를 들면 "자동차 인터페이스"의 경우에는 `운전 인터페이스`, `정비 인터페이스`로 나눌수 있다.

---

<br>

### <span style="color:gray">DIP (의존관계 역전 원칙)</span>

---

**Dependency Inversion Principle**

✔︎ ***<span style="background-color:yellow">프로그래머는 추상화에 의존해야지, 구체화에 의존하면 안된다.</span>*** 

의존성 주입은 이 원칙을 따르는 방법중 하나이다. 쉽게 말해서 구현 클래스에 의존하지 말고,

`인터페이스(역할)`에 의존하라는 뜻이다. 왜냐면 클라이언트가 인터페이스에 의존해야 유연하게

구현체를 변경할 수 있기 때문이다. 만약 구현체에 의존하게 된다면 변경이 아주 어려워진다.

<br>

### <span style="color:gray">[ 정리 ]</span>

---

객체 지향의 핵심은 ***<span style="background-color:yellow">다형성</span>*** 이다. 

그렇지만 OCP에서 봤듯 다형성만으로는 쉽게 부품을 갈아 끼우듯이 개발할 수 없다.

다형성만으로 구현 객체를 변경할 때 클라이언트 코드도 함께 변경해야 하기 때문이다.

즉, 다형성만으로는 `OCP`, `DIP`를 지킬수 없기 때문에 뭔가 더 필요한데, 

여기서 그 뭔가는 **`스프링 컨테이너(스프링 DI)`** 이다.

---