---
layout: post
title: 스프링 AOP 포인트컷
categories: spring
tags: aop
---

## <span style="color:gray">[ 포인트컷 지시자 ]</span>

포인트컷 표현식은 execution 같은 포인트컷 지시자(Pointcut Designator)로 시작한다. 

줄여서 PCD라 한다.

|지시자|설명|
|------|----|
|`execution`|메소드 실행 조인 포인트를 매칭한다. 스프링 AOP에서 가장 많이 사용하고, 기능도 복잡하다.|
|`within`|특정 타입 내의 조인 포인트를 매칭한다.|
|`args`|인자가 주어진 타입의 인스턴스인 조인 포인트|
|`this`|스프링 빈 객체(스프링 AOP 프록시)를 대상으로 하는 조인 포인트|
|`target`|Target 객체(스프링 AOP 프록시가 가르키는 실제 대상)를 대상으로 하는 조인 포인트|
|`@target`|실행 객체의 클래스에 주어진 타입의 애노테이션이 있는 조인 포인트|
|`@within`|주어진 애노테이션이 있는 타입 내 조인 포인트|
|`@annotation`|메서드가 주어진 애노테이션을 가지고 있는 조인 포인트를 매칭|
|`@args`|전달된 실제 인수의 런타임 타입이 주어진 타입의 애노테이션을 갖는 조인 포인트| 
|`bean`|스프링 전용 포인트컷 지시자, 빈의 이름으로 포인트컷을 지정한다.|

---

<br>

## <span style="color:gray">[ execution 1 ]</span>

> execution(접근제어자? 반환타입 선언타입? 메서드이름(파라미터) 예외?)

- ?는 생략할 수 있다.
- `*`같은 패턴을 지정할 수 있다.

```java
"execution(public String hello.aop.member.MemberServiceImpl.hello(String))"

// 접급제어자, 선언타입, 예외 생략한 경우
"execution(* *(..))" 
```
---

<br>

## <span style="color:gray">[ execution 2 ]</span>

execution에서는 다형성이 할당 가능하다.

만약 부모타입을 표현식에 선언한 경우 부모 타입에서 선언한 메서드가 자식 타입에 

있어야 매칭에 성공한다. 그래서 부모 타입에 있는 hello(String) 메서드는 매칭에 

성공하지만, 부모 타입에 없는 메서드는 매칭에 실패한다.

<br>

execution 파라미터 매칭 규칙은 다음과 같다.

|규칙|설명|
|----|----|
|(String)|정확하게 String 타입 파라미터|
|( )|파라미터가 없어야 한다.|
|( * )|정확히 하나의 파라미터, 단 모든 타입을 허용한다.|
|( * , * )|정확히 두 개의 파라미터, 단 모든 타입을 허용한다.|
|( . . )|숫자와 무관하게 모든 파라미터, 모든 타입을 허용한다. 참고로 파라미터가 없어도 된다.|
|(String,...|String 타입으로 시작한다. 숫자와 무관하게 모든 파라미터, 모든 타입을 허용한다.|

---

<br>

## <span style="color:gray">[ within ]</span>

within 지시자는 특정 타입 내의 조인 포인트에 대한 매칭을 제한한다. 

쉽게 이야기해서 해당 타입이 매칭되면 그 안의 메서드들이 자동으로 매칭된다.

문법은 단순한데 execution 에서 타입 부분만 사용한다.

그런데 within 사용시 주의해야 할 점이 있다. 표현식에 부모 타입을 지정하면 안된다는 점이다.

정확하게 타입이 맞아야 한다. 이 부분에서 execution 과 차이가 난다.

---

<br>

## <span style="color:gray">[ args ]</span>

인자가 주어진 타입의 인스턴스를 조인 포인트로 매칭한다. 기본 문법은 execution의 

args부분과 같다. execution과 args의 차이점은 다음과 같다.

execution은 파라미터 타입이 정확하게 매칭되어야 한다. args는 부모 타입을 허용한다. 

args는 실제 넘어온 파라미터 객체 인스턴스를 보고 판단한다.

<br>

예를 들면 자바에서 기본으로 제공해주는 String은 Object, java.io.Seializable의 하위타입이다.

정적으로 클래스에 선언된 정보만 보고 판단하는 `execution(* *(Object))`는 매칭에 실패한다.

동적으로 실제 파라미터로 넘어온 객체 인스턴스로 판단하는 `args(Object)`는 매칭에 성공한다.

왜냐하면 args는 부모타입을 허용하기 때문이다.

---

<br>

## <span style="color:gray">[ @target vs @within ]</span>

|지시자|설명|
|------|----|
|@target|실행 객체의 클래스에 주어진 타입의 애노테이션이 있는 조인 포인트|
|@within|주어진 애노테이션이 있는 타입 내 조인 포인트|

두 지시자 모두 타입에 있는 애노테이션으로 AOP 적용 여부를 판단한다.

가장 큰 차이점은 아래의 그림에서 볼 수 있듯, **`@target`** 은 부모 클래스의 메서드까지

어드바이스를 다 적용하지만, **`@within`** 의 경우에는 자기 자신의 클래스에 정의된

메서드에만 어드바이스를 적용한다.

<img src="/assets/img/spring/aop/aop3.png">

---

<br>

## <span style="color:gray">[ @annotation ]</span>

메서드가 주어진 애노테이션을 가지고 있는 조인 포인트를 매칭

---

<br>

## <span style="color:gray">[ @args ]</span>

전달된 실제 인수의 런타임 타입이 주어진 타입의 애노테이션을 갖는 조인 포인트

---

<br>

## <span style="color:gray">[ bean ]</span>

스프링 전용 포인트컷 지시자, 빈의 이름으로 지정한다.

스프링 빈의 이름으로 AOP 적용 여부를 지정한다. 이것은 스프링에서만 사용할 수 있는 

특별한 지시자이다. 예) `bean(orderService) || bean(*Repository)` 

