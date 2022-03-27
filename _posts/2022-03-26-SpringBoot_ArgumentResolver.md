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

**`supportsParameter()`**

<span style="background-color:black;color:yellow">@Login</span> 어노테이션이 있으면서, Model 타입이면 ArgumentResolver가 실행된다.

<br>

**`resolveArgument()`**

컨트롤러 호출 직전에 호출되어서 필요한 파라미터 정보를 생성해준다.

위의 코드에서는 로그인 회원정보인 member 객체를 찾아서 반환해준다.

> session=Member(id=1, loginId=test, name=테스터, password=1234)

이후 스프링MVC는 컨트롤러의 메서드를 호출하면서 여기에서 반환된 member 객체를

파라미터에 전달해준다.

> model={member=Member(id=1, loginId=test, name=테스터, password=1234)}

<br>

### 3. 작성한 ArgumentResolver 등록

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
          resolvers.add(new LoginMemberArgumentResolver());
      }
}
```
---

<br>

### 고찰

JWT Token 인증의 경우 이런 방법으로 하면 되는건가??

⒈ token 유효 여부 확인 

⒉ token의 claims 정보에서 고유 값(ex. Email)으로 DB 조회

⒊ 반환 된 raw값을 컨틀롤러 객체에 넣어줌.

<br>

**ArgumentResolver**
```java
@RequiredArgsConstructor
public class LoginMemberArgumentResolver implements HandlerMethodArgumentResolver {

    private final UserMapper userMapper;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {

        
        boolean hasLoginAnnotation = parameter.hasParameterAnnotation(Login.class);
        boolean hasModelType = User.class.isAssignableFrom(parameter.getParameterType()); 

        return hasLoginAnnotation && hasModelType;
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        
        // Token 정보 확인 
        HttpServletRequest request = (HttpServletRequest) webRequest.getNativeRequest();
        String header = request.getHeader("Authorization");
        String token = JwtUtils.getTokenFromHeader(header);


        if (JwtUtils.isValideToken(token)) {

            // Email 정보 가져오기
            String email = JwtUtils.getUserEmailFromToken(token);

            // 가져온 email정보로 해당 User객체 반환
            User checkUser = findUserByEmail(String email);
            return checkUser;

        } else if (!JwtUtils.isValideToken(token)) {

            /** Access Token이 유효하지 않을 경우
            * 만료된 토큰에서 Email 가져온다.
            * DB에서 Email로 해당 객체의 Refresh Token을 가져온다.
            * 다시 새로운 AccessToken을 만들어 준다.
            */
            String email = JwtUtils.getUserEmailFromToken(token);
            User checkUser = findUserByEmail(String email);
            String reToken = checkUser.getRetoken();

            if (JwtUtils.isValideReToken(reToken)) {

                // Refresh Token을 기반으로 새로운 Access Token을 생성
                User user = new User();
                user.setAuthCode(JwtUtils.getClaimsCodeFromToken(reToken));
                user.setEmail(JwtUtils.getUserEmailFromToken(reToken));
                user.setUserSeq(Long.parseLong(JwtUtils.getClaimsSeqFromToken(reToken)));

                response.setHeader(AuthConstants.AUTH_HEADER, AuthConstants.TOKEN_TYPE + " " + JwtUtils.generateJwtToken(user));
                response.setHeader(AuthConstants.RE_AUTH_HEADER, AuthConstants.TOKEN_TYPE + " " + reToken);
                
                HttpSession session = request.getSession();
                session.setAttribute(user.getEmail()+"_token", reToken);
        
                return checkUser;
                
            } else {
                response.addHeader("Content-Type", "application/json");
                response.getWriter().print("Fail");
                return false;
            }
        }
    }
}
```
