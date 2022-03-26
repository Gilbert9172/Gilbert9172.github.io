---
layout: post
title: Filter
categories: springboot
---

# 🔎  Filter, Interceptor

로그인을 하지 않은 사용자가 물건을 주문하는 일은 없어야 한다.

그렇다면 로그인 하지 않은 클라이언트는 다시 로그인 페이지로 이동시키는 등

적절한 조치를 취해주어야한다. 그런데 이런 조치를 모든 요청에 코딩한다면 매우

생산적이지 않다. 이런 문제를 해결하기 위해선 Filter와 Interceptor를 사용하면된다.

Filter는 Servlet에서 제공해주는 인터페이스이고, 

Interceptore는 스프링에서 자체적으로 제공하는 인터헤이스 이다.

<br>

## <span style="color:gray">Servlet Filter</span>

### 1. 필터의 흐름

> HTTP 요청 → WAS → 필터 → (Dispatch)서블릿 → 컨트롤러

필터를 사용하게 되면 필터가 먼저 호출된 후, 서블릿이 호출된다.

그리고 필터에는 특정 URL을 적용할 수 있다.

<br>

### 2. 필터의 제한

> HTTP 요청 → WAS → 필터 (적합하지 않은 요청일 경우 여기서 중단)

만약 필터에서 요청을 적합하지 않다고 판단하게 될 경우의 흐름은 위와 같다.

중간에 종료 되기 때문에 로근인 확인 여부를 보기에 좋다.

<br>

### 3. 필터 체인

> HTTP 요청 → WAS → 필터1 → 필터2 → 필터3 →  (Dispatch)서블릿 → 컨트롤러

필터는 한 개 이상 적용할 수 있다. 대신에 필터를 WebConfig에 등록할 때

그 순서는 `setOrder()`로 지정해 주어야한다.

<br>

### 4. Filter Interface

```java
public interface Filter {

    public default void init(FilterConfig filterConfig) throws ServletException {}

    
    public void doFilter(ServletRequest request, ServletResponse response,
        FilterChain chain) throws IOException, ServletException;

    
	public default void destroy() {}
}
```

필터 인터페이스를 구현하고 등록하면 서블릿 컨테이너가 필터를 싱글톤 객체로 생성하고, 관리한다.

`init()`과 `destory()` 는 default 메소드이기 때문에 꼭 override 하지 않아도 된다.

`doFilter()`가 가장 중요한대, 클라이언트의 요청이 올 때마다 해당 메소드가 실행된다.

따라서 이 메서드에 비지니스 로직을 작성하면 된다.

추가적으로 `doFilter()`를 작성할 때 마지막에 꼭!!! chain.doFilter(request, response);를 

작성해야 한다. 

만약 작성하지 않을 경우 더 이상 클라이언트의 요청을 뒤로 넘어가지 않고 끝나버린다.

---

<br>

### 5. Filter 적용

⒈ 필터 interface를 구현한다.

```java
public class MyFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
                                    throws IOException, ServletException {

            HttpServletRequest request = (HttpServletRequest) request;
            HttpServletResponse response = (HttpServletResponse) response;
            
            // 중요!!!
            chain.doFilter(request,resoponse);
    }
}
```

<br>

⒉ 생성한 필터(MyFilter)를 Bean에 등록한다.

```java
@Configuration
public class WebConfig {

    @Bean
    public FilterRegistrationBean<Filter> myFilter() {
        
        FilterRegistrationBean<Filter> filterRegistrationBean = new FilterRegistrationBean<>();
        filterRegistrationBean.setFilter(new MyFilter());
        filterRegistrationBean.setOrder(1);
        filterRegistrationBean.addUrlPatterns("/*");
        return filterRegistrationBean;
    }
}
```
---