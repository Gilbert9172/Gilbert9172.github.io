---
layout: post
title: 제8장 - 경계
categories: book
tags: cleanCode 
---

## <span style="color:gray">들어가기 앞서</span>

> 로버트 C 마틴 - 클린코드 8장

---

#### <span style="background-color:black; color:white">목표</span>

• 책을 그대로 정리하지 않기.

• 책 내용을 참고하여 이해하기 쉽게 정리하기.

<br>

#### <span style="background-color:black; color:white">목차</span>

• [외부 코드 사용하기](#외부-코드-사용하기)

• [어뎁터 패턴](#어뎁터-패턴)

<br>

## <span style="color:gray">경계</span>

---

#### <span style="background-color:black; color:white">외부 코드 사용하기</span>

<br>

<span style="background-color:#AFEEEE;">[ ▾ 이해하기 ]</span>

이 책에서는 Map 인터페이스를 예시를 들어 설명을 해주었다. 그러나 현재 지금

시점에서는 이해가 잘 되지 않는다. 단순하게 이해한 것을 정리해 보자면 아래와 같다.

- 누구든지 Map을 사용하면 삭제 및 삽입을 할 수 있다.
- 위와 같은 상황이 발생하면 프로젝트 여기 저기에 코드가 잠복해 있을 수 있다.
- 혹시라도 인터페이스가 변동되면 `수정 포인트`가 너무 많다.

위의 문제들 때문에 "Map 인터페이스를 한 번 감싸서 불필요한 기능들을 노출하지

않게끔 별도의 Wrapper 클래스를 정의해야 한다." 라고 이해했다.

<br>

<span style="background-color:#AFEEEE;">[ ▾ 언제 wrapping을 해야할까?]</span>

책에서는 아래의 경우에 사용하라고 하는 것 같다.

- 프로그램에 필요한 인터페이스만 제공해야 할 때
- 설계 규칙과 비즈니스 규칙을 따르도록 해야 할 때

그리고 항상 wrapper 클래스를 만드는 것은 아니라고 한다. (캡슐화 강요 아님)

개인적인 의견으로는 뭔가 크기가 정해진 list나 map을 사용할 때 쓰면 어떨가 싶다.

<br>

아래는 직접 만들어본 예제이다.

```java
@Component
@NoArgsConstructor
public class TestEx {

    private Map<int, int> discountPolicy = new HashMap<>();

    public String getById(String id) {
        return discountPolicy.get(id);
    }

    @PostConstruct
    public void init() {
        discountPolicy.put(1, 15);
        discountPolicy.put(2, 20);
    }
    
}
```

우선 할인 정책률을 가지고 있는 Map이다.

클라이언트 코드에서 함부로 할인률을 바꾸면 안되기 때문에 오직 `getById()` 메서드만

외부로 노출해주었다. 또한 `@PostConstructor` 애노테이션을 사용하여 Bean초기화 

시점에 map에 필요한 값 들을 넣어주었다.

<br>

Id가 1번일 경우에는 15% 할인을, Id가 2번일 경우에는 20% 할인이 들어간다.

뭔가 예제를 만들고 보니깐 Java의 Enum 클래스로 만들어도 됐을 것 같다는 생각이든다.

아마 아직 해당 내용에 대해 제대로 이해하지 못한 상태여서 그런거 같다.

> 추후에 이해가 된다면 포스팅을 수정해야 한다.

<br>

## <span style="color:gray">어뎁터 패턴</span>

---

#### <span style="background-color:black; color:white">들어가기 앞서</span>

책에서 어뎁터 패턴을 언급해서 이에 관해 자세히 알아보았다.

구글링을 해보니 전부 해드퍼스트 디자인 패턴에 있는 내용 및 예제를 그대로 사용해여

글을 정리해뒀다. 하지만 나는 실 프로젝트에서 어떻게 사용할 수 있을지 혹은 이미 

작성된 코드에서 무의식적으로 사용했던건 아닌지 알아보면서 정리할 계획이다.

<br>

#### <span style="background-color:black; color:white">어뎁터 패턴의 목적</span>

어뎁터 패턴의 목적은 호환되지 않는 인터페이스 때문에 동작하지 않는 클래스들을 동작할 

수 있게 해주는 것이다. Java에서는 <span style="color:#4169E1;">Wrapper 클래스</span>로 이야기한다고 한다.

<br>

예를 들어 우리가 일본으로 여행을 갔다고 가정해보자. 숙소를 들어가 핸드폰을 충전해야

하는데 일본은 한국과 다르게 110v를 사용한다. 하지만 우리는 220v 규격의 충전기 밖에

없다. 이럴 때 우리는 `변압기(돼지코)`를 사용한다.

<br>

어뎁터 패턴도 이와 유사하다. 이미지를 보면서 이해해보자.

<img src = "/assets/img/designPattern/adapter/adapter.png">

위 이미지와 예시를 매핑해보면 아래와 같다.

- 기존 시스템 : 220v
- 어뎁터 : 변압기(돼지코)
- 업체에서 제공한 클래스 : 110v

어뎁터 패턴이 어떤 상황에 어떤 목적으로 사용되는지 확실히 감은 잡았다.

이제 내가 실제로 어떤 상황에 사용할 수 있을지 예제를 만들어보고, 혹은

이미 어뎁트 패턴을 사용하여 뭔가 구현한 것은 없는지 알아보자.

<br>

#### <span style="background-color:black; color:white">Security에서 어뎁터 패턴</span>

<br>

<span style="background-color:#AFEEEE;">[ ▾ UserDetails]</span>

최근에 친구에게 Spring Security에서 제공해주는 UserDetails라는 인터페이스를 설명해준

기억이 난다. 이때 나는 이렇게 설명해줬다.

> 프로젝트마다 사용자 정보를 저장하는 Entity가 다르기 때문에 <br> 일관성을 위해서 시큐리티에서 제공해주는 인터페이스라고


<details>
<summary><u>UserDetails Interface</u></summary>
<div markdown="1">

<br>

```java
public interface UserDetails extends Serializable {

	Collection<? extends GrantedAuthority> getAuthorities();

	String getPassword();

	String getUsername();

	boolean isAccountNonExpired();

	boolean isAccountNonLocked();

	boolean isCredentialsNonExpired();

	boolean isEnabled();

}

```

</div>
</details><br>

<br>

즉, Spring Security를 사용하면 프로젝트에서 정의한 사용자 클래스(e.g. Agent.class)에 

정보를 담는 것이 아니고 UserDetails 인터페이스를 구현한 클래스에 사용자 정보를 담아야 한다.

<br>

그럼 이제 어뎁터 패턴이 어떻게 사용되고 있던 것인지 이미지를 보며 이해해보자.

<img src="/assets/img/designPattern/adapter/adapter2.png"><br>

- Client : CustomAuthenticationProvider
- Target : UserDetails
- Adapter : CustomUserDetails
- Adaptee : Agent

<br>

사용자 인증을 처리해주는 CustomAuthenticationProvider가 Client 코드에 해다한다.

CustomAuthenticationProvider는  UserDatils와 UserDetailsService라는 정해진 

규격의 인터페이스를 사용하고 있다.

<details>
<summary><u>CustomAuthenticationProvider Class</u></summary>
<div markdown="1">

<br>

```java
@RequiredArgsConstructor
public class CustomAuthenticationProvider implements AuthenticationProvider {

    private final CustomUserDetailsService customUserDetailsService;
    private final PasswordEncoder encoder;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        final UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) authentication;

        String agentEmail = token.getName();
        String agentPassword = (String) token.getCredentials();

        // ▼ 이 부분
        CustomUserDetails loginAgentDetails = (CustomUserDetails) customUserDetailsService.loadAgentByEmail(agentEmail);

        if (!encoder.matches(agentPassword, loginAgentDetails.getPassword())) {
            throw new WrongPasswordException("Wrong Password");
        }

        return new UsernamePasswordAuthenticationToken(loginAgentDetails, agentPassword, loginAgentDetails.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}

```

</div>
</details><br>

<br>

Adapter는 `Agent.class`를 Spring Security에서 사용할 수 있게 만들어줘야 한다.

따라서 **<span style="background-color:#F0E68C">Target 인터페이스를 구현한 어뎁터 클래스를 만들어줘야 한다.</span>**

<details>
<summary><u>CustomUserDetails Class</u></summary>
<div markdown="1">

<br>

```java
@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final Agent agent;

    public Agent getAgent() {
        return agent;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(agent.getRoleType().name()));
        return authorities;
    }

    //...
}

```

</div>
</details><br>


<br>

<span style="background-color:#AFEEEE;">[ ▾  ]</span>

<br>

#### <span style="background-color:black; color:white"></span>

<br>