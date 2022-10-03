---
layout: post
title: 싱글톤 패턴
categories: book
tag: designPattern
---

## <span style="color:gray">싱글톤 패턴</span>

> 단순하지만 구현하기는 까다롭다!

---

#### <span style="background-color:black; color:white">싱글톤 패턴이란?</span>

> 정의 : 클래스 인스턴스를 하나만 만들고, 그 인스턴스로의 전역 접근을 제공한다.

싱글톤 패턴이란, 특정 클래스에 객체 인스턴스가 하나만 만들어지도록 해 주는 패턴이다.

싱글톤 패턴을 사용하면, 전역 변수를 사용할 때와 마찬가지로 객체 인스턴스를 어디서든지 

엑세스 할 수 있게 만들 수 있으며, 전역 변수를 쓸 때처럼 여러 단점을 감수할 필요가 없다.

> 연결 풀이나, 스레드 풀과 같은 자원 풀을 관리하는 데 자주 사용된다.

<br>

#### <span style="background-color:black; color:white">고전적인 싱글톤 패턴 구현법</span>

**<u>자바 코드로 구현하기</u>**

싱글톤 패턴은 하나의 객체 인스턴스만 생성해야 하며, 이를 위해서는 생성자를 private로

만들어줘야 한다. 그런데 private로 생성자 메소드를 생성하면 외부에서 해당 인스턴스의

참조변수를 가져올 수 없기 때문에 참조변수를 가져올 수 있는 public 메소드도 하나 필요하다.

```java
public class SingletonExample {
    
    /**
     * SingletonExample클래스의 하나뿐인 인스턴스를 저장하는 정적변수
     */
    private static SingletonExample singletonExample;
    
    /**
     * 생성자를 private로 선언했으므로,
     * SingletonExample에서만 클래스의 인스턴스를 생성할 수 있다. 
     */
    private SingletonExample() {};

    /**
     * getInstance() 메소드는 클래스의 인스턴스를 만들어서 리턴한다.
     */
    public static SingletonExample getInstance() {

        if (singletonExample == null) {
            singletonExample = new SingletonExample();
        }
        return singletonExample;
    }
}
```

위 코드는 싱글톤을 구현한 코드이다. 이번에는 어떻게 인스턴스가 생성되는지 알아보겠다.

```java
if (singletonExample == null) {
    singletonExample = new SingletonExample();
}
return singletonExample;
```

singletonExample가 null이면 아직 인스턴스가 생성되지 않았다는 것을 알 수 있다.

아직 인스턴스가 만들어지지 않았다면 private으로 선언된 생성자를 사용해서 

SingletonExample 객체를 만든 다음 `singletonExample`에 그 객체를 대입한다.

이러면 인스턴스가 필요한 상황이 닥치기 전까지 아예 인스턴스를 생성하지 않게 된다.

이런 방법을 **<span style="background-color:yellow">게으른 인스턴스 생성(lazyinstantiation)</span>** 이라도 한다.

만약 singletonExample가 null이 아니라면 이미 객체가 생성된 것이기 때문에 바로

return문이 실행된다.

<br>

이제 실제로 어떻게 객체가 반환되는지 로그로 확인해보았다.

```java
public class SingletonTest {

    public static void main(String[] args) {
        SingletonExample instance1 = SingletonExample.getInstance();
        SingletonExample instance2 = SingletonExample.getInstance();

        System.out.println("Assertion = " + instance1.equals(instance2));
        //→ Assertion = true
    }
}
```
모두 같은 객체 인스턴스를 반환했다.

<br>

## <span style="color:gray">멀티 스레드 환경에서의 싱글톤</span>

---

#### <span style="background-color:black; color:white">멀티 스레드 환경에서 생기는 문제</span>

```java
public class SingletonExample {
    
    private static SingletonExample singletonExample;
    
    private SingletonExample() {};

    public static SingletonExample getInstance() {

        if (singletonExample == null) {
            singletonExample = new SingletonExample();
        }
        return singletonExample;
    }
}
```

기존에 사용하던 코드는 멀티스레드 환경에서 무슨 문제가 있을까? 

아래의 코드는 멀티스레드 환경에서 기존의 싱글톤 예제 코드를 실행해보는 코드이다.

```java
public class SingletonTest {

    public static void main(String[] args) {

        // 1번 스레드
        Thread thread1 = new Thread(new Runnable() {

            @Override
            public void run() {
                SingletonExample.getInstance();
            }
        });
        thread1.start();

        // 2번 스레드
        Thread thread2 = new Thread(new Runnable() {

            @Override
            public void run() {
                SingletonExample.getInstance();
            }
        });
        thread2.start();
    }
}

/**
 * 출력 결과
 * design.singleton.SingletonExample@737996a0
 * design.singleton.SingletonExample@3d663ccf
 */
```

출력 결과를 보면 `@737996a0`,`@3d663ccf`라는 두 개의 인스턴스가 생성된걸 볼 수 있다.

즉, 멀티스레드 환경에서 기존의 코드는 더 이상 싱글톤 패턴을 유지하지 못한다.

왜 이렇게 나오는지 진행 순서를 표로 그려보았다.

