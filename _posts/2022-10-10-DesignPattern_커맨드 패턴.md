---
layout: post
title: 커멘드 패턴
categories: book
tag: designPattern
---

## <span style="color:gray">커멘드 패턴</span>

> 헤드퍼스트 디자인패턴 - 커멘드 패턴 내용 정리.

---

#### <span style="background-color:black; color:white">호출 캡슐화하기</span>

> 캡슐화를 더 높은 수준으로 끌어올려보자!

메소드 호출을 캡슐화하면 계산 과정의 각 부분을 결정화할 수 있기에 계산하는 코드를

호출한 객체는 그 일이 어떤 식으로 처리되는지 전혀 신경 쓸 필요가 없다. 그냥 

결정화된 메소드를 호출해서 필요한 일만 잘 할 수 있으면 된다. 그 외에도 캡슐화된

메소드 호출을 로그 기록용으로 저장한다거나 재상용해서 최소 기능을 구현하는 일과 같이

스마트한 일도 할 수 있다.

<br>

#### <span style="background-color:black; color:white">커멘드 패턴 이해하기</span>

음식 주문과정을 예시로 커멘드 패턴에 대해 이해를 해보자!

<br>

**<u>1. 고객은 원하는 것을 주문한다.</u>**
 
이 때 주문서는 주문 내용을 요구하는 객체라고 볼 수 있다. 그리고 이 주문서는 어디든

전달이 될 수 있다. 주문서 객체는 식사 준비에 필요한 행동을 캡슐화한 `orderUp()`

메소드가 들어있다. 그리고 그 식사를 준비해야 하는 주방장의 정보도 들어있다.

이렇게 **행동**과 **주방장 정보**가 캡슐화 되어 있기 때문에 주문을 받는 종업원은

**<span style="background-color:#98FB98">손님이 어떤 메뉴를 주문했는지, 누가 요리를 할지에 대해서 전혀 몰라도 된다.</span>**

그냥 이 주문서를 적당한 곳에 전달해주고 "주문 들어왔어요~" 라고만 외치면 된다.

<br>

**<u>2. 종업원은 주문 처리를 준비하는 orderUp( ) 메소드를 호출한다.</u>**

종업원은 주문을 받고, 카운터로 가서 `orderUp()` 메소드를 호출해서 식사 준비를

요청만 하면된다. 

종업원의 `takeOrder()` 메소드에는 여러 고객의 주문서를 매개변수로 전달한다.

주문이 많아도 괜찮다. 왜냐면 종업원은 `orderUp()` 메소드만 호출하면 되기 때문이다.

<br>

**<u>3. 주방장은 식사를 준비하는 데 필요한 정보를 받는다.</u>**

실제로 요리를 하는 방법은 주방장만 알고 있다. 종업원이 orderUp() 메소드를 

호출하면 주방장이 그 주문을 받아서 음식을 만들때 필요한 메소드를 전부 처리한다.

**<span style="background-color:#98FB98">여기서 주방장과 종업원은 완전히 분리되어 있다.</span>**

<br>

#### <span style="background-color:black; color:white">커멘드 패턴 제대로 알기</span>

이제 위의 예시를 베이스로 제대로 알아보자!

|음식점 예시|커맨드 패턴|
|-----------|-----------|
|종업원|인보커 객체|
|주방장|리시버 객체|
|`orderUp()`|`execute()`|
|주문서|커맨드 객체|
|고객|클라이언트|
|`takeOrder()`|`setCommand()`|


<br>

**<u>createCommandObject</u>**

클라이언트는 커멘드 객체를 생성해야 한다. 

커맨드 객체는 리시버에 전달할 일련의 행동으로 구성된다. 

<br>

**<u>setCommand</u>**

클라이언트는 인보커 객체의 `setCommand()` 메소드를 호출하는데, 이때 커멘드 객체를

넘겨준다. 그 커멘드 객체는 나중에 쓰이기 전까지 인보커 객체에 보관된다.

<br>

**<u>execute</u>**

커멘드 객체에서 제공하는 메소드는 `execute()` 단 하나 뿐이다.

이 메소드는 행동을 캡슐화하여, 리시버에 있는 특정 행동을 처리한다.

인보커에서 커멘드 객체의 `execute()`를 호출하면 리시버에 있는 해동 메소드가

호출된다.

<br>

#### <span style="background-color:black; color:white">코드로 알아보기</span>

이번에는 리모컨을 팩토리 패턴을 통해서 구현해보자!

<br>

**<u>1. 커멘드 인터페이스 구현</u>**

```java
public interface Command {
    public void execute();
}
```

<br>

**<u>2. 조명을 켤 때 필요한 커멘드 클래스 구현</u>**

우선 커멘드 클래스를 만들기 위해서는 커멘트 인터페이스를 구현해야 한다.

그리고 다시 한 번 기억을 짚어보자. 

**<span style="background-color:#98FB98">커멘드 객체는 행동과 리시버의 정보를 캡슐화한 객체라고 했다.</span>**

▷ Light.class
```java
public class Light {
    public Light() {};

    public void on() {
        System.out.println("전등 ON");
    }

    public void off() {
        System.out.println("전등 OFF");
    }
}
```

