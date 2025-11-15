---
layout : post
title : TemplateHTMLRenderer
categories : django
tags : drf
---

### 🔎 ***TemplateHTMLRenderer***

[DRF docs-topic](https://www.django-rest-framework.org/topics/html-and-forms/)

오늘은 여태까지 통상적으로 사용했던 JSONRednerer말고 HTMLRenderer를 사용해봤다.

TemplateHTMLRenderer 클래스는 딕셔너리 형태로 데이터를 넘겨줘야한다. 보통 context라는

변수를 통해 넘겨주는거 같다.

> ex. context = {"key":vlaue}

그리고 template_name을 지정해주는데, view 또는 리턴 값에서 지정해준다.

---

<br>

### 📝  ***전체 게시물 확인***

> views
```python
# CASE1. view에 template_name 지정.
class PostList(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'posts/post_list.html'

    def get(self, request):
        post = Post.objects.all()
        context = {
            "post" : post
        }
        return Response(context)

# CASE2. 리턴 값에 template_name 지정.
class PostList(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    
    def get(self, request):
        post = Post.objects.all()
        context = {
            "post" : post
        }
        return Response(context,template_name = 'posts/post_list.html')
```

---

<br>

### 📝 ***게시물 수정***

> view
```python
class PostEditView(GenericView):
    serializer_class = PostViewSerializer
    rendered_classes = [TemplateHTMLRenderer]

    def post(request,pk):
        post = get_object_or_404(Post, pk=pk)
        serializer = self.serializer_class(post, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return redirect('post-list')
```

<br>

### 📝 ***게시물 올리기***

> views 

django를 할 때도, post를 할 때 **`if request.method == 'post'`** 로 시작했었다.

여기서도 마찬자기로 빈 serializer 객체를 가져오고 거기에서 post를 했어야했다.

```python
class PostingPostView(GenericAPIView):
    renderer_classes = [TemplateHTMLRenderer]
    serializer_class = PostViewSerializer
    template_name = 'posts/posting.html'

    def get(self,request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid()
        return Response({"serializer":serializer})

    def post(self,request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid()
        serializer.save(user_id=ruquest.user)
        return redirect('post-list')
```
---

<br>


### 📝 ***게시물 삭제***

> views

```python
class PostDeleteView(GenericAPIView):
    renderer_classes = [TemplateHTMLRenderer]
    serializer_class = PostViewSerializer
    template_name = 'posts/post_delete.html'

    def get(self,request,pk):
        post = get_object_or_404(Post, pk=pk)
        return Response({"post":post})
    
    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        post.delete()
        return redirect('posts:post-list')
```
---