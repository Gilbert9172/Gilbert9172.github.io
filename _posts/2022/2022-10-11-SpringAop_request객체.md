---
layout: post
title: Aop 사용 시 HttpServletRequest 접근하기
categories: spring
tags: aop
---

## <span style="color:gray">HttpServletRequest 접근하기</span>

---

#### <span style="background-color:black; color:white">접근 방법</span>

[stackoverflow](https://stackoverflow.com/questions/19271807/how-to-inject-httpservletrequest-into-a-spring-aop-request-custom-scenario)에서 찾은 답변이다.

> 모든 요청에서 DispatcherServlet은 현재 HttpServletRequest를 

> `RequestContextHolder`의 정적 ThreadLocal 개체에 바인딩한다. 

```java
HttpServletRequest request 
    = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();

```

여기서 생기는 의문점 `RequestContextHolder` 클래스는 뭘까?🤔 

<br>

## <span style="color:gray">RequestContextHolder</span>

---

[깃블로그:dveamer](http://dveamer.github.io/backend/SpringRequestContextHolder.html), [티스토리:gompangs](https://gompangs.tistory.com/entry/Spring-RequestContextHolder) 이 두 블로그에 정말 내용이 잘 정리되어 있다.

이 블로그 내용을 요약해보았다.

<br>

#### <span style="background-color:black; color:white">요약</span>

**<u>1. RequestContextHolder란?</u>**

Spring RequestContextHolder은 Spring 2.x부터 제공되던 기능으로 controller, service, DAO 

**<span style="color:#228B22">전 구간에서</span>** HttpServletRequest에 접근할 수 있도록 도와준다. 

이렇게 되면 Controller에서 service 쪽으로 request, response를 매개변수로 넘기지 않아도 된다. 

<br>

**<u>2. 동작 원리</u>**

Spring은 static한 map을 하나 만들어 놓고, servlet이 호출되면 key를 thread로 해서 제공받은

**HttpServletRequest**를 보관한다. 그리고 servlet이 종료될 때 해당 thread를 key로 갖는

HttpServletRequest를 map에서 제거한다. 그 결과, 호출된 servlet과 동일한 thread 내에서는

어느 곳에서든 같은 HttpServletRequest를 꺼내 쓸수 있게 된다. 

<br>

**<u>3. 접근 방법</u>**

```java
HttpServletRequest request 
    = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();

HttpServletRequest request 
    = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
```

|메소드|Null 일 때|
|------|----|
|`getRequestAttributes()`|예외 발생|
|`currentRequestAttributes()`|null 반환|

<br>

**<u>4. 응용</u>**

Spring **RequestContextHolder**을 좀 더 쉽게 이용하고 유연성을 제공하기 위한 유틸리티를 

만들어 사용하면 좋다. 

▷ HttpServletRequestUtil

```java
public class HttpServletRequestUtil {

    public static HttpServletRequest getServletRequest() {
        return ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
    }

    public static HttpServletResponse getServletResponse() {
        return ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getResponse();
    }
}
```

<br>

▷ SessionManger

```java
@Component
@RequiredArgsConstructor
public class SessionManager {

    private final ApplicationConfiguration applicationConfiguration;

    /* 기존 : 매개변수에 request, response 객체를 받는걸 볼수 있다.
    public void generateSession(HttpServletRequest request, HttpServletResponse response, Object value) {

        HttpSession session = request.getSession();
        String sessionId = UUID.randomUUID().toString();
        session.setAttribute(sessionId, value);

        Cookie cookie = new Cookie(applicationConfiguration.getCookieId(), sessionId);
        cookie.setPath("/");
        response.addCookie(cookie);
    }

    public Long getMemberSeqFromSession(HttpServletRequest request) {

        Long memberSeq = null;

        HttpSession session = request.getSession();

        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals(applicationConfiguration.getCookieId())) {
                memberSeq = (Long) session.getAttribute(cookie.getValue());
            }
        }
        return memberSeq;
    }
    */

    // RequestContextHolder 사용
    public void generateSession(Object value) {
        HttpServletRequest request 
                        = HttpServletRequestUtil.getServletRequest(); //=> 핵심!
        HttpSession session = request.getSession();
        String sessionId = UUID.randomUUID().toString();
        session.setAttribute(sessionId, value);

        Cookie cookie = new Cookie(applicationConfiguration.getCookieId(), sessionId);
        cookie.setPath("/");

        HttpServletResponse response = HttpServletRequestUtil.getServletResponse();
        response.addCookie(cookie);
    }

    public Long getMemberSeqFromSession() {

        Long memberSeq = null;

        HttpServletRequest request 
                        = HttpServletRequestUtil.getServletRequest(); //=> 핵심!
        HttpSession session = request.getSession();

        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals(applicationConfiguration.getCookieId())) {
                memberSeq = (Long) session.getAttribute(cookie.getValue());
            }
        }
        return memberSeq;
    }
}
```


<br>

## <span style="color:gray">회고</span>

---

원래 컨트롤러에서 request 객체를 매개변수로 넘기면서 프로젝트를 진행했었다.

이 부분이 매우 거슬렸는데 이번 기회에 우연치 않게 **RequestContextHolder**을 알게 됐다.

보다 세션을 만들고 관리할 때 매개변수가 없어져서 코드가 더 깔끔해짐을 알 수 있었다.

그리고 어느 위치에서든 HttpServletRequest를 사용할 수 있다는 점을 알아서 다행이다.

추가적으로 Spring Servlet에 대해서 다시 복습하는 시간을 가지는 계기가 됐다.
