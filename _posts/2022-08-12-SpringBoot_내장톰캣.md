---
layout: post
title: 내장 톰캣
categories: spring
tags: springBoot
---

## <span style="color:gray">WHY?</span>

---

Web Server는 정적인 파일을 서빙하고, WAS(Web Application Server)는 WS의 역할과

동적이 부분도 서빙해주는 역할을 한다. 그런데 오늘 프로젝트에서 파일 업로드를 구현하던

와중에 저장할 경로를 설정해주는 부분에서 애를 먹었다. 

맨 처음에 경로를 WAS 서버 내부로 지정하려고 했지만 실패했을 뿐더러 WAS 내부에 

파일을 저장하면 안된다는 글을 읽었다. 그렇게 고민하던 와중에 `내부톰켓` 이라는 

키워드를 듣고 위의 문제를 해결하게 됐다. 그래서 오늘은 톰캣에 대해서 정리할까 한다.

<br>

## <span style="color:gray">Embedded Tomcat & Tomcat</span>

---

Spring Boot에는 ***`tomcat`*** 이 내장되어 있어, 애플리케이션을 빌드하고 실행하는

것만으로 웹 어플리케이션을 서비스 할 수 있다.

그러나 과거에 내장 톰켓이 없던 시절에는 자바 웹 어플리케이션을 톰캣에 포함시켜줘야 

했다고 한다. 그러면 한 번 이 둘의 실행 방법의 차이에 대해서 알아보자.

<br>

#### ***내장 톰캣***

정말 간단하다. 빌드 된 스프링부트 애플리케이션(jar, war)를 실행만 해주면 된다.

참고로 톰캣 설정은 `application.properties`에서 하면 된다. [관련 공식 문서](https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html#appendix.application-properties.server)

<br>

#### ***외장 톰캣***

• 톰캣을 설치한다.

• 톰캣 설정 파일을 구성한다.

• 톰캣 webApp 디렉토리에 빌드 된 war파일을 포함시켜준다.

• 톰캣을 실행해준다.

<br>

## <span style="color:gray">차이점</span>

---

외장 톰캣을 `virtual host`라는 기증을 가지고 있다. 

도메인 host에 따라 각각의 다른 루트 컨텍스트를 갖게 하여 하나의 웹애플리케이션 

배포만으로 마치 여러 애플리케이션을 운영하는 것 처럼 할 수 있다. 

이 기능을 하용하기 위해서는 server.xml 파일을 작성해주면 된다.

<br>

## <span style="color:gray">정리</span>

---

그렇다면 언제 외장 톰캣을 써야하고, 또 내장 톰캣은 언제 써야할까?

프로제트의 규모 혹은 서비스의 규모에 따라 적절한 선택이 필요하다고 생각한다.

정말 간단한 서비스 혹은 사용자가 많이 없을 것 같은 서비스는 별도의 

외장 톰캣없이 내장 톰캣만으로 충분히 서비스 할 수 있다.

<img src="/assets/img/spring/server/내장톰캣.jpg">

<br>

반면에 엄청 나게 큰 큐모의 프로젝트이고 몇 백명 혹은 몇 천명의 사용자가 

있을거 같은 서비스는 내장 톰캣 하나만으로는 서버 부하를 감당하기 힘들다고

생각이 든다. 요즘 큰 스타트업 기업만 봐도 하나의 플랫폼 내에서 여러개의

서비스를 운영할 뿐만 아니라 각각의 서비스의 규모도 무시무시하게 크다.

이런 경우라면 앞단에 `Reverse Proxy`를 두고 뒤에 여러개의 WAS를 두는 형식으로 

프로젝트를 구성하면 된다. 이렇게 되면 웹서버와 WAS의 역할을 구분함과 동시에 

`Reverse Proxy`가 로드벨런서의 역할도 함께 해준다.

> Forward Proxy와 Reverse Proxy는 따로 포스팅.

<img src="/assets/img/spring/server/loadBalancing.png">

간략하게 설명을 하자면, 클라이언트가 프록시 서버에 요청을 보내면, 프록시 서버는 

해당 요청을 실제 서비스 서버에 보낸다. 그리고 실제 서비스 서버는 요청에 대한 

***<span style="color:red">응답을 프록시 서버로 보낸다.</span>*** 이제 응답을 받은 프록시 서버가 클라이언트에게 응답을 

보내준다. 이렇게 프록시 서버를 쓰는 이유는 내가 알기론 3가지가 있는데 아래와 같다.

• 캐시 데이터를 저장

• 보안 목적 (프록시가 중간에 있으면 실제 IP를 감출수 있다.)

• 접속 우회