---
layout: post
title: Mixins 상속을 통한 APIView
categories: django
tags: drf
---

### 💡 ***DRF에서 지원하는 Mixins***

> 반복해서 쓰는 로직을 패턴화 시켜둔것. 

Python의 상속 문법을 활용한 것이다. Mixin이라는 네이밍을 갖고 있는 class는 

클래스라기 보단, 반복해서 쓰는 로직을 패턴화 시켜둔 것이라고 이해했다. 

그리고 필요하다면 다양한 믹스인을 만들수도 있다. 아래는 기본적인 Mixin들이다.

１. CreateModelMixin

２. ListModelMixin

３. RetrieveModelMixin

４. UpdateModelMixin

５. DestroyModelMixin

---

<br>

#### method별 로직 연결 

```python
from rest_framework import generics 
from rest_framework import mixins

class PostListAPIView(mixins.ListModelMixin, mixins.CreateModelMixin,
                        generics.GenricAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get(self,request,*args,**kwargs):
        return self.list(request,*args,**kwargs)

    def post(self,request,*args,**kwargs):
        return self.create(request,*args,**kwargs)

```

위 코드에서 상속 받는 순서는 MRO를 기반으로 호출되기 때문에 중요하다.

따라서 **`GenricAPIView`** 가 가장 마지막에 오게 된다.

하지만 위와 같이 매번 직접 연결을 하는 것은 번거롭다.

그래서 위와 같은 부분을 패턴화 해 두었는데,

APIView → mixin → Generics → ViewSet 순으로 기능들을 압축시켜 놨다고 한다.

---

<br>

### 💡 ***GenricAPIView 활용***

[GenricAPIView 깃허브 소스코드](https://github.com/encode/django-rest-framework/blob/3.11.0/rest_framework/generics.py) 

```python
from rest_framework import generics

class PostListAPIView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
```
Generics를 상속 받으면 위와 같이 코드를 굉장히 간단하게 구현할 수 있다.

---