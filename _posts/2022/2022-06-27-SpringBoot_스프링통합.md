---
layout: post
title: ThymeLeaf 스프링 통합
categories: spring
tags: thymeleaf
---

## <span style="color:gray">입력 폼 처리</span>


|기능|설명|
|----|----|
|**`th:object`**|커멘드 객체를 지정한다.|
|**`*{...}`**|선택 변수 식이라고 한다. `th:object`에서 선택한 객체에 접근한다.|
|**`th:field`**|HTML 태그의 id, name, value 속성을 자동으로 처리해준다.|

<br>

***Contoller***
```java
@GetMapping("/add")
public String addForm(Model model) {
    model.addAttribute("item", new Item());
    return "form/addForm";
}
```

<br>

***html***
```html
<form action="item.html" th:action th:object="${item}">
    <div>
        <input type="text" th:field="*{itemName}" class="form-control" placeholder="이름을 입력하세요">
    </div>
```

|기능|설명|
|----|----|
|**`th:object`**|컨트롤러에서 model객체에 넘겨서 보내준 key|
|**`th:field="﹡{itemName}"`**|object에서 item을 잡아놨기 때문에 사용가능 원래는 item.itemName|

그리고 ***`th:field`*** 를 사용하면 렌더링이 될 때 자동으로 id, name, value를 만들어 준다. 

<br>


**렌더링 전**
```html
 <input type="text" th:field="*{itemName}" class="form-control" placeholder="이름을 입력하세요">
```


**렌더링 후**
```html
<input type="text" class="form-control" placeholder="이름을 입력하세요" id="itemName" name="itemName" value="">
```
