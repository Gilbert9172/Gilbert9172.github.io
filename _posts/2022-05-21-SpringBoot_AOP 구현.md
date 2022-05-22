---
layout: post
title: 스프링 AOP 구현
categories: spring
tags: aop
---

## <span style="color:gray">[ 설정 ]</span>
 
우선 dependency를 추가해주어야 한다.

- maven
```XML
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-aop</artifactId>
    <version>5.3.20</version>
</dependency>
```

<br>
- gradle
```xml
implementation 'org.springframework.boot:spring-boot-starter-aop'
```

## <span style="color:gray">[ 가장 기본적인 구현 ]</span>

```java
@Slf4j
@Aspect
public class AspectV1 {

    @Around("execution(* hello.aop.order..*(..))")
    public Object doLog(ProceedingJoinPoint joinPoint) throws Throwable{
        log.info("[log] {}", joinPoint.getSignature());
        return joinPoint.proceed();
    }
}
```

→ 포인트 컷 : `"execution(* hello.aop.order..*(..))"`

→ 어드바이스 : `doLog`

<br>

그리고 `@Around`를 사용하면 반드시 **`joinPoint.proceed();`** 를 꼭! 써야한다.


<br>

`@Aspect`는 컴포넌트 스캔이 되지는 않는다. 따라서 사용하기 위해선

스프링 빈으로 등록해야 한다.

---

<br>

## <span style="color:gray">[ 포인트 컷 분리 ]</span>

```java
@Slf4j
@Aspect
public class AspectV2 {

    //hello.aop.order 패키지와 하위 패키지
    @Pointcut("execution(* hello.aop.order..*(..))")    //pointcut expression
    private void allOrder(){}                           //pointcut signature

    @Around("allOrder()")
    public Object doLog(ProceedingJoinPoint joinPoint) throws Throwable{
        log.info("[log] {}", joinPoint.getSignature());
        return joinPoint.proceed();
    }
}
```

**@Pointcut**

→ `@Pointcut`에 포인트컷 표현식을 사용한다.

→ 메서드 이름과 파라미터를 합쳐서 pointcut signature라 한다.

→ 메서드의 반환 타입은 반드시 `void`여야 한다.

→ 코드 내용은 비워둔다.

---

<br>

## <span style="color:gray">[ 어드바이스(부가기능) 추가 ]</span>

```java
@Slf4j
@Aspect
public class AspectV3 {

    //hello.aop.order 패키지와 하위 패키지
    @Pointcut("execution(* hello.aop.order..*(..))") 
    private void allOrder() {} 

    // 클래스 이름 패턴이 *Service
    @Pointcut("execution(* *..*Service.*(..))")
    public void allService() {}

    //    @Around("execution(* hello.aop.order..*(..))")
    @Around("allOrder()")
    public Object doLog(ProceedingJoinPoint joinPoint) throws Throwable {
        log.info("[log] {}", joinPoint.getSignature());
        return joinPoint.proceed();
    }

    //hello.aop.order 패키지와 하위 패키지 이면서 클래스 이름 패턴이 *Service
    @Around("allOrder() && allService()")
    public Object doTransaction(ProceedingJoinPoint joinPoint) throws Throwabl {
        try {
            log.info("[트랜잭션 시작] {}", joinPoint.getSignature());
            Object result = joinPoint.proceed();
            log.info("[트랜잭션 커밋] {}", joinPoint.getSignature());
            return result;
        } catch (Exception e) {
            log.info("[트랜잭션 롤백] {}", joinPoint.getSignature());
            throw e;
        } finally {
            log.info("[리소스 릴리즈] {}", joinPoint.getSignature()); }
    }
}
```

**`@Around("allOrder() && allService()")`**

포인트컷은 이렇게 조합할 수 있다. `&&`, `||`, `!` 이렇게 3가지 조합이 가능하다.

---

<br>

## <span style="color:gray">[ 포인트 컷 참조 ]</span>

<br>

#### 포인트컷 모음 PointCuts

```java
public class PointCuts {

    //hello.springaop.app 패키지와 하위 패키지
    @Pointcut("execution(* hello.aop.order..*(..))")
    public void allOrder(){}

    //타입 패턴이 *Service
    @Pointcut("execution(* *..*Service.*(..))")
    public void allService(){}

    //allOrder && allService
    @Pointcut("allOrder() && allService()")
    public void orderAndService(){}
}

```

<br>

#### 포인트컷 모음(PointCuts)참조