`*` 과 같은 패턴을 사용할 수 있다.

---

<br>

## <span style="color:gray">[ 매개변수 전달 ]</span>

다음은 포인트컷 표현식을 사용해서 어드바이스에 매개변수를 전달할 수 있다. 

> this, target, args,@target, @within, @annotation, @args


#### args 사용한 매개변수 조작.

메소드 전후로 DataSeq를 암호화 및 복호화 과정을 aop를 통해 적용

```java
@Slf4j
@Aspect
@Component
public class FileVoAdvisor {

    @Pointcut("execution(* com.webiznet.arthive.app.service..*.*(..))")
    public void cut() {}

    @Before("cut() && args(fileVo)")
    public void beforePointCut(JoinPoint joinPoint, FileVo fileVo) {
        log.info("Before JoinPoint ={}", joinPoint.getSignature());
        log.info("Before 시작={}",fileVo.getDataSeq());

        String dataSeq = new String(Base64.getDecoder().decode(fileVo.getDataSeq()));
        fileVo.setDataSeq(dataSeq);
        log.info("Before 결과={}",fileVo.getDataSeq());
    }

    @AfterReturning(value = "cut() && args(fileVo)")
    public void afterPointCut(JoinPoint joinPoint, FileVo fileVo) {
        log.info("After JoinPoint={}", joinPoint.getSignature());
        log.info("AfterReturning 시작={}",fileVo.getDataSeq());

        String base64DataSeq = Base64.getEncoder().encodeToString(fileVo.getDataSeq().getBytes(StandardCharsets.UTF_8));
        fileVo.setDataSeq(base64DataSeq);
        log.info("AfterReturning 결과={}",fileVo.getDataSeq());
    }
}
```

---

<br>

## <span style="color:gray">[ this & target ]</span>

`this`,`target`은 적용 타입 하나를 정확하게 지정해야 한다.

두 개 모두 부모타입은 허용한다.그러나 이 둘은 포인트컷을 매칭하는 대상(객체)에서 

차이점을 가지고 있다.

스프링에서는 AOP를 적용하면 실제 target 객체 대신에 프록시 객체가 스프링 빈으로 등록된다. 

`this`는 스프링 빈으로 등록되어 있는 프록시 객체를 대상으로 포인트컷을 매칭한다.

반면에 `target`은 실제 target 객체를 대상으로 포인트컷을 매칭한다.

<br>

JDK 동적 프록시의 경우 this, target은 구체 클래스를 지정할 때 차이가 생긴다.

<img src="/assets/img/spring/aop/aop4.png">

<br>

### **`this(com.test.MemberServiceImpl)`**

MemberServiceImpl은 인터페이스가 있기 때문에 MemberService 인터페이스를 기반으로

proxy객체가 생성된다. 이때 생성된 proxy객체는 MemberServiceImpl를 전혀 알지 못한다.

> MemberServiceImpl또한 MemberService의 구현클래스지만 어떤 메소드가 추가됐는지 모른다.

따라서 ***<span style="background-color:yellow">AOP적용 대상이 아니다.</span>***

<br>

### **`target(com.test.MemberServiceImpl)`**

this와 다르게 target 객체를 보고 판단한다. target 객체가 MemberServiceImpl 타입이므로 

***<span style="background-color:yellow">AOP 적용 대상이다.</span>***

<br>

CGLIB 프록시의 경우 구체 클래스를 기반으로 프록시 객체가 생성되기 때문에

모두 AOP가 적용된다. 

---