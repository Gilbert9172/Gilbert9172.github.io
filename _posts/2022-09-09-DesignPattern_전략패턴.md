---
layout: post
title: 전략패턴
categories: book
tag: designPattern
---

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