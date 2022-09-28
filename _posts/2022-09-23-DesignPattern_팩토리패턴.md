---
layout: post
title: 팩토리 패턴
categories: book
tag: designPattern
---

## <span style="color:gray">변화</span>

---

#### <span style="background-color:black; color:white">new 연산자</span>

> new연산자가 눈에 띈다면 '구상'을 떠올리자.

`new`를 사용하면 구상 클래스의 인스턴스가 만들어진다. 당연히 이 방법은 인터페이스가 아닌

특정 구현을 사용하는 것이다. 그런데 구상클래스 바탕으로 코딩을 하면 유연성이 떨어진다고 

했다. 그렇다면 new를 사용하지 않는게 맞지 않을까? 라는 생각은 했지만, 

자바에서 new는 절대 안쓸수 없는 존재이다. 

<br>

그렇다면 new에는 어떤 문제가 있는걸까? 사실 new는 문제가 없다. 

진짜로 문제가 되는 부분은 바로 **<span style="color:red">변화</span>** 이다. 첫 번째 디자인 원칙을 떠올려보자. 

바로 변화하는 부분과 변화하지 않는 부분을 분리하는 것이다. 

오늘은 위 개념들을 바탕으로 팩토리패턴을 알아보았다.

<br>

## <span style="color:gray">팩토리 패턴 예제</span>

> 팩토리 패턴으로 불필요한 의존성을 없애서 결합 문제를 해결하는 방법을 알아보자.

---

책에서 나온 피자만들기 코드로 학습을 진행했다. 코드가 고도화? 되가는 과정을 나타냈다.


#### <span style="background-color:black; color:white">PizzaStore 클래스</span>

```java
// STEP 1 
public class PizzaStore {
    Pizza orderPizza() {
        Pizza pizza = new Pizza();

        pizza.prepare();
        pizza.bake();
        pizza.cut();
        pizza.box();

        return pizza;
    }
}

/** STEP 2 
 * 피자가 하나만 있는 것이 아니다. 여러 종류의 피자를 추가해야 한다.
 */
public class PizzaStore {
    Pizza orderPizza(String type) {
        Pizza pizza = null;

        // 여러 종류의 피자
        if (type.equals("cheese")) {
            pizza = new CheesePizza();
        } else if (type.equals("pepperoni")) {
            pizza = new PepperoniPizza();
        } else if (type.equals("clam")) {
            pizza = new ClamPizza();
        } else if (type.equals("veggie")) {
            pizza = new VeggiePizza();
        }

        pizza.prepare();
        pizza.bake();
        pizza.cut();
        pizza.box();

        return pizza;
    }
}
```

위 코드들의 문제 점은 무엇일까? 

우선 STEP1 코드를 보면 해당 코드는 한 가지 종류의 피자만 만들수 있다. 

그래서 STEP2 코드에서 다양한 종류의 피자를 만들수 있게 코드를 추가해주었다.

하지만 새로운 종류의 피자가 추가되다면, 코드를 수정해야 하는 일이 발생한다.

**<span style="color:red">수정을 해야한다? 결국 변경에 닫혀있지 않은 코드라는 의미이다 (OCP를 위배하게 된다.)</span>**

`orderPizza(String type)`에서 가장 문제가 되는 부분은 인스턴스를 만드는 

구상 클래스(피자의 종류)를 선택하는 부분이다.

<br>

그럼 이제 변경되는 부분과 변경되지 않는 부분을 구분하고 캡슐화 해보자.

```java
public class PizzaStore {
    Pizza orderPizza(String type) {
        Pizza pizza = null;

        /** 변경되는 부분
        if (type.equals("cheese")) {
            pizza = new CheesePizza();
        } else if (type.equals("pepperoni")) {
            pizza = new PepperoniPizza();
        } else if (type.equals("clam")) {
            pizza = new ClamPizza();
        } else if (type.equals("veggie")) {
            pizza = new VeggiePizza();
        }
        */

        /** 변경되지 않는 부분
        pizza.prepare();
        pizza.bake();
        pizza.cut();
        pizza.box();
        */

        return pizza;
    }
}
```

<br>

#### <span style="background-color:black; color:white">객체 생성 부분 캡슐화하기</span>

객체 생성을 처리하는 클래스를 **<span style="color:gray"><u>팩토리</u></span>** 라고 부른다.

