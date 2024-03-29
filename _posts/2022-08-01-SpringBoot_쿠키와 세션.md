---
layout: post
title: 쿠키와 세션
categories: spring
tags: springBoot
---

## <span style="color:gray">🔎 쿠키와 세션을 왜 사용할까?</span>

---

> Http 프로토콜의 특징이자 약점을 보완하기 위해서 사용된다.

**⒈ Connectionless 프로토콜 (비연결 지향성)**

클라이언트가 서버에 요청을 보냈을 때, 그 요청에 맞는 응답을 보낸 후 

연결을 끊는 처리 방식이다.

<br>

**⒉ Stateless 프로토콜 (상태정보 유지 안함)**

클라이언트의 상태 정보를 가지지 않는 서버 처리 방식이다.

클라이언트와 첫 번째 통신에서 데이터를 주고 받았다 해도, 두 번째 통신에서

이전 데이터를 유지하지 않는다.

<br>

하지만 실무에서는 데이터 유지가 필요한 경우가 많다. 왜냐면 정보가 유지되지 않으면, 

매번 페이지를 이동할 때 마다 로그인을 다시 하는 일이 발생하기 때문이다. 

따라서, ***<span style="background-color:yellow">Stateless 경우를 대처하기 위해서 쿠키와 세션을 사용한다.</span>***

<br>

결과적으로 현재 요청을 보내는 사용자가 누군지 브라우저에서 기억하기 위해 쿠키와 세션을 

사용하는데, 최근에 토큰을 통한 로그인을 구현할 때도 session에 토큰을 담는 방식을 

사용했다. 그리고 form-data로 로그인을 구현할 때도 session에 사용자의 정보와 일련번호를

담은 쿠키/세션을 사용했었다.

<br>

## <span style="color:gray">🔎 Cookie(쿠키)</span>

---

#### ***쿠키란?***

HTTP 쿠키란 HTTP의 일종으로 인터넷 사용자가 어떠한 웹사이트를 방문할 경우 사용자의 

웹 브라우저를 통해 인터넷 사용자의 컴퓨터나 다른 기기에 설치되는 작은 기록 정보 파일을

일컫는다. 웹 쿠키, 브라우저 쿠키라고도 한다. 이 기록 파일에 담긴 정보는 인터넷 사용자가

같은 웹사이트를 방문할 때마다 읽히고 수시로 새로운 정보로 바뀐다. 

쿠키는 소프트웨어가 아니다. 쿠키는 컴퓨터 내에서 프로그램처럼 실행될 수 없으며 바이러스를

옮길수도 없다. 하지만 누군가 악의적으로 쿠키를 훔쳐서 해당 사용자의 웹 계정 접근권한을 

획득할 수 있다.

<br>

#### ***쿠키의 특징***

|특징|
|----|
|이름, 값, 만료일, 경로정보로 구성되어 있다.|
|클라이언트에 총 300개의 쿠키를 저장할 수 있다.|
|하나의 도메인 당 20개의 쿠키를 가질 수 있다.|
|하나의 쿠키는 4kb까지 저장 가능하다.|

<br>

#### ***쿠키의 동작순서***

|순서|설명|
|----|----|
|1|클라이언트가 로그인을 요청한다.|
|2|웹 서버는 쿠키를 생성한다.|
|3|생성한 쿠키에 정보를 담아 HTTP 화면을 돌려줄 때, 클라이언트 브라우저에 쿠키를 저장한다.|
|4|넘겨 받은 쿠키는 클라이언트가 가지고 있다가, 다시 서버에 요청할 때 요청과 함께 쿠키를 전송한다.|
|5|동일 사이트 재방문시 클라이언트의 pc에 해당 쿠키가 있는 경우, 요청과 함께 쿠키를 전송한다.|


<br>

## <span style="color:gray">🔎 Session(세션)</span>

---

#### ***세션이란?***

일정 시간동안 같은 사용자로 부터 들어오는 일련의 요구를 하나의 `상태`로 보고,

그 상태를 일정하게 유지시키는 기술이다. 여기서 일정 시간은 방문자가 웹 브라우저를

통해 웹 서버에 접속한 시점으로부터 웹 브라우저를 종료하여 연결을 끝내는 시점을 

말한다. 즉, 방문자가 웹 서버에 접속해 있는 상태를 하나의 단위로 보고 그것을 

세션이라고 한다.

<br>

#### ***OSI 7계층의 세션 계층*** 

