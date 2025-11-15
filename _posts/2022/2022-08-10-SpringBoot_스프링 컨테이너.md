---
layout: post
title: 스프링 컨테이너와 스프링 빈
categories: spring
tags: springBoot
---

## <span style="color:gray">스프링 컨테이너</span>

---

#### ***스프링 컨테이너란?***

ApplicationContext를 스프링 컨테이너라 한다. (인터페이스이다.)

기존에는 개발자가 별도의 AppConfig 사요해서 직접 객체를 생성하고 DI를 했지만,

이제부터는 스프링 컨테이너를 통해서 이 작업을 수행한다.

<br>

스프링 컨테이너는 `@Configuration` 어노테이션이 붙은 별도의 AppConfig를 구성정보로

사용한다. 여기서 `@Bean`이라 적힌 메서드를 모두 호출해서 반환된 객체를 스프링 컨테이너에 

등록한다. 이렇게 스프링 컨테이너에 등록된 객체를 ***<span style="color:green">스프링 빈</span>*** 이라 한다.

<br>

스프링 빈은 `@Bean`이 붙은 메서드의 명을 스프링 빈의 이름으로 사용한다.

이전에는 개발자가 필요한 객체를 별도의 AppConfig를 사용해서 직접 조회했지만,

이제부터는 스프링 컨테이너를 통해서 필요한 스프링 빈을 찾아야 한다. 

스프링 빈은 `getBean()` 메서드를 사용해서 찾을 수 있다.

<br>

## <span style="color:gray">스프링 컨테이너 생성</span>

---

```java
//스프링 컨테이너 생성
ApplicationContext applicationContext =
                        new AnnotationConfigApplicationContext(AppConfig.class);
```

ApplicationContext는 인터페이스이다.

- AnnotationConfigApplicationContext : 어노테이션 기반의 설정

- XmlConfigApplicationContext : xml 기반의 설정 

위 두 구현체 외에도 많은 구현체가 있다. 

<br>

스프링 컨테이너는 XML을 기반으로 만들 수 있고, 애노테이션 기반의 자바 설정 클래스로 

만들 수 있다. 요즘에는 애노테이션 기반을 많이 사용한다.

<br>

더 정확히는 스프링 컨테이너를 부를 때 `BeanFactory`, `ApplicationContext`로 구분해서

이야기한다. 그러나 일반적으로 `ApplicationContext`를 스프링 컨테이너라고 한다.

<br>

## <span style="color:gray">스프링 컨테이너 생성 과정</span>

---

#### ***스프링 컨테이너 생성***

<img src="/assets/img/spring/container/생성.png">

✔︎ 스프링 컨테ㅐ이너를 생성할 때는 구성 정보를 지정해줘야 한다.

<br>

#### ***스프링 빈 등록***

<img src="/assets/img/spring/container/등록.png">

스프링 컨테이너는 파라미터로 넘어온 설정 클래스 정보를 사용해서 

스프링 빈을 등록한다. 이때 key값은 `빈 이름`이고, value 값은 `빈 객체`가 된다.

빈 이름은 메서드 이름을 사용하는데, 개발자가 직접 부여할 수 있다.

직접 이름을 부여할 때 주의할 점은, 빈 이름은 항상 다른 이름을 부여해야 한다는

점이다. 같은 이름을 부여하면, 다른 빈이 무시되거나, 기존 빈을 덮어버리거나

설정에 따라 오류가 발생한다.

<br>

#### ***스프링 빈 의존관계 설정***

<img src="/assets/img/spring/container/주입.png">

✔︎ 스프링 컨테이너는 설정 정보를 참고해서 의존관계를 주입한다.

<br>

## <span style="color:gray">스프링 빈 조회 - 상속</span>

---

***<span style="background-color:yellow">대원칙 : 부모 타입으로 조회하면, 자식 타입도 함께 조회한다.</span>***

그래서 모든 자바 객체의 최고 부모인 `Object`타입으로 조회하면, 모든 스프링 빈을 조회한다.

<br>

## <span style="color:gray">BeanFactory와 ApplicationContext</span>

---

<img src="/assets/img/spring/container/BeanFactory.png">

그림에서 볼 수 있듯이 ApplicationContext는 BeanFactory에 부가 기능을 더했다고 

볼 수 있다.

<br>

#### ***BeanFactory***

✔︎ 스프링 컨테이너의 최상위 인터페이스다.

✔︎ 스프링 빈을 관리하고 조회하는 역할을 담당한다.

✔︎ `getBean()`을 제공한다.

✔︎ 지금까지 우리가 사용했던 대부분의 기능은 BeanFactory가 제공하는 기능이다.

<br>

#### ***ApplicationContext***

Applicationcontext는 BeanFactory 기능을 모두 상속 받아서 제공한다. 그런데 빈을 

관리하고 검색하는 기능을 BeanFactory가 제공해준다. 그러면 둘의 차이는 뭘까..? 

<br>

우리가 애플리케이션을 개발할 때 빈을 관리하고 조회하는 기능은 뿐만 아니라, 수 많은

부가기능이 필요하다. 위에 이미지에서 볼 수 있듯이 `ApplicationContext`는 

`BeanFactory` 뿐만 아니라 다양한  인터페이스의 기능을 가지고 있다.

<br>

|부가 기능|설명|비고|
|---------|----|----|
|MessageSource|국제화 기능|한국에서 들어오면 한국어, 영어권은 여어|
|EnvironmentCapabel|환경변수|로컬, 개발, 운영 등을 구분해서 처리|
|ApplicationEventPublisher|애플리케이션 이벤트|이벤트를 발행하고 구독하는 모델을 편리하게 지원|
|ResourceLoader|편리한 리소스 조회|파일, 클래스 패스, 외부 등에서 리소스를 편리하게 조회|

<br>

## <span style="color:gray">스프링 빈 설정 메타 정보 - BeanDefinition</span>

---

스프링 빈은 어떻게 다양한 설정 형식을 지원하는 것일까? 

그 중심에는 `BeanDefinition`이라는 추상화가 있다. 

쉽게 이야기 하면 **역할과 구현을 나눈 것이다.**

<img src="/assets/img/spring/container/BeanDefinition.png">

위 그림을 보면 설계가 너무 잘되어 있다. 스프링 컨테이너는 오로지 `BeanDefinition`

인터페이스만 알면 되기 때문이다. (OCP와 DIP를 잘 지킨다.)

<br>

```java
public class AnnotationConfigApplicationContext extends GenericApplicationContext implements AnnotationConfigRegistry {
    private final AnnotatedBeanDefinitionReader reader;
    private final ClassPathBeanDefinitionScanner scanner;
    //...
}
```

`AnnotationConfigApplicationContext`에 있는 `AnnotatedBeanDefinitionReader`라는 녀석인 설정(구성)정보를 

읽어서 `BeanDefinition` (빈 메타정보)를 생성한다.

<br>

정리해보면 BeanDefinition을 직접 생성해서 스프링 컨테이너에 등록할 수 도 있다. 

하지만 실무에서 BeanDefinition을 직접 정의하거나 사용할 일은 거의 없다고 한다. 

나도 개발하면서 (물론 경험이 많지는 않지만) 아직 써본적이 없다. 

그냥 ***<span style="background-color:yellow">스프링이 다양한 형태의 설정 정보를 BeanDefinition으로 추상화해서 사용한다.</span>***

정도만 이해하면 될 것 같다.