|실행순서|스레드|실행 코드|인스턴스|
|--------|------|---------|--------|
|1|1|getInstance()|null|
|2|2|getInstance()|null|
|3|1|if null|null|
|4|2|if null|null|
|5|1|new SingletonExample()|`@737996a0`|
|6|1|return|`@737996a0`|
|7|2|new SingletonExample()|`@3d663ccf`|
|8|2|return|`@3d663ccf`|

<br>

#### <span style="background-color:black; color:white">멀티스레딩 문제 해결하기</span>

아래에 나오는 방법들을 무조건적으로 적용하기 보단, 

주어진 문제나 상황에서 적절한 해결 방법을 쓰도록 하자. 

<br>

**<u>1 ) Synchronized (동기화, Thread-safe)</u>**

`getInstance()`를 동기화하면 멀티스레딩과 관련된 문제가 간단하게 해결된다.

**<span style="color:#8A2BE2">synchronized</span>** 키워드만 추가하면 한 스레드가 메소드 사용을 끝내기 전까지 다른 스레드는

기다려야 한다. 즉, 2개의 스레드가 이 메소드를 통시에 실행하는 일은 일어나지 않는다.

```java
public class SingletonExample {
    
    private static SingletonExample singletonExample;
    
    private SingletonExample() {};

    public static synchronized SingletonExample getInstance() {

        if (singletonExample == null) {
            singletonExample = new SingletonExample();
        }
        return singletonExample;
    }
}

/**
 * 출력 결과
 * design.singleton.SingletonExample@55033d71
 * design.singleton.SingletonExample@55033d71
 */
```

좀 더 자세히 보면, 동기화가 필요한 시점은 메소드가 시작되는 시점일 뿐이다. 

즉, 이 방법으로 문제가 해결되는 하지만 처음을 제외하면 동기화는 불필요한 오버헤드만 

증가시키게 된다. 이렇게 되면 속도 이슈가 생길 가능성이 있다.

물론 getInstance() 메소드가 애플리케이션 속도에 큰 영향을 주지 않는다면, 크게 문제되지는 

않는다. 다만 여기서 기억해야 될 부분은 메소드를 동기화하면 **<span style="color:red">100배</span>** 정도의 성능 저하가 

발생한다. 

<br>

**<u>2 ) Eager Initialization (이른 초기화, Thread-safe) </u>**

> 클래스 초기화 시점에서 인스턴스 생성.

```java
public class SingletonExample {
    
    private static SingletonExample singletonExample = new SingletonExample();
    
    private SingletonExample() {};

    public static SingletonExample getInstance() {
        return singletonExample; // 항상 인스턴스는 존재하므로 return만 하면 된다.
    }
}

/**
 * 출력 결과
 * design.singleton.SingletonExample@3ad6acaa
 * design.singleton.SingletonExample@3ad6acaa
 */
```

코드를 자세히 살펴보면, 

⒈ 정적 초기화 부분에서 SingletonExample의 인스턴스를 생성한다. (이러면 스레드를 써도 별 문제가 없다.)

```java
private static SingletonExample singletonExample = new SingletonExample();
```

<br>

⒉ 그리고 항상 인스턴스는 존재하므로 return만 하면 된다.

```java
return singletonExample;
```

<br>

**<u>3 ) DCL(Double-Checked Locking, Thread-safe)</u>**

> Synchronized 방식을 개선한 방식 : 인스턴스가 생성되지 않은 경우에만 동기화 블럭이 실행

```java
public class SingletonExample {

    private static volatile SingletonExample singletonExample;

    private SingletonExample() {};

    public static SingletonExample getInstance() {

        if (singletonExample == null) {
            synchronized (SingletonExample.class) {
                if (singletonExample == null) {
                    singletonExample = new SingletonExample();
                }
            }
        }

        System.out.println(singletonExample);
        return singletonExample;
    }
}
/**
 * 출력 결과
 * design.singleton.SingletonExample@3998b269
 * design.singleton.SingletonExample@3998b269
 */
```

코드를 자세히 살펴보면,

⒈ 인스턴스가 있는지 없는지 확인한다. 

```java
if (singletonExample == null) {}
```

<br>

⒉ 1번에서 인스턴스가 없으면 동기화 블록으로 들어온다. (애플리케이션 처음에만 실행된다.)
```java
synchronized (SingletonExample.class) {}
```

<br>

⒊ 블록에서 다시 한 번 변수가 null인지 확인한 다음 인스턴스를 생성한다.
```java
if (singletonExample == null) {
    singletonExample = new SingletonExample();
}
```

<br>

**<span style="background-color:yellow"><u>4 ) LazyHolder (게으른 홀더, Thread-safe)</u></span>**

> 이 부분을 공부하기 이전에 static, 클래스 로드와 초기화에 대해 숙지해야 한다.

• [블로그1](https://kdhyo98.tistory.com/70), [블로그2](https://velog.io/@skyepodium/%ED%81%B4%EB%9E%98%EC%8A%A4%EB%8A%94-%EC%96%B8%EC%A0%9C-%EB%A1%9C%EB%94%A9%EB%90%98%EA%B3%A0-%EC%B4%88%EA%B8%B0%ED%99%94%EB%90%98%EB%8A%94%EA%B0%80)

요약하자면, 클래스는 호출될 때 초기화를 진행한다. 우리는 대부분 new 생성자를 통해서 

클래스를 초기화 하며 이때 static으로 선언된 애들이 올라가게 된다.

하지만, static은 유일한 하나이기 때문에 한 번 올라가면, 새로 해당 클래스를 초기화를 

진행하더라도 먼저 올라간 걸 호출해서 사용된다.

<br>

LazyHolder 방식은 가장 많이 사용되는 싱글턴 구현 방식이다.

volatile 이나 synchronized 키워드 없이도 동시성 문제를 해결하기 때문에 성능이 뛰어나다.

자 이제 본격적으로 LazyHolder 방식으로 싱글턴을 구현해봐야겟다.

```java
public class SingletonExample {
    private singeltonExample() {};

    private static class InnerInstanceClass {
        private static final SingletonExample singletonExample = new SingletonExample();
    }

    public static SingletonExample getInstance() {
        return InnerInstanceClass.singletonExample;
    }
}
```

<br>

```java
public class SingletonTest {

    public static void main(String[] args) {
        Thread thread1 = new Thread(new Runnable() {

            @Override
            public void run() {
                SingletonExample.getInstance();
            }
        });
        thread1.start();

        Thread thread2 = new Thread(new Runnable() {

            @Override
            public void run() {
                SingletonExample.getInstance();
            }
        });
        thread2.start();
    }
}

```

최초에 SingletonTest 클래스를 실행 할 때, `SingletonExample`과 `InnerInstanceClass`는

클래스로더에 의해 로딩이 된다. 그리고 초기화는 각각 `getInstance()` 메소드를 호출할 때 

진행된다. 즉, 런타임시에 성격이 결정되며 Thread-safe하며 성능이 뛰어나다.


<br>

## <span style="color:gray">싱글톤 패턴의 문제점</span>

---

#### <span style="background-color:black; color:white">1. 느슨한 결합 원칙에 위배되는게 아닐까?</span>

실제로 이 부분은 싱글턴의 문제점으로 종종 제기되는 내용이다. 느슨한 결합 원칙에 따르면

**상호작용하는 객체 사이에는 최대한 느슨한 결합을 추구**해야 한다. 싱글톤을 사용하다

보면 이런한 원칙에 위배되기 십상이다. 싱글턴을 바꾸면 연결된 모든 객체도 바뀌어야 할

가능성이 높기 때문이다

<br>

#### <span style="background-color:black; color:white">2. 리플렉션, 직렬화, 역직렬화 문제도 있지 않을까?</span>

리플렉션, 직렬화, 역직렬화도 싱글턴에서 문제가 될 수 있다. 

<br>

#### <span style="background-color:black; color:white">3. 싱글턴은 하나의 객체가 2가지 역할을 하는거 같은데...</span>

싱글턴은 자신의 인스턴스를 관리하는 일 외에도 원래 그 인스턴스를 사용하고자 하는 목적에 

부합하는 작업을 책임져야 한다. 따라서 2가지를 책임지고 있다고 할 수 있다. 

하지만 클래스 내에 인스턴스 관리 기능을 포함한 클래스를 적지 않게 볼 수 있다. 

이렇게 되면 전체적인 디자인을 더 간단하게 만들 수 있기 때문이다.

<br>

#### <span style="background-color:black; color:white">4. 전역변수가 싱글톤보다 더 좋은거 같은데?</span>

전역 변수는 게으른 인스턴스 생성(lazyinstantiation)이 불가하며, 인스턴스를 사용하든 

사용하지 않든 처음부터 끝까지 인스턴스를 가지고 있어야 한다. 

싱글턴 패턴은 클래스가 하나의 인스턴스만 가지도록 하고, 전역적인 접근을 제공할 때 사용한다.

전역 변수를 쓰면 두 번째 목표는 달성할 수 있지만, 첫 번째 목표는 달성할 수 없다.

<br>

## <span style="color:gray">Enum</span>

---

#### <span style="background-color:black; color:white">Enum (열거 상수 클래스, Thread-safe)</span>

위에서 봤던 싱글턴의 문제점들은 `enum`으로 싱글턴을 생성하면 해결할 수 있다.

```java
public enum SingletonEnum {
    singletonEnumExample;
}
```

Enum 인스턴스의 생성은 기본적으로 Thread-Safe 하다. 따라서 스레드 관련 코드가

없어져서 코드가 더욱 간단해진다. 하지만 Enum 내의 다른 메서드가 있는 경우에 

해당 메서드가 Thread-Safe힌지는 개발자가 확인해야 하는 부분이다.

Enum 방식을 사용하면 아주 복잡한 직렬화 상황이나, 리플렉션 공격에도 제2의 인스턴스가

생성되는 것을 막아주는 장점이 있다. 하지만 만들려는 싱글턴이 Enum 외의 다른 클래스를

상속해야 하는 경우에는 사용할 수 없다.

<br>

## <span style="color:gray">SpringBoot에서의 싱글턴 패턴</span>

---