그렇다면 이번엔 객체 생성만을 담당하는 `SimplePizzaFactory`를 작성해보겠다.

```java
public class SimplePizzaFactory {

    public SimplePizzaFactory() {};

    public Pizza createPizza(String type) {
        Pizza pizza = null;

        if (type.equals("cheese")) {
            pizza = new CheesePizza();
        } else if (type.equals("pepperoni")) {
            pizza = new PepperoniPizza();
        } else if (type.equals("clam")) {
            pizza = new ClamPizza();
        } else if (type.equals("veggie")) {
            pizza = new VeggiePizza();
        }
        return pizza;
    }
}
```

여기서 한 가지 QnA가 생길 수 있다.

**Q1 )**

근데 이렇게 하면 결국 문제를 다른 객체로 돌려막는 것이 아닌가요?

<br>

**A1 )**

SimplePizzaFactory를 사용하는 클라이언트가 매우 많을 수도 있다. 

현재 PizzaStore에는 `orderPizza()` 메소드만 있지만, 피자 객체를 받아서 피자를 설명하거나

가격을 알려주는 PizzaShopMenu 클래스와 PizzaStore 클래스와는 조금 다른 방식으로

피자 주문을 처리하는 HomeDelivery 클래스에도 이 팩토리를 사용할 수 있다.

이런 상황에서 피자 객체 생성 작업을 팩토리 클래스로 캡슐화해 놓으면 구현을 변경할 때 

여기저기 고칠 필요 없이 팩토리 클래스 하나만 고치면 된다.

<br>

#### <span style="background-color:black; color:white">PizzaStore 클래스 업그레이드</span>

```java
public class PizzaStore {

    SimplePizzaFactory factory;

    public PizzaStore(SimplePizzaFactory factory) {
        this.factory = factory;
    }

    public Pizza orderPizza(String type) {
        Pizza pizza = factory.createPizza(type);

        pizza.prepare();
        pizza.bake();
        pizza.cut();
        pizza.box();

        return pizza;
    }
}
```

<br>

#### <span style="background-color:black; color:white">PizzaStore 확장</span>

미국은 지역마다 각각의 피자 스타일이 다르다고 한다. 그러나 지금까지 작성한

PizzaStore는 하나의 지역의 피자 스타일만 표현할 수 있다. 이제 이 부분을 

요청 사항에 맞게 고도화 해보자.

```java
public abstract class PizzaStore {

    abstract Pizza createPizza(String type);

    public Pizza orderPizza(String type) {
		Pizza pizza = createPizza(type);
		System.out.println("--- Making a " + pizza.getName() + " ---");
		pizza.prepare();
		pizza.bake();
		pizza.cut();
		pizza.box();
		return pizza;
	}
}
```

`orderPizza()` 메서드는 이미 시스템이 잘 갖춰져있다. 각 지점에서 달라질수 있는 것은

피자 스타일 뿐이다. 따라서 `createPizza()` 라는 추상메서드를 작성하고, PizzaStore의 

서브클래스에서 해당 메서드를 구체적으로 작성하면 된다. 

즉, 피자의 종류는 **<span style="color:red">어떤 서브클래스를 선택했느냐</span>** 에 따라 결정된다고 생각할 수 있다.

<br>

그러면 시카고 지점을 만들어 보자!

ChicagoPizzaStore 클래스는 PizzaStore 클래스의 구상 클래스이므로, PizzaStore를 상속받고

추상메서드인 `createPizza()`를 구현해주면 된다.

```java
public class ChicagoPizzaStore extends PizzaStore {

    public ChicagoPizzaStore() {};

    @Override
    public Pizza orderPizza(String type) {
        return super.orderPizza(type);
    }

    public Pizza createPizza(String item) {
        if (item.equals("cheese")) {
            return new ChicagoStyleCheesePizza();
        } else if (item.equals("veggie")) {
            return new ChicagoStyleVeggiePizza();
        } else if (item.equals("clam")) {
            return new ChicagoStyleClamPizza();
        } else if (item.equals("pepperoni")) {
            return new ChicagoStylePepperoniPizza();
        } else return null;
    }
}
```

<br>

그렇다면 최종적으로 피자를 주문해보자!!

