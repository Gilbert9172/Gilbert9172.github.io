---
layout: post
title: Filter
categories: spring
tags: springBoot
---

# ๐  Filter, Interceptor

๋ก๊ทธ์ธ์ ํ์ง ์์ ์ฌ์ฉ์๊ฐ ๋ฌผ๊ฑด์ ์ฃผ๋ฌธํ๋ ์ผ์ ์์ด์ผ ํ๋ค.

๊ทธ๋ ๋ค๋ฉด ๋ก๊ทธ์ธ ํ์ง ์์ ํด๋ผ์ด์ธํธ๋ ๋ค์ ๋ก๊ทธ์ธ ํ์ด์ง๋ก ์ด๋์ํค๋ ๋ฑ

์ ์ ํ ์กฐ์น๋ฅผ ์ทจํด์ฃผ์ด์ผํ๋ค. ๊ทธ๋ฐ๋ฐ ์ด๋ฐ ์กฐ์น๋ฅผ ๋ชจ๋  ์์ฒญ์ ์ฝ๋ฉํ๋ค๋ฉด ๋งค์ฐ

์์ฐ์ ์ด์ง ์๋ค. ์ด๋ฐ ๋ฌธ์ ๋ฅผ ํด๊ฒฐํ๊ธฐ ์ํด์  Filter์ Interceptor๋ฅผ ์ฌ์ฉํ๋ฉด๋๋ค.

Filter๋ Servlet์์ ์ ๊ณตํด์ฃผ๋ ์ธํฐํ์ด์ค์ด๊ณ , 

Interceptore๋ ์คํ๋ง์์ ์์ฒด์ ์ผ๋ก ์ ๊ณตํ๋ ์ธํฐํค์ด์ค ์ด๋ค.

<br>

## <span style="color:gray">Servlet Filter</span>

### 1. ํํฐ์ ํ๋ฆ

> HTTP ์์ฒญ โ WAS โ ํํฐ โ (Dispatch)์๋ธ๋ฆฟ โ ์ปจํธ๋กค๋ฌ

ํํฐ๋ฅผ ์ฌ์ฉํ๊ฒ ๋๋ฉด ํํฐ๊ฐ ๋จผ์  ํธ์ถ๋ ํ, ์๋ธ๋ฆฟ์ด ํธ์ถ๋๋ค.

๊ทธ๋ฆฌ๊ณ  ํํฐ์๋ ํน์  URL์ ์ ์ฉํ  ์ ์๋ค.

<br>

### 2. ํํฐ์ ์ ํ

> HTTP ์์ฒญ โ WAS โ ํํฐ (์ ํฉํ์ง ์์ ์์ฒญ์ผ ๊ฒฝ์ฐ ์ฌ๊ธฐ์ ์ค๋จ)

๋ง์ฝ ํํฐ์์ ์์ฒญ์ ์ ํฉํ์ง ์๋ค๊ณ  ํ๋จํ๊ฒ ๋  ๊ฒฝ์ฐ์ ํ๋ฆ์ ์์ ๊ฐ๋ค.

์ค๊ฐ์ ์ข๋ฃ ๋๊ธฐ ๋๋ฌธ์ ๋ก๊ทผ์ธ ํ์ธ ์ฌ๋ถ๋ฅผ ๋ณด๊ธฐ์ ์ข๋ค.

<br>

### 3. ํํฐ ์ฒด์ธ

> HTTP ์์ฒญ โ WAS โ ํํฐ1 โ ํํฐ2 โ ํํฐ3 โ  (Dispatch)์๋ธ๋ฆฟ โ ์ปจํธ๋กค๋ฌ

ํํฐ๋ ํ ๊ฐ ์ด์ ์ ์ฉํ  ์ ์๋ค. ๋์ ์ ํํฐ๋ฅผ WebConfig์ ๋ฑ๋กํ  ๋

๊ทธ ์์๋ `setOrder()`๋ก ์ง์ ํด ์ฃผ์ด์ผํ๋ค.

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

ํํฐ ์ธํฐํ์ด์ค๋ฅผ ๊ตฌํํ๊ณ  ๋ฑ๋กํ๋ฉด ์๋ธ๋ฆฟ ์ปจํ์ด๋๊ฐ ํํฐ๋ฅผ ์ฑ๊ธํค ๊ฐ์ฒด๋ก ์์ฑํ๊ณ , ๊ด๋ฆฌํ๋ค.

`init()`๊ณผ `destory()` ๋ default ๋ฉ์๋์ด๊ธฐ ๋๋ฌธ์ ๊ผญ override ํ์ง ์์๋ ๋๋ค.

`doFilter()`๊ฐ ๊ฐ์ฅ ์ค์ํ๋, ํด๋ผ์ด์ธํธ์ ์์ฒญ์ด ์ฌ ๋๋ง๋ค ํด๋น ๋ฉ์๋๊ฐ ์คํ๋๋ค.

๋ฐ๋ผ์ ์ด ๋ฉ์๋์ ๋น์ง๋์ค ๋ก์ง์ ์์ฑํ๋ฉด ๋๋ค.

์ถ๊ฐ์ ์ผ๋ก `doFilter()`๋ฅผ ์์ฑํ  ๋ ๋ง์ง๋ง์ ๊ผญ!!! chain.doFilter(request, response);๋ฅผ 

์์ฑํด์ผ ํ๋ค. 

๋ง์ฝ ์์ฑํ์ง ์์ ๊ฒฝ์ฐ ๋ ์ด์ ํด๋ผ์ด์ธํธ์ ์์ฒญ์ ๋ค๋ก ๋์ด๊ฐ์ง ์๊ณ  ๋๋๋ฒ๋ฆฐ๋ค.

---

<br>

### 5. Filter ์ ์ฉ

โ ํํฐ interface๋ฅผ ๊ตฌํํ๋ค.

```java
public class MyFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
                                    throws IOException, ServletException {

            HttpServletRequest request = (HttpServletRequest) request;
            HttpServletResponse response = (HttpServletResponse) response;
            
            // ์ค์!!!
            chain.doFilter(request,resoponse);
    }
}
```

<br>

โ ์์ฑํ ํํฐ(MyFilter)๋ฅผ Bean์ ๋ฑ๋กํ๋ค.

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