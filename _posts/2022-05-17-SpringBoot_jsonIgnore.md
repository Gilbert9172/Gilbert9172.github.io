---
layout: post
title: Json에서 null값 처리하기
categories: spring
tags: springBoot
---

## <span style="color:gray">null값을 어떻게 처리할 수 있을까?</span>

간혹가다 DTO에 값이 매핑되지 않는경우 null값으로 반환이 되어서 내려온다. 

뭐 사실있어도 크게 상관은 없지만 깔끔하게? null값을 없애보고 싶었다.

<br>

## <span style="color:gray">@JsonIgnore</span>

해당 어노테이션을 사용하면 Jackson이 해당 프로퍼티를 무시하도록 만든다.

필드 레벨에서 상요한다.

```java
import com.fasterxml.jackson.annotation.JsonIgnore;

public class TestVo {

    @JsonIgnore
    private String test;
}
```

<br>

## <span style="color:gray">@JsonIgnoreProperties</span>

클래스 레벨에서 사용한다.

```java
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"test"})
public class TestVo {

    @JsonIgnore
    private String test;
    private String test2;
}
```

<br>

## <span style="color:gray">@JsonIgnoreType</span>

클래스 수준에서 사용도미ㅕ 전체 클래스를 무시한다.

```java
import com.fasterxml.jackson.annotation.JsonIgnoreType;

@JsonIgnoreType
public class TestVo {

    @JsonIgnore
    private String test;
    private String test2;
}
```

<br>

## <span style="color:gray">@JsonInclude</span>

**`JsonInclude.Include.NON_NULL`** 를 사용할시 프로퍼티 중 null인 프로퍼티를 제외한다.

이번 프로젝트에서 사용한 방법이다. 처음에는 JsonIgnore를 사용했는데 막상 사용하니깐

실제로 필요한 값을 제외해서 내려주지 않는 경우가 생겨서 이 방법을 사용했다.

```java
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class TestVo {

    private String test;
    private String test2;
}
```

NON_NULl 외에도 다양한 항목을 선택할 수 있다.

<img src="/assets/img/spring/JsonInclude.png">