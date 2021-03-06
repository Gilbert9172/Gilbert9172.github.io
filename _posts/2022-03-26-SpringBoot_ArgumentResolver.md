---
layout: post
title: ArgumentResolver
categories: spring
tags: springBoot
---

# ๐  ArgumentResolver

๋ก๊ทธ์ธ๋ ์ฌ์ฉ์๋ฅผ ์ ๋ธํ์ด์์ผ๋ก ํ์ธํ๋ ๋ฐฉ๋ฒ์ ์์๊น? 

<span style="background-color:black;color:yellow">@Login</span>์ด๋ผ๋ argument๋ฅผ ์ฒ๋ฆฌํด์ฃผ๋ <span style="background-color:#4682B4; color:white">ArgumentResolver</span>๋ฅผ ๋ง๋ค๊ณ  ์ด๋ฅผ ํ์ฉํ๋ฉด ์ถฉ๋ถํ ๊ฐ๋ฅํ๋ค.

<br>

## <span style="color:gray">@Login</span>

<span style="background-color:black;color:yellow">@Login</span> ์ ๋ธํ์ด์์ ์๋์ผ๋ก ์ธ์์ ์๋ ๋ก๊ทธ์ธ ํ์์ ์ฐพ์์ฃผ๊ณ , 

๋ง์ฝ ์ธ์์ ์๋ค๋ฉด null ์ ๋ฐํํ๋๋ก ํ๋ค.

### 1. @Login ์ ๋ธํ์ด์ ์์ฑ

```java
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface Login {}
```
- @Target(ElementType.PARAMETER) : ํ๋ผ๋ฏธํฐ์๋ง ์ฌ์ฉ
- @Retention(RetentionPolicy.RUNTIME) : ๋ฐํ์๊น์ง ์ ๋ธํ์ด์ ์ ๋ณด๊ฐ ์ ์ง

<br>

### 2. @Login์ ์ฒ๋ฆฌํด์ฃผ๋ ArgumentResolver ์์ฑ

```java
// import
import org.springframework.web.method.support.HandlerMethodArgumentResolver;

// main class
public class LoginMemberArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {

        // @Login ์ ๋ธํ์ด์์ด ํ๋ผ๋ฏธํฐ์ ์๋์ง?
        boolean hasLoginAnnotation = parameter.hasParameterAnnotation(Login.class);

        /** 
        * parameter.getParameterType() : @Login ์ ๋ธํ์ด์ ๋ค์ ๋ถ์ ํด๋์ค
        * isAssignableFrom : ํ ๋นํ  ์ ์๋์ง.
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

<span style="background-color:black;color:yellow">@Login</span> ์ด๋ธํ์ด์์ด ์์ผ๋ฉด์, Model ํ์์ด๋ฉด ArgumentResolver๊ฐ ์คํ๋๋ค.

<br>

**`resolveArgument()`**

์ปจํธ๋กค๋ฌ ํธ์ถ ์ง์ ์ ํธ์ถ๋์ด์ ํ์ํ ํ๋ผ๋ฏธํฐ ์ ๋ณด๋ฅผ ์์ฑํด์ค๋ค.

์์ ์ฝ๋์์๋ ๋ก๊ทธ์ธ ํ์์ ๋ณด์ธ member ๊ฐ์ฒด๋ฅผ ์ฐพ์์ ๋ฐํํด์ค๋ค.

> session=Member(id=1, loginId=test, name=ํ์คํฐ, password=1234)

์ดํ ์คํ๋งMVC๋ ์ปจํธ๋กค๋ฌ์ ๋ฉ์๋๋ฅผ ํธ์ถํ๋ฉด์ ์ฌ๊ธฐ์์ ๋ฐํ๋ member ๊ฐ์ฒด๋ฅผ

ํ๋ผ๋ฏธํฐ์ ์ ๋ฌํด์ค๋ค.

> model={member=Member(id=1, loginId=test, name=ํ์คํฐ, password=1234)}

<br>

### 3. ์์ฑํ ArgumentResolver ๋ฑ๋ก

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

### ๊ณ ์ฐฐ

JWT Token ์ธ์ฆ์ ๊ฒฝ์ฐ ์ด๋ฐ ๋ฐฉ๋ฒ์ผ๋ก ํ๋ฉด ๋๋๊ฑด๊ฐ??

โ token ์ ํจ ์ฌ๋ถ ํ์ธ 

โ token์ claims ์ ๋ณด์์ ๊ณ ์  ๊ฐ(ex. Email)์ผ๋ก DB ์กฐํ

โ ๋ฐํ ๋ raw๊ฐ์ ์ปจํ๋กค๋ฌ ๊ฐ์ฒด์ ๋ฃ์ด์ค.

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
        
        // Token ์ ๋ณด ํ์ธ 
        HttpServletRequest request = (HttpServletRequest) webRequest.getNativeRequest();
        String header = request.getHeader("Authorization");
        String token = JwtUtils.getTokenFromHeader(header);


        if (JwtUtils.isValideToken(token)) {

            // Email ์ ๋ณด ๊ฐ์ ธ์ค๊ธฐ
            String email = JwtUtils.getUserEmailFromToken(token);

            // ๊ฐ์ ธ์จ email์ ๋ณด๋ก ํด๋น User๊ฐ์ฒด ๋ฐํ
            User checkUser = findUserByEmail(String email);
            return checkUser;

        } else if (!JwtUtils.isValideToken(token)) {

            /** Access Token์ด ์ ํจํ์ง ์์ ๊ฒฝ์ฐ
            * ๋ง๋ฃ๋ ํ ํฐ์์ Email ๊ฐ์ ธ์จ๋ค.
            * DB์์ Email๋ก ํด๋น ๊ฐ์ฒด์ Refresh Token์ ๊ฐ์ ธ์จ๋ค.
            * ๋ค์ ์๋ก์ด AccessToken์ ๋ง๋ค์ด ์ค๋ค.
            */
            String email = JwtUtils.getUserEmailFromToken(token);
            User checkUser = findUserByEmail(String email);
            String reToken = checkUser.getRetoken();

            if (JwtUtils.isValideReToken(reToken)) {

                // Refresh Token์ ๊ธฐ๋ฐ์ผ๋ก ์๋ก์ด Access Token์ ์์ฑ
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
