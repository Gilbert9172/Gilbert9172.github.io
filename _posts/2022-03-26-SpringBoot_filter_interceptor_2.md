---
layout: post
title: Interceptor
categories: spring
tags: springBoot
---

# 🔎  Interceptor

스프링 인터셉터도 서블릿 필터와 같이 웹과 관련된 공통 관심 사항을 효과적으로 

해결할 수 있는 기술이다. 서블릿 필터가 서블릿이 제공하는 기술이라면, 

<span style="background-color:#4682B4; color:white">스프링 인터셉터는 스프링 MVC가 제공하는 기술</span>이다. 둘다 웹과 관련된 공통 관심 사항을 

처리하지만, 적용되는 순서와 범위, 그리고 사용방법이 다르다.

<br>

## <span style="color:gray">Spring Interceptor</span>

### 1. 인터셉터의 흐름

> HTTP 요청 → WAS → 필터 → (Dispatcher)서블릿 → 스프링 인터셉터 → 컨트롤러

스프링 인터셉터는 Dispatcher Servlet과 컨트롤러 사이에서 컨트롤러 호출 직전에 호출된다.

스프링 인터셉터는 스프링 MVC가 제공하는 기능이기 때문에 결국 Dispatcher Servlet 이후에 

등장한다. 스프링 인터셉터에도 URL 패턴을 적용할 수 있는데, 서블릿 URL 패턴과는 다르게, 

매우 정밀하게 설정할 수 있다.

<br>

### 2. 인터셉터의 제한

> HTTP 요청 → WAS → 필터 → (Dispatcher)서블릿 → 스프링 인터셉터 (차단)

인터셉터에서 적절하지 않은 요청이라고 판단하면 거기에서 끝을 낼 수도 있다. 

그래서 로그인 여부를 체크하기에 딱 좋다.

<br>

### 3. 인터셉터 체인

> HTTP 요청 -> WAS -> 필터 -> 서블릿 -> 인터셉터1 -> 인터셉터2 -> 컨트롤러

스프링 인터셉터는 체인으로 구성되는데, 중간에 인터셉터를 자유롭게 추가할 수 있다. 

<br>

<h4> ✓ 2022.04.19 추가 ✓ </h4>

오늘은 프로젝트 과정에서 Dispather Servlet에서 발생하는 PageNotFound를 인터셉터를 

사용해서 해결하였다. 

가장 먼저 RestControllerAdvice를 적용 했지만 해결되지 않았다. 

왜인지 확인해보니 애초에 Page Not Found는 컨트롤러를 부르기전에 handler를 처리해줄 

HandlerAdapter가 없기 때문에 nohandlerfoundexception로 인해서 생기는 오류였기 때문!!! 

따라서 Servlet과 Controller 사이에서 호출되는 Interceptor를 사용해야겟다 싶었다.

```java
public class PageNotFoundInterceptor implements HandlerInterceptor {
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (response.getStatus() == 404) {
            response.getWriter().print("Page Not Found");
            return false;
            }
        return true;
    }
}
```


<br>

### 4. HandlerInterceptor Interface

```java

public interface HandlerInterceptor {
	
	// 컨트롤러 호출 전
	default boolean preHandle(HttpServletRequest request, HttpServletResponse response, 
            Object handler) throws Exception {
		return true;
	}

 	// 컨트롤러 호출 후
	default void postHandle(HttpServletRequest request, HttpServletResponse response, 
            Object handler, @Nullable ModelAndView modelAndView) throws Exception {
	}

	// 요청 완료 후
	default void afterCompletion(HttpServletRequest request, HttpServletResponse response, 
            Object handler, @Nullable Exception ex) throws Exception {
	}

} 
```

서블릿 필터의 경우 단순하게 doFilter() 하나만 제공하지만, 인터셉터는 

컨트롤러 “호출 전”, “호출 후”, “요청 완료 이후”와 같이 단계적으로 잘 세분화 되어 있다.

또한 서블릿 필터의 경우 단순히 request, response만 제공했지만, 

인터셉터는 어떤 컨트롤러가 호출되는지 **호출 정보**도 받을 수 있다. 

그리고 어떤 modelAndView가 반환되는지 **응답 정보**도 받을 수 있다.

<br>

### 5. 스프링 인터셉터의 호출 흐름

정상적인 흐름의 경우 다음과 같다.

- **preHandle** 
    - 컨트롤러 호출 전에 호출 된다. → 더 정확히는 핸들러 어댑터 호출 전에 호출된다.
    - preHandle의 응답값이 true일 경우 다음으로 진행
    - false일 경우 더는 진행하지 않는다.

<br>

- **postHandle**
    - 컨트롤러 호출 후에 호출된다. → 더 정확히는 핸들러 어댑터 호출 후에 호출된다.

<br>

- **afterCompletion**
    - 뷰가 렌더링 된 이후에 호출된다.
    - 실패 성공의 여부에 관련없이 무조건 호출된다.

<br>

하지만 예외가 발생할 경우에는 postHandle 은 호출되지 않는다.

afterCompletion은 무조건 호출되는데, 이떄 예외정보(ex)를 포함해서 호출된다.

<br>

### 6. Interceptor 구현하기.

⒈ HandlerInterceptor를 상속받아 구현한다.

⒉ 인터셉터 등록

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new MyInterceptor())
                .order(1)
                .addPathPatterns("/**")
                .excludePathPatterns("/css/**", "/*.ico","/error");
}
```

<br>

### 추가. Handler 메소드

```java
// 호출할 컨트롤러 메서드의 모든 정보가 포함되어 있다.
if (handler isinstanceof HandlerMethod) {
		HandlerMethod hm = (HandlerMethod) handler;
}
```

핸들러 정보는 어떤 핸들러 매핑을 사용하는가에 따라서 달라진다. 

스프링을 사용하면 일반적으로 @Controller, @RequestMapping을 활용한 핸들러 매핑을 사용하는데, 

이 경우 핸들러 정보로 **HandlerMethod**가 넘어온다.

만약 @Controller가 아니라 정적 리소스가 호출되는 경우에는 **ResourceHttpRequestHandler**가 

핸들러 정보로 넘어고기 때문에 타입에 따라서 처리가 필요하다.

---

<br>

## <span style="color:gray">정리</span>

서블릿 필터와 스프링 인터셉터는 호출되는 순서만 다르고, 제공하는 기능은 비슷하다.

하지만 스프링 인터셉터는 서블릿 필터보다 편리하고, 더 정교하고 다양한 기능을 지원한다.

간단하게 인터셉터는 스프링 MVC구조에 특화된 필터 기능을 제공한다고 이해하면 된다.

스프링 MVC를 사용하고, 서블릿 필터를 꼭 사용해야하는 상황이 아니라면 인터셉터를 사용하는 

것이 더 편리하다.

---