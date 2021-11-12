---
layout: post
title: Serializer를 통한 유효성 검사 및 저장
categories: django
tags: drf
---

### 💡 ***생성자***

Serializer는 Djagno Form과 컨셉 및 사용법이 매우 유사하다. 

하지만 생성자(`__init__`)에 차이가 있다.

여기서 둘의 차이점은 Form 생성자의 첫 번째 인자는 <span style="color:#3CB371">**data**</span>이지만,

Serializer 생성자의 첫 번째 인자는 <span style="color:#B8860B">**instance**</span>이다.

instance 인자는 직렬화가 목적이고, '모델 객체' 혹은 'Queryset'을 전달해준다.

그리고 실제 유효성 검사를 위해서는 data 인자를 넘겨줘야 한다.

```python
# django/forms/forms.py/BaseForm
class BaseForm(RenderableFormMixin):
    # 생략
    def __init__(self,data=None,):
        # 생략

# rest_framework/serializers.py/BaseSerializer
class BaseSerializer(Field):
    def __init__(self, instance=None, data=empty, **kwargs):
        # 생략
```
Serializer의 data 인자가 주어지면, 아래와 같은 기능을 사용할 수 있다.

１. **`.initial_data`** 필드에 접근할 수 있다.

２. **`.validate_data`** 를 통해 유효성 검증에 통과한 값들이 **`.save()`** 시에 저장

３. **`.errors`** → 유효성 검증 수행 후에 오류 내역 

４. **`.data`** → 유효성 검증 후에, 갱신된 인스턴스에 대한 필드값 사전으로 반환


---

<br>

### 💡 ***serializer.save() Method***

**`serializer.save()`** 를 호출할 때는 여러 kwargs를 넘겨줄 수 있다. 

실제 위 함수는 `ModelForm.save()`와 마찬가지로 아래와 같은 기능을 수행한다.

▪ DB에 저장한 관련 Instance를 리턴

▪ **`.validated_data`** 와  **`serializer.save()`** 의 인자로 주어진 <span style="color:#B8860B">**kwargs 사전**</span>을 

합친 데이터를 실제 DB에 업데이트를 시도.

<br>

예를 들어 사용자의 IP를 지정해야 할 경우 보통 아래와 같이 구현했다.
```python
# views.py
class PostCreate(request):
    if reqeust.method == 'POST':
        form = PostForm()
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.ip = request.META['REMOTE_ADDR']
            post.save()
            return redirect('instagram:test')
```

반면에 Serializer에서는 save에 내가 업데이트하고 싶은 값 들을 kwargs로 넘겨준다. 

```python
serializer.is_valid(raise_exception=True)
serializer.save(author=request.user, ip=request.META['REMOTE_ADDR'])
```
▪ **`.update()`** : self.instance 인자가 지정되어 있을 경우

▪ **`.create()`** : self.instance 인자가 지정되어 있을 않을 경우

---

<br>

### 💡 ***rest_framework.validators***

DRF에서는 <span style="color:#B8860B">**유일성 체크**</span>를 도와주는 validators를 제공해준다.

<br>

▪ UniqueValidator : 지정 1개 필드가 지정 QuerySet 범위에서의 유일성 여부 체크

▪ UniqueTogetherValidator : UniqueValidator의 다수 필드 버전

▪ BaseUniqueForValidator

▪ UniqueFor<span style="color:#3CB371">**Date**</span>Validator (BaseUniqueValidator) : 지정 날짜 범위에서 유일성 여부 체크

▪ UniqueFor<span style="color:#3CB371">**Month**</span>Validator (BaseUniqueValidator) : 지정 월 범위에서 유일성 여부 체크

▪ UniqueFor<span style="color:#3CB371">**Year**</span>Validator (BaseUniqueValidator) : 지정 년 범위에서 유일성 여부 체크

<br>

#### UniqueValidator

Serializer 필드에 직접 Validators를 지정 가능하다.

```python
from rest_framework.validators import UniqueValidators

slug = SlugField(
    max_length = 100,
    validators = [UniqueValidaors(queryset=...)]
)
```
그러나 모델 필드에 <span style="color:#B8860B">**unique=True**</span>를 지정하면, 자동 지정된다.

▪ queryset → 필수

▪ message : 유효성 검사 실패 시의 에러 메세지

▪ lookup : default('exact')

<br>

#### UniqueTogetherValidator

모델 Meta에 unique_together이 지정된다면, 자동 지정된다.

```python
from rest_framework.validators import UniqueTogetherValidator 

class ExampleSerializer(serializers.Serializer):
    # ...
    class Meta:
    validators = [
        UniqueTogetherValidator(
            queryset=ToDoItem.objects.all(), fields=['list', 'position']
        ) 
    ]
```

▪ queryset → 필수

▪ fields → 필수

▪ message

<br>

#### UniqueFor(Date/Month/Year)Validator

```python
from rest_framework.validators import UniqueForYearValidator 

class ExampleSerializer(serializers.Serializer):
    # ...
    class Meta:
        validators = [
            UniqueForYearValidator(

                # 1. 전체 queryset에서 
                queryset=BlogPostItem.objects.all(),

                # 3. 해당 년도에 slug가 유일한지 체크!
                field='slug',

                # 2. published라는 field에서 연도만 확인하고,
                date_field='published'
            )
        ]
```
▪ queryset → 필수

▪ fields → 필수

▪ date_field → 필수

▪ message

---

<br>

### 💡 ***ValidationError***

Django와 DRF의 ValidationError는 이름만 같을 뿐, 다른 로직을 사용하게 된다.

기본 Django에서는 djagno.core.exceptions.ValidationError 로직을,

DRF에서는 <span style="color:#B8860B">**rest_framework.exceptions.ValidatorError**</span> 로직을 사용한다.

▪ [Djagno ValidationError](https://github.com/Gilbert9172/django/blob/main/django/core/exceptions.py#L107)

▪ [DRF ValidationError](https://github.com/encode/django-rest-framework/blob/3.10.1/rest_framework/exceptions.py#L138)

---

<br>

### 💡 ***Serializer에서 유효성 검사***

필드 정의 시에 validators 지정하거나, 클래스 Meta.validators 지정할 수 있다.

<br>

#### 1. Field Level 검사

특정 필드에 대한 유효성 검사 및 값 변환

▪ validate_필드명

```python
def validate_title(self,value):
    # 생략
```

#### 2. Object Level 검사

두 개 이상의 필드에 대한 유효성 검사 및 변환

```python
def validate(self,value):
    # 생략
```
---

<br>

### 💡 ***DB반명 & perform_ 계열 함수***

APIView의 create/update/destroy 멤버 함수에서 실질적인 DB처리 로직은 

perform_create(serializer), perform_update(serializer), perform_destroy(instance)를

통해 이뤄 집니다.

▪ [CreateModelMixin 소스코드](https://github.com/Gilbert9172/django-rest-framework/blob/master/rest_framework/mixins.py#L12)

```python
class CreateModelMixin:
    """
    Create a model instance.
    """
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save()

    def get_success_headers(self, data):
        try:
            return {'Location': str(data[api_settings.URL_FIELD_NAME])}
        except (TypeError, KeyError):
            return {}
```

▪ **`perform_create(serializer)`** : 실제로 create를 수행하는 함수

▪ **`serializer.save()`** : 모델 객체 생성

<br>

create시에 추가로 저장할 필드가 있을 경우에는 아래와 같이 진행한다.

```python
def perform_create(self, serializer):
    serializer.save(ip=seld.requet.META['REMOTE_ADDR'])
```
---