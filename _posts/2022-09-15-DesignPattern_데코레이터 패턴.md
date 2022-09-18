---
layout: post
title: 데코레이터 패턴
categories: book
tag: designPattern
---

## <span style="color:gray">데코레이터 패턴</span>

---

#### 데코레이터 패턴이란?

> OCP를 만족하는 디자인 패턴

데코레이터 패턴으로 객체에 추가 요소를 동적으로 더할 수 있다.

데코레이터를 사용하면 서브클래스를 만들 때보다 훨씬 유연하게 기능을 확장할 수 있다.

<br>

#### 데코레이터 패턴의 특징

• 데코레이터의 슈퍼클래스는 자신이 장식하고 있는 객체의 슈퍼클래스와 같다.

• 한 객체를 여러 개의 데코레이터로 감쌀 수 있다.

• 데코레이터는 자신이 감싸고 있는 객체와 같은 슈퍼클래스를 가지고 있기에

원래 객체가 들어갈 자리에 데코레이터 객체를 넣어도 상관없다.

• 데코레이터는 자신이 장식하고 있는 객체에게 어떤 행동을 위임하는 일 말고도

추가작업을 수행할 수 있다.

• 객체는 언제든지 감쌀 수 있으므로 실행 중에 필요한 데코레이터를 마음대로

적용할 수 있다.

• 구성 요소의 클라이언트는 데코레이터의 존재를 알 수 없다.

> 단, 클라이언트가 구성 요소의 구체적인 형식에 의존하는 경우는 예외

<br>

#### 데코레이터 패턴의 단점

⒈ 개발을 하다 보면 자잘한 클래스가 많이 추가된다.

⒉ 특정 형식에 의존하는 코드에 데코레이터를 적용하면 설계가 엉망이된다.

⒊ 구성 요소를 초기화하는 데 필요한 코드가 복잡해진다.

<br>

## <span style="color:gray">적용 예시</span>

---

#### 구상도

<img src="/assets/img/designPattern/decoratorPattern.jpg">

<br>

#### Beverage.java

```java
public abstract class Beaverage {
    String description = "제목없음";

    public String getDescription() {
        return this.description;
    }

    public abstract double cost();
}
```

Beaverage는 추상클래스이며 `getDescription()`과 `cost()`라는 2개의 메소드를 갖는다.

<br>

#### CondimentDecorator.java

```java
public abstract class CondimentDecorator extends Beverage {
    
    /**
     * 각 데코레이터가 감쌀 음료를 나타내는 Beverage 객체를 여기에 지정한다.
     * 음료를 지정할 때는 데코레이터에서 어떤 음료든 감쌀 수 있도록
     * 슈퍼클래스 유형을 사용한다.
     */
    Beverage beverage;

    public abstract String getDescription();
}
``` 

• 각 데코레이터 안에는 Component객체(Beverage)가 들어있어야 한다.

• 즉, 데코레이터에는 구성 요소의 레퍼런스를 포함한 인스턴스 변수가 있다.

***• <span style="background-color:yellow">Decorator는 자신이 장식할 구성요소와 같은 인터페이스 또는 추상클래스를 구현한다.</span>***

> Beverage를 상속받았다.

<br>

#### Espresso.java

```java
public class Espresso extends Beverage {

    public Espresso(Beverage beverage) {
        description = "에스프레소";
    }

    public double cost() {
        return 1.99;
    }
}
```

• Beverage 클래스를 확장한다.

• 클래스 생성자 부분에서 description 변수값을 설정한다.

> description이라는 인스턴스 변수는 Beverage로 부터 상속받았다.

<br>

#### Mocha.java

```java
public class Mocha extends CondimentDecorator {

    public Moha(Beverage beverage) {
        this.beverage = beverage;
    }

    public String getDescription() {
        return beverage.getDescription + ", 모카";
    }

    public double cost() {
        return beverage.cost() + .20;
    }
}
```

<br>

#### CoffeSimulator.java

```java
public class CoffeSimulator {

    public static void main(String[] args) {

        Beverage beverage1 = new Espresso();
        System.out.println(beverage1.getDescription() + " $" + beverage1.cost()); 
        
        Beverage beverage2 = new Mocha(beverage1);
        System.out.println(beverage2.getDescription() + " $" + beverage2.cost());

        Beverage beverage3 = new Mocha(beverage2);
        System.out.println(beverage3.getDescription() + " $" + beverage3.cost());
    }
}
```

|출력 결과|
|---------|
|에스프레소 $1.99|
|에스프레소, 모카 $2.01|
|에스프레소, 모카, 모카 $2.03|

<br>

## <span style="color:gray">언제 적용하는게 좋을까?</span>

---

상속만을 사용하여 클래스를 만들게 되면 클래스가 어마어마하게 많아지거나 일부

클래스는 필요없는 메서드를 상속받게 된다. 이런 경우에는 데코레이터 패턴을 

적용하는게 좋을듯 싶다. 이렇게 데코레이터 패턴을 사용하게 된다면, 개발자는

기존 코드의 수정없이 행동을 확장할 수 있다. 

<br>

정리하자면, 아래와 같은 경우에 사용하면 될 것 같다.

⒈ 클래스의 요소들을 계속해서 수정을 하면서 사용하는 구조가 필요한 경우

⒉ 여러 요소들을 조합해서 사용하는 클래스 구조인 경우