```java
@Slf4j
@Aspect
public class AspectV4PointCut {

    @Around("hello.aop.order.aop.PointCuts.allOrder()")
    public Object doLog(ProceedingJoinPoint joinPoint) throws Throwable {
        log.info("[log] {}", joinPoint.getSignature());
        return joinPoint.proceed();
    }
    @Around("hello.aop.order.aop.PointCuts.orderAndService()")
    public Object doTransaction(ProceedingJoinPoint joinPoint) throws Throwable {

        try {
            log.info("[트랜잭션 시작] {}", joinPoint.getSignature());
            Object result = joinPoint.proceed();
            log.info("[트랜잭션 커밋] {}", joinPoint.getSignature());
            return result;
        } catch (Exception e) {
            log.info("[트랜잭션 롤백] {}", joinPoint.getSignature());
            throw e;
        } finally {
            log.info("[리소스 릴리즈] {}", joinPoint.getSignature()); }
    }
}
```

사용하는 방법은 패키지명을 포함한 클래스 이름과 포인트 컷 시그니처를 

모두 지정하면 된다. 포인트컷을 여러 어드바이스에서 함께 사용할 때 

이 방법을 사용하면 효과적인다.

---

<br>

## <span style="color:gray">[ 어드바이스 순서 ]</span>

어드바이스는 기본적으로 순서를 보장하지 않는다. 순서를 지정하고 싶으면 

`@Aspect`적용 단위로 `@Order`를 적용해야 한다. 

따라서 Aspect를 별도의 클래스로 분리해야 한다.

```java
@Slf4j
public class AspectV5Order {

    @Aspect
    @Order(2)
    public static class LogAspect {

        @Around("hello.aop.order.aop.PointCuts.allOrder()")
        public Object doLog(ProceedingJoinPoint joinPoint) throws Throwable {
            log.info("[log] {}", joinPoint.getSignature());
            return joinPoint.proceed();
        }
    }

    @Aspect
    @Order(1)
    public static class TxAspect {

        @Around("hello.aop.order.aop.PointCuts.orderAndService()")
        public Object doTransaction(ProceedingJoinPoint joinPoint) throws Throwable {
            try {
                log.info("[트랜잭션 시작] {}", joinPoint.getSignature());
                Object result = joinPoint.proceed(); log.info("[트랜잭션 커밋] {}", joinPoint.getSignature());
                return result;
            } catch (Exception e) {
                log.info("[트랜잭션 롤백] {}", joinPoint.getSignature());
                throw e;
            } finally {
                log.info("[리소스 릴리즈] {}", joinPoint.getSignature()); }
        }
    }
}
```

---

<br>

## <span style="color:gray">[ 어드바이스 종류 ]</span>

어드바이스는 `@Around` 외에도 여러가지 종류가 있다.

<br>

#### **`@Around`**

> 메서드 호출 전후에 수행되는 가장 강력한 어드바이스이다.

하는 역할은 아래와 같다.

|역할|설명|
|----|---|
|조인 포인트 실행 여부 선택|joinPoint.proceed() 호출 여부 선택|
|전달 값 변환|joinPoint.proceed(args[])|
|반환 값 변환|-|
|예외 변환|-|

<br>

모든 어드바이스는 `org.aspectj.lang.JoinPoint`를 첫 번째 파라미터에 사용할 수 있다.

***<span style="background-color:yellow">단, @Around는 ProceedingJoinPoint를 사용해야 한다.</span>***

ProceedingJoinPoint의 메서드인 proceed()를 통해서 대상을 실행할 수 있고, 여러번 실행할 수도 있다.

---

<br>

#### **`@Before`**

> 조인 포인트 실행 이전에 실행

```java
@Before("hello.aop.order.aop.Pointcuts.orderAndService()")
public void doBefore(JoinPoint joinPoint) {
    log.info("[before] {}", joinPoint.getSignature());
}
```

**`@Around`** 와 다르게 작업 흐름을 변경할 수는 없다.

**`@Around`** 는 `ProceedingJoinPoint.proceed()` 를 호출해야 다음 대상이 호출된다. 

만약 호출하지 않으면 다음 대상이 호출되지 않는다. 

반면에 **`@Before`** 는 `ProceedingJoinPoint.proceed()` 자체를 사용하지 않는다. 

메서드 종료시 자동으로 다음 타켓이 호출된다. 물론 예외가 발생하면 다음 코드가 호출되지는 않는다.

---

<br>

#### **`@AfterReturning`**

