---
layout: post
title: Servlet
categories: spring
tags: springBoot
---

## <span style="color:gray">CGI</span>

---

#### <span style="background-color:black; color:white">CGI란?</span>

`CGI(Common GateWay Interface)`는 공용 게이트웨이 인터페이스의 약어로, 웹 서버와 

응용 프로그램간의 통신을 위한 프로토콜이다. 웹 브라우저로 부터 수신한 요청에 실린 정보를 

어떻게 Application에 전달할 것이며, 또 Application에서 받은 응답 결과를 어떻게 웹 서버가 

수신할 것인지에 대한 약속이라고 생각하면 된다.

> CGI를 통해 웹서버와 통신하는 프로그램들은 Java, Python, Php등 다양한 언어로 작성이 가능하다.

<br>

#### <span style="background-color:black; color:white">CGI를 안쓰는 이유는?</span>

요청이 들어올 때마다 애플리케이션 프로세스를 다시 실행해야 한다는 점이다. 

만약 다량의 요청이 동시에 들어온다면 그 때마다 새로운 프로세스를 생성하고, 지우고 다시 생성해야 

한다. 이는 매우 비효율적이다. 특히 이러한 비효율성은 파이썬과 같은 스크립트 언어에서 두드러진다. 

스크립트 언어에서는 보통 코드를 실행할 때마다 코드를 매번 해석해야 하기 때문이다. 

<br>

#### <span style="background-color:black; color:white">CGI의 발전</span>

> 차차 정리.

우선 Servlet, mod_python, FastCGI, SCGI, WSGI 등이 있다 정도만 알아두자.

<br>

## <span style="color:gray">Servlet</span>

---

#### <span style="background-color:black; color:white">Servlet의 탄생</span>

앞서 봤듯, CGI는 매 요청 마다 새로운 프로세스를 생성하고 지우기를 반복하는 단점을 

가지고 있다. 앞선 개발자들은 이렇게 프로세스 단위로 실행되던 CGI의 문제점을 해결하고자 

하였고, 이 문제를 해결하기 위해 등장한 것이 바로 ***<span style="background-color:#F0E68C">Java Servlet</span>*** 이다.

<br>

#### <span style="background-color:black; color:white">Servlet이란?</span>

서블릿은 각 요청에 대해 프로세스를 생성해 처리하는 것이 아니라, 프로세스 내부에 

**<span style="background-color:#F0E68C">스레드 풀</span>** 이라는 스레드들이 생성될 수 있는 공간을 만들어 멀티스레드로 요청을 처리한다.

서블릿은 CGI와 완전히 다른 개념이 아니다. 서블릿도 내부적으로 CGI 프로토콜을 지킨다.

서블릿은 JSP, Spring Framework의 부모님과도 같은 존재이며 자식인 JSP, Spring Framework는 

내부적으로 서블릿 기술을 사용하고 있다. 그래서 스프링 프레임워크의 구조를 완벽하게 이해하고자 

한다면 서블릿부터 제대로 알아야 한다. 

<br>

#### <span style="background-color:black; color:white">Tomcat이란?</span>

**`Apache Tomcat`** 은 동적인 데이터 처리를 위해 자바 서블릿이 실행될 수 있는 **<span style="background-color:#F0E68C">웹(서블릿) 컨테이너</span>**

환경을 제공하는 Web Application Server이다.

<img src="/assets/img/spring/server/tomcat.png">

일반적인 웹서버는 정적인 처리만 가능하지만 Tomcat은 WAS로 웹서버와는 다르게 DB연결,

다른 응용 프로그램과 상호 작용 등 동적인 기능들을 사용할 수 있다. 

Tomcat은 **<span style="background-color:#F0E68C">Apache 웹서버의 일부 기능 + Web 컨테이너 조합</span>** 으로, 웹서버의 정적 데이터 처리 기능과 

동적 데이터 처리기능 모두를 포함하고 있다. **하나의 Tomcat은 하나의 JVM을 가지고 있다.**

<br>

#### <span style="background-color:black; color:white">Servlet의 기본적인 동작 과정</span>

서블릿은 Web Application Server 안에서 구동된다. 동장 과정을 다음과 같다.

<img src="/assets/img/spring/server/was2.png">

<br>

⒈ Web Server는 HTTP request를 Web Container(Servlet Container)에게 위임한다.

- 어떤 URL과 매핑되어 있는지 확인.

- 클라이언트(browser)의 요청 URL을 보고 적절한 Servlet을 실행

<br>

⒉ Web Container는 service() 메서드를 호출하기 전에 Servlet 객체를 메모리에 올린다.

- Web Container는 적절한 Servlet 파일을 컴파일(.class 파일 생성)한다.

- .class 파일을 메모리에 올려 Servlet 객체를 만든다.

- 메모리에 로드될 때 Servlet 객체를 초기화하는 init() 메서드가 실행된다.

<br>

⒊ Web Container는 Request를 thread를 사용하여 처리한다.

- 쓰레드 풀을 사용한다.

- 각 thread는 Servlet의 단일 객체에 대한 service() 메서드를 실행한다.

<br>

⒋ HttpServletRequest와 HttpServletResponse 객체를 생성하여 Servlet에 전달한다.

- Thread는 Servlet의 `service()` 메서드를 호출한다.

- `service()` 메서드는 요청에 맞게 `doGet()` 또는 `doPost()` 메서드를 호출한다.

<br>

⒌ `doGet()` 또는 `doPost()` 메서드는 인자에 맞게 생성된 적절한 동적 페이지를 

Response 객체에 담아 WAS에 전달한다.

<br>

⒍ WAS는 Response 객체를 HttpResponse 형태로 바꾸어 Web Server에 전달한다.

<br>

⒎ 생성된 Thread를 종료하고, HttpServletRequest와 HttpServletResponse 객체를 제거한다.

<br>

#### <span style="background-color:black; color:white">Servlet 생명주기</span>

**<span style="background-color:#F0E68C">서블릿 객체는 싱글턴으로 관리한다!!!</span>**

서블릿 컨테이너는 서블릿 객체를 생성, 초기화, 호출, 종료하는 생명주기를 관리한다.

<br>

클라이언트 요청이 들어오면 WAS는 해당 요청에 맞는 Servlet이 메모리에 있는지 확인한다.

만약 메모리에 없다면 해당 Servlet class를 메모리에 올린 후(Servlet 인스턴스 생성) 

`init()` 메소드를 실행하고 `service()` 매소드를 실행한다. 그러나 메모리에 이미 있다면

기존에 있는 인스턴스를 사용하고, `service()` 매소드를 실행한다.

<br>

마지막으로 `destory()` 메소드는 WAS 종료되거나 갱신될 때 1회 호출되며, 

서블릿 인스턴스를 메모리에서 제거한다.

<br>


#### <span style="background-color:black; color:white">Servlet 실습</span>

우선 Servlet 클래스를 상속받는 구상 클래스를 작성해준다.

```java
@WebServlet(name = "helloServlet", urlPatterns = "/hello")
public class HelloServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("HelloServlet.service");
        super.service(request, response);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("HelloServlet.doGet");

        System.out.println("request = " + request);
        System.out.println("response = " + response);

        String username = request.getParameter("username");
        System.out.println("username = " + username);               // 서블릿 덕분에 이렇게 쉽게 쿼리파라미터를 읽을 수 있다.

        response.setContentType("text/plain");
        response.setCharacterEncoding("utf-8");
        response.getWriter().write("hello " + username);        // HttpMessage 바디에 데이터가 들어간다.
    }
}

```

<img src="/assets/img/spring/server/요청 응답 구조.png">

요청이 들어오면 request, response 객체를 만들어서 싱글턴으로 떠 있는 helloServlet을 

호출해준다. 이때 `service()` 메소드를 호출해주면서 `doGet()`또는 `doPost()`를 호출해주고,

응답 결과를 reponse 객체에 담아 브라우저로 보내준다.


<br>

## <span style="color:gray">참고한 자료</span>

---

***📚 <a href="https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=ginameee&logNo=220868560433" target="_blank">CGI란?</a>***

***📚 <a href="https://namu.wiki/w/Common%20Gateway%20Interface" target="_blank">나무위키 - CGI</a>***

***📚 <a href="https://velog.io/@seanlion/cgihistory" target="_blank">CGI의 발전</a>***

***📚 <a href="https://velog.io/@suhongkim98/CGI%EC%99%80-%EC%84%9C%EB%B8%94%EB%A6%BF-JSP%EC%9D%98-%EC%97%B0%EA%B4%80%EA%B4%80%EA%B3%84-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0" target="_blank">CGI 그리고 Servlet</a>***

***📚 <a href="https://gmlwjd9405.github.io/2018/10/28/servlet.html" target="_blank">Servlet이란?</a>***

***📚 <a href="https://medium.com/svelte-seoul/%EC%84%9C%EB%B2%84-web-server-cgi-was-wsgi-%EC%97%90-%EB%8C%80%ED%95%9C-%EC%9D%B4%ED%95%B4-2ab0f9bfabd4" target="_blank">Web Server, CGI, WAS, WSGI</a>***

***📚 <a href="https://kangbk0120.github.io/articles/2022-02/cgi-wcgi-asgi" target="_blank">WSGI, ASGI</a>***

***📚 <a href="https://gmlwjd9405.github.io/2018/10/27/webserver-vs-was.html" target="_blank">WAS와 WS 비교</a>***