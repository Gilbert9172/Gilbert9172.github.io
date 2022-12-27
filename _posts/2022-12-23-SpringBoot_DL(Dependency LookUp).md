---
layout: post
title: Dependency LookUp
categories: spring
tags: springBoot
---

## <span style="color:gray">DL(Dependency LookUp)</span>

---

#### <span style="background-color:black; color:white">DL이란?</span>

Dependecy LookUp은 DI와 반대로 스프링 컨테이너에 등록된 빈을 찾는 것을 말한다.

ApplicationContext에서 제공해주는 `getBean()` 메소드를 통해서 DL을 할 수 있다.

<br>

#### <span style="background-color:black; color:white">예시 코드</span>

```java
AnnotationConfigApplicationContext ac =
            new AnnotationConfigApplicationContext(ClientBean.class, ProtoTypeBean.class);

ClientBean clientBean1 = ac.getBean(ClientBean.class);
```

<br>

<details>
<summary>출력결과</summary>
<div markdown="1">

```txt
com.SingletonWithPrototype$ClientBean@3c7c886c
```

</div>
</details>

<br>

## <span style="color:gray">Scope</span>

---

#### <span style="background-color:black; color:white">용어 정리</span>


• `스코프` : 존재할 수 있는 범위를 가리키는 말이다. 

• `빈 스코프` : 빈 오브젝트가 만들어져 존재할 수 있는 범위이다.

<br>

#### <span style="background-color:black; color:white">Scope의 종류</span>

|스코프|설명|
|------|----|
|싱글톤|기본 스코프, 스프링 컨테이너의 시작과 종료까지 유지되는 가장 넓은 범위의 스코프|
|프로토타입|스프링 컨테이너가 프로토타입 빈의 생성과 DI 까지만 관여하고 그 이후는 관리하지 않는 스코프|
|요청|Http 요청마다 별도의 빈 인스턴스가 생성되고, 관리된다.|
|세션|Http Session과 동일한 생명주기를 가지는 스코프|
|어플리케이션|ServletContext와 동일한 생명주기를 가지는 스코프|
|웹소켓|웹 소켓과 동일한 생명주기를 가지는 스코프|

<br>

#### <span style="background-color:black; color:white">프로토타입 스코프</span>

**[ 프로토타입 스코프란? ]**

프로토타입 스코프의 경우에는 스프링 컨테이너가 빈을 생성하고 DI 해주는 것 까지만 관리한다.

그 후로는 더 이상 관리를 하지 않는다. 여기서 `더 이상 컨테이너가 관리하지 않는다.` 라는 의미는

<span style="color:red">새로운 요청</span>이 들어올 때 마다 프로토타입 스코프의 경우에는 <span style="color:red">매번 새로운 인스턴스를 반환</span>하게 된다.

<details>
<summary>예제 코드</summary>
<div markdown="1">

```java
public class PrototypeTest {

    @Test
    void prototypeBeanFind() {
        AnnotationConfigApplicationContext ac = new AnnotationConfigApplicationContext(PrototypeBean.class);
        System.out.println("find prototypeBean1");
        PrototypeBean prototypeBean1 = ac.getBean(PrototypeBean.class);

        System.out.println("find prototypeBean2");
        PrototypeBean prototypeBean2= ac.getBean(PrototypeBean.class);

        System.out.println("prototypeBean1 = " + prototypeBean1);
        System.out.println("prototypeBean2 = " + prototypeBean2);

        assertThat(prototypeBean1).isNotSameAs(prototypeBean2);
        ac.close();
    }

    @Scope("prototype")
    static class PrototypeBean {
        @PostConstruct
        public void init() {
            System.out.println("prototype Init");
        }

        @PreDestroy
        public void destroy() {
            System.out.println("prototype.destroy");
        }
    }
}
```

</div>
</details>

<br>

<details>
<summary>출력결과</summary>
<div markdown="1">

<img src = "/assets/img/spring/scope/prototype1.png">

</div>
</details>

<br>

출력 결과를 보면 DI든 DL이든 **새로운 인스턴스를 반환**하는 것을 알 수 있다. 

<br>

**[ 프로토타입 빈의 용도 ]**

프로토타입 빈은 코드에서 `new`로 오브젝트를 생성하는 것을 대신하기 위해 사용된다.

사용자의 요청별로 독립적인 정보나 작업 상태를 저장해둘 오브젝트를 만들 필요가 있다.

이 경우에는 대부분 `new` 키워드나 `팩토리(factory)`를 이용해 코드 내에 직접 오브젝트를

만들면 된다. **<span style="background-color:#F0E68C">하지만 DI가 필요한 경우라면 프로토타입 빈을 사용해야한다.</span>**

<br>

**[ 프로토타입 빈의 생명주기와 종속성 ]**

프로토타입 빈은 컨테이너가 초기 생성 시에만 관여하고 DI 한 후에는 더 이상 신경쓰지 않기

때문에 빈 오브젝의 관리는 전적으로 DI 받은 오브젝트에 달려있다. 따라서 프로토타입 빈은

이 빈을 주입받은 오브젝트에 종속적일 수밖에 없다.