```java
public class PizzaOrderSystem {

    public static void main(String[] args) {
        PizzaStoreB chicagoStore = new ChicagoPizzaStore();

        PizzaB pizza = nyStore.orderPizza("cheese");
        System.out.println("Gilbert ordered a " + pizza.getName() + "\n");
    }
}

/** 출력결과
 * --- Making a Chicago Style Clam Pizza ---
 * Prepare Chicago Style Clam Pizza
 * Tossing dough...
 * Adding sauce...
 * Adding toppings: 
 *    Shredded Mozzarella Cheese
 *    Frozen Clams from Chesapeake Bay
 * Bake for 25 minutes at 350
 * Cut the pizza into diagonal slices
 * Place pizza in official PizzaStore box
 * Gilbert ordered a Chicago Style Clam Pizza
 */
```

<br>

## <span style="color:gray">팩토리 패턴 정의</span>

---

#### <span style="background-color:black; color:white">팩토리 메서드 패턴 정의</span>

펙토리 메소드 패턴에서는 객체를 생성할 때 필요한 인터페이스를 만든다.

**<span style="background-color:yellow">어떤 클래스의 인스턴스를 만들지는 서브클래스에서 결정한다.</span>**

팩토리 메소드 패턴을 사용하면 클래스 인스턴스 만드는 일을 서브클래스에게 맡기게 된다.

여기에서 **결정한다**라는 표현을 쓰는 이유는 실행 중에 서브클래스에서 어떤 클래스의 

인스턴스를 만들지를 결정해서가 아니라, 생산자 클래스가 실제 생산될 제품을 전혀 모르는 

상태로 만들어지기 때문이다. 사실 더 정확하게 말하면,  **<span style="background-color:yellow">사용하는 서브클래스에 따라</span>**

 **<span style="background-color:yellow">생산되는 객체 인스턴스가 결정된다.</span>**

<br>

#### <span style="background-color:black; color:white">간단한 팩토리 vs 팩토리 메소드 패턴</span>

간단한 팩토리는 일회용 처방에 불과한 반면, 팩토리 메소드 패턴을 사용하면 여러 번 

재상용이 가능하다. 간단한 팩토리는 객체 생성을 캡슐화하는 방법을 사용하긴 하지만 

팩토리 메소드만큼 **<span style="color:red">유연하지는 않다.</span>**

<br>

#### <span style="background-color:black; color:white">팩토리를 썼을 때 장점</span>

• 객체 생성 코드를 전부 한 객체 또는 메소드에 넣기 때문에 중복되는 코드를 제거할 수 있다.

• 유지/보수 할 때 한 군데만 신경을 쓰면 된다.

• 객체 인스턴스를 만들 때 인터페이스만 있으면 된다.

• 이 방법을 사용하면 인터페이스를 바탕으로 프로그래밍을 할 수 있기 때문에

**<span style="background-color:yellow">유연성과 확장성이 뛰어난 코드를 만들 수 있다.</span>**

<br>

## <span style="color:gray">의존성 뒤집기 원칙</span>

---

#### <span style="background-color:black; color:white">앞에서 했던 내용을 복귀</span>

아래의 코드는 `Pizza 구상(Concrete) 클래스`가 바뀌게 되면 PizzaStore까지도 바뀌게 되는

치명적인 단점을 가지고 있다.

```java
public class PizzaStore {
    Pizza orderPizza(String type) {
        Pizza pizza = null;

        // 여러 종류의 피자
        if (type.equals("cheese")) {
            pizza = new CheesePizza();
        } else if (type.equals("pepperoni")) {
            pizza = new PepperoniPizza();
        } else if (type.equals("clam")) {
            pizza = new ClamPizza();
        } else if (type.equals("veggie")) {
            pizza = new VeggiePizza();
        }

        pizza.prepare();
        pizza.bake();
        pizza.cut();
        pizza.box();

        return pizza;
    }
}
```

반면에 아래의 코드에서 PizzaStore는 추상클래스인 Pizza에 의존하게 된다.

그리고 각각의 Pizza 구성 클래스 또한 추상클래스인 Pizza에 의존하게 된다.

```java
public abstract class PizzaStore {

    abstract Pizza createPizza(String type);

    public Pizza orderPizza(String type) {
		Pizza pizza = createPizza(type);
		return pizza;
	}
}
```

<br>

#### <span style="background-color:black; color:white">의존성 뒤집기 원칙을 지키는 방법</span>

> 원칙을 지키는 데 도움이 될 뿐, 무조건 적으로 지키라는 것은 아님.

