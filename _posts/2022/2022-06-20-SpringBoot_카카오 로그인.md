---
layout: post
title: 카카오 로그인
categories: spring
tags: springBoot
---

## <span style="color:gray">[ 연동 준비 단계 ]</span>

***📚 [카카오 로그인 공식문서](https://developers.kakao.com/docs/latest/ko/kakaologin/common)***

#### 1. 내 어플리케이션 등록하기

<img src="/assets/img/spring/kakao/kakao1.png">

그리고 플랫폼 추가하기를 누르고 추가할 플랫폼의 URL을 입련한다.

> 연습이라서 http://localhost:8080 으로 입력함.

<br>

#### 2. 제품설정

활성화 설정을 해주고, Redirect URL을 입력해준다. 

Redirect URI로 카카오톡 로그인 후 반환 값이 돌아온다.

<br>

#### 3. 기타설정

동의항목 및 활성화를 설정해준다.

---

<br>

## <span style="color:gray">[ 연동하기 ]</span>

우선 가장 먼저 카카오톡 연동의 처리과정에 대해서 알아봤다. 

과정을 크게 세가지로 먼저 인가코드를 받고, 받은 인가코드를 통해 토큰을 

발급받는다. 그리고 마지막으로 받은 토큰을 기반으로 로그인을 완료한다.

<br>

### 1. 인가코드 받기

<img src="/assets/img/spring/kakao/kakao2.png">

위 그림은 인가 코드를 밥급 받는 과정이다. 사용자는 동의 화면에서 서비스 

이용 시 필요한 사용자 정보 및 권한 제공에 동의하고 로그인을 요청하거나

로그인을 취소할 수 있다. 사용자가 필수 동의 항목에 모두 동의한 뒤,

`동의하고 계속하기` 버튼을 누르면, 카카오 인증 서버는 해당 사용자에 대한

인가 코드를 발급해 서비스의 **`redirect_uri`** 에 전달한다.

```java
kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code
```

이 URI로 GET 요청을 보내면 code 값을 받을 수 있다.

---

<br>

### 2. 토큰 받기

1번에서 받은 인가코드로 토큰 발급을 요청한다. 인가 코드 받기 만으로는 카카오

로그인이 완료되지 않으며, 토큰 받기까지 마쳐야 카카오 로그인을 정상적으로 

완료할 수 있다. 토큰 받기의 경우 필수 파라미터를 포함하여 POST로 요청한다.

```java
Content-type : application/x-www-form-urlencoded;charset=utf-8
URI : kauth.kakao.com/oauth/token
```

성공적으로 응답을 받게 되면 아래의 그림과 같이 JSON 객체를 반환 받는다.

<img src="/assets/img/spring/kakao/kakao3.png">