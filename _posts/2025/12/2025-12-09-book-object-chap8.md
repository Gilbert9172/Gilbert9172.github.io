---
title: 8장. 의존성 관리하기  
categories: [book, 오브젝트]
tags: [오브젝트]
---

<br>

<div class="notice-box chapter" markdown="1">
객체지향 설계의 핵심
- 협력을 위해 필요한 의존성은 유지하면서도 변경을 방해하는 의존성은 제거하는데 있다.
- 이런 관점에서 객체지향 설계란 의존성을 관리하는 것이고 객체가 변화를 받아들일 수 있게 의존성을 정리하는 기술이라고 할 수 있다.
</div>


<br>

### ❐ 1. 의존성 이해하기

---

#### {% include i.html %} 1-1. 변경과 의존성

> 실행 시점과 구현 시점

- 실행 시점 : 의존하는 객체가 정상적으로 동작하기 위해서는 실행 시에 의존 대상 객체가 반드시 존재해야 한다.
- 구현 시점 : 의존 대상 객체가 변경될 경우 의존하는 객체도 함께 변경된다.

<br>

> 의존성

- **의존하고 있는 대상의 변경에 영향을 받을 수 있는 가능성**
- 의존성은 방향성을 가지며 항상 **단방향**이다.
- 어떤 객체가 예정된 작업을 정상적으로 수행하기 위해 다른 객체를 필요로 하는 경우<br>두객체 사이에 의존성이 존재한다 라고 한다.

<br>

> 두 요소 사이의 의존성이 나타내는 의미

- 의존되는 요소가 변경될 때 의존하는 요소도 함께 변경될 수 있음을 의미한다.
- 따라서 의존성은 변경에 의한 영향의 전파 가능성을 암시한다. 

<br>

#### {% include i.html %} 1-2. 의존성 전이

> 의존성 전이

- A → B → C : C가 변경되면, A까지 변경될 수 있음.
- 하지만 모든 경우에 의존성이 전이 되는것은 아니다.
- 전이될지 여부는 `변경의 뱡향` & `캡슐화의 정도`에 따라 달라진다.
- 즉, 의존성 전이는 변경에 의해 영향이 널리 전파될 수 있다는 경고 정도.

<br>

> 직접 의존성과 간접 의존성

- 직접 의존성 : 한 요소가 다른 요소에 직접 의존하는 경우
- 간접 의존성 : 직접적인 관계는 없지만, 의존성 전이에 의해 영향이 전파되는 경우

<br>

#### {% include i.html %} 1-3. 런타임 의존성과 컴파일타임 의존성

> 런타임 의존성

- 객체 사이의 의존성
- 협력할 객체가 어떤 것인지는 런타임에 알아야 한다.
- `Movie ↔ PercentDiscountPolicy` / `Movie ↔ AmountDiscountPolicy`  

<br>

> 컴파일타임 의존성

- 클래스 사이의 의존성
- `Movie ↔ DiscountPolicy`

<br>

#### {% include i.html %} 1-4. 컨텍스트의 독립성

> 컨텍스트 독립성이란?

- 클래스가 사용될 특정한 문맥(context)에 대햇 최소한의 가정만으로 이뤄져 있는 것.
- 구체 클래스에 대한 의존한다는 뜻은?
  - 클래스의 인스턴스가 어떤 문맥에서 사용될 것인지를 구체적으로 명시하는 것과 같다.
- 설계가 유연해지기 위해서는
  - 가능한 한 자신이 실행될 컨텍스트에 대한 구체적인 정보를 최대한 적게 알아야 한다.

<br>

#### {% include i.html %} 1-5. 의존성 해결하기

> 의존성 해결이란?

- 컴파일타임 의존성을 실행 컨텍스트에 맞는 적절한 런타임 의존성으로 교체하는 것.
- 의존성을 해결하기 위한 일반적인 세 가지 방법
  1. 객체를 생성하는 시점에 생성자를 통해 의존성을 해결
  2. 객체 생성 후 setter 메서드를 통해 의존성 해결
  3. 메서드 실행 시 인자를 이용해 의존성 해결

<br>
<br>

### ❐ 2. 유연한 설계

---

#### {% include i.html %} 2-1. 의존성과 결합도 

> Movie 코드의 문제점

```java
public class Movie {
    private PercentDiscountPolicy percentDiscountPolicy;

    public Movie(String title, Duration runningTime, Money fee,
                 PercentDiscountPolicy percentDiscountPolicy) {
        this.percentDiscountPolicy = percentDiscountPolicy;
    }

    public Money calculateMovieFee(Screening screening) {
        return fee.minus(percentDiscountPolicy.calculateDiscountAmount(screening));
    }
}
```
- 의존성의 경직성: Movie는 구체적인 PercentDiscountPolicy 클래스에 직접 의존하고 있다.
- 다른 할인 정책(AmountDiscountPolicy 등)을 사용하려면 Movie의 코드를 수정해야 한다.

