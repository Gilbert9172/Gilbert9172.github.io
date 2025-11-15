---
layout: post
title: ControllerAdvice
categories: spring
tags: springBoot
---

## <span style="color:gray">@ControllerAdvice</span>

**`@ExceptionHandler`** 를 사용해서 예외를 깔끔하게 처리할 수 있게 되었지만, 

정상 코드와 예외 처리 코드가 하나의 컨트롤러에 섞여 있다. 

이 둘을 분리하기 위해서는 **`@ControllerAdvice`** 와 **`@RestControllerAdvice`** 를 사용하면 된다.

**`@ControllerAdvice`** 와 **`@RestControllerAdvice`** 조합하면 예외를 깔끔하게 해결할 수 있다.

<br>

### 대상 컨트롤러 지정 방법1 - 애노테이션

```java
@RestControllerAdvice(annotation = RestController.class)
public class ExControllerAdvice {...}
```

<br>

### 대상 컨트롤러 지정 방법2 - 패키지명 <span style="color:gray">*(주로 많이 사용)*</span>

```java
@RestControllerAdvice("org.example.controllers")
public class ExControllerAdvice {...}
```

<br>

### 대상 컨트롤러 지정 방법3 - 컨트롤러명

```java
@RestControllerAdvice(assignableTypes = {ControllerV1.class, ControllerV2.class})
public class ExControllerAdvice {...}
```

---