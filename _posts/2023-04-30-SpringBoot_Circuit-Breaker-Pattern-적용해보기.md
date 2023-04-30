---
layout: post
title: Circuit Breaker Pattern 적용
categories: spring
tags: springBoot
---

## <span style="color:gray">Circuit Breaker Pattern 적용</span>

---

#### <span style="background-color:black; color:white">@CircuitBreaker</span>

오늘은 애노테이션 기반으로 Circuit Breaker를 적용해보는 시간을 가졌다.

```java
@GetMapping("/")
@CircuitBreaker(name = "", fallBackMehtod = "")
public void testMethod() {
    //...
}
```

<img src = "/assets/img/spring/resilence4j/annotation.png">

<span style="color:#8A2BE2;">@CircuitBreaker</span>에는 name, fallbackMethod 두 가지 속성을 설정할 수 있다.

- name : circuit breaker의 이름
- fallbackMethod : 요청이 실패했을 때 호출할 콜백 메소드명.

<br>

#### <span style="background-color:black; color:white">두개의 프로젝트 만들기</span>

<details>
<summary><u>Project A</u></summary>
<div markdown="1">

<br>

```java
@RestController
@RequestMapping("/a")
public class ServiceAController {

    @Autowired
    private RestTemplate restTemplate;

    private static final String BASE_URL = "http://localhost:8081/";
    private static final String SERVICE_A = "serviceA";

    @GetMapping
    @CircuitBreaker(name = SERVICE_A, fallbackMethod = "serviceAFallback")
    public String serviceA() {
        String url = BASE_URL + "b";
        return restTemplate.getForObject(
                url,
                String.class
        );
    }

    public String serviceAFallback(Exception e) {
        return "This is a fallback method for Service A";
    }
}
```

```yml
resilience4j:
  circuitbreaker:
    instances:
      serviceA:
        registerHealthIndicator: true   
        eventConsumerBufferSize: 10
        failureRateThreshold: 50
        minimumNumberOfCalls: 5
        automaticTransitionFromOpenToHalfOpenEnabled: true
        waitDurationInOpenState: 5s
        permittedNumberOfCallsInHalfOpenState: 3
        slidingWindowSize: 10
        slidingWindowType: COUNT_BASED
```

▶︎ <a href="https://resilience4j.readme.io/docs/circuitbreaker" target="_blank">설정 정보에 대한 설명</a>


</div>
</details>

<br>

<details>
<summary><u>Project B</u></summary>
<div markdown="1">

<br>

```java
@RestController
@RequestMapping("/b")
public class ServiceBController {

    @GetMapping("")
    public String serviceB() {
        return "Service B is called from Service A";
    }

}
```
</div>
</details><br>

<br>

#### <span style="background-color:black; color:white">요청 Test</span>

|ServerA 상태|ServerB 상태|결과|
|------------|------------|----|
|Up|Up|"Service B is called from Service A"|
|Up|Down|"This is a fallback method for Service A"|

ServerB가 내려갔을 때 ServerA에서 설정해둔 FallbackMethod가 실행됨을 확인할 수 있었다.

<br>

#### <span style="background-color:black; color:white">참고 블로그 및 영상</span>

▶︎ <a href="https://www.youtube.com/watch?v=9AXAUlp3DBw&t=1257s" target="_blank">Youtube 강의</a>
