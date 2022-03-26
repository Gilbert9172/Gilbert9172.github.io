---
layout: post
title: ArgumentResolver
categories: springboot
---

# 🔎  ArgumentResolver

로그인된 사용자를 애노테이션으로 확인하는 방법은 없을까? 

<span style="background-color:black;color:yellow">@Login</span>이라는 argument를 처리해주는 <span style="background-color:#4682B4; color:white">ArgumentResolver</span>를 만들고 이를 활용하면 충분히 가능하다.

<br>

## <span style="color:gray">@Login</span>

<span style="background-color:black;color:yellow">@Login</span> 애노테이션은 자동으로 세션에 있는 로그인 회원을 찾아주고, 

만약 세션에 없다면 null 을 반환하도록 한다.

### 1. @Login 애노테이션 생성

```java
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface Login {}
```
- @Target(ElementType.PARAMETER) : 파라미터에만 사용
- @Retention(RetentionPolicy.RUNTIME) : 런타임까지 애노테이션 정보가 유지

<br>

### 2. @Login을 처리해주는 ArgumentResolver 생성

```java
// import
import org.springframework.web.method.support.HandlerMethodArgumentResolver;

// main class
public class LoginMemberArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {

        // @Login 애노테이션이 파라미터에 있는지?
        boolean hasLoginAnnotation = parameter.hasParameterAnnotation(Login.class);

        /** 
        * parameter.getParameterType() : @Login 애노테이션 뒤에 붙은 클래스
        * isAssignableFrom : 할당할 수 있는지.
        */
        boolean hasModelType = Member.class.isAssignableFrom(parameter.getParameterType()); 

        return hasLoginAnnotation && hasModelType;
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        
        HttpServletRequest request = (HttpServletRequest) webRequest.getNativeRequest();

        HttpSession session = request.getSession();
        if (session == null) {
            return null;
        }
        return session.getAttribute("LOGIN_MEMBER");
    }
}
```