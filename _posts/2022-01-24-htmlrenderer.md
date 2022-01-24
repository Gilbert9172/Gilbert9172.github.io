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
        return Response(context,template_name = 'posts/post_list.html'
)
```

---

<br>

> html
```html
{% load static %}

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Posting List</title> 
    <link rel="stylesheet" type="text/css" href="{% static 'css/posts.css' %}"
</head>
<body>
    <section>
        {% if post %}
        {% for i in post %}
            <div class=“container”>
                제목: {{i.title}}<br>
                작성자: {{i.user}}<br>
                이미지: {{i.image}}<br>
                설명: {{i.description}}
            </div>
            {% endfor %}
        {% endif %}
    </section>  
</body>
</html>
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

> html

여기서 신기했던 부분은 serializer를 **`render_form`** 템플릿 태그를 사용하여, 

form으로 렌더링한 점이다. 

```html
{% load static %}
{% load rest_framework %}

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title> 
    <link rel="stylesheet" type="text/css" href="{% static 'css/posts.css' %}"
</head>
<body>
    <form action="{% url 'posting' pk=post.pk %}" method="post" enctype="multipart/form-data">
        {% csrf_token %}
        {% render_form serializer %}
    <input type="submit" value="수정완료">
</body>
</html>
```