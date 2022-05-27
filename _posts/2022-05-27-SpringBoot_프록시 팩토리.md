---
layout: post
title: Proxy Factory
categories: spring
tags: springBoot
---

## <span style="color:gray">[ JDK 동적 프록시 & GCLIB ]</span>

#### JDK 동적 프록시

> 인터페이스를 구현(implement)해서 프록시 생성



JDK 동적 프록시는 인터페이스를 기반으로 프록시를 동적으로 만들어준다. 

따라서 인터페이스가 필수이다. **`InvocationHandler`** 인터페이스를 구현해서 작성하면 된다.

<br>

#### CGLIB (Code Generate Library)

> 구체 클래스를 상속(extends)해서 프록시 생성

바이트 코드를 조작해서 동적으로 클래스를 생성하는 기술을 제공하는 라이브러리이다.

CGLIB를 사용하면 인터페이스가 없어도 **구체 클래스만 가지고** 동적 프록시를 만들어낼 수 있다.

**`MethodInterceptor`** 인터페이스를 구현해서 작성하면 된다.

<br>

참고로 우리가 CGLIB를 직접 사용하는 경우는 거의 없다. 왜냐면 스프링의 ProxyFactory라는 

것이 이 기술을 편리하게 사용하게 도와주기 때문이다. 너무 깊이있게 파기 보다는 무엇인지

대략 개념만 잡으면 된다.

---

<br>

## <span style="color:gray">[ Proxy Factory란? ]</span>

프록시 팩토리는 인터페이스가 있는 경우에는 JDK 동적 프록시를 적용하고, 

그렇지 않은 경우에는 CGLIB를 적용하기 위해서 나온 기능이다.

즉, ***<span style="background-color:yellow">동적 프록시를 통합해서 편리하게 만들어주는 기능이다.</span>***

<img src="/assets/img/spring/aop/proxyfactory1.png">

<br>

프록시 팩토리 덕분에 개발자는 `InvocationHandler`나 `MethodInterceptor`를 신경쓰지 않고 **`Advice`** 만 

만들면 된다. 왜냐면 프록시 팩토리 내부에서 Advice를 호출하는 전용 `InvocationHandler`, `MethodInterceptor`가

사용되기 때문이다.

<img src="/assets/img/spring/aop/proxyfactory2.png">

---