<br>

> 해결책: 추상화를 통한 의존성 역전

- 추상 클래스 또는 인터페이스 도입
  ```java
  public abstract class DiscountPolicy {
      public abstract Money calculateDiscountAmount(Screening screening);
  }
    
    // 또는 인터페이스
  public interface DiscountPolicy {
      Money calculateDiscountAmount(Screening screening);
  }
  ```
  ```java
  public class Movie {
      private DiscountPolicy discountPolicy;  // 추상화에 의존

      public Movie(String title, Duration runningTime, Money fee, DiscountPolicy discountPolicy) {
          this.discountPolicy = discountPolicy;
      }
    
      public Money calculateMovieFee(Screening screening) {
          return fee.minus(discountPolicy.calculateDiscountAmount(screening));
      }
  }
  ```

<br>

> 개선의 핵심

- 구체적 클래스 대신 추상화에 의존
- 구현의 유연성: DiscountPolicy 인터페이스를 구현한 모든 클래스를 사용할 수 있다.
- 변경에 대한 폐쇄성: Movie 코드를 수정할 필요가 없다.

<br>

> 의존성 결합도 분석

- 직접 의존성(direct dependency)
  - 한 클래스가 다른 클래스를 직접 참조
  - 예: `private PercentDiscountPolicy policy;`
- 간접 의존성(indirect dependency)
  - 의존하는 클래스가 의존하는 다른 의존성
  - 예: Movie → PercentDiscountPolicy → PercentDiscountPolicy : Movie는 PercentDiscountPolicy에 간접 의존

<br>

> 의존성과 결합도
 
- 대부분 동의어로 사용하지만 사실 두 용어는 서로 다른 관점에서 관계의 특성을 설명하는 용어다.
- 의존성 : 두 요소 사이의 **관계 유무**를 설명한다.
- 결합도 : 두 요소 사이에 존재하는 **의존성의 정도**를 상대적으로 표현한다.

<br>

#### {% include i.html %} 2-2. 지식이 결합을 낳는다.

> 결합도의 정도

- 한 요소가 자신의 의존라고 있는 다른 요소에 대해 알고 있는 정보의 양으로 결정
- 적게 알고 있을수록 더 많은 컨텍스트에서 재사용할 수 있다.

<br>

#### {% include i.html %} 2-3. 추상화에 의존하라.

> 추상화를 사용하면...

- 대상에 대해 알아야 하는 지식의 양을 줄일 수 있기 때문에 결합도를 느슨하게 유지할 수 있다.

<br>

> 결합도가 느슨한 순서

1. 인터페이스 의존성 : 협력하는 객체에 어떤 메시지를 수신할 수 있는지에 대한 지식만 남긴다.
2. 추상 클래스 의존성
3. 구체 클래스 의존성

<br>

> 여기서 기억해야 할 것은

- 실행 컨텍스트에 대해 알아야 하는 **정보를 줄일수록 결합도가 낮아진다**는 것. 
 
<br>

#### {% include i.html %} 2-4. 명시적인 의존성

> 명시적 의존성 (Explicit Dependency)

- 문제점 :
  - Movie 인스턴스 변수의 타입이 주상 클래스인 DiscountPolicy로 선언되어 있지만
  - 생성자에서 구체 클래스인 AmountDiscountPolicy를 직접 인스턴스화 
  - 이로 인해 DiscountPolicy뿐만 아니라 AmountDiscountPolicy에도 의존

<br>

> 숨겨진 의존성 (Hidden Dependency)

- 문제점 :
  - Movie의 생성자 매개변수를 보면 DiscountPolicy 관련 정보가 없음 
  - 실제로는 AmountDiscountPolicy에 강하게 의존하고 있으나 이것이 숨겨져 있음 
  - 셍상지, setter 메서드, 메서드 인자를 통해 의존성을 해결하는 방법들 제시

<br>

> 명시적 의존성이 왜 필요한가

- 생성자의 매개변수로 DiscountPolicy를 받아 의존성을 명시적으로 표현 
- Movie가 어떤 DiscountPolicy 구현체에 의존하는지 코드 상에서 명확하게 드러남 
- 이를 통해 결합도를 낮추고 유연성을 높임

<br>

> 결론

- 의존성은 코드에서 명시적으로 드러내야 하며, 숨겨진 의존성은 유지보수를 어렵게 만든다.

