---
layout: post
title: Spring Security 3
categories: springboot
tags: springSecurity
---

# Spring Secutiry 3

<br>

## <span style="color:gray">[ AuthenticationEntryPoint ]</span>

<h4><span style="background-color:#4682B4; color:white">인증이 되지 않은 유저가 접근 시 호출된다.</span></h4>

존재하는 경로에 로그인 하지 않고(Header에 JwtToken을 넘기지 않고) 접속할 경우, 호출된다.

```java
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
	
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        // 유효한 자격증명을 제공하지 않고 접근하려 할때 401
    	response.addHeader(AuthConstants.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
		response.getWriter().print("JwtAuthenticationEntryPoint Fail");
    }
}
```

<br>

## <span style="color:gray">[ AccessDeniedHandler ]</span>

<h4><span style="background-color:#4682B4; color:white">인증이 된 클라이언트 중, 권한이 없는 사용자가 접근 시 호출된다.</span></h4>

```java
@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        response.addHeader(AuthConstants.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().print("Authorization Fail");
    }
}
```

<br>

## <span style="color:gray">[ OncePerRequestFilter ]</span>

<h4><span style="background-color:#4682B4; color:white">인증 받은(Authenticated) 클라이언트가, 권한이 필요한 URL에 접근 시도 시 호출된다.</span></h4>

✓ 권한 확인 성공 → 정상 로직

x 권한 확인 실패 → AccessDeniedHandler


```java
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {

        try {
            String header = request.getHeader("Authorization");
            String token = JwtUtils.getTokenFromHeader(header);
            String authCode = JwtUtils.getClaimsCodeFromToken(token);

            switch (authCode) {
                case "1":
                    authCode = "ROLE_ADMIN";
                    break;
                case "2":
                    authCode = "ROLE_USER";
                    break;
            }

            CustomUserDetail userDetail = 
                        new CustomUserDetail(User.builder().authCode(authCode).build());

            Authentication authentication =
                    new UsernamePasswordAuthenticationToken(null, null, userDetail.getAuthorities();

            SecurityContextHolder.getContext().setAuthentication(authentication);

            chain.doFilter(request, response);

        } catch (NullPointerException e) {
     
            chain.doFilter(request, response);
     
        }
    }
}
```
---