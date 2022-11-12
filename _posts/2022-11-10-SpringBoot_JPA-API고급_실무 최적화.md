---
layout: post
title: API 개발 고급 - 실무 필수 최적화
categories: spring
tags: jpa
---

## <span style="color:gray">OSIV</span>

---

#### <span style="background-color:black; color:white">Open Session In View</span>

OSIV는 영속성 컨텍스트를 뷰까지 열어 둔다는 뜻이다.

영속성 컨텍스트가 살아 있으면 엔티티는 영속 상태로 유지된다. 

따라서 뷰에서도 지연로딩을 사용할 수 있다.

<br>

참고로 Open Session In View는 하이버네이트에서 사용하는 용어이고,

JPA에서는 Open EntityManager In View(OEIV)라고 하는데, 관계상 모두 

OSIV라고 한다.

<br>

#### <span style="background-color:black; color:white">요청 당 트랜잭션 방식의 OSIV</span>

요청 당 트랜잭션이란, 클라이언트의 요청이 들어오자마자 서블릿 필터나 스프링 인터셉터에서

트랜잭션을 시작하고 요청이 끝날 때 트랜잭션도 끝내는 방식이다.

<br>

이 방법이 가지고 있는 문제점은 컨트롤러나 뷰 같은 프리젠테이션 계층이 엔티티를

변경할 수 있다는 점이다.

예를 들면 단순히 보여지는 값만 바꾸고 싶은데, 아래의 코드처럼 작성을 하게 되면 

```java
Member member = memberService.getMember(id);
member.setName("ABC");
```

트랜잭션이 끝나지 않은 시점에 Dirty Checking이 이루어지면서 DB의 값이

변경되는 문제가 발생할 것이다. 왜냐면 이 방식에서는 뷰를 렌더링 된 후에

트랜잭션 커밋이 이루어지며 flush가 되기 때문이다.

<br>

물론 이 문제를 해결하는 방법은 있지만 문제 해결하는 과정에서 코드량이 상당히

많아진다는 단점이 있다. 따라서 이 방법은 최근에 잘 사용하진 않는다.

<br>

#### <span style="background-color:black; color:white">스프링 OSIV: 비즈니스 계층 트랜잭션</span>

> <em> spring.jpa.open-in-view: true 인 경우</em>

<img src="/assets/img/jpa/활용2편/스프링OSIV.png">

**<u>▷ 동작 방식</u>**

⒈ 클라이언트의 요청이 들어오면 서블릿 필터나, 스프링 인터셉터에서

영속성 컨텍스트를 생성한다. 단 이때 트랜잭션은 시작하지는 않는다.

<br>

⒉ 서비스 계층에서 `@Transactional`로 트랜잭션을 시작할 때 1번에서 

미리 생성해둔 영속성 컨텍스트를 찾아와서 **<span style="background-color:#F0E68C">트랜잭션을 시작한다.</span>**

<br>

⒊ 서비스 계층이 끝나면 트랜잭션을 커밋하고 영속성 컨텍스트를 플러시

한다. **<span style="color:#F08080">이때 트랜잭션은 끝내지만, 영속성 컨텍스트는 종료하지 않는다.</span>**

<br>

⒋ 컨트롤러와 뷰까지 영속성 컨텍스트가 유지되므로 조회한 엔티티는

영속 상태를 유지한다. → **<span style="background-color:#F0E68C">지연로딩을 할 수 있다.</span>**

<br>

⒌ 서블릿 필터나, 스프링 인터셉터로 요청이 들어오면 영속성 컨텍스를

종료한다. 이때 플러시를 호출하지 않고 바로 종료한다.

<br>

**<u>▷ 특징</u>**

• **<span style="color:#F08080">트랜잭션이 끝나도 영속성 컨텍스트를 끝까지 살려둔다.</span>**

• 영속성 컨텍스트를 프레젠테이션 계층까지 유지한다.

• API 응답이 끝나거나, view 렌더링을 마무리하면 영속성 컨텍스트가 종료된다.

• 프리젠테이션 계층에서는 트랜잭션이 없으므로 엔티티를 수정할 수 없다.

• 프리젠테이션 계층에서는 트랜잭션이 없지만 `트랜잭션 없이 읽기`를 사용해서

**<span style="background-color:#F0E68C">지연로딩을 할 수 있다.</span>**

<br>

참고로 `트랜잭션 없이 읽기`란 영속성 컨텍스트는 트랜잭션 범위 밖에서 

엔티티를 조회만 하는 것을 말한다.

<br>

**<u>▷ 단점</u>**

이 방식은 너무 오랜시간 동안 데이터베이스 커넥션 리소스를 사용하기 때문에

실시간 트래픽이 중요한 애플리케이션에서는 커넥션이 부족할 수 있다.

이것은 결국 장애로 이어진다. 

예를 들어서 컨트롤러에서 외부 API를 호출하면 외부 API 대기 시간 만큼 커넥션

리소스를 반환하지 못하고 유지해야 한다.

<br>

> <em> spring.jpa.open-in-view: false 인 경우</em>

<img src = "/assets/img/jpa/활용2편/스프링OSIVOff.png">

OSIV를 끄면 트랜잭션을 종료할 때 영속성 컨텍스트를 닫고, 데이터베이스 

커넥션도 반환한다. 따라서 커넥션 리소스를 낭비하지 않는다.

만약 OSIV를 끄면 **<span style="color:#FF7F50">모든 지연로딩을 트랜잭션 안에서 처리해야 한다.</span>**

따라서 지금까지 작성한 많은 지연 로딩 코드를 트랜잭션 안으로 넣어야 한다.

그리고 view template가 동작하지 않는다.

결론적으로 트랜잭션이 끝나기 전에 지연 로딩을 강제로 호출해 두어야 한다.

<br>

만약 OSIV를 끄고 개발을 한다면 지연로딩을 아래와 같이 `읽기 전용 트랜잭션`을 

사용해서 처리하면 된다.

```java
// 화면이나 API에 맞춘 서비스 (주로 읽기 전용 트랜잭션 사용)

@Service
@Transactional(readOnly=true)
@RequiredArgsConstructor
public class OrderQueryService {
    //...
}
```