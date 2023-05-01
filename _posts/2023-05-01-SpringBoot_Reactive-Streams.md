---
layout: post
title: Reactive Streams
categories: spring
tags: springBoot
---

## <span style="color:gray">Reactive Programming</span>

---

#### <span style="background-color:black; color:white">Reactive Programming의 배경</span>

<img src = "/assets/img/spring/reactive/exImg.png">

예를 들어 A는 시간이 항상 궁금하지만, 시계를 볼 줄 모르는 사람이라고 해보자.

1. A가 B에게 지금 몇시인지 물어본다.
2. B는 시계가 없어서 C에게 다시 물어본다.
3. C는 본인이 하던 일을 마무리하고 B에게 시간을 알려준다.
4. B는 C에게서 들은 시간을 A에게 알려준다.

얼핏 봤을 때 문제는 없다. 하지만 지금 공부하는 reactive programming 관점에서 보면 두 가지 문제가 있다.

- A,B 모두 대기 시간이 있다. (대기 시간 == 아무것도 안하고 있는 시간)
- 따라서 대기 시간이 있기 때문에 다른 일을 할 수 없다.
- A가 시간을 알기위해서는 항상 B에게 시간을 물어봐야 한다.

<br>

이제 대기 시간을 줄여서 A,B가 다른 일을 할 수 있게 해줘야하며, A가 항상 B에게 시간을 

물어보지 않아도 시간을 알 수 있게 해주어야 한다. 

이를 가능하게 해주는 것이 <span style="background-color:#F0E68C">Reactive - Programming</span>이다.

<br>

그럼 위에서 언급됐던 두 가지 문제를 해결해보자.

> 1. 대기 시간 줄이기.

대기 시간을 줄이려면 요청에 대한 응답을 바로바로 전달해주면 된다.

<img src = "/assets/img/spring/reactive/exImg2.png">

이렇게 응답을 하고 나서 B는 Event Loop라는 곳에 A(Client)의 요청을 저장해 뒀다가,

5분 뒤에 해당 요청이 마무리가 되면 A에게 몇 시 인지 알려줘야한다.

그 사이에 B(Server)는 다른 일을 할 수 있게 된다.

<br>

> 2. 물어보지 않아도 알려주기.

<img src = "/assets/img/spring/reactive/exImg3.png">

1번에 이미 응답을 했기 때문에 HTTP 프로토콜의 stateless 특성상 A(Client)와 B(Server)의 

연결이 끊겨서 5분뒤에 B(Server)가 A(Client)에게 시간을 알려줄 수 없다.

따라서 A와 B의 연결을 유지시켜줘야만, A가 물어보지 않아도 시간을 알 수 있다.

이 문제를 해결하기 `SSE(Server-Send-Event) 프로토콜`을 사용해서 지속적인 응답이 가능하도록 해야한다.

그리고 여기서 말한 지속적인 응답이라는 것은 다른 말로하면 `stream`, `flux`이다.

<br>

이렇게 처음에 발생했던 두 가지 문제를 해결하는 방법을 알아보았다.

이것을 spring에 적용시킨 것이 webFlux이다.

<br>

#### <span style="background-color:black; color:white">Reactive Programming의 정의</span>

- 데이터 스트림 및 변경 사항 전파와 관련된 선언적 프로그래밍 패러다임. 
- 비동기 데이터 스트림을 사용하는 프로그래밍

<br>

## <span style="color:gray">Reactive Streams</span>

---

#### <span style="background-color:black; color:white">Reactive-Streams란?</span>

Reactive-Streams는 non-blocking back pressure로 비동기 스트림 처리를 위한 표준을 제공하는 계획(가이드)이다.

<br>

Reactive-Streams를 보기 전에 추가적으로 알아야할 내용들이 있는데, 

<a href="https://engineering.linecorp.com/ko/blog/reactive-streams-with-armeria-1" target="_blank">Ikhun Um님의 블로그</a>에 정리가 잘 되어있어 이것으로 공부했다.

<br>

추가적으로 Reactive Streams는 표준화된 API인데, 이를 구현하기 위해선 복잡한 규칙들이 많다.

따라서 직접 구현하기 보단, 이미 잘 만들어져서 검증까지 받은 구현체를 사용하는 게 좋다.

그 중 하나가 <span style="background-color:#F0E68C">ProjectReactor</span>다.

<br>

위 블로그를 읽다보면 Back Pressure라는 용어가 나와서 .

<details>
<summary><u>Back Pressure</u></summary>
<div markdown="1">

<br>

Back Pressure를 이해하기 위해선 Observer 패턴의 push, pull 방법의 차이를 이해해야한다.

Back Pressuer는 pull 방식을 사용하고 정의하자면 다음과 같다.

|key word|description|
|--------|-----------|
|Back Pressure|구독자가 수용할 수 있는 만큼만 발행자에게 데이터를 요청하는 방식|

</div>
</details>

<br>

#### <span style="background-color:black; color:white">API Components</span>

Reactive Streams는 Publisher, Subscriber, Subscription, Processor라는 4개 인터페이스를 제공한다.

|Components|Description|
|----------|-----------|
|Publisher|데이터를 생성하고 통지한다.|
|Subscriber|통지된 데이터를 전달받아서 처리한다.|
|Subscription|전달 받을 데이터의 개수를 요청하고 구독을 해지한다. (구독 자체를 의미)|
|Processor|Publisher와 Subscriber의 기능을 모두 가지고 있다.|

<a href="https://sjh836.tistory.com/182" target="_blank">sjh836님의 블로그</a>를 통해 공부를 진행했다.

<br>

간단하게 정리해보면

- Observer 패턴의 한계를 Reactive streams의 Publisher 인터페이스로 해결
- Subscriber 인터페이스는 Observer 패턴과 Iterator 패턴의 결합물
- Subscription 인터페이스로 Back Pressure를 구현

<br>

Reactive Streams Component들간의 흐름을 도식화한 그림이다.

<img src = "/assets/img/spring/reactive/pub-sub.png"><br>

- Subscription은 Subscriber와 Publisher 간 통신의 매개체

<br>

#### <span style="background-color:black; color:white">WebFlux와 Project-Reactor</span>

WebFlux는 Spring 5부터 도입된 비동기적인 웹 프레임워크이며, 

Project Reactor는 Spring 5에서 기본적으로 사용되는 Reactive-Stream 라이브러리다.

WebFlux에서는 Project Reactor의 Flux와 Mono 클래스를 사용하여 비동기적으로 HTTP 요청을 처리하고 

응답을 반환한다. 이를 통해 Reactive Streams 스펙을 구현하면서 높은 처리량과 낮은 지연 시간을 가지는 

리액티브한 웹 애플리케이션을 구현할 수 있습니다. 또한 WebFlux는 Project Reactor의 다양한 연산자를 

사용할 수 있다. 예를 들어, WebFlux에서는 Flux의 map, flatMap, filter와 같은 연산자를 사용하여 

비동기 스트림을 처리하고, Mono의 onErrorResume, retry와 같은 연산자를 사용하여 예외 처리를 구현할 수 있다.

<br>

#### <span style="background-color:black; color:white">참고 블로그 및 문서</span>

▶︎ <a href="https://tecoble.techcourse.co.kr/post/2022-10-11-server-sent-events/" target="_blank">Spring SSE 구현</a>

▶︎ <a href="https://engineering.linecorp.com/ko/blog/reactive-streams-with-armeria-1" target="_blank">Ikhun Um님의 블로그</a>

▶︎ <a href="https://github.com/reactive-streams/reactive-streams-jvm/tree/v1.0.4" target="_blank">github_reactive-streams</a>
