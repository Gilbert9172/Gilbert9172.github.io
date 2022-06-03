---
layout: post
title: 빈 후처리기
categories: spring
tags: springBoot
---

## <span style="color:gray">[ 빈 후처리기 - BeanPostProcessor ]</span>

**`BeanPostProcessor`** 는 번역하면 빈 후처리기인데, 이름 그대로 빈을 생성한 후에 

무언가를 처리하는 용도로 사용한다. 빈 후처리기는 빈을 조작하고 변경할 수 있는 후킹 포인트이다.

이것은 빈 객체를 조작하거나 심지어 다른 객체로 바꾸어 버릴 수 있을 정도로 막강하다.

여기서 조작이라는 것은 해당 객체의 특정 메서드를 호출하는 것을 뜻한다. 

일반적으로 스프링 컨테이너가 등록하는, 특히 컴포넌트 스캔의 대상이 되는 빈들은 중간에 조작할 방법이

없는데, 빈 후처리기를 사용하면 개발자가 등록하는 모든 빈을 중간에 조작할 수 있다. 

***<span style="background-color:yellow">이 말은 빈 객체를 프록시로 교체하는 것도 가능하다는 뜻이다.</span>***

```java
public interface BeanPostProcessor {

    @Nullable
    // 객체 생성 이후, @PostConstruct 같은 초기화가 발생하기 전에 호출되는 포스트 프로세서.
	default Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}

    @Nullable
    // 객체 생성 이후에 @PostConstruct 같은 초기화가 발생한 다음에 호출되는 포스트 프로세서.
	default Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}
}
```

빈 후처리기를 사용하려면 `BeanPostProcessor` 인터페이스를 구현하고, 스프링 빈으로 등록하면 된다.

---

<br>

## <span style="color:gray">[ 빈 후처리기 기능 ]</span>

**⒈ 생성** 

스프링 빈 대상이 되는 객체를 생성한다. (@Bean, @ComponentScan 포함)

<br>

**⒉ 전달** 

생성된 객체를 빈 저장소에 등록하기 직전에 빈 후처리기에 전달한다.

<br>

**⒊ 후 처리 작업**

빈 후처리기는 전달된 스프링 빈 객체를 조작하거나 다른 객체로 바꿔치기 할 수 있다.

<br>

**⒋ 등록**

빈 후처리기는 빈을 반환한다. 전달 된 빈을 그대로 반환하면 해당 빈이 등록되고,

바꿔치기 하면 다른 객체가 빈 저장소에 등록된다.

---

<br>

## <span style="color:gray">[ 빈 후처리기 - 문제/해결 ]</span>

#### **문제 1 - 너무 많은 설정**

예를 들어서 애플리케이션에 스프링 빈이 100개가 있다면 여기에 프록시를 통해

부가 기능을 적용하려면 100개의 프록시 설정 코드가 들어가야하낟.

<br>

#### **문제 2 - 컴포넌트 스캔**

컴포넌트 스캔을 사용하는 경우에는 수동으로 프록시 적용이 불가능하다.

왜냐하면 컴포넌트 스캐으로 이미 스프링 컨테이너에 실제 객체를 스프링 빈으로

등록을 다 해버린 상태이기 때문이다.

<br>

#### **해결**

빈 후처리기 덕분에 프록시를 생성하는 부분을 하나로 집중할 수 있다. 그리고

컴포넌트 스캔처럼 스프링이 작접 대상을 빈으로 등록하는 겅우에도 중간에 빈 등록

과정을 가로채서 원본 대신에 프록시를 스프링 빈으로 등록할 수 있다.

스프링은 프록시를 생성하기 위한 빈 후처리기를 이미 만들어서 제공한다.

---

<br>

## <span style="color:gray">[ 스프링이 제공하는 빈 후처리기 ]</span>

#### **자동 프록시 생성기 - AutoProxyCreator**

스프링 부트는 자동으로 **`AnnotationAwareAspectAutoProxyCreator`** 라는 빈 후처리를 스프링 빈에 

자동으로 등록한다. 이 빈 후처리기는 스프링 빈으로 등록된 Advisor들을 자동으로 찾아서 프록시가

필요한 곳에 자동으로 프록시를 적용해준다. 

<img src="/assets/img/spring/aop/AutoProxyCreator1.png">

<br>

#### **포인트컷의 두 가지 기능**

**⒈ 프록시 적용 여부 판단 - 생성단계**

자동 프록시 생성기는 포인트컷을 사용해서 해당 빈이 프록시를 생성할 필요가 있는지 없는지 체크한다.

클래스 + 메서드 조건을 모두 비교한다. 이때 모든 메서드를 체크하는데, 포인트컷 조건에 하나하나 매칭해본다. 

만약 조건에 맞는 것이 하나라도 있으면 프록시를 생성한다. 만약 조건에 맞는 것이 하나도 없으면 

프록시를 생성할 필요가 없으므로 프록시를 생성하지 않는다.

<br>

**⒉ 어드바이스 적용 여부 판단 - 사용단계**

프록시가 호출되었을 때 부가 기능인 어드바이스를 적용할지 말지 포인트컷을 보고 판단한다.

---

<br>

## <span style="color:gray">[ 하나의 프록시, 여러 Advisor 적용 ]</span>

예를 들어서 어떤 스프링 빈이 advisor1 , advisor2 가 제공하는 포인트컷의 조건을 모두 만족하면 

프록시 자동 생성기는 프록시를 몇 개 생성할까? ***<span style="background-color:yellow">프록시 자동 생성기는 프록시를 하나만 생성한다.</span>***

왜냐하면 프록시 팩토리가 생성하는 프록시는 내부에 여러 advisor 들을 포함할 수 있기 때문이다. 

따라서 프록시를 여러 개 생성해서 비용을 낭비할 이유가 없다.

<img src="/assets/img/spring/aop/AutoProxyCreator2.png">