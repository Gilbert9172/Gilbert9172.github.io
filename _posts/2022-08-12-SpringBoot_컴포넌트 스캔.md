---
layout: post
title: 컴포넌트 스캔
categories: spring
tags: springBoot
---

## <span style="color:gray">컴포넌트 스캔</span>

---

#### ***컴포넌트 스캔이란?***

지금까지 스프링 빈을 등록할 때는 자바 코드의 `@Bean`이나 `xml`의 <bean> 등을 통해서 

설정 정보에 직접 등록할 스프링 빈을 나열했다. 하지만 실무에서는 등록해야 할 

스프링 빈이 매우 많기 때문에 일일이 등록하기도 귀찮고, 설정 정보도 커지고, 

누락하는 문제도 발생한다. 그래서 스프링은 설정 정보가 없어도 자동으로 스프링 

빈을 등록하는 ***<span style="background-color:yellow">컴포넌트 스캔</span>*** 이라는 기능을 제공한다.

<br>

#### ***Java 코드***

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Indexed
public @interface Component {
    String value() default "";
}
```

<br>

#### ***@Configuration***

**`@Configuration`** 은 어떻게 스프링 빈으로 자동 등록이 된것일까?

내부 코드를 살펴보면 **`@Component`** 를 가지고 있기 때문이다.

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component  //<- 여기
public @interface Configuration {
    @AliasFor(
        annotation = Component.class
    )
    String value() default "";

    boolean proxyBeanMethods() default true;
}
```

<br>

## <span style="color:gray">컴포넌트 스캔과 의존관계 자동 주입</span>

---

#### ***⒈ @ComponentScan***

**`@ComponentScan`** 은 **`@Component`** 가 붙은 모든 클래스를 스프링 빈으로 

등록한다. 이때 스프링 빈의 기본 이름은 클래스명을 사용하되 맨 앞글자만 소문자를 

사용한다. 만약 스프링 빈의 이름을 직접 지정하고 싶으면 `@Component("customName")` 

처럼 이름을 부여하면 된다.

<br>

#### ***⒉ @Autowired 의존관계 자동 주입***

생성자에 `@Autowired`를 지정하면, 스프링 켄테이너가 자동으로 해당 스프링 빈을

찾아서 주입한다. 이때 기본 조회 전략은 타입이 같은 빈을 찾아서 주입한다.

그리고 생성자에 파라미터가 많아도 다 찾아서 자동으로 주입해준다.

<br>

#### ***참고 : @Autowired가 탄생한 계기***

기존에는 개발자가 일일이 의존성을 주입했다. 그러나 `@ComponentScan`이 나오면서

스프링이 알아서 빈을 생성해주니깐 의존관계를 설정할 방법이 없엇다. 

그래서 `@Autowired`가 탄생하게 됐다고 한다. 