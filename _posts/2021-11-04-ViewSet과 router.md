---
layout: post
title: ViewSet & Router
categories: django
tags: drf
---

### ๐ก ***ViewSet***

2๊ฐ์ URL์ ์ง์ํ๋ค. ํ๋์ URL์ list/create๋ฅผ ์ง์ํ๊ณ ,

๋๋จธ์ง ํ๋๋ detail/update/partial_update/delete๋ฅผ ์ง์ํ๋ค.

์์ ๊ฐ์ด 2๊ฐ๋ก ๋๋์๋ ์์ง๋ง, `ViewSet`์์๋ 2๊ฐ์ URL ๊ตฌํ์

ํ๋์ ๋จ์ผ ํด๋์ค์์ ์ ๊ณตํด์ค๋ค.

<br>

#### ViewSet ์ ์ธ ๊ฒฝ์ฐ
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

#### ViewSet ์ธ ๊ฒฝ์ฐ
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

### ๐ก ***ModelViewSet***

ModelViewSet์๋ ๋ ๊ฐ์ง๊ฐ ์๋ค. 

๏ผ. viewsets.ReadOnlyModelViewSet

GET ์์ฒญ์๋ง ๋ฐ์ํ๋ ViewSet

- list ์ง์

- detail ์ง์

<br>

๏ผ. viewsets.ModelViewSet

- list/create ์ง์ (1๊ฐ์ URL)

- detail/update/partial_update/delete ์ง์ (1๊ฐ์ URL)

---

<br>

### ๐ก ***Router***

๋ฆฌ์์ค ๋ผ์ฐํ์ ์ฌ์ฉํ๋ฉด ๋ณ๋์ ๊ฒฝ๋ก๋ฅผ ์ ์ธํ๋ ๋์ 

์ฃผ์ด์ง ๋ฆฌ์์ค์ ๋ํ ๋ชจ๋  ๊ณตํต ๊ฒฝ๋ก๋ฅผ ๋น ๋ฅด๊ฒ ์ ์ธํ  ์ ์๋ค. 

router.urls๋ฅผ ์ถ๋ ฅํด ๋ดค๋๋ ์ถ๋ ฅ ๊ฒฐ๊ณผ๋ ์๋์ ๊ฐ์๋ค.

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

<span style="color:#3CB371">**post-list**</span>์ <span style="color:#3CB371">**detail-list**</span>๊ฐ ์์ฑ๋ ๊ฑธ ํ์ธํ  ์ ์์๋ค.

๊ทธ๋ฆฌ๊ณ  format์ ์ง์ํด์ฃผ๋ URL๋ ๊ฐ์ด ์์ฑ๋๋ค. ๋ฐ๋ผ์ URL์ฐฝ์

`/post/1.json`๊ณผ ๊ฐ์ด ์๋ ฅ์ ํ๊ฒ ๋๋ฉด, ์๋์ ๊ฐ์ด jsonํ์์ผ๋ก ๋์จ๋ค.

<img src="/assets/img/django/router1.png">

๋ง์ง๋ง์ ์์ฑ๋ <span style="color:#3CB371">**api-root**</span>๋ ํ์ฌ router์ ๋ฑ๋ก๋ ๋ฆฌ์์ค์ ๋ํ ๋ชฉ๋ก์ ๋ณผ ์ ์๋ค.

<img src="/assets/img/django/router2.png">

---

<br>

### ๐ก ***ViewSet์ ์๋ก์ด EndPoint ์ถ๊ฐํ๊ธฐ***

#### @action

ViewSet์ <span style="color:#BA55D3">**@action**</span>์ ํตํด ๋ฉ์๋๋ฅผ ๋ฐ์ฝ๋ ์ด์ ํ์ฌ

์๋ก์ด EndPoint๋ฅผ ํ์ํ  ์ ์๋ค. 

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

get_object(), get_serializer(), get_queryset() ์ด ์ธ ํจ์๋ 

์๋ ๋งํฌ์์ ์์ค ์ฝ๋๋ฅผ ํตํด ์ดํดํ๊ธฐ.

๐ [GenericAPIView ๊นํ๋ธ ์์ค์ฝ๋](https://github.com/Gilbert9172/django-rest-framework/blob/00cd4ef864a8bf6d6c90819a983017070f9f08a5/rest_framework/generics.py)

<br>

์ด๋ฌํ ์ถ๊ฐ ์์์ ํตํด ์์ฑ๋ URL์ ์๋์ ๊ฐ์ด ๊ธฐ์กด URLPattern์ ์ถ๊ฐ๋๋ค.

(๋ฐ์ 4์ค์ด ์๋ก ์ถ๊ฐ๋ URLPattern์ด๋ค.)

```txt
[
    #====================================== ๊ธฐ์กด URLPattern ======================================#
    <URLPattern '^post/$' [name='post-list']>, 
    <URLPattern '^post\.(?P<format>[a-z0-9]+)/?$' [name='post-list']>,

    <URLPattern '^post/(?P<pk>[^/.]+)/$' [name='post-detail']>, 
    <URLPattern '^post/(?P<pk>[^/.]+)\.(?P<format>[a-z0-9]+)/?$' [name='post-detail']>, 

    <URLPattern '^$' [name='api-root']>, 
    <URLPattern '^\.(?P<format>[a-z0-9]+)/?$' [name='api-root']>]

    #===================================== ์ถ๊ฐ ๋ URLPattern =====================================#
    <URLPattern '^post/(?P<pk>[^/.]+)/set_public/$' [name='post-set-public']>, 
    <URLPattern '^post/(?P<pk>[^/.]+)/set_public\.(?P<format>[a-z0-9]+)/?$' [name='post-set-public']>, 

    <URLPattern '^post/public/$' [name='post-public']>, 
    <URLPattern '^post/public\.(?P<format>[a-z0-9]+)/?$' [name='post-public']>,
]
```