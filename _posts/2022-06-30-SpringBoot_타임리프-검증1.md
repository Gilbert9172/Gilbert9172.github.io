---
layout: post
title: ThymeLeaf Validation
categories: spring
tags: thymeleaf
---

## <span style="color:gray">BindingResult</span>

> BindingResult 파라미터의 위치는 반드시 @ModelAttribute 뒤에 와야한다.

타임리프는 스프링의 `BindingResult`를 활용해서 편리하게 검증 오류를 표현하는 기능을 제공한다. 

|파라미터|넣어야할 값|
|--------|-----------|
|#fields|#fields 로 BindingResult 가 제공하는 검증 오류에 접근할 수 있다.|
|th:errors|해당 필드에 오류가 있는 경우에 태그를 출력한다. `th:if`의 편의 버전이다.|
|th:errorclass|`th:field`에서 지정한 필드에 오류가 있으면 class정볼를 추가한다.|

`BindingResult`는 스프링이 제공하는 검증 오류를 보관하는 객체이다. 검증 오류가 발생하면

여기에 보관하면 된다. `BindingResult`가 있으면 `@ModelAttribute`에 데이터 바인딩 시 

오류가 발생해도 컨트롤러가 호출된다. 

<br>

**BindingResult에 검증 오류를 적용하는 3가지 방밥**

⒈ `@ModelAttribute`의 객체 타입 오류 등으로 바인딩이 실패하는 경우 스프링이 `FieldError`를

생성해서 BindingResult에 넣어준다.

⒉ 개발자가 직접 넣어준다.

⒊ Validator 사용

<br>

**BindingResult와 Errors**

BindingResult는 인터페이스이고, Errors 인터페이스를 상속받고 있다.

실제 넘어오는 구현체는 `BeanPropertyBindingResult`라는 것인데, 둘다 구현하고 있으므로

Errors를 사용해도 된다. 하지만 BindingResult는 `addError()` 메소드도 제공해준다.

<br>

## <span style="color:gray">FieldError</span>

**첫 번째 생성자**

<img src="/assets/img/spring/fieldError/fieldError0.png">

```java
bindingResult.addError(new FieldError("object", "fieldName", "기본 메세지")); 
```

<br>

|파라미터|넣어야할 값|
|--------|-----------|
|objectName|@ModelAttribute 이름|
|field|오류가 발생한 필드 이름|
|defaultMessage|오류 기본 메세지|

<br>

```html
<input type="text" id="price" th:field=*{price}
        th:errorclass="field-error" class="form-control" placeholder="가격을 입력하세요">

<div class="field-error" th:errors="*{price}">
    가격 오류
</div>


<!-- 오류 발생할 때 -->
<div>
    <input type="text" id="itemName" class="form-control field-error" 
    placeholder="이름을 입력하세요" name="itemName" value="">
    <div class="field-error">
        상품 이름은 필수입니다.
    </div>
</div>


<!-- 정상일 때 -->
<div>
    <input type="text" id="itemName" class="form-control" 
    placeholder="이름을 입력하세요" name="itemName" value="qwer">
</div>

```

<br>

**두 번째 생성자**

<img src="/assets/img/spring/fieldError/fieldError1.png">

|파라미터|설명|
|--------|----|
|**`objectName`**| 오류가 발생한 객체 이름|
|**`field`**| 오류 필드|
|**`rejectedValue`**| 사용자가 입력한 값(거절된 값)|
|**`bindingFailure`**| 타입 오류 같은 바인딩 실패인지, 검증 실패인지 구분 값|
|**`codes`**| 메시지 코드|
|**`arguments`**| 메시지에서 사용하는 인자|
|**`defaultMessage`**| 기본 오류 메시지|

<br>

FieldError는 오류 발생시 사용자 입력 값을 저장하는 기능을 제공한다.

물론 타입 오류로 바인딩에 실해하면 스프링은 FieldError를 생성하면서 사용자가 입력한

값을 넣어둔다. 그리고 해당 오류를 BindingResult에 담아서 컨트롤러를 호출한다.

따라서 타입 오류 같은 바인딩 실패시에도 사용자의 오류 메시지를 정상 출력할 수 있다.

<br>

타임리프의 `th:field="*{price}"`는 매우 똑똑하게 동작한다. 정상 상황에는 모델 객체의

값을 사용하지만, 오류가 발생하면 FieldError에서 보관한 값을 사용해서 값을 출력한다.

---

<br>

## <span style="color:gray">글로벌 오류 - ObjectError</span>

```java
bindingResult.addError(new ObjectError("objectName","기본 메세지"))
```

<br>

|파라미터|넣어야할 값|
|--------|-----------|
|objectName|@ModelAttribute 이름|
|defaultMessage|오류 기본 메세지|

<br>

```html
<div th:if="${#fields.hasGlobalErrors()}">
    <p class="field-error" th:each="err:${#fields.globalErrors()}" th:text="${err}">
</div>
```