**⒈ 변수에 구상 클래스의 레퍼런스를 저장하지 않는다.**

→ new 연산자를 사용하면 구상 클래스의 레퍼런스를 사용하게 된다. 그러니 팩토리를 써서

구상 클래스의 레퍼런스를 변수에 저장하는 일을 미리 방지한다.

<br>

**⒉ 구상 클래스에서 유도된 클래스를 만들지 않는다.**

→ 구상 클래스에서 유도된 클래스를 만들면 특정 구상 클래스에 의존하게 된다.

인터페이스나 추상 클래스처럼 추상화된 것으로부터 클래스를 만들어야 한다.

<br>

**⒊ 베이스 클래스에 이미 구현되어 있는 메소드를 오버라이드하지 않는다.**

→ 이미 구현되어 있는 메소드를 오버라이드한다면 베이스 클래스가 제대로 추상화되지

않는다. 베이스 클래스에서 메소드를 정의할 때는 모든 서브클래스에서 공유할 수 있는

것만 정의해야 한다.

<br>

## <span style="color:gray">추상 팩토리 패턴의 정의</span>

---

#### <span style="background-color:black; color:white">추상 팩토리란?</span>

**추상 팩토리 패턴(Abstract Factory Pattern)** 은 구상 클래스에 의존하지 않고도

서로 연관되거나 의존적인 객체로 이루어진 제품군을 생산하는 인터페이스를 제공한다.

구상 클래스는 서브클래스에서 만든다.

<br>

## <span style="color:gray">팩토리 메소드 패턴 VS 추상 팩토리 패턴</span>

---

#### <span style="background-color:black; color:white">공통점</span>

> 객체 생성을 캡슐화해서 애플리케이션의 결합을 느슨하게 만들고, 특정 구현에 덜 의존하도록 만든다.

• 애플리케이션을 특정 구현으로부터 분리하는 역할

• 클라이언트와 구상형식을 분리하는 역할

• 객체를 만드는 역할

<br>

#### <span style="background-color:black; color:white">차이점</span>

**팩토리 메소드 패턴**

> 클라이언트 코드와 인스턴스를 만들어야 할 구상 클래스를 분리시켜야 할 때 사용한다.


상속으로 객체를 만든다. 

팩토리 메소드 패턴으로 객체를 생성할 때는 **<u>클래스를 확장</u>** 하고, **<u>팩토리 메소드를 오버라이드</u>** 해야 한다.


```java
// 클래스를 확장 : extends
public class ChicagoPizzaStore extends PizzaStoreB {

    // 팩토리 메소드를 오버라이드
    public PizzaB createPizza(String item) {
        ...
    }
}
```

<br>

**추상 팩토리 패턴**

> 클라이언트에서 서로 연관된 일련의 제품을 만들어야 할 때 사용한다.

객체 구성을 사용하며, 제품군을 만드는 추상형식을 제공한다.

```java
public interface PizzaIngredientFactory {

    public Dough createDough();
    public Sauce createSauce();
    public Cheese createCheese();
    ...
}
```

제품이 생산되는 방법은 위 형식의 서브클래스에서 정의한다.

```java
public class NYPizzaIngredientFactory implements PizzaIngredientFactory {

    public Dough createDough() {
        return new ThinCrustDough();
    }

    public Sauce createSauce() {
        return new MarinaraSauce();
    }

   ...
}
```
제품군을 추가해야 할 때는 인터페이스를 수정해야 한다는 함정이 있다.

구상 팩토리를 구현할 때 팩토리 메소드로 제품을 생산할 때가 종종 있다.

반면에 팩토리 메소드 패턴은 서브클래스에서 만드는 구상 형식을 활용하는 

추상 생산자(생성자 아님)에서 코드를 구현하다. (아래의 코드)

```java
public class ChicagoPizzaStore extends PizzaStoreB {

    public ChicagoPizzaStore() {};

    @Override
    public PizzaB orderPizza(String type) {
        return super.orderPizza(type);
    }

    public PizzaB createPizza(String item) {
        if (item.equals("cheese")) {
            return new ChicagoStyleCheesePizza();
        } else if (item.equals("veggie")) {
            return new ChicagoStyleVeggiePizza();
        } else if (item.equals("clam")) {
            return new ChicagoStyleClamPizza();
        } else if (item.equals("pepperoni")) {
            return new ChicagoStylePepperoniPizza();
        } else return null;
    }
}
```