▷ LightOnCommand.class
```java
public class LightOnCommand implements Command {

    // 리시버를 받을 필드 정의
    Light light;

    public LightOnCommand(Light light) {
        this.light = light;
    }

    public void execute() {
        light.on();
    }
}
```

코드를 자세히 살펴보자.

생성자에는 이 커멘드 객체로 제어할 특정 조명의 정보(light)가 전달된다.

```java
public LightOnCommand(Light light) {
    this.light = light;
}
```

<br>

그리고 `execute()` 메소드는 리시버 객체(light)에 있는 `on()` 메소드를 호출한다.

```java
public void execute() {
    light.on();
}
```

<br>

**<u>3. 리모컨 클래스</u>**

이번에 구현할 클래스는 Invoker 객체이다. 클라이언트 객체는 `setCommand()` 메소드를 사용하여 

Invoker 객체에 커맨드 객체의 정보를 보관한다. 


```java
public class SimpleRemoteControl {

    Command command;

    public void setCommand(Command command) {
        this.command = command;
    }

    public void buttonWasPressed() {
        command.execute();
    }
}
```

코드를 자세히 살펴보자.

우선 커멘드 객체의 정보를 보관하기 위해서 필드를 정의해주었다.

```java
Command command;
```

<br>

그리고 Invoke 객체(SimpleRemoteControl)에 커멘드 객체를 저장해준다.

```java
public void setCommand(Command command) {
    this.command = command;
}
```

<br>

마지막으로 리모컨의 버튼을 누르면 아래의 메소드가 호출된다.

```java
public void buttonWasPressed() {
    command.execute();
}
```

<br>

**<u>4. 테스트 해보기</u>**

책에 있는 예시 말고도 `off()` 메소드를 쓸수 있는 커맨드 객체를 만들었다.

```java
public class SimpleRemoteControlTest {

    public static void main(String[] args) {

        // Invoker => 커멘드 객체 보관
        SimpleRemoteControl remote = new SimpleRemoteControl();

        // Receiver => 일련의 작업을 처리할 객체
        Light light = new Light();

        // Command Object => 리시버 정보 && 행동 보관
        Command lightOnCommand = new LightOnCommand(light);
        Command lightOffCommand = new LightOffCommand(light);

        // Invoker에 커멘드 객체 보관
        remote.setCommand(lightOnCommand);

        // Invoker 행동 개시
        remote.buttonWasPressed();

        remote.setCommand(lightOffCommand);
        remote.buttonWasPressed();
    }
}

/**
 * 출력 결과
 * =========
 * 전등 ON
 * 전등 OFF
 * =========
 */
```

위 코드를 보면 하나의 Invoker 객체를 가지고 `불 끄기`, `불 켜기` 행동을 모두

수행할 수 있다. Invoker 객체는 매개변수로 커멘드 객체를 전달 받기 때문에 

매개변수를 전달 받기 전까지는 Invoker 객체가 어떤 행동을 할지 전혀 알수 없다.


<br>

#### <span style="background-color:black; color:white">커멘드 패턴의 정의</span>

**커멘드 패턴**을 사용하면 요청 내역을 객체로 캡슐화해서 객체를 서로 다른 요청 내역에 

따라 **<span style="color:#FF7F50">매개변수화</span>** 할 수 있다. 이러면 요청을 큐에 저장하거나 로그로 기록하거나 작업 취소 

기능을 사용할 수 있다.

<br>

커멘드 객체는 일련의 행동을 특정 리시버와 연결함으로써 요청을 캡슐화한 것이다.

이러러면 행동과 리시버를 한 객체에 넣고, `execute()`라는 메소드 하나만 외부에

공개하는 방법을 써야한다. 이 메소드 호출에 따라 리시버에서 일련의 작업을 처리한다.

밖에서 볼 때는 어떤 객체가 리시버 역할을 하는지, 그 리시버가 어떤 일을 하는지 알 수

없다. 그냥 `execute()` 메소드를 호출하면 해당 요청이 처리된다는 사실만 알 수 있다.

<br>

#### <span style="background-color:black; color:white">커멘드 패턴 핵심 정리</span>

✔︎ 커멘드 패턴을 사용하면 요청하는 객체와 요청을 수행하는 객체를 분리할 수 있다.

<br>

✔︎ 이렇게 분리하는 과정의 중심에는 커맨드 객체가 있으며, 

이 객체가 행동이 들어있는 리시버를 캡슐화한다. 

<br>
 
✔︎ 인보커는 무언가 요청할 때 커멘드 객체의 `execute()` 메소드를 호출하면 된다.

`execute()` 메소드는 리시버에 있는 행동을 호출한다.

<br>

✔︎ 인보커에 매개변수를 써서 여러 가지 요구사항을 전달할 수도 있다.

<br>

✔︎ 매크로 커맨드는 커맨드를 확장해서 여러 개의 커맨드를 한 번에 호출할 수 있게 해주는 

가장 간편한 방법이다. 매크로 커맨드로 어렵지 않게 작업 취소 기능을 구현할 수 있다.

<br>

✔︎ 커맨드 패턴을 활용해서 로그 및 트렌잭션 시스템을 구현할 수 있다.