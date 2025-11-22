---
title: 2장. 객체지향 프로그래밍
categories: [book, 오브젝트]
tags: [오브젝트]
---

<br>

## ❐ 1. 영화 예매 시스템

---

### 🌀 1-1. 요구사항 살펴보기

> 용어 정리 

- 영화 : 영화에 대한 기본정보를 표현
- 상영 : 실제로 관객들이 영화를 관람하는 사건을 표현

<br>

> 요금 할인 관련

- 할인 조건 : 할인 여부 결정
  - 순서 조건
  - 기간 조건
- 할인 정책 : 할인 요금 결정 (1개 이하만 가능)
  - 금액 할인 정책
  - 비율 할인 정책

<br>

## ❐ 2. 객체지향 프로그래밍을 향해 

---

### 🌀 2-1. 협력, 객체, 클래스

> 진정한 객체지향 페러다임으로의 전환 : 클래스가 아닌 객체에 초점을 맞춰라.

- 어떤 객체가 필요한지 고민하라.
- 객체를 독립적인 존재가 아닌, 기능을 구현하기 위해 협력하는 공동체의 일원으로 봐라.

<br>

### 🌀 2-2. 도메인의 구조를 따르는 프로그램 구조

> 도메인 

- 문제를 해결하기 위해 사용자가 프로그램을 사용하는 분야


<br>

### 🌀 2-3. 클래스 구현하기

> 클래스의 경계를 구분지어라.

- 왜? 
  - 경계의 명확성이 객체의 자율성을 보존하기 때문.
  - (더 중요한 포인트) 프로그래머에게 구현의 자유를 제공하기 때문.

<br>

> 자율적인 객체

- 객체 내부에 대한 접근을 통제하는 이유는 객체를 자율적인 존재로 만들기 위해함이다.
- 자율적인 객체를 위해 우리는 캡슐화, 접근 제어 메커니즘을 사용한다.
- **인터페이스와 구현의 분리 원칙**은 훌륭한 객체지향 프로그래밍을 만들기 위해 따라야하는 핵심 원칙
  - 인터페이스 : 외부에서 접근 가능한 부분 
  - 구현 : 외부에서 접근할 수 없는 내부 동작
- 이 원칙은 인터페이스(외부 계약)는 그대로 두고 구현(내부 로직)만 바꾸어도 외부 코드(클라)는 아무 영향을 받지 않음.

<br>

> 프로그래머의 자유

- 두 종류의 프로그래머 
  - 클래스 작성자 (class creator)
    - 새로운 클래스(데이터 타입)를 만드는 사람 
    - 내부 구현을 어떻게 짤지 결정함 
  - 클라이언트 프로그래머 (client programmer)
    - 만들어진 클래스를 사용하는 사람 
    - 인터페이스만 보고 사용함
- 접근 제어(private 등)는 ‘구현 숨기기’를 위한 언어 지원장치

<br>

> 구현 은닉

- 클래스 내부 구현은 숨기고, 외부에는 인터페이스만 공개한다.

<br>

> 인터페이스와 구현을 분리하면 무엇이 좋아지는가?

- 비공개 영역(private)은 마음대로 바꿀 수 있다.
- 의존성을 줄여 유지보수성과 확장성이 크게 올라간다.
- 궁극적으로 “설계가 쉬워지고 변경이 쉬워진다” 
  - _(기억하기) 객체지향 설계의 목적 = “변경에 유연한 시스템 만들기”_

<br>

### 🌀 2-4. 협력하는 객체들의 공동체

> 협력 (Collaboration)

[collaboration](../../assets/img/book/object/chap2/collaboration.png)
- 객체지향 프로그램을 작성할 때는
  1. 협력의 관점에서 어떤 객체가 필요한지를 결정
  2. 객체들의 공통 상태와 행위를 구현하기 위해 클래스를 작성

<br>

### 🌀 2-5. 협력에 관한 짧은 이야기

> 객체간 상호작용 

- 객체는 요청/응답을 할 수 있다.
- 서로 다른 객체가 상호작용을 할 수 있는 유일한 방법은? **메시지 전송**
- 수신된 메시지를 처리하는 자신만의 방법을 **메소드(method)**라고 한다.

<br>

> 메시지 ≠ 메서드

- 메시지(message) 
  - 한 객체가 다른 객체에게 "이 행동을 해달라"는 요청을 보내는 의사소통 방식.
  - 즉, 어떤 객체에게 어떤 동작을 요구하는 “신호”나 “명령”인 셈.
  - 예) `screening.reserve(...)`처럼 “예약해 줘”라는 메시지를 Screening 객체에게 전달하는 것. 
- 메서드(method)
  - 메시지를 받은 객체가 자신만의 방식으로 그 메시지를 처리하는 구체적인 알고리즘/함수.

<br>

## ❐ 3. 할인 요금 구하기

---

### 🌀 3-1. 할인 요금 구하기

```java
public abstract class DefaultDiscountPolicy implements DiscountPolicy {
    private final List<DiscountCondition> conditions;

    public DefaultDiscountPolicy(DiscountCondition... conditions) {
        this.conditions = Arrays.asList(conditions);
    }

    @Override
    public Money calculateDiscountAmount(Screening screening) {
        for(DiscountCondition each : conditions) {
            if (each.isSatisfiedBy(screening)) {
                return getDiscountAmount(screening);
            }
        }

        return Money.ZERO;
    }

    abstract protected Money getDiscountAmount(Screening Screening);
}
```
[discountPolicy](../../assets/img/book/object/chap2/discountPolicy.png)
- 하나의 할인 정책은 여러 개의 할인 조건을 포함할 수 있음.

<br>

## ❐ 4. 상속과 다형성

---

<br>

### 🌀 4-1. Compile-time 의존성 vs Run-time 의존성 

> Movie는 어떤 구현체를 선택할까?

[dependency](../../assets/img/book/object/chap2/dependency.png)
- 현재 Movie와 DiscountPolicy는 의존성을 가지고 있음. (Movie -> DiscountPolicy)
- 즉, 현재 구성도만으로는 Movie가 어떤 'DiscountPolicy 구현체'를 사용할지 알 수 없음.    

<br>

> Compile-time 의존성 ≠ Run-time 의존성

- 이는 다형성과 의존성 역전(DIP) 원칙 덕분에 가능하다.
- 컴파일 타임에는 추상화(인터페이스, 상위 타입)에만 의존하지만, 런타임 시점에는 실제 구현체가 결정된다. 
- SpringBoot의 의존성 주입(DI)이 대표적인 예다.

<br>

### 🌀 4-2. 차이에 의한 프로그래밍

> 차이에 의한 프로그래밍

- 부모 클래스와 다른 부분만을 추가해서 새로운 클래스를 쉽고 빠르게 만드는 방법 
- 상속 : 객체지향 코드를 재사용하기 위해 가장 널리 사용되는 방법

<br>

> 개인적인 생각 : 상속 별로임

- 부모에 너무 종속적임
- 그리고 변화에 굉장히 취약함.
- 상속 보다는 구성(Composition)을 사용해서 개발하는게...

<br>

### 🌀 4-3. 상속과 인터페이스

> 상속 & 인터페이스

- 인터페이스는 객체가 이해할 수 있는 **메시지의 목록을 정의**한다는 것을 기억해라.
- 상속을 통해 자식클래스는 자신의 인터페이스 + 부모의 인터페이스를 포함하게 된다.
  - 즉, 자식은 부모가 수신할 수 있는 모든 메시지를 수신할 수 있음.
  - 고로 자식과 부모는 같은 타입으로 간주함.

<br>

### 🌀 4-4. 다형성

> 
