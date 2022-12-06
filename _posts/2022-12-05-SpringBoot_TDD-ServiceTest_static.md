---
layout: post
title: Service 계층 - Static 클래스 테스트
categories: tdd
tags: jpa
---

## <span style="color:gray">Static 클래스 mocking하기</span>

---

#### <span style="background-color:black; color:white">MockedStatic</span>

> <em><a href="hhttps://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/MockedStatic.html" target="_blank">mockito docs</a> : Interface MockedStatic</em>

Mocking은 이 정적 모의가 생성된 스레드에만 영향을 미치며 다른 스레드에서 이 개체를 

사용하는 것은 안전하지 않다. 따라서 `close()` 메소드를 호출해서 자원을 해제해줘야 한다.

그렇지 않으면 **정적 모의 객체**가 활성상태로 유지된다.

따라서 Junit을 사용할 때 try-with-resources 문 내에서 이 객체를 생성하는 것이 좋다.

<br>

#### <span style="background-color:black; color:white">구현하기</span>

> <em><a href="https://stackoverflow.com/questions/63263662/mockito-3-4-0-static-mocking-exception" target="_blank">stackoverflow</a>에 올라온 질문이다. 그리고 답변에 다양한 구현방법이 적혀있다.</em>

**[ @BeforeAll, @AfterAll ]**

```java
private static MockedStatic<JwtUtil> jwtUtil;

@BeforeAll
public static void mockJwtUtil() {
    jwtUtil = mockStatic(JwtUtil.class);
}

@AfterAll
public static void mockJwtUtilEnd() {
    jwtUtil.close();
}
```

<br>

**[ try-with-resources ]**

> <em><a href="https://codechacha.com/ko/java-try-with-resources/" target="_blank">여기에</a> 관련된 설명이 잘되어있다.</em>

```java
try (MockedStatic<JwtUtil> mockedStatic = mockStatic(JwtUtil.class)) {
    given(JwtUtil.agentId()).willReturn(1L);
}
```

자동으로 `close();` 메소드를 호출해준다. 그러면 어떻게 자동으로 호출해줄까?🤔

그 이유는 바로  **<span style="background-color:#F0E68C">AutoCloseable</span>** 인터페이스 덕분이다.

<img src = "/assets/img/tdd/autoCloseable.png"><br>

위 다이어크램 처럼 MocokedStatic 인터페이스는 최상위에 AutoClosable 인터페이스가 있다.

<br>

#### <span style="background-color:black; color:white">AutoCloseable 인터페이스</span>

**AutoCloseable 인터페이스**에 대해 알아보고 넘어가자.

**[ 설명 ]**

해당 자원 할당을 해제한다. 이 메서드는 try-with-resources 문에 의해 관리되는 객체에서 자동으로 

호출된다. 이 인터페이스 메서드는 예외를 throw하도록 선언되지만 개발자는 `close()` 메서드의 

구체적인 구현을 선언하여 보다 구체적인 예외를 throw하거나 닫기 작업이 실패할 수 없는 경우 예외를 

전혀 throw하지 않는 것이 좋다.

<br>

그리고 `java.io.Closeable#close()` 메소드와 달리 이 `close()` 메소드는 멱등성이 필요하지 않다. 

즉, 이 `close()` 메서드를 두 번 이상 호출하면 효과가 없어야 하는 Closeable.close와 달리 눈에 띄는 

부작용이 발생할 수 있다. 따라서 개발자는 이 인터페이스의 `close()` 메소드를 **<span style="background-color:#F0E68C">멱등성으로 만드는 것이 좋다.</span>**

<br>

## <span style="color:gray">테스트 코드 작성</span>

---

#### <span style="background-color:black; color:white">최초 이적 제안하기.</span>

```java
private static MockedStatic<JwtUtil> jwtUtil;

@BeforeAll
public static void mockJwtUtil() {
    jwtUtil = mockStatic(JwtUtil.class);
}

@AfterAll
public static void mockJwtUtilEnd() {
    jwtUtil.close();
}

@ExtendsWith(MockitoExtension.class)
class AgentServiceImplTest {

    @Test
    @DisplayName("최초 이적 제안하기")
    void offerTransfer() throws Exception {
        Player player = new Player(1L, agent, team, position, "메시", 34);

        Contract contractCond = Contract.builder()
                .contractId(1L).payment(1000L).transferFee(2000L)
                .contractDivision(LOAN).contractYear(1).contractMonth(6)
                .currencyUnit(EURO).build();

        Offer offer = Offer.builder()
                .offerId(1L).agent(agent).player(player)
                .contract(contractCond).contractStatus(NEGOTIATING)
                .build();

        Long playerId = 1L;

        //given
        given(JwtUtil.agentId()).willReturn(1L);
        given(agentRepository.findById(any())).willReturn(ofNullable(agent));
        given(playerRepository.findById(any())).willReturn(of(player));
        given(offerRepository.findPreviousOffer(anyLong(), anyLong())).willReturn(empty());
        given(offerRepository.save(any())).willReturn(offer);

        //when
        Offer offerTransfer = agentService.offerTransfer(1L, playerId, contractCond);

        //then
        assertThat(offer.getPlayer().getName()).isEqualTo(offerTransfer.getPlayer().getName());
    }

}

```


<br>

#### <span style="background-color:black; color:white"></span>

<br>

#### <span style="background-color:black; color:white"></span>

<br>