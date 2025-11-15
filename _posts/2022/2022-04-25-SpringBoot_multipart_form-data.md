---
layout: post
title: multipart/form-data
categories: spring
tags: springBoot
---

## <span style="color:gray">multipart/form-data</span>

파일을 업로드 하려면 파일은 문자가 아니라 바이너리 데이터를 전송해야 한다.

문자를 전송하는 방식으로 파일을 전송하기는 어렵다. 

이 문제를 해결하기 위해 **`multipart/form-data`** 라는 전송방식을 제공한다.
 
<br>
 
이 방식을 사용하려면 Form 태그에 별도의 **`enctype="multipart/form-data"`** 를 지정해야한다.

**`multipart/form-data`** 방식은 다른 종류의 여러 파일과 폼의 내용을 함께 전달할 수 있다.

폼의 입력 결과로 생성된 HTTP 메시지를 보면 각각의 전송 항목이 구분이 되어있다. 

<img src="/assets/img/spring/multipart.png">

Content- Disposition이라는 항목별 헤더가 추가되어 있고 여기에 부가 정보가 있다. 

위 그림에서는 username , age , file1 이 각각 분리되어 있고, 폼의 일반 데이터는 각 항목별로 

문자가 전송되고, 파일의 경우 파일 이름과 Content-Type이 추가되고 바이너리 데이터가 전송된다.

***<span style="background-color:yellow">multipart/form-data는 이렇게 각각의 항목을 구분해서, 한번에 전송하는 것이다.</span>***

<br>

> Part

multipart/form-data는 application/x-www-form-urlencoded와 비교해서 매우 복잡하고 각각의 부분(part)로

나누어져 있다. 그렇다면 이렇게 복잡한 HTTP메세지를 서버에서 어떻게 사용할 수 있을까?

<br>

> Part 주요 메서드

`part.getSubmittedFileName()` : 클라이언트가 전달한 파일명

`part.getInputStream()` : Part의 전송 데이터를 읽을 수 있다.

`part.write(..)` : Part를 통해 전송된 데이터를 저장할 수 있다.


<br>

> 멀티파트 사용 옵션

**업로드 사이즈 제한**

```java
spring.servlet.multipart.max-file-size=1MB

spring.servlet.multipart.max-request-size=10MB
```

<br>

**spring.servlet.multipart.enabled=false**

서블릿 컨테이너는 멀티파트와 관련된 처리를 하지 않는다.

참고로 기본값은 true이다.

---