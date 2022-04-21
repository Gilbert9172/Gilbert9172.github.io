---
layout: post
title: Exception Handler
categories: spring
tags: springBoot
---

## <span style="color:gray">@ExceptionHandler</span>

스프링은 API 예외 처리 문제를 해결하기 위해서 <span style="color:yellow">**`@ExceptionHandler`**</span>라는 애노테이션을 사용하는

매우 편리한 예외 처리 기능을 제공하는데, 이것이 바로 ExceptionHandlerExceptionResolver이다.

스프링은 ExceptionHandlerExceptionResolver를 기본으로 제공하고, 

기본으로 제공하는 ExceptionResolver 중에서 우선 순위도가 가장 높다. 

실무에서 API예외 처리는 대부분 이 기능을 사용한다.

<br>

### <span style="color:gray">예외 처리 방법 1</span>

<span style="color:yellow">**`@ExceptionHandler`**</span> 애노테이션을 선언하고, 해당 Controller에서 

처리하고 싶은 예외를 지정해주면 된다. 해당 Controller에서 예외가 발생하면 이 메서드가 호출된다.

참고로 지정한 예외 또는 그 예외의 자식 클래스들 까지 모두 잡을 수 있다.

```java
@ExceptionHandelr(IllegalArgumentException.class)
public ErrorResult illegalExhandelr(IllegalArgumentException.class) {
    return new ErrorResult("BAD", e.getMessage());
}
```
위와 같이 작성할 경우 네트워크는 정상 작동하기 때문에 상태코드 200을 반환한다.

따라서 <span style="color:yellow">**`@ResponseStatus`**</span>를 추가해줘야 한다.

참고로 ***<span style="background-color:yellow">스프링의 우선순위는 항상 자세한 것이 우선권을 가진다.</span>***

예를 들어서 부모, 자식 클래스가 있다면 자식 클래스가 우선순위를 가진다.


