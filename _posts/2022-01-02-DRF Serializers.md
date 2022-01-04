---
layout: post
title: DRF에서 serializer란?
categories: django
tags : drf  
---

[DRF serializers documentation](https://www.django-rest-framework.org/api-guide/serializers/) 내용 정리

<br>

### 💡 ***Serializers***

Serializers를 사용하면 'queryset' 및 '모델 instance'와 같은 복잡한 데이터를 JSON, XML 또는 

기타 콘텐츠 유형으로 쉽게 렌더링할 수 있는 기본 Python 데이터 유형으로 변환할 수 있다.

DRF의 **`Serializer 클래스`** 는 Django의 form 클래스, modelform 클래스와 굉장히 유사하다. 

Serializer class는 응답의 출력을 제어하는 강력하고 일반적인 방법을 제공해준다. 이와 유사하게

**`Model Serializer 클래스`** 가 있는데, 이것은 'queryset' 및 '모델 instance'를 처리하는 serializer를 

생성하기 위한 유용한 클래스이다.

---

<br>

### 📚 ***Serializing Objects*** 

**⒈ 모델 인스턴스를 Python 기본 데이터 유형으로 변환**

```python
serializer = TestSerializer(data=request.data)
serializer.is_valid()
serializer.data

#출력값 : '~~'
```

<br>

**⒉ 직렬화 프로세스를 완료하기 위해 데이터를 json으로 렌더링**

```python
from rest_framework.renderers import JSONRenderer

json = JSONRenderer().render(serializer.data)

#출력값 : b '~~'
```
---

<br>

### 📚 ***Deserializing objects***

**⒈ 먼저 stream을 Python 기본 데이터 유형으로 구문 pasing**
```python
import io
from rest_framework.parsers import JSONParser

stream = io.BytesIO(json)
data = JSONParser().parse(stream)
```

<br>

**⒉ 다음으로 원형의 데이터를 검증된 데이터(dict type)로 넣는다.**

요청 받는 값에 대한 직렬화를 진행할 땐, **`data=`** 으로 값을 넘겨줘야한다.

```python
serializer = CommentSerializer(data=data)
serializer.is_valid()
serializer.validated_data
```

**`data=`** 으로 값을 넘겨준 후에 사용할 수 있는 메서드이다.

- is_valid() 

- initial_data 

- validated_data : `is_valid()` 메서드 사용 수 사용가능 ; 모든 값 반환

- errors - `is_valid()` 메서드 사용 수 사용가능

- data - `is_valid()` 메서드 사용 수 사용가능

---

<br>

### 📚 ***Saving Instance***

유효성 검증을 통과한 데이터로 구성된 '모델 객체'를 반환해주고 싶다면,

**`.create()`** 및 **`.update()`** 메서드 중 하나 또는 둘 다를 구현해야 한다.

만일 모델 instance가 Django 모델과 대응한다면, 이 것을 DB에 저장하고 싶을 것이다.

이럴 경우에 마지막에 **`.save()`** 메서드를 추가해야한다.

<br>

근데 어제 instance의 비밀번호를 바꿀 땐 **`.set_password()`** 매서드를 사용했다. 

그래서 drf doc과 같이 validated_data.get('password')를 해서 바꿔보니 비밀번호가 

DB에 해싱이 되지 않은 상태로 들어갔다. 

<br>

추가적으로 instance를 저장하는 시점에서 데이터를 추가로 입력하고 싶다면, 

**`.save()`** 메서드 호출시 kwargs(Keyword arguments)를 추가해주면 된다.

```python
serializer.save(owner=request.user)
```
---

<br>

### 💡 ***Validation***

<br>

**⒈ Field-level validation** 

Serializer 하위 클래스에 **`.validate_필드명`** 메서드를 추가하여 custom field에 대한 

유효성 검사를 지정할 수 있다. 이것은 Django form의 **`.clean_필드명`** 메소드와 유사하다.

이 메서드는 "single argument(하나의 값)"에 대해서만 유효성검증을 진행한다.


<br>

**⒉ Object-level validation**

여러 필드에 접근하는 유효성 검사를 수행하려면 **`.validate()`** 라는 메서드를 

Serializer 하위 클래스에 추가해야한다. 이 메서드는 dict 형태인 단일 인수를 사용한다.

---

<br>

### 💡 ***Partial updates***

기본적으로 Serializer는 모든 필수 필드에 대한 값을 전달해야 한다. 그렇지 않으면 

유효성 검사에서 오류가 발생하게 된다. 이때 추가적으로 **`partial`** 이라는 인자를 

<span style="color:#2E8B57">**True**</span>로 넘겨주면, 특정 필드만 업데이트가 가능하다.

```

data = {
    "password" : "new_password"
}

serializer = PasswordChangeSerializer(instance, data = data, partial=True)
```


