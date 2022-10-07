---
layout: post
title: Value 어노테이션
categories: spring
tags: springBoot
---

## <span style="color:gray">@Value</span>

---

#### <span style="background-color:black; color:white">@Value 란?</span>

**`@Value`** 어노테이션은 properties 파일에 세팅한 내용을 변수에 주입하는 역할을 한다.

<br>

#### <span style="background-color:black; color:white">실 사용 해보기</span>

우선 application.properties에 아래와 같이 값을 정의해야 한다.

```txt
// application.properties
cookie.name=mySessionId
```

그리고 `@Value` 어노테이션을 사용해서 값을 가져온다.

```java
@Getter
@Configuration
@PropertySource("classpath:/application.properties")
public class ApplicationConfiguration {

    @Value("${cookie.name}")
    private String cookieId;

    @Value("${default.target.path}")
    private String defaultTargetPath;

    @Value("${default.fail.path}")
    private String defaultFailPath;

    @Value("${default.login.path}")
    private String defaultLoginPath;

}
```

여기에서 주의할 점은 다른 자바 파일에서 ApplicationConfiguration 클래스를 사용할 때는 

의존성 주입을 통해서 해줘야 한다. 만약에 new 연산자를 통해서 인스턴스를 생성하게 되면 

스프링 컨테이너에서 관리하는 인스턴스가 아니다. 

> 나는 이 부분에서 실수를 저질렀다.

```java
@Component
@RequiredArgsConstructor
public class SessionManager {

    private final ApplicationConfiguration applicationConfiguration;

    // 관련 method들

}
```

이렇게 스프링 컨테이너를 통해서 의존성을 주입해서 서용해야 한다.

<br>

#### <span style="background-color:black; color:white">참고 블로그</span>

**📚 [bcp0109:티스토리](https://bcp0109.tistory.com/227)**