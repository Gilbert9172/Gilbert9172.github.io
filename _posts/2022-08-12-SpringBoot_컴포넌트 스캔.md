---
layout: post
title: 빈 자동 등록
categories: spring
tags: springBoot
---

## <span style="color:gray">빈 등록</span>

---

#### <span style="background-color:black; color:white">빈 등록 방법</span>

빈 등록은 <span style="color:green">빈 메타정보</span>를 작성해서 컨테이너에게 건네주면 된다.

가장 직접적이고 원시적인 방법은 BeaaDefinition 구현 오브젝트를 직접 생성하는 것이다.

그러나 이 방법은 무리가 있기 때문에 보통 `XML문서`, `프로퍼티 파일`, `소스코드 애노테이션`과

같은 외부 리소스로 빈 메타정보를 작성하고 이를 적절한 리더나 변환기를 통해 

ApplicationContext가 사용할 수 있는 정보로 변환해주는 방법을 사용한다.

<br>

#### <span style="background-color:black; color:white">자동 인식을 이용한 빈 등록 : 스테레오타입 애노테이션과 빈 스캐너</span>

빈으로 사용될 클래스에 특별한 애노테이션을 부여해주면 자동으로 찾아서 빈으로

등록해준다. 이렇게 특정 애노테이션이 붙은 클래스를 자동으로 찾아서 빈으로 등록해주는

방식을 <span style="color:#4169E1">빈 스캐닝(Scanning)을 통한 자동인식 빈 등록 기능</span>이라고 하고, 

이런 스캐닝 작업을 담당하는 오브젝트를 <span style="color:green">빈 스캐너</span>라고 한다.

<br>

빈 스캐너에 내장된 디폴트 필터는 `@Component` 애노테이션이, 또는 `@Component`를

메타 에노테이션으로 가진 에노테이션이 부연된 클래스를 선택하도록 되어 있다.

그래서 `@Component` 등의 애노테이션을 지정하는 것만으로도 빈등록이 가능했던 것이였다.

<br>

`@Component`을 포함해 디폴트 필터에 적용되는 애노테이션을 스프링에서는 

<span style="color:#4169E1">StreoType Annotation</span>이라 부른다. StreoType에는 아래 종류의 애노테이션이 있다.

- @Componentnet
- @Controller
- @Service
- @@Repository

<br>

#### <span style="background-color:black; color:white">AnnotationConfigApplicationContext</span>

<img src = "/assets/img/spring/container/annotationcontext.png"><br>

위 이미지는 `AnnotationConfigApplicationContext` 클래스의 일부를 캡쳐한 것이다.

- Reader : AnnotatedBeanDefinitionReader 클래스
- Scanner : ClassPathBeanDefinitionScanner 클래스

<br>

## <span style="color:gray">컴포넌트 스캔</span>

---

#### <span style="background-color:black; color:white">컴포넌트 스캔이란?</span>

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