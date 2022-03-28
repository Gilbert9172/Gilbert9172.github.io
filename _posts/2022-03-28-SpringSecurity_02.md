---
layout: post
title: Spring Security 2 
categories: springboot
tags: springSecurity
---

# Spring Secutiry

<br>

## <span style="color:gray">JwtAuthenticationFilter Class</span>

스프링 시큐리티에 UsernamePasswordAuthenticationFilter가 있음.

login 요청해서 username, password를 post로 전송하면

UsernamePasswordAuthenticationFilter가 동작을 함

> UsernamePasswordAuthenticationFilter : 로그인을 진행하는 필터

```java
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter{
	
	private final AuthenticationManager authenticationManager;

    // login 요청을 하면 로그인 시도를 위해서 실행되는 함수.
	@Override 
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
			throws AuthenticationException {
		// TODO 
        // 1. username, password 받아서 
		log.info("JwtAuthenticationFilter: 로그인 시도중");
		
		try {
			ObjectMapper om = new ObjectMapper();
			User user = om.readValue(request.getInputStream(), User.class);
			log.info("request객체 = {}",user);	
		
            /**
            * 2. 정상인지 로그인 시도를 한다.
            * authenticationManager로 로그인 시도를 한면,
            * UserDetailServiceImpl가 실행이 된다.
            */ 
			UsernamePasswordAuthenticationToken authenticationToken = 
					new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
			
			// UserDetailServiceImpl의 loadUserByUsername 호출 
            // 정상 실행되면 authentication이 리턴됨.
            // DB에 있는 Email과 Password가 일치한다.
			Authentication authentication = 
					authenticationManager.authenticate(authenticationToken);
			
			PrincipalDetails principalDetails = (PrincipalDetails)authentication.getPrincipal(); 
			log.info("Authorized Id = {}", principalDetails.getUser().getEmail()); // -> 값이 있다면 로그인 정상 작동.

            // authentication 객체가 session 영역에 저장된다.
            // 리턴 이류는 권한 관리를 security가 대신해주기 때문에 편리하려고 하는 것.
            // 굳이 JWT 토큰을 사용하면서 세션을 만들 이유가 없음. 근데 단지 권한 처리 때문에 session에 넣어준다.
			return authentication;
		} catch (IOException e) {
			e.printStackTrace();
		} log.info("=====================================");	
		return null;
	}

    // attemptAuthentication 실행 후 인증이 정상적으로 되었으면 successfulAuthentication 함수가 호출된다.
    // 여기서 JWT 토큰을 만들어서 request 요청한 사용자에게 JWT토큰을 response해주면된다.
}
```