---
layout: post
title: Exception Handler
categories: spring
tags: springBoot
---

## <span style="color:gray">@ExceptionHandler</span>

스프링은 API 예외 처리 문제를 해결하기 위해서 **`@ExceptionHandler`** 라는 애노테이션을 사용하는

매우 편리한 예외 처리 기능을 제공하는데, 이것이 바로 ExceptionHandlerExceptionResolver이다.

스프링은 ExceptionHandlerExceptionResolver를 기본으로 제공하고, 

기본으로 제공하는 ExceptionResolver 중에서 우선 순위도가 가장 높다. 

실무에서 API예외 처리는 대부분 이 기능을 사용한다.

<br>

### <span style="color:gray">예외 처리 방법 1</span>

**`@ExceptionHandler`** 애노테이션을 선언하고, 해당 Controller에서 처리하고 싶은 예외를 

지정해주면 된다. 해당 Controller에서 예외가 발생하면 이 메서드가 호출된다.

참고로 지정한 예외 또는 그 예외의 자식 클래스들 까지 모두 잡을 수 있다.

```java
@ExceptionHandelr(IllegalArgumentException.class)
public ErrorResult illegalExhandelr(IllegalArgumentException.class) {
    return new ErrorResult("BAD", e.getMessage());
}
```
위와 같이 작성할 경우 네트워크는 정상 작동하기 때문에 상태코드 200을 반환한다.

따라서 **`@ResponseStatus`** 를 추가해줘야 한다.

참고로 ***<span style="background-color:yellow">스프링의 우선순위는 항상 자세한 것이 우선권을 가진다.</span>***

예를 들어서 부모, 자식 클래스가 있다면 자식 클래스가 우선순위를 가진다.

<br>

ExceptionHandler의 흐름은 아래와 같다.

---

**Step 1.**

Controller를 호출한 결과 IllegalArgumentException 예외가 Controller 밖으로 던저진다.

<br>

**Step 2.**

예외가 발생했으므로 ExceptionResolver가 작동한다. 

이떄 가장 우선순위가 높은 ExceptionHandlerExceptionResolver가 실행된다. 

<br>

**Step 3.**

ExceptionHandlerExceptionResolver는 해당 Controller에 IllegalArgumentException을 

처리할 수 있는 **`@ExceptionHandler`** 가 있는지 확인한다.

<br>

**Step 4.**

illegalExHandle()를 실행한다. `@RestController` 이므로 illegalExHandle()에도 `@ResponseBody`가 적용된다. 

따라서 HTTP 컨버터가 사용되고, JSON으로 반환된다.

<br>

**Step 5.**

@ResponseStatus(HttpStatus.BAD_REQUEST) 를 지정했으므로 HTTP 상태코드 400으로 응답한다.

---

<br>

### <span style="color:gray">예외 처리 방법 2</span>

> 회사에서 프로젝트할 때 사용했던 방식

**`@ExceptionHandler`** 에서 예외를 생략할 수 있다. 

그러나 생략할 경우 메서드 파라미터에 반드시 예외를 지정해야 한다.

```java
@ExceptionHandler
public ResponseEntity NoHandlerFoundException(NoHandlerFoundException e) {
    log.info(e.getLocalizedMessage());
    
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
}
```

---