만약 프로토타입을 주입 받은 빈이 싱글톤이라면, 이 프로토타입 빈의 생명주기는 싱글톤 생명주기를

따를것이다. 반대로 프로토타입보다 더 짧은 생명주기를 갖는 빈에 이 프로토타입빈이 주입되었다면,

더 짧은 생명주기를 따라가게 된다.

<br>

**[ 싱글톤 빈과 함께 사용시 문제점 ]**

위에서 프로토타입 빈이 싱글톤 빈에 주입이 되면, 생명주기가 더 긴 싱글톤 빈의 생명주기를 

따른다고 했다. 이번엔 이 경우에 생길 문제에 대해서 정리해보았다.

<br>

⒈ 싱글톤 빈 **S**가 프로토타입 빈인 **P**를 주입 받는다.

⒉ **P**의 생명주기는 **S**의 생명주기를 따른다.

⒊ `손님1`이 치킨을 1마리 장바구니에 넣었다. (P에 카운트 로직이 있다고 가정.)

⒋ `손님2`도 치킨을 1마리 장바구니에 넣었다.

⒌ `손님1`이 결제를 하려고 보니 치킨이 2마리가 된것을 확인했다.

<br>

위의 시나리오에서 생긴 문제의 이유는 <span style="color:red">프로토타입 빈이 싱글톤 빈의 생명주기를 따르기 때문이다.</span>

<br>

**[ 프로토타입 빈의 DL 전략 ]**

⒈ getBean

<details>
<summary>에제 코드</summary>
<div markdown="1">

```java
@Test
void singletonClientUsePrototype() {
    AnnotationConfigApplicationContext ac =
            new AnnotationConfigApplicationContext(ClientBean.class, ProtoTypeBean.class);

    ClientBean clientBean1 = ac.getBean(ClientBean.class);
    int count1 = clientBean1.logic();
    assertThat(count1).isEqualTo(1);

    ClientBean clientBean2 = ac.getBean(ClientBean.class);
    int count2 = clientBean2.logic();
    assertThat(count2).isEqualTo(1);
}
```

</div>
</details>

<br>

위의 예제 코드처럼 `getBean()` 메서드로 직접 필요한 의존관계를 DL을 하면된다.

하지만 이렇게 스프링의 ApplicationContext를 전체를 주입받게 되면, 스프링 컨테이너에

종속적인 코드가 되고, 단위 테스트도 어려워진다.

<br>

⒉ ObjectFactory, ObjectProvider

<details>
<summary>에제 코드</summary>
<div markdown="1">

```java
@Autowired
private ObjectProvider<PrototypeBean> prototypeBeanProvider;

public int logic() {
    PrototypeBean prototypeBean = prototypeBeanProvider.getObject();
    prototypeBean.addCount();
    int count = prototypeBean.getCount();
    return count;
}
```

</div>
</details>

<br>

직접 Application Context를 사용하지 않으려면 중간에 컨텍스트에서 `getBean()`을 호출해주는

역할을 맡은 오브젝트를 두면 된다. 이렇게 되면 ApplicationContext의 `getBean()`처럼 너무

로우 레벨의 API를 사용하지 않기 때문에 코드가 깔끔할뿐더러, 테스트 코드 작성에도 유리하다.

<br>

⒊ JSR-330 Provider

<details>
<summary>에제 코드</summary>
<div markdown="1">

```java
//implementation 'javax.inject:javax.inject:1' gradle 추가 필수 @Autowired
private Provider<PrototypeBean> provider;

public int logic() {
    PrototypeBean prototypeBean = provider.get();
    prototypeBean.addCount();
    int count = prototypeBean.getCount();
    return count;
}
```

</div>
</details>

<br>

Provider는 자바 표준이며 기능이 단순하므로 단위 테스트를 만들거나 mock코드를 만들기 훨씬 쉽다.

<br>

## <span style="color:gray">웹 스코프</span>

---

#### <span style="background-color:black; color:white">요청 스코프</span>

**[ 요청 스코프 빈이란? ]**

요청 스코프는 하나의 웹 요청 안엥서 만들어지고 해당 요청이 끝날 때 제거된다. 

각 요청별로 독립적인 빈이 만들어지기 때문에 빈 오브젝트 내에 상태 값을 저장해둬도

안전하다. 

<br>

**[ 웹 스코프빈 DL ]**

요청 스코프 빈은 컨텍스트 초기화 시점에서는 만들어 질 수조차 없다. 왜냐면 아무런

웹 요청이 들어오지 않았기 때문이다. 따라서 요청 스코프 빈을 싱글톤 빈에 그냥 DI하면

컨텍스트 초기화 중 에러가 발생할 것이다.

결국 요청 스코프 빈은 프로토타입 빈과 마찬가지로 Provider나 ObjectFactory 같은 DL 방식을

사용해야 한다.


<br>

**[ 웹 스코프와 프록시 ]**

컨텍스트 초기화 시점에 직접 스코프 빈을 DI하는 대신  **<span style="background-color:#F0E68C">스코프 빈에 대한 프록시를 DI 해주는 것이다.</span>**
 
```java
@Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
@Scope(value = "request", proxyMode = ScopedProxyMode.INTERFACES)
```