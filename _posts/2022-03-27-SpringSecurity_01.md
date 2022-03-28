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

⒈ Http 요청이 들어오면 AuthenticationFilter가 해당 요청을 가로챈다.

⒉ 인증용 객체인 UsernamePasswordAuthenticationToken객체를 생성한다.

⒊ 인증을 담당할 (Interface)AuthenticationManager에게 2번에서 만든 

UsernamePasswordAuthenticationToken객체를 전달해준다.

⒋ AbstractAuthenticationProcessingFilter가 사용되는데 이것은 다음과 같은 역할을 한다.

사용자가 form에 입력한 아이디, 비밀번호를 처리하는 역할을 하는데, 

사용자 비밀번호를 다른 필터로 전달하기 위해서 Authentication 객체를 생성한다.

이때 비밀번호 외의 정보(사용자 이름 등)도 설정을 해준다.

⒌ 생성된 Authenrication 객체를 AuthenticationProvider에 전달해주면, 실제 인증이 일어난다.

인증에 실패하게 되면 AuthenticationException을 호출한다.

⒍ 인증이 성공하게 된 경우 DB에서 사용자의 정보를 찾고 UserDetails객체에 담아 반환한다.

<br>

성공적으로 인증이 완료되면, Spring Security 인메모리 저장소인 SecurityContextHolder에 

Session을 저장하고, sessionId와 함께 응답을 보낸다.

<br>

사용자 정보를 꺼내야 할 때는 Secutity Session에서 Authentication객체를 꺼내고, 

꺼낸 Authentication 객체에서 UserDetails 객체를 꺼내야한다.

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
public class PrincipalDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
        //...

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
