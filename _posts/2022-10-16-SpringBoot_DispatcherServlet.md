---
layout: post
title: DispatcherServlet
categories: spring
tags: springBoot
---

## <span style="color:gray">DispatcherServlet</span>

---

#### <span style="background-color:black; color:white">이전 이야기</span>

<a href="https://gilbert9172.github.io/spring/2022/10/15/SpringBoot_servlet/" target="_blank">이전 포스팅</a>에서 CGI와 Servlet에 대해서 자세하게 공부했다.

이번에는 Servlet 인터페이스를 구현한 Spring MVC의 핵심인 DispatcherServlet에 대해서

자세히 살펴볼 예정이다.

<br>

#### <span style="background-color:black; color:white">DispatcherServlet이란?</span>

DispatcherServlet도 `Servlet`이다. 아래의 다이어그램을 보면 한 눈에 알 수 있다.

<img src ="/assets/img/spring/server/dispatcherServletDiagram.png"><br>

DispatcherServlet은 표현 계층(Presentation layer) 전면에서 HTTP 프로토콜을 통해 들어오는 

모든 요청을 가장 먼저 받아 적합한 컨트롤러에 위임해주는 Front Controller이다.

<br>

클라이언트로부터 어떠한 요청이 오면 Tomcat(톰캣)과 같은 서블릿 컨테이너가 요청을 받게 된다. 

그리고 이 모든 요청을 프론트 컨트롤러인 DispatcherServlet이 가장 먼저 받게 된다. 그러면 

DispatcherServlet은 공통적인 작업을 먼저 처리한 후에 해당 요청을 처리해야 하는 컨트롤러를 

찾아서 작업을 위임한다.

<br>

스프링 부트는 DispatcherServlet을 서블릿으로 자동으로 등록하면서 **모든 경로**에 대해서

매핑한다. 더 자세한 경로가 우선 순위가 높다. 그래서 기존에 등록한 서블릿도 함께 동작한다.

<br>

여기서 **<span style="background-color:#F0E68C">Front Controller</span>** 라는 용어가 사용되는데, Front Controller는 주로 

서블릿 컨테이너의 제일 앞에서 서버로 들어오는 클라이언트의 모든 요청을 받아서 

처리해주는 컨트롤러로써, MVC 구조에서 함께 사용되는 디자인 패턴이다.


<br>

## <span style="color:gray">DispatcherServlet 동작 과정</span>

---

WAS에서 HttpServletRequest, HttpServletResponse 객체를 생성하여 DispatcherServlet에게 

전달한다. DispatcherServlet은 해당 객체들을 파라미터로 전달받고, 웹 요청에 따른 응답을 

생성하기 위해 맨 처음으로 `doService()` 메소드를 호출한다. 그리고 해당 메소드 내부에서 

이어 `doDispatch()` 메소드를 호출한다. 

<br>

**▷ doServicve**

파라미터로 HttpServletRequest, HttpServletResponse 객체를 받는다.

```java
protected void doService(HttpServletRequest request, HttpServletResponse response) throws Exception {
    ...
}
```

<br>

request, response를 파라미터로 하는 `doDispatch()` 메소드를 호출한다.

```java
// doService 메소드 내부의 주요 로직
try {
    this.doDispatch(request, response);
} finally {
    ...
}
```

<br>

**▷ doDispatch**

`doDispatch()` 안에서 어떤 과정이 진행되는지 코드를 통해서 그 흐름을 자세히 알아봤다.

<br>

**<u>1. Handler 조회</u>**

핸들러 매핑을 통해 요청 URL에 매핑된 핸들러(컨트롤러)를 조회한다.

만약 핸들러가 없다면 `noHandlerFound()` 메소드를 호출한다.

```java
// doDispatch
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {

    HandlerExecutionChain mappedHandler = null;

    try {
        try {
            ModelAndView mv = null;
            Object dispatchException = null;

            try {
                ...

                /************************* 주요 로직 *************************/
                mappedHandler = this.getHandler(processedRequest);
                if (mappedHandler == null) {
                    this.noHandlerFound(processedRequest, response);
                    return;
                }
            }
        }
    }
}
```
```java
// getHandler
@Nullable
protected HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception {
    if (this.handlerMappings != null) {
        Iterator var2 = this.handlerMappings.iterator();

        while(var2.hasNext()) {
            HandlerMapping mapping = (HandlerMapping)var2.next();
            HandlerExecutionChain handler = mapping.getHandler(request);
            if (handler != null) {
                return handler;
            }
        }
    }

    return null;
}
```
```java
// noHandlerFound
protected void noHandlerFound(HttpServletRequest request, HttpServletResponse response) throws Exception {
    if (pageNotFoundLogger.isWarnEnabled()) {
        pageNotFoundLogger.warn("No mapping for " + request.getMethod() + " " + getRequestUri(request));
    }

    if (this.throwExceptionIfNoHandlerFound) {
        throw new NoHandlerFoundException(request.getMethod(), getRequestUri(request), (new ServletServerHttpRequest(request)).getHeaders());
    } else {
        response.sendError(404);
    }
}
```

<br>

**<u>2. Handler Adapter 조회</u>**

1번에서 찾은 핸들러(컨트롤러)를 실행하기 위한 Handler Adapter를 찾는 과정이다.



```java
@Nullable
private List<HandlerAdapter> handlerAdapters;

// doDispatch
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {

    HandlerExecutionChain mappedHandler = null;

    try {
        try {
            ModelAndView mv = null;
            Object dispatchException = null;

            try {
                ...

                /************************* 주요 로직 *************************/
                HandlerAdapter ha = this.getHandlerAdapter(mappedHandler.getHandler());
                String method = request.getMethod();
                boolean isGet = HttpMethod.GET.matches(method);
                if (isGet || HttpMethod.HEAD.matches(method)) {
                    long lastModified = ha.getLastModified(request, mappedHandler.getHandler());
                    if ((new ServletWebRequest(request, response)).checkNotModified(lastModified) && isGet) {
                        return;
                    }
                }
            }
        }
    }
}
```

<br>

`List<HandlerAdapter> handlerAdapters`가 null이 아니라면 Iterator 객체를 만든다.

Iterator에 다음 요소가 있다면, 해당 **어댑터**가 핸들러를 처리(지원)할 수 있는지 

확인하고, 만약 처리(지원)할 수 있다면 해당 **어댑터**를 반환한다.

매개변수로 넘어온 핸들러를 처리할 **어댑터**가 없다면 <span style="color:red">ServletException</span>을 발생시킨다.

```java
// getHandlerAdapter
protected HandlerAdapter getHandlerAdapter(Object handler) throws ServletException {
    if (this.handlerAdapters != null) {
        Iterator var2 = this.handlerAdapters.iterator();

        while(var2.hasNext()) {
            HandlerAdapter adapter = (HandlerAdapter)var2.next();
            if (adapter.supports(handler)) {
                return adapter;
            }
        }
    }

    throw new ServletException("No adapter for handler [" + handler + "]: ...");
}
```

<br>

찾은 HandlerAdapter로 Handler의 메소드를 실행하기 앞서 **Interceptor**의 `applyPreHandle()` 

메소드를 호출한다. 해당 메소드의 반환 타입은 boolean이다. 만약, 반환값이 true면 Interceptor를 

통과하여 다음 단계로 진행된다. 반면, 반환값이 false면 Interceptor를 통과하지 못해 로직을 더이상 

수행하지 않고 종료한다.

```java
boolean applyPreHandle(HttpServletRequest request, HttpServletResponse response) throws Exception {
    for(int i = 0; i < this.interceptorList.size(); this.interceptorIndex = i++) {
        HandlerInterceptor interceptor = (HandlerInterceptor)this.interceptorList.get(i);
        if (!interceptor.preHandle(request, response, this.handler)) {
            this.triggerAfterCompletion(request, response, (Exception)null);
            return false;
        }
    }

    return true;
}
```

<br>

**<u>2. Handler(Controller) 실행</u>**

Interceptor를 통과하면, 앞서 찾은 HandlerAdapter를 이용하여 `handle()` 메소드로 

Handler(Controller)의 메소드를 실행한다. handle() 메소드의 반환 타입은 ModelAndView이다. 

```java
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {

    HandlerExecutionChain mappedHandler = null;

    try {
        try {
            ModelAndView mv = null;
            Object dispatchException = null;

            try {
                ...

                mv = ha.handle(processedRequest, response, mappedHandler.getHandler());
                if (asyncManager.isConcurrentHandlingStarted()) {
                    return;
                }

                this.applyDefaultViewName(processedRequest, mv);
                mappedHandler.applyPostHandle(processedRequest, response, mv);
            } 
    }
}
```
<br>

HandlerAdapter는 인터페이스로 정의되어 있어, 다양한 종류의 HandlerAdapter 구현체에서 

해당 메소드를 구현한다.

```java
public interface HandlerAdapter {
    boolean supports(Object handler);

    @Nullable
    ModelAndView handle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception;

    /** @deprecated */
    @Deprecated
    long getLastModified(HttpServletRequest request, Object handler);
}
```

|구현체 종류|
|-----------|
|AbstractHandlerMethodAdapter|
|HandlerFunctionAdapter|
|HttpRequestHandlerAdapter|
|SimpleControllerHandlerAdapter|
|SimpleServletControllerAdapter|


<br>

handle() 메소드를 실행하면, DispatcherServlet 뒤에 있는 비즈니스 로직을 수행하고 

결과로 ModelAndView를 반환한다. 반면 @RestController의 경우에는 View에 Model이 

렌더링되는 과정은 생략하고 바로 그 다음 단계를 진행한다.

```java
ModelAndView mv = null;
mv = ha.handle(processedRequest, response, mappedHandler.getHandler());
```

<br>

그리고 `applyPostHandle()` 메소드로 ModelAndView에 대해 후처리를 진행한다.

`applyPostHandle()` 메소드는 비즈니스 로직을 전부 수행하고 실행하는 메소드로, 

반환 타입은 void이다.

```java
void applyPostHandle(HttpServletRequest request, HttpServletResponse response, @Nullable ModelAndView mv)
        throws Exception {

    for (int i = this.interceptorList.size() - 1; i >= 0; i--) {
        HandlerInterceptor interceptor = this.interceptorList.get(i);
        interceptor.postHandle(request, response, this.handler, mv);
    }
}
```

<br>

**<u>4. ViewResolver 호출 & View Render</u>**

이제 거의 다 왔다. 위 과정에서 생성? 한 매개변수(processedRequest, response, mappedHandler, mv, 

dispatchException)들을 받는 `processDispatchResult()` 메소드를 호출해준다.

```java
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
    HttpServletRequest processedRequest = request;
    HandlerExecutionChain mappedHandler = null;

    try {
        ModelAndView mv = null;
        try {
            ...
            mv = ha.handle(processedRequest, response, mappedHandler.getHandler());
            this.processDispatchResult(processedRequest, response, mappedHandler, mv, (Exception)dispatchException);
    }
}
```

<br>

```java
private void processDispatchResult(HttpServletRequest request, HttpServletResponse response, @Nullable HandlerExecutionChain mappedHandler, @Nullable ModelAndView mv, @Nullable Exception exception) throws Exception {
    boolean errorView = false;
    if (exception != null) {
        if (exception instanceof ModelAndViewDefiningException) {
            this.logger.debug("ModelAndViewDefiningException encountered", exception);
            mv = ((ModelAndViewDefiningException)exception).getModelAndView();
        } else {
            Object handler = mappedHandler != null ? mappedHandler.getHandler() : null;
            mv = this.processHandlerException(request, response, handler, exception);
            errorView = mv != null;
        }
    }

    if (mv != null && !mv.wasCleared()) {
        this.render(mv, request, response);
        if (errorView) {
            WebUtils.clearErrorRequestAttributes(request);
        }
    } else if (this.logger.isTraceEnabled()) {
        this.logger.trace("No view rendering, null ModelAndView returned.");
    }

    if (!WebAsyncUtils.getAsyncManager(request).isConcurrentHandlingStarted()) {
        if (mappedHandler != null) {
            mappedHandler.triggerAfterCompletion(request, response, (Exception)null);
        }

    }
}
```

<br>

그리고 `processDispatchResult()` 메소드 내부에 있는 `render()` 메소드를 호출한다.

```java
protected void render(ModelAndView mv, HttpServletRequest request, HttpServletResponse response) throws Exception {
    Locale locale = this.localeResolver != null ? this.localeResolver.resolveLocale(request) : request.getLocale();
    response.setLocale(locale);
    String viewName = mv.getViewName();
    View view;
    if (viewName != null) {
        view = this.resolveViewName(viewName, mv.getModelInternal(), locale, request);
        if (view == null) {
            throw new ServletException("Could not resolve view with name '" + mv.getViewName() + "' in servlet with name '" + this.getServletName() + "'");
        }
    } else {
        view = mv.getView();
        if (view == null) {
            throw new ServletException("ModelAndView [" + mv + "] neither contains a view name nor a View object in servlet with name '" + this.getServletName() + "'");
        }
    }

    if (this.logger.isTraceEnabled()) {
        this.logger.trace("Rendering view [" + view + "] ");
    }

    try {
        if (mv.getStatus() != null) {
            request.setAttribute(View.RESPONSE_STATUS_ATTRIBUTE, mv.getStatus());
            response.setStatus(mv.getStatus().value());
        }

        view.render(mv.getModelInternal(), request, response);
    } catch (Exception var8) {
        if (this.logger.isDebugEnabled()) {
            this.logger.debug("Error rendering view [" + view + "]", var8);
        }

        throw var8;
    }
}
```

<br>

`render()` 메소드 내부에 있는 `resolveViewName()` 메소드를 호출하여 

View의 논리 이름을 **물리 이름**으로 변환한다.

```java
@Nullable
protected View resolveViewName(String viewName, @Nullable Map<String, Object> model, Locale locale, HttpServletRequest request) throws Exception {
    if (this.viewResolvers != null) {
        Iterator var5 = this.viewResolvers.iterator();

        while(var5.hasNext()) {
            ViewResolver viewResolver = (ViewResolver)var5.next();
            View view = viewResolver.resolveViewName(viewName, locale);
            if (view != null) {
                return view;
            }
        }
    }

    return null;
}
```

<br>

마지막으로 View 객체의 render() 메소드를 호출하여 View에 Model 데이터를 렌더링한다.

```java
view.render(mv.getModelInternal(), request, response);
```

<br>

**<u>5.</u>**

맨 마지막으로 Interceptor를 한번 더 실행한다. 이때, `triggerAfterCompletion()` 메소드를 호출하고 

응답값이 반환되기 전에 마지막 후처리를 진행한다. 

해당 메소드는 View에 Model를 렌더링한 이후, 즉 가장 마지막에 실행된다.

```java
private void processDispatchResult(HttpServletRequest request, HttpServletResponse response, @Nullable HandlerExecutionChain mappedHandler, @Nullable ModelAndView mv, @Nullable Exception exception) throws Exception {
    
    if (!WebAsyncUtils.getAsyncManager(request).isConcurrentHandlingStarted()) {
        if (mappedHandler != null) {
            mappedHandler.triggerAfterCompletion(request, response, (Exception)null);
        }

    }
}
```

<br>


## <span style="color:gray">참고한 자료</span>

---

***📚 <a href="https://mangkyu.tistory.com/m/18" target="_blank">티스토리 : mangkyu</a>***

***📚 <a href="https://tecoble.techcourse.co.kr/post/2021-06-25-dispatcherservlet-part-1/" target="_blank">테코블 - DispatcherServlet1</a>***

***📚 <a href="https://tecoble.techcourse.co.kr/post/2021-07-15-dispatcherservlet-part-2/" target="_blank">테코블 - DispatcherServlet1</a>***