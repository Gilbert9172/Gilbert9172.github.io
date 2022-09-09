---
layout: post
title: 디자인패턴 소개와 전략패턴
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

## <span style="color:gray">전략 패턴(Strategy pattern)</span>

---

#### 전략 패턴이란?

전략패턴은 알고리즘군을 정의하고 캡슐화해서 각각의 알고리즘군을 수정해서 쓸 수 있게  해준다. 

전략패턴을 사용하면 클라이언트로부터 알고리즘을 분리해서 ***<span style="background-color:yellow">독립적으로 변경할 수 있다.</span>***


<br>

#### Duck Class

전략패턴을 사용하여 아래의 예제들을 풀어보기로 했다.

Duck 클래스는 아래와 같은 메서드를 가지고 있다.

|Duck|
|----|
|quack()|
|swim()|
|display()|

<br>

#### 🚨 요구사항 1 

>오리들이 날아다닐 수 있도록 해야한다.

만약 Duck 클래스에 `fly()` 메서드를 추가하고 Duck 클래스를 상속받게 끔 하면

요구사항을 만족시킬수 있을까? 이렇게 되면 날아다니면 안되는 장난감오리가 날아다니는 

경우가 생길 수 있다. 추가적으로 Duck의 행동을 상속을 받으면 생길 단점을 알아보았다.

• 서브클래스에서 코드가 중복된다.

• 모든 오리의 행동을 알기 힘들다.

• 실행 시에 특징을 바꾸기 힘들다.

• 코드를 변경했을 때 다른 오리들에게 원치 않은 영향을 끼칠 수 있다.

<br>

#### 인터페이스 설계하기

앞에서 봤듯 상속이 항상 올바른 해결책이 아니다. 그렇다면 위 요구사항을 만족시키기 위해서는 

어떻게 하면 좋을까? `fly()` 메서드를 Duck 슈퍼클래스에서 빼고 `fly()` 메서드가 들어있는 

FlyBehavior ***<span style="background-color:yellow">인터페이스</span>*** 를 만들면 된다. 

```java
public interface FlyBehavior {
    void fly();   
}
```

위와 같이 인터페이스를 만들고 구체적인 행동을 구현하는 클래스들을 만들면 된다.

```java
public class FlyWithWings implements FlyBehavior {
    
    @Override
    public void fly() {
        // 날개를 빠르게 저으면 난다.
    }
}
```

<br>

#### Duck 클래스 통합하기

우리는 지금까지 변화되는 부분과 변화되지 않는 부분을 나눠서 개발을 진행했다.

이제 Duck 클래스에 통합만 하면된다. 근데 여기서 중요한 부분이 하나 있다.

오리의 나는 행동을 Duck 클래스(혹은 서브클래스)에서 정의한 메소드를 써서 구현하지

않고 ***<span style="background-color:yellow">다른 클래스에 위임하는 것이다.</span>*** 말보단 코드로 이해하는게 빠르다.

```java
public abstract class Duck {

    FlyBehavior flyBehavior;
    QuackBehavior quackBehavior;

    public duck() {};

    public abstract void display();

    // 행동 클래스에 위임
    public void performFly() {
        flyBehavior.fly();
    }

    // 행동 클래스에 위임
    public void performQuack() {
        quackBehavior.quack();
    }

    public void swim() {
        System.out.println("모든 오리는 뜬다.")
    }
}
```

```java
public class MallardDuck extends Duck {

    public MallardDuck() {
        quackBehavior = new Quack();
        flyBehavior = new FlyWithWings();
    }

    public void display() {
        System.out.println("I'm a real Mallard duck");
    }
}
```
```java
public class DuckSimulator {

    public static void main(String[] args) {
        Duck mallardDuck = new MallardDuck();

        /*
         * 여기서 fly() 와 quack()은 duck 클래스가 아닌
         * new Quack() 그리고 new FlyWithWings()에 구현된 메소드이다.
         */
        mallardDuck.performFly();
        mallardDuck.performQuack();
    }
}
```