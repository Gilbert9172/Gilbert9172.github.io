---
layout: post
title: Spring Security 3
categories: spring
tags: springSecurity
---

## <span style="color:gray">추가 내용 및 수정 사항</span>

원래 jwt 유효성 검사를 인터셉터에서 진행했었는데, 권한 검사랑 코드가

꼬여서 필터로 재구성하였다.

```java
@Slf4j
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    // 제외할 경로 추가.
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return (
                new AntPathMatcher().match("/user/login", request.getServletPath()) ||
                new AntPathMatcher().match("/user/join", request.getServletPath())
                );
    }

    // Token Check
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        log.info("찍혀1?");
        try {
            log.info("찍혀2?");

            // Access Token
            String header = request.getHeader(AuthConstants.AUTH_HEADER);
            String token = JwtUtils.getTokenFromHeader(header);

            // Refresh Token
            String reHeader = request.getHeader(AuthConstants.RE_AUTH_HEADER);
            String reToken = JwtUtils.getTokenFromHeader(reHeader);

            if (JwtUtils.isValidToken(token)) {

                // 권한 검사.
                checkAuthorization(token);

                chain.doFilter(request, response);

            } else if (!JwtUtils.isValidToken(token) && JwtUtils.isValidRefreshToken(reToken)) {

                // Access Token 재발급
                UserVo userVo = UserVo.builder()
                        .type(JwtUtils.getClaimsCodeFromToken(reToken))
                        .id(JwtUtils.getIdFromToken(reToken))
                        .email(JwtUtils.getUserEmailFromToken(reToken))
                        .userSeq(JwtUtils.getClaimsSeqFromToken(reToken))
                        .build();

                String newToken = JwtUtils.generateJwtToken(userVo);
                String newAccessToken = AuthConstants.TOKEN_TYPE + " " + newToken;

                response.setHeader(AuthConstants.AUTH_HEADER, newAccessToken);
                response.setHeader(AuthConstants.RE_AUTH_HEADER, AuthConstants.TOKEN_TYPE + " " + reToken);

                // 권한 검사.
                checkAuthorization(newToken);

                chain.doFilter(request, response);
            } else {
                chain.doFilter(request, response);
            }
        } catch (NullPointerException e) {
            chain.doFilter(request, response);
        }
    }

    // 권한 검사 로직
    public void checkAuthorization(String token) {

        String authCode = JwtUtils.getClaimsCodeFromToken(token);

        switch (authCode) {
            case "1":
                authCode = "ROLE_ADMIN";
                break;
            case "2":
                authCode = "ROLE_USER";
                break;
        }

        CustomUserDetail userDetail = new CustomUserDetail(UserVo.builder().type(authCode).build());

        Authentication authentication =
                new UsernamePasswordAuthenticationToken(null, null, userDetail.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
```

<br>

## <span style="color:gray">OncePerRequestFilter</span>

특정 필터가 요청당 한 번만 호출되도록 할 수 있다. Spring Security로 작업할 때 일반적으로 사용한다.

요청이 Filter Chain을 통과할 때 일부 인증작업을 요청에 대해 한 번만 발생하기를 원할 경우, 

OncePerRequestFilter를 상속받아서 커스텀하면 된다. Spring은 주어진 요청에 대해 OncePerRequestFilter가 

한 번만 실행되도록 보장해준다. 나의 경우에도 토큰에 대한 유효성 검사와 요청에 대한 권한 검사는 

클라이언트로 부터 요청이 들어올 때 딱 한번만 실행하면 된다고 판단했다.

---

<br>

## <span style="color:gray">shouldNotFilter 메서드</span>

특정 요청에 대해서, 해당 필터를 적용하지 않고 싶을 때 사용하는 메서드.

OncePerRequestFilter를 상속받아 정의하면 된다.

제외해야 할 경로를 추가하는 방법은 아래와 같다.

```java
// 하나의 경우
return new AntPathMatcher().match("/test", request.getServletPath());

// 하나 이상일 경우
return (
        new AntPathMatcher().match("/test1", request.getServletPath()) ||
        new AntPathMatcher().match("/test2", request.getServletPath());
        )
```