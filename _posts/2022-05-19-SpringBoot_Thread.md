---
layout: post
title: Thread 구현
categories: spring
tags: springBoot
---

## <span style="color:gray">Thread</span>

프로세스란 간단히 말해서 ‘실행 중인 프로그램’이다.

프로그램을 실행하면 OS로 부터 실행에 필요한 자원(메모리)를 할당 받아 프로세스가 된다.

프로세스는 프로그램을 수행하는 데 필요한 데이터와 메모리 등의 자원 그리고 쓰레드로 

구성되어 있으며 프로세스의 자원을 이용해서 실제로 작업을 수행하는 것이 바로 쓰레드이다.

<br>

## <span style="color:gray">Thread구현과 실행</span>

쓰레드를 구현하는 방법은 Thread 클래스를 상속받는 방법과 Runnable 인터페이스를 구현하는 

방법, 모두 두 가지가 있다. 어느 쪽을 선택해도 별 차이는 없지만 Thread 클래스를 상속받으면

다른 클래스를 상속받을 수 없기 때문에, Runnable인터페이스를 구현하는 방법이 일반적이다.

> Thread 상속

```java
class CustomThread extends Thread {
    public void run() {
            // 로직
    }
}
```

<br>

> Runnable 인터페이스 구현

```java
class CustomThread implements Runnable {
    public void run() {
            //로직
    }
}
```

```java
Runnable customThread = new CustomThread();
CustomThread t1 = new Thread(customThread);

t1.start();
```

<br>

## <span style="color:gray">`start()` 와 `run()`</span>

main메서드에서 **`run()`** 을 호출하는 것은 생성된 쓰레드를 실행시키는 것이 아니라 단순히 클래스에 

선언된 메서드를 호출하는 것일 뿐이다. 반면 **`start()`** 는 새로운 쓰레드가 작업을 실행하는데 필요한 

호출스택(call stack)을 생성한 다음에 **`run()`** 을 호출해서, 생성된 호출스택에 **`run()`** 이 

첫 번째로 올라가게 한다. 모든 쓰레드는 독립적인 작업을 수행하기 위해 자신만의 호출스택을 

필요로 하기 때문에,  새로운 쓰레드를 생성하고 실행시킬 때마다 새로운 호출스택이 생성되고 쓰레드가 

종료되면 작업에 사용된 호출스택은 소멸된다. 호출스택에서는 가장 위에 있는 메서드가 현재 실행중인 메서드이고, 

나머지 메서드들은 대기 상태에  있다는 것을 앞에서 봤다. 

그러나 쓰레드가 둘 이상일 경우에는 호출스택의 최상위에 있는 메서드일지라도 대기상태에 있을 수 있다.

<br>

## <span style="color:gray">데몬 쓰레드</span>

데몬 쓰레드는 다른 일반 쓰레드의 작업을 돕는 보조적인 역할을 수행하는 쓰레드이다.

일반 쓰레드가 모두 종료되면 데몬쓰레드는 강제적으로 자동 종료되는데, 그 이유는 

데몬 쓰레드는 일반쓰레드의 보조역할을 수행하므로 일반 쓰레드가 모두 종료되면 

데몬쓰레드의 존재의 의미가 없기 때문이다. 데몬쓰레드의 예로는 `가비지 컬렉터`, 

`워드프로세서의 자동저장`, `화면자동갱신` 등이 있다. 

데몬 쓰레드는 일반쓰레드의 작성방법과 실행방법이 같다. 다만 쓰레드를 생성한 다음 

실행하기 전에 **`setDaemon(true)`** 를 호출하기만 하면 된다. 

그리고 데몬쓰레드가 생성한 쓰레드는 자동적으로 데몬 쓰레드가 된다는 점도 알아두면 좋다.

<br>

## <span style="color:gray">Thread 실행 제어</span>

많은 메서드가 있지만 우선 **`join()`** 부터 알아보았다. (나머지도 차차...)

다양한 블로그에서 공통적으로 하는 말이 있었는데, **`join()`** 을 사용하게 되면

> main쓰래드가 subThread가 종료될 때 까지 기다려준다.

라고 되어 있다. 솔직히 글로는 이해가 되지 않아서 오늘 구현한 쓰래드를 예로 이해를 해봤다.

<br>

현재 구글드라이브랑 비슷한 드라이브를 개발중인데, 이미지 업로드 할 때 썸네일 이미지도 

서버에 저장해야 한다는 요구가 있었다. 처음에는 그냥 파일 객체를 추가로

만들어서 저장하면 될 줄 알았는데 막상해보니깐 시간이 너무 오래 걸렸다. 그래서 Thread를 

사용해보기로 헀다.

<br>

**join() 사용할 경우**

MainThread가 돌다가 SubThread가 실행되고, SubThread 다 종료가 된다.

이때 MainThread가 기다리고 있다가 SubThread 다 종료가 된 후 종료된다.

```java
DEBUG 2022-05-19 16:44:49[http-nio-8080-exec-2]
DEBUG 2022-05-19 16:44:49[http-nio-8080-exec-2]
INFO  2022-05-19 16:44:49[http-nio-8080-exec-2] Main Thread =http-nio-8080-exec-2
INFO  2022-05-19 16:44:49[http-nio-8080-exec-2] 쓰레드 t.start=http-nio-8080-exec-2
INFO  2022-05-19 16:44:49[http-nio-8080-exec-2] 쓰레드 t.join=http-nio-8080-exec-2

INFO  2022-05-19 16:44:49[Thread-7] makeThumbnail 쓰레드=Thread-7
INFO  2022-05-19 16:44:54[Thread-7] 완성=Thread-7
INFO  2022-05-19 16:44:54[Thread-7] 쓰레드 끝=Thread-7

DEBUG 2022-05-19 16:44:54[http-nio-8080-exec-2] 
DEBUG 2022-05-19 16:44:54[http-nio-8080-exec-2] 
DEBUG 2022-05-19 16:44:54[http-nio-8080-exec-2] 
INFO  2022-05-19 16:44:54[http-nio-8080-exec-2] 
```

<br>

**join() 사용안 할 경우**

MainThread가 다 끝나고 SubThread가 실행된다.

```java
INFO  2022-05-19 16:47:22[http-nio-8080-exec-2] Main Thread    = http-nio-8080-exec-2
INFO  2022-05-19 16:47:22[http-nio-8080-exec-2] 쓰레드 t.start = http-nio-8080-exec-2
DEBUG 2022-05-19 16:47:22[http-nio-8080-exec-2]

INFO  2022-05-19 16:47:22[Thread-7] makeThumbnail 쓰레드=Thread-7

DEBUG 2022-05-19 16:47:22[http-nio-8080-exec-2]
DEBUG 2022-05-19 16:47:22[http-nio-8080-exec-2]
INFO  2022-05-19 16:47:22[http-nio-8080-exec-2]
DEBUG 2022-05-19 16:47:22[http-nio-8080-exec-2]
DEBUG 2022-05-19 16:47:22[http-nio-8080-exec-2]
DEBUG 2022-05-19 16:47:22[http-nio-8080-exec-2]
DEBUG 2022-05-19 16:47:22[http-nio-8080-exec-2]
DEBUG 2022-05-19 16:47:22[http-nio-8080-exec-2]

INFO  2022-05-19 16:47:27[Thread-7] 완성=Thread-7
INFO  2022-05-19 16:47:27[Thread-7] 쓰레드 끝?=Thread-7
```

---