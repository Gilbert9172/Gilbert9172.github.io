---
layout: post
title: Optional
categories: springboot
---

# Optional

<br>

## <span style="color:gray">Optional이란??</span>

nul이 올 수 있는 값을 감싸는 Wrapper 클래스

<br>

### Optional.of()

만약 어떤 데이터가 null이 절대 아닌 경우에 사용.

```java
Optional<User> user1 = Optional.of(user);
```

<br>

### Optional.ofNullable()

값이 null이 올 수도 있고, 아닐 수도 있는 경우에 사용.

```java
Optional<User> user = Optional.ofNullable(user);
```

만약 `user = null` 일 경우에는 `orElse()` 또는 `orElseGet()` 메소드를 사용할 수 있다.

```java

```

