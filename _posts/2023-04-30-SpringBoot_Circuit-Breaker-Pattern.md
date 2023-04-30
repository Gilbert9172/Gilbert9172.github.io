---
layout: post
title: Circuit Breaker Pattern
categories: spring
tags: springBoot
---

## <span style="color:gray">resilience4j</span>

---

#### <span style="background-color:black; color:white">resilience4j란?</span>

▶︎ <a href="https://mangkyu.tistory.com/290" target="_blank">망나니 개발자 - Resilence4J란?</a>


위 블로그 글을 요약을 해 보면 아래와 같다.
- Hystrix는 넷플릭스에서 만든 비슷한 기능을 하는 오픈소스인데, deprecated되었다.
- Resilience4J를 적용하면 외부 서비스에서 장애가 발생하여도 자신의 시스템에 장애가 전파되지 않는다.
- Resilience4J에는 여러 가지 코어 모듈이 존재하는데 그 중 하나가 CircuitBreaker 모듈이다.

<br>

## <span style="color:gray">Circuit Breaker Pattern</span>

---

#### <span style="background-color:black; color:white">등장 배경</span>

아래의 이미지는 MSA 패턴을 간단하게 도식화 한 것이다.

<img src = "/assets/img/spring/resilence4j/msa.png">

위 이미지에서 볼 수 있는 MSA의 한계는 ServerA가 ServerB에 종속적이라는 점이다.

다시 말해, ServerA가 ServerB를 호출했을 때 ServiceB가 내려가서 응답을 못하거나 

응답 시간이 길어진다면 ServerA는 응답을 계속 기다려야만 한다. 

만약 응답 대기 시간이 길어지면 아래와 같은 문제가 발생할 수 있다.

- 쓰레드 풀이 말라버리는 현상
- 메모리 낭비

이러한 한계를 극복하기 위해 Circuit Breaker Pattern이 것이 등장한 것이다.


<br>

#### <span style="background-color:black; color:white">Circuit Breaker Pattern 이란?</span>

<img src = "/assets/img/spring/resilence4j/circuit-breaker.png">

외부 서비스에서 생긴 문제를 나의 서비스에 전파되지 않도록 방지하기 위해 등장한 패턴이다.

이 패턴의 목적은 <span style="background-color:#F0E68C">문제가 발생한 지점을 감지하고, 실패하는 요청을 계속 보내지 않도록 방지한다.</span>

이를 통해 시스템의 장애 확산을 막고, 장애 복구를 도와주며 사용자는 불필요한 대기를 하지 않게 된다.

즉, Circuit Breaker Pattern은 실패할 수 있는 작업을 계속 시도하지 않도록 방지한다.

<br>

예를 들어 ServerA에서 ServerB로 요청을 10번 보냈는데 모두 실패라면, 11번째 요청에서는 

Circuit Breaker 선에서 요청을 컷 한다는 의미다.

<br>

#### <span style="background-color:black; color:white">Circuit Breaker Pattern 상태</span>

Circuit Breaker Pattern에는 총 3가지 상태가 있다.

|상태|설명|
|----|----|
|Closed|모든 것이 정상인 상태. 모든 요청을 받을 수 있음.|
|Open|회로가 열려서 요청을 보내 수 없음.|
|Half Open|갑작스럽게 많은 요청을 받지 않고, 정해진 수의 요청만 받을 수 있음.|



<br>

#### <span style="background-color:black; color:white">Circuit Breaker Pattern 동작 원리</span>

Circuit Breaker Pattern는 회로 차단기에서 영감을 받아 나온 패턴으로 알려져있다.

<img src = "/assets/img/spring/resilence4j/circuit-breaker-states.png">

- `closed` : 모든 것이 정상인 상태
- `closed → open` : 특정 임계치를 넘어 갔을 경우
- `open → half open` : open 상태에서 특정 시간이 흘렀을 경우
- `half open → closed` : 정해진 수의 요청만 외부로 전달되고, 응답에 성공한 경우.

<br>

#### <span style="background-color:black; color:white">Circuit Breaker Pattern의 필요성 및 장점</span>

▶︎ <a href="https://mangkyu.tistory.com/290" target="_blank">망나니 개발자 - Circuit Breaker Pattern란?</a>

위 블로그 글을 요약하면 아래와 같다.

- 장애 감지 및 격리
- 자동 시스템 복구
- 빠른 실패 및 고객 응답
- 장애 서비스로의 부하 감소
- 장애 대안 커스터마이징

마지막 `장애 대안 커스터마이징`이 현재 내게 가장 도움이 될 장점으로 기대한다.

<br>


#### <span style="background-color:black; color:white">참고 블로그 및 문서</span>

▶︎ <a href="https://mangkyu.tistory.com/290" target="_blank">망나니 개발자 - Resilence4J란?</a>

▶︎ <a href="https://mangkyu.tistory.com/290" target="_blank">망나니 개발자 - Circuit Breaker Pattern란?</a>

▶︎ <a href="https://resilience4j.readme.io/docs" target="_blank">resilience4j docs</a>

▶︎ <a href="https://martinfowler.com/bliki/CircuitBreaker.html" target="_blank">Martin Fowler - CircuitBreaker</a>

