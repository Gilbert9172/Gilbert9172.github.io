---
layout: post
title: Spring Security
categories: springboot
tags: springSecurity
---

# Spring Secutiry

<br>

## <span style="color:gray">Spring Security란?</span>

> Spring 기반의 애플리케이션의 보안(인증, 인가)을 담당하는 스프링 하위 프레임 워크

**인증(Authenticate)** : 현재 사용자가 누구인지 사용자의 신원을 증명하는 프로세스

**인가(Authorize)** : 사용자에게 특정 리소스나 기능에 액세스할 수 있는 권한을 부여하는 프로세스

<br>

Spring Security는 Servlet이 제공해주는 Filter를 기반으로 동작한다. 

따라서 Spring MVC와 분리되어 동작하고, Bean으로 등록해서 관리할 수 있다.

---

<br>

## <span style="color:gray">Spring Security의 구조</span>

<img src="/assets/img/spring/secutiry구조.png">

<br>

**<span style="color:gray">[ AuthenticationFilter ]</span>**

Http 요청이 들어오면 AuthenticationFilter가 해당 요청을 가로챈다.

<br>

**<span style="color:gray">[ UsernamePasswordAuthenticationToken ]</span>**

클라이언트 요청으로 넘어온 아이디와 비밀번호를 사용하여,  

인증용 객체인 UsernamePasswordAuthenticationToken객체를 생성한다.

<br>

**<span style="color:gray">[ AuthenticationManager ]</span>**

인증을 담당할 AuthenticationManager에게 2번에서 만든 Token 객체를 전달해주고, 

AuthenticationProvider목록에서 적적한 Provider를 찾은 후 토큰을

AuthenticationProvider에게 전달해준다.

<br>

**<span style="color:gray">[ AuthenticationProvider & userDetailService ]</span>**

AuthenticationManager로 부터 받은 Token 객체를 가지고 Authentication 객체를 생성해 준다. 

그리고 생성해준 Authentication 객체에서 아이디와 비밀번호를 꺼내서 실제 사용자 인증을 

진행한다. 사용자 인증을 진행하기 위해서 userDetailService에 정의되어 있는 

`loadUserByUsername()` 메소드를 사용하고, 이때 DB에 접근해서 사용자 정보를 가져온다.

인증이 성공적이면 <span style="background-color:#4682B4; color:white">*UsernamePasswordAuthenticationToken 객체*</span>를 생성해준다.

필요하다면 사용자의 다른 정보도 추가해 줄 수 있다.

```java
// DB에 접근해서 사용자 정보 가져오기
CustomUserDetail userDetails = 
                (CustomUserDetail) userDetailService.loadUserByUsername(email);

// 인증 완료 후 생성하는 UsernamePasswordAuthenticationToken객체
new UsernamePasswordAuthenticationToken(userDetails, userPw, userMembership);
```

<br>

**<span style="color:gray">[ Security Context Holder ]</span>**

성공적으로 인증이 완료되면, Spring Security 인메모리 저장소인 SecurityContextHolder에 

Session을 저장하고, sessionId와 함께 응답을 보낸다.

사용자 정보를 꺼내야 할 경우에는 Secutity Session에서 <span style="background-color:#4682B4; color:white">*Authentication객체*</span>를 꺼내고, 

꺼낸 Authentication 객체에서 <span style="background-color:#4682B4; color:white">*UserDetails 객체*</span>를 꺼내야한다.

---

## <span style="color:gray">Spring Security Filter Chain</span>

<img src="/assets/img/spring/secrity_filter.png">

---

<br>

## <span style="color:gray">User Class</span>

```java
@Builder
@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private int id;
    private String username;
    private String password;
    private String email;
    private String role;

    @CreationTimestamp
    private Timestamp createDate;
}
```


<br>

## <span style="color:gray">UserDetails Interface</span>

```java
@RequiredArgsConstructor
public class PrincipalDetails implements UserDetails {

    private final User user;

    // 해당 User의 권한을 리턴하는 곳.
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collect = new ArrayList<>();
        collect.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return user.getRole();
            }
        });
        return collect;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        
        /** 
        * 예를 들어서 사이트에 1년이상 로그인을 하지 않으면 
        * 휴면 계정으로!!
        */ 
        return true;
    }
}
```

<br>

## <span style="color:gray">UserDetailsService Interface</span>

```java
@Service
@RequiredArgsConstructor
public class UserDetailServiceImpl implements UserDetailsService {

	private final UserDetailsMapper userDetailsMapper;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		
		Optional<User> user = userDetailsMapper.findUserByEmail(email);
		if (user.isEmpty()) {
			User notFoundUser = User.builder()
					.email(email)
					.build();
			return new CustomUserDetail(notFoundUser);
		}
		return user.map(CustomUserDetail::new).orElseThrow(UserNotFoundException::new);
	}
}
```

<br>

## <span style="color:gray">WebSecurityConfigurerAdapter Class</span>

```java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private final CorsFilter corsFilter;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .addFilter(corsFilter)
                .formLogin().disable()
                .httpBasic().disable()
                .authorizeRequests()
                .antMatchers("/users/**").authenticated()
                .antMatchers("/admin/**").access("hasRole('ROLE_ADMIN')")
                .anyRequest().permitAll();
    }
}
```

<br>

## <span style="color:gray">CorsConfig Class</span>

```java
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // 내 서버가 응답을 할 때 json을 자바스크립트에서 처리할 수 있게 할지 설정하는 것
        config.setAllowCredentials(true);

        // 모든 Ip의 응답을 허용
        config.addAllowedOrigin("*");

        // 모든 Header의 응답을 허용
        config.addAllowedHeader("*");

        // 모든 HttpMethod의 응답을 허용
        config.addAllowedMethod("*");

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source)   
    }
}
```