세션 계층은 응용 프로그램 계층 간의 통신을 제어하는 구조를 제공하기 위해 응용

프로그램계층 사이의 접속을 `설정`, `유지`, `종료`하는 역할을 한다. 또한 사용자와

전송 계층 간의 인터페이스 역할을 하며, LAN사용자가 서버에 접속할 때 이를 관리하는

기능을 수행한다.

<br>

|세션 계층의 기능|설명|
|----------------|----|
|동기화|전송 계층으로 전송할 순서와 정송할 때 수신자 확인이 필요한 곳을 결정|
|세션 연결의 설정과 종료|세션 연결의 설정과 종료 및 관리 절차를 정의|
|대화 제어|누가 언제 보내는지 결정|


<br>

#### **세션 특징**

|특징|
|----|
|웹 서버에 웹컨테이너의 상태를 유지하기 위한 정보를 저장한다.|
|웹 서버에 저장되는 쿠키(=세션 쿠키)|
|브라우저를 닫거나, 서버에서 세션을 삭제했을 때만 삭제가 된다. → 쿠키보다 비교적 보안이 좋다.|
|각 클라이언트 고유 Session ID를 부여한다.|

<br>

#### ***세션의 동작순서***

|순서|설명|
|-|----|
|1|클라이언트가 페이지를 요청한다. (사용자가 웹사이트 접근)|
|2|서버는 접근한 클라이언트의 Request-Header 필드인 Cookie를 확인하여, 클라이언트가 해당 session-id를 보냈는지 확인한다.|
|3|session-id가 존재하지 않는다면, 서버는 session-id를 생성해 클라이언트에게 돌려준다.|
|4|서버에서 클라이언트로 돌려준 session-id를 쿠키를 사용해 서버에 저장한다.|
|5|클라이언트는 재접속 시, 이 쿠키(JSESSIONID)를 이용하여 session-id 값을 서버에 전달|

---

<br>

## <span style="color:gray">🔎 쿠키와 세션의 차이</span>

|비교 대상|쿠키|세션|
|---------|----|----|
|저장 위치|클라이언트|웹 서버|
|저장 형식|text|Object|
|만료 시점|쿠키 저장시 설정|브라우저 종료시|
|리소스|클라이언트|서버|
|용량|총 300개|서버가 혀용하는 정도|
|속도|세션보다 빠름|쿠키보다 느림|
|보안|세션보다 안좋음|쿠키보다 좋음|

<br>

## <span style="color:gray">🔎 실제 사용 예시</span>

---

```java
private void addUserSeqCookie(HttpServletRequest request, HttpServletResponse response) {

    Long userSeq = ((CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
            .getLoginUser()
            .getUserSeq();

    HttpSession session = request.getSession();
    String sessionId = UUID.randomUUID().toString();
    session.setAttribute(sessionId, userSeq);

    Cookie cookie = new Cookie("mySessionId", sessionId);

    //TODO : set Cookie parameter
    cookie.setMaxAge(3600);
    cookie.setPath("/");
    response.addCookie(cookie);
}
```

새로 진행하는 프로젝트의 개발 환경 셋팅과 로그인을 내가 담당하게 되었다. 

로그인은 Spring Security를 사용하였는데 사용자 일련번호(UserSeq)를 따로 세션에 

저장해줘햐 하는 요구사항이 있어 세션과 쿠키를 다시 리마인드 하게 되었다.

<br>

#### 세션 생성하기
---

우선 세션을 가저오고, 추가하는건 굉장히 간단한다. 

아래와 같이 코드를 작성해주면 되는데, 여기서 한 가지 알고 넘어가야할 부분이 있다.

```java
HttpSession session = request.getSession();
session.setAttribute(String sessionId, String userSeq);
```

> 참고 : sessionId는 UUID를 램덤으로 생성해서 넣어주는 것이 보안상 좋다.

getSession() 메서드는 파라미터로 boolean값을 가질수 있다.

`true`(default)의 경우에는 세션이 이미 있는지 확인한다. 있다면 그 세션을 반환하고 

없다면 새로운 세션을 생성한다. `false`의 경우에는 세션이 있다면 그 세션을 반환하지만,

없다면 null을 반환한다.

<br>

#### 쿠키 생성하기
---

이렇게 세션을 생성하고, 세션 아이디를 쿠키 값에 넣어서 클라이언트 브라우저에 

반환해주면 된다.

```java
Cookie cookie = new Cookie("mySessionId", sessionId);
response.addCookie(cookie);
```