> 조인 포인트가 정상완료 후 실행

```java
@AfterReturning(value = "hello.aop.order.aop.Pointcuts.orderAndService()", returning = "result")
public void doReturn(JoinPoint joinPoint, Object result) {
      log.info("[return] {} return={}", joinPoint.getSignature(), result);
}
```

returning 속성에 사용된 이름은 어드바이스 메서드의 매개변수 이름과 일치해야 한다.

Joinpoint한 메서드의 반환 값과 returning 절에 지정된 반환 타입이 일치해야한다.

물론 부모 타입을 지정하면 모든 자식 타입은 인정된다.(다형성)

**`@Around`** 와 다르게 반환되는 객체를 변경할 수는 없다. 하지만 반환 객체를 조작할 수 있다.

예를 들면 `result.getXxx()` 와 같이 값을 조작한 뒤 반환할 수 있다.

---

<br>

#### **`@AfterThrowing`**

> 메서드가 예외를 던지는 경우 실행 

```java
@AfterThrowing(value = "hello.aop.order.aop.Pointcuts.orderAndService()", throwing = "ex")
public void doThrowing(JoinPoint joinPoint, Exception ex) {
      log.info("[ex] {} message={}", joinPoint.getSignature(), ex.getMessage());
}

```

throwing 속성에 사용된 이름은 어드바이스 메서드의 매개변수 이름과 일치해야 한다.

throwing 절에 지정된 타입과 맞은 예외를 대상으로 실행한다. 여기서도 다형성이 적용된다.

---

<br>

#### **`@After`**

> 조인 포인트가 정상 또는 예외에 관계 없이 실행(finally와 비슷함)

메서드 실행이 종료되면 실행된다.

정상 및 예외 반환 조건을 모두 처리한다.

일반적으로 리소스를 해제하는데 사용한다.

---

<br>
 
## <span style="color:gray">[ JoinPoint 인터페이스의 주요 기능 ]</span>

✓ **`getArgs()`** : 메서드 인수를 반환한다.

✓ **`getThis()`** : 프록시 객체를 반환한다.

✓ **`getTarget()`** : 대상 객체를 반환한다.

✓ **`getSignature()`** : 조인되는 메서드에 대한 설명을 반환.

✓ **`toString()`** : 조인되는 방법에 대한 유용한 설명을 반환.

<br>

## <span style="color:gray">[ ProceedingJoinPoint 인터페이스의 주요 기능 ]</span>

ProceedingJoinPoint는 아래의 그림과 같이 JoinPoint를 상속받은 인터페이스이다.

<img src="/assets/img/spring/aop/aop2.png">

따라서 JoinPoint 인터페이스의 모든 기능을 가지고 있고 아래의 기능을 추가로 가진다.

✓ **`proceed()`** : 다음 어드아비스나 타켓을 호출한다.

<br>

만약 **`@Around`** 에 proceed 메서드가 없다면 크나큰 문제를 야기하기 때문에 

사용시 꼭 주의해야한다.

---

<br>

## <span style="color:gray">[ @Around 외에 다른 어드바이스가 존재하는 이유 ]</span>

`@Around` 가 가장 넓은 기능을 제공하는 것은 맞지만, 실수할 가능성이 있다. 

반면에 `@Before` , `@After` 같은 어드바이스는 기능은 적지만 실수할 가능성이 낮고, 코드도 단순하다. 

그리고 가장 중요한 점이 있는데, 바로 ***<span style="background-color:yellow">이 코드를 작성한 의도가 명확하게 들어난다는 점</span>*** 이다. 

`@Before` 라는 애노테이션을 보는 순간 "아~ 이 코드는 타켓 실행 전에 한정해서 어떤 일을 하는 코드구나" 

라는 것이 들어난다. 즉, ***<span style="background-color:yellow">좋은 설계는 제약이 있는 것이다.</span>***

`@Around`만 있으면 되는데 왜? 이렇게 제약을 두는가? 제약은 실수를 미연에 방지한다. 일종에 가이드 역할을 한다. 

만약 `@Around` 를 사용했는데, 중간에 다른 개발자가 해당 코드를 수정해서 호출하지 않았다면? 

큰 장애가 발생했을 것이다. 처음부터 `@Before` 를 사용했다면 이런 문제 자체가 발생하지 않는다.

***제약 덕분에 역할이 명확해진다*** . 다른 개발자도 이 코드를 보고 고민해야 하는 범위가 줄어들고 

코드의 의도도 파악하기 쉽다.

---