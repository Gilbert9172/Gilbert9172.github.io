---
layout: post
title: 백그라운드에서 스프링부트 서버 돌리기
categories: linux
---

## <span style="color:gray">nohup - No Hang Up</span>

회사에서 프로잭트 개발중에 스프링부트 서버를 배포했다. 처음에는 리눅스에서 서버를 백그라운드로 

실행하지 않아서 리눅스 서버와 연결을 끊으면 서버가 내려갔다. 해결방법은 아래와 같았다.

```Prompt
nohup ./mvnw spring-boot:run -D"spring-boot.run.profiles"=prod > api.out &
```

nohup 명령어는 리눅스에서 프로세스를 실행한 터미널의 세션 연결이 끊어지더라도 지속적으로 

동작 할 수 있게 해주는 명령어입니다. 기본적으로 터미널에서 세션 로그아웃(logout)이 발생하면

리눅스는 해당 터미널에서 실행한 프로세스들에게 `HUP signal`이 전달하여 종료시키게 되는데,

이 `HUP signal`을 프로세스가 무시(ignore)하도록 하는 명령어이다.

<br>

그리고 스프링 부트 서버를 터미널에서 실행할 때는 아래와 같은 명령어를 사용한다.

```prompt
./mvnw spring-boot:run -D"spring-boot.run.profiles"=prod
```

마지막에 prod 자리에는 `application.properties`에 설정한 profile id를 넣으면 된다.

---

<br>

## <span style="color:gray">xxx.out</span>

명령어 뒤에 '>' 또는 '>>' 와 같은 리다이렉션을 이용하면 nohup의 표준출력을

xxx.out 파일에 출력할 수 있다고 한다. 

만약 어디에도 표준출력을 기록하고 싶지 않다면, 아래와 같이 실행하면 된다.

```prompt
$ nohup ./mvnw spring-boot:run -D"spring-boot.run.profiles"=prod > ./null
```

---

<br>

## <span style="color:gray">&</span>

`&`을 프로그램 실행시에 명령어 맨 끝에 붙여주면 해당 프로그램이 백그라운드로 

실행된다. 

---

<br>

## <span style="color:gray">nohup과 &의 차이</span>

**`nohup`** 은 프로그램을 데몬의 형태로 실행시키는 것이기 때문에 로그아웃으로 세션이

종료되더라도 프로그램이 종료되지 않는다. 그러나 **`&`** 실행은 단지 프로그램 사용자 눈에

보이지 않는 백그라운드 형태로 돌리고 있는 것이기 때문에 로그아웃으로 세션과 연결이

끊어지면 실행되고 있던 프로그램도 함께 종료된다. 

---

<br>

## <span style="color:gray">원하는 위치에 로그 쌓기</span>

예를 들어서 표준출려과 표준에러를 다른 파일에 쓰고 싶을 경우 아래와 같이 입력하면 된다.

```prompt
nohup ./mvnw spring-boot:run -D"spring-boot.run.profiles"=prod 1 > arthive.out 2 > arthive.err
```

---

<br>

📚 [참고 블로그](https://joonyon.tistory.com/98)

---