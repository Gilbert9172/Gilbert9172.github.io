---
layout: post
title: 디자인패턴 소개
categories: book
tag: designPattern
---

## <span style="color:gray">디자인 패턴</span>

---

#### 디자인패턴이란?

> 라이브러리나 프레임워크가 도와주지 못하는 부분을 도와주는 것.

디자인 패턴은 개발자 사이에서 서로 모두 이해할 수 있는 용어를 제공한다.

일단 용어를 이해하고 나면 다른 개발자와 더 쉽게 대화할 수 있고, 패턴을 아직 잘 모르는

사람들에게는 패턴을 배우고 싶은 생각이 들도록 자극을 줄 수 있다. 또한 자질구레한 

객체수준에서의 생각이 아닌, **<span style="color:#BC8F8F">패턴 수준</span>** 에서 생각할 수 있기에 아키텍처를 생각하는

수준도 끌어 올려준다.

<br>

## <span style="color:gray">디자인 원칙</span>

---

#### 디자인원칙1

***<span style="background-color:yellow">애플리케이션에서 달라지는 부분을 찾아내고, 달라지지 않는 부분과 분리한다.</span>***

달라지는 부분을 찾아서 나머지 코드에 영향을 주지 않도록 **<span style="color:#BC8F8F">캡슐화</span>** 해야 한다.

그러면 코드를 변경하는 과정에서 의도치 않게 발생하는 수정사항을 줄이면서 

시스템의 유연성을 향상시킬 수 있다.

<br>

#### 디자인원칙2

***<span style="background-color:yellow">구현보다는 인터페이스에 맞춰서 프로그래밍한다.</span>***

"인터페이스에서 맞춰서 프로그래밍한다." 라는 말은 "상위 형식에 맞춰서 프로그래밍 한다." 라는

말과 같다. 핵심은 실제 실행 시에 쓰이는 객체가 코드에 **<span style="color:#BC8F8F">고정되지 않도록</span>** 상위 형식(superType)에

맞춰 프로그래밍해서 **<span style="color:#BC8F8F">다형성을 활용</span>** 해야 한다는 점이다.

<br>

#### 디자인원칙3

***<span style="background-color:yellow">상속보다는 구성을 활용한다.</span>***

"A에는 B가 있다" 관계를 생각해 보면, (아래에 있는 예시) 각 오리에는 FlyBehavior와

QuackBehavior가 있으며, 각각 나는 행동과 꽥꽥거리는 행동을 위임받는다. 

이런 식으로 **<span style="color:#BC8F8F	">두 클래스를 합치는 것을 '구성(Composition)을 이용한다.'</span>** 라고 부른다. 

아래 예시에 나와있는 오리 클래스에서는 행동을 상속받는 대신에, 올바른 행동 객체를 구성하여

행동을 부여받는다. 구성은 매우 중요한 테크닉이자 세 번째 디자인 원칙이기도 하다.

<br>

구성을 활용해서 시스템을 만들면 유연성을 크게 향상시킬 수 있다. 단순히 알고리즘군을 별도의

클래스 집합으로 캡슐화할 수 있으며 구성 요소로 사용하는 객체에서 올바른 행동 인터페이스를 

구현하기만하면 실행 시에 행동을 바꿀 수도 있다. 구성을 여러 다지인 패턴에서 쓰인다.

<br>

#### 디자인원칙4

***<span style="background-color:yellow">상호작용하는 객체 사이에는 가능하면 느슨한 결합을 사용해야 한다.</span>***

느슨하게 결합하는 디자인을 사용하면 변경 사항이 생겨도 무난히 처리할 수 있는 유연한 

객체지향 시스템을 구축할 수 있다. 객체 사이의 상호의존성을 최소화 할 수 있기 때문이다.

<br>

#### 디자인원칙5

***<span style="background-color:yellow">클래스는 확장에는 열려있어야 하지만, 변경에는 닫혀있어야 한다.</span>***

OCP(Open-Close-Principle)는 정말 중요한 디자인 패턴 중 하나이다.

코드를 확장해야 할 부분을 선택할 때는 세심한 주의를 기울여야 한다.

무조건 OCP를 적용한다면 괜히 쓸데없는 일을 하며 시간을 낭비할 수 있으며,

필요 이상으로 복잡하고 이해하기 힘든 코드를 만들게 되는 부작용을 발생시킬 수 있다.

<br>

#### 디자인원칙6

> 의존성 뒤집기 원칙(Dependency Inversion Principle

***<span style="background-color:yellow">추상화된 것에 의존하게 만들고, 구상 클래스에 의존하지 않게 만든다.</span>***

이 원칙과 "구현보다는 인터페이스에 맞춰서 프로그래밍한다"라는 원칙이 똑같다는 생각이 

들 수 있다. 물론 비슷하지만 의존성 뒤집기 원칙에선 추상화를 좀 더 많이 강조한다.

이 원칙에는 고수준 구성 요소가 저수준 구서 요소에 의존하면 안 되며, 항상 추상화에 

의존하게 만들어야 한다는 뜻이 담겨 있다.

> 고수준 구성 요소는 다른 '저수준'구성 요소에 의해 정의되는 행동이 들어있는 구성요소를 뜻한다.


