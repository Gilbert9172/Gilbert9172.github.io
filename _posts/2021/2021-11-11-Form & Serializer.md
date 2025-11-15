---
layout: post
title: Form & Serializer
categories: django
tags: drf
---

### 💡 ***Form & Serializer***

<br>

#### Serializer / ModelSerializer

▪ 데이터 변환 / 직렬화 지원

▪ Django의 Form/ModelForm과 유사

Serializer는 view 응답을 생성하는 데에 범용적이고 강력한 방법을 제공해준다.

ModelSerializer는 Serializer 생성을 위한 Shortcut이다.

---

<br> 

### 💡 ***Feature 비교*** 

<br> 

#### Form / ModelForm

html 입력 form을 통한 입력에 대한 유효성 검사

주로 Create/Update에 대한 처리에서 활용 → 장고 admin에서 활용

CreateView/UpdateView CBV를 통한 view처리 → 단일 view

<br> 

#### Serializer / ModelSerializer

데이터 변환 및 직렬화 지원 (JSON 포맷)

주로 JSON 포맷 입력에 대한 유효성 검사

List/Create 및 특정 리소스에 대한 Retrieve/Edit/Delete 등 에서 활용

APIView를 통한 View 처리 → 단일 view → 1개의 URL 처리

ViewSet을 통한 View 처리 → 2개 view → 2개의 URL 처리

---

<br> 

### 💡 ***주된 호출 주제*** 

<br>

#### Form

일반적으로 웹 브라우저 상에서 <span style="color:#B8860B">**HTML Form Submit**</span>을 통해서 POST 요청을 받게 된다.

혹은 <span style="color:#B8860B">**JavaScript에 의한 비동기 호출**</span>도 가능하다. 

물론 https 프로토콜 요청/응답이기에 Android/ios 앱에 의한 요청/응답도 가능하다.

<br>

#### Serializer

다양한 Client(웹)에 대한 Data 위주의 http(s) 요청

---

<br>

### 💡 ***Class 정의***

<br>

#### Form/ModelForm

```python
# form
from django import forms

class PostForm(forms.Form):
    email = forms.EmailField()
    content = forms.CharField(widget=forms.Textarea)
    created_at = forms.DateField()

# ModelForm
class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = '__all__'
```

<br>

#### Serializer/ModelSerializer

Form 쪽은 HTML Form을 좀 더 효율적으로 처리하기 위함이다. 

반면에 Serializer의 경우에는 api 요청을 처리하는 것에 맞춰져있기 때문에

Form에서 사용한 widget은 Serializer에 없다.

```python
from rest_framework import serializers

# Serializer
class PostSerializer(serializers.Serializer):
    email = forms.EmailField()
    content = forms.CharField(max_length=200)
    created_at = forms.DateField()

# ModelSerializer
class PostModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
```
---

<br>

### 💡 ***유효성 검사 수행 시점***

<br>

#### Form
```python

```

<br>

#### Serializer
```python
```
---

<br>

### 💡 ***clean VS validate***

아래의 두 코드에서 <span style="color:#B8860B">**ValidationError**</span>는 이름은 같지만, 다른 로직을 탄다.

<br>

#### Form
```python
from django import forms

class PostForm(forms.Form):
    title = forms.CharField()

    def clean_title(self):
        value = self.cleaned_data.get('title','')
        if 'django' not in value:
            raise forms.ValidationError('실패')
        return value
```

<br>

#### Serializer
```python
from rest_framework import ValidationError

class PostSerializer(serializers.Serializer):
    title = serializer.CharField(max_length=100)

    def validate_title(self,value):
        if 'django' not in value:
            raise ValidationError('실패')
        return value
```
---
