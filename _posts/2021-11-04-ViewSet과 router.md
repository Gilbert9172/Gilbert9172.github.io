---
layout: post
title: ViewSet & Router
categories: django
tags: drf
---

### 💡 ***ViewSet***

2개의 URL을 지원한다. 하나의 URL을 list/create를 지원하고,

나머지 하나는 detail/update/partial_update/delete를 지원한다.

위와 같이 2개로 나눌수도 있지만, `ViewSet`에서는 2개의 URL 구현을

하나의 단일 클래스에서 제공해준다.

<br>

#### ViewSet 안 쓸 경우
```python
from rest_framework import generics

class PostListAPIView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
```

<br>

#### ViewSet 쓸 경우
```python
# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('post', view.PostViewSet)

urlpatterns =[
    path('',include(router.urls)),
]

# views.py
from rest_framework.viewsets import ModelViewSet

class PostViewSet(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
```
---

### 💡 ***ModelViewSet***

ModelViewSet에는 두 가지가 있다. 

１. viewsets.ReadOnlyModelViewSet

GET 요청에만 반응하는 ViewSet

- list 지원

- detail 지원

<br>

２. viewsets.ModelViewSet

- list/create 지원 (1개의 URL)

- detail/update/partial_update/delete 지원 (1개의 URL)

---

<br>

### 💡 ***Router***

리소스 라우팅을 사용하면 별도의 경로를 선언하는 대신

주어진 리소스에 대한 모든 공통 경로를 빠르게 선언할 수 있다. 

router.urls를 출력해 봤더니 출력 결과는 아래와 같았다.

```txt
[
    <URLPattern '^post/$' [name='post-list']>, 
    <URLPattern '^post\.(?P<format>[a-z0-9]+)/?$' [name='post-list']>,

    <URLPattern '^post/(?P<pk>[^/.]+)/$' [name='post-detail']>,
    <URLPattern '^post/(?P<pk>[^/.]+)\.(?P<format>[a-z0-9]+)/?$' [name='post-detail']>,

    <URLPattern '^$' [name='api-root']>,
    <URLPattern '^\.(?P<format>[a-z0-9]+)/?$' [name='api-root']>
]
```

<span style="color:#3CB371">**post-list**</span>와 <span style="color:#3CB371">**detail-list**</span>가 생성된 걸 확인할 수 있었다.

그리고 format을 지원해주는 URL도 같이 생성된다. 따라서 URL창에

`/post/1.json`과 같이 입력을 하게 되면, 아래와 같이 json형식으로 나온다.

<img src="/assets/img/django/router1.png">

마지막에 생성된 <span style="color:#3CB371">**api-root**</span>는 현재 router에 등록된 리소스에 대한 목록을 볼 수 있다.

<img src="/assets/img/django/router2.png">

---

<br>

### 💡 ***ViewSet에 새로운 EndPoint 추가하기***

#### @action

ViewSet은 <span style="color:#BA55D3">**@action**</span>을 통해 메소드를 데코레이션 하여

새로운 EndPoint를 표시할 수 있다. 

```python
# views.py
class PostView(ModelViewSet):
    queryset = Post.object.all()
    serializer_class = PostSerializer

    @action(detail=False, methods=['GET'])
    def public(self,request):
        qs = self.get_queryset().filter(is_public=True)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, method=['PATCH'])
    def set_public(self,request,pk):
        instance = self.get_object()
        instance.is_public = True
        instance.save(update_fields=['is_public'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
```
- [GenericAPIView](https://github.com/Gilbert9172/django-rest-framework/blob/00cd4ef864a8bf6d6c90819a983017070f9f08a5/rest_framework/generics.py)

위 링크에 가면 <span style="color:#BA55D3">**`get_queryset()`**</span>, **`get_object()`**, **`get_serializer()`** 함수의 소스코드를 볼 수 있다.

<br>

이러한 추가 작업을 통해 생성된 URL은 아래와 같이 기존 URLPattern에 추가된다.

(밑에 4줄이 새로 추가된 URLPattern이다.)

```txt
[
    #====================================== 기존 URLPattern ======================================#
    <URLPattern '^post/$' [name='post-list']>, 
    <URLPattern '^post\.(?P<format>[a-z0-9]+)/?$' [name='post-list']>,

    <URLPattern '^post/(?P<pk>[^/.]+)/$' [name='post-detail']>, 
    <URLPattern '^post/(?P<pk>[^/.]+)\.(?P<format>[a-z0-9]+)/?$' [name='post-detail']>, 

    <URLPattern '^$' [name='api-root']>, 
    <URLPattern '^\.(?P<format>[a-z0-9]+)/?$' [name='api-root']>]

    #===================================== 추가 된 URLPattern =====================================#
    <URLPattern '^post/(?P<pk>[^/.]+)/set_public/$' [name='post-set-public']>, 
    <URLPattern '^post/(?P<pk>[^/.]+)/set_public\.(?P<format>[a-z0-9]+)/?$' [name='post-set-public']>, 

    <URLPattern '^post/public/$' [name='post-public']>, 
    <URLPattern '^post/public\.(?P<format>[a-z0-9]+)/?$' [name='post-public']>,
]
```