---
layout: post
title: 백그라운드에서 스프링부트 서버 돌리기
categories: Linux
---

## <span style="color:gray">nohup</span>

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