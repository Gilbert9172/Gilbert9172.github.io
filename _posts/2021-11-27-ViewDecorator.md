---
layout: post
title: View Decorator
categories: django
tags: django
---

### ๐ก ***View Decorator***

Decorator๋ ์ด๋ค ํจ์๋ฅผ ๊ฐ์ธ๋(Wrapping)ํ๋ ํจ์์ด๋ค. 

function๊ณผ class์๋ง ์ ์ฉ์ด ๊ฐ๋ฅํ๋ค. ๋ค์๊ณผ ๊ฐ์ด ์ฌ์ฉํ  ์ ์๋ค.

```python
#-- case1
@login_required
def test_view1(request):
    return render(request, 'instagram/test.html')

#-- case2
def test_view2(request):
    return render(request, 'instagram/test.html')

test_view = login_required(test_view2)
```

---

<br>

### ๐ก ***django ๊ธฐ๋ณธ decorator***

<br>

#### django.views.decorator.http

โฃ ๐ [์์ค ์ฝ๋](https://github.com/Gilbert9172/django/blob/main/django/views/decorators/http.py)

๋ทฐ๊ฐ ํน์  ์์ฒญ ๋ฉ์๋๋ง ํ์ฉํ๋๋ก ํ๋ ๋ฐ์ฝ๋ ์ดํฐ๋ค. 

์ฌ์ฉ๋ฒ์ ๋ค์๊ณผ ๊ฐ๋ค. 

```python
@require_http_method(["GET", "POST"])
def test_view(request):
    pass

# Decorator to require that a view only accepts the GET method.
require_GET = require_http_methods(["GET"])

# Decorator to require that a view only accepts the POST method.
require_POST = require_http_methods(["POST"])

# Decorator to require that a view only accepts safe methods: GET and HEAD.
require_safe = require_http_methods(["GET", "HEAD"])
```

์ง์  method๊ฐ ์๋ ๊ฒฝ์ฐ, HttpResponseNotAllowed ์๋ต (์ํ์ฝ๋ 405) ๋ฐํํ๋ค.

---

<br>

#### django.contrib.auth.decorators

โฃ ๐ [์์ค ์ฝ๋](https://github.com/Gilbert9172/django/blob/main/django/contrib/auth/decorators.py)

โ user_passes_test 

์ฌ์ฉ์๊ฐ ์ฃผ์ด์ง ํ์คํธ๋ฅผ ํต๊ณผํ๋์ง ํ์ธํ๋ ๋ทฐ์ฉ ๋ฐ์ฝ๋ ์ดํฐ, 

ํ์ํ ๊ฒฝ์ฐ ๋ก๊ทธ์ธ ํ์ด์ง๋ก ๋ฆฌ๋๋ ์ํฉ๋๋ค. 

ํ์คํธ๋ ํธ์ถ ๊ฐ๋ฅํด์ผ ํ๋ฉฐ ์ฌ์ฉ์ ๊ฐ์ฒด๋ฅผ ๊ฐ์ ธ์ค๊ณ  ์ฌ์ฉ์๊ฐ ํต๊ณผํ๋ฉด True๋ฅผ ๋ฐํํฉ๋๋ค.

<br>

โ login_requires

์ฌ์ฉ์๊ฐ ๋ก๊ทธ์ธํ๋์ง ํ์ธํ๋ ๋ทฐ์ฉ ๋ฐ์ฝ๋ ์ดํฐ, ๋ฆฌ๋๋ ์ ํ์ํ ๊ฒฝ์ฐ ๋ก๊ทธ์ธ ํ์ด์ง๋ก ์ด๋ํฉ๋๋ค

<br>

โ permission_required

์ฌ์ฉ์์๊ฒ ํน์  ๊ถํ์ด ์๋์ง ํ์ธํ๋ ๋ณด๊ธฐ์ฉ ๋ฐ์ฝ๋ ์ดํฐ ํ์ํ ๊ฒฝ์ฐ ๋ก๊ทธ์ธ ํ์ด์ง๋ก ๋ฆฌ๋๋ ์ํฉ๋๋ค. 

raise_exception ๋งค๊ฐ๋ณ์์ PermissionDenied ์์ธ๊ฐ ๋ฐ์ํ ๊ฒฝ์ฐ ์ ๊ธฐ๋๋ค.

---

<br>

### ๐ก ***CBV์ decorator ์ฌ์ฉํ๊ธฐ***

```python
#-- Case1 : ์์ฒญ์ ์ฒ๋ฆฌํ๋ ํจ์๋ฅผ wrappingํ๊ธฐ โ ๊ฐ๋์ฑ Bad
from django.contrib.auth.decorators import login_required 
from django.views.generic import TempalteView

class SecretView(TemplateView): 
    template_name = 'myapp/secret.html'
    view_fn = SecretView.as_view()

secret_view = login_required(view_fn)



#-- Case2 : ํด๋์ค ๋ฉค๋ฒํจ์์ method_decorator๋ฅผ ํ์ฉ
from django.contrib.auth.decorators import login_required 
from django.utils.decorators import method_decorator 
from django.views.generic import TempalteView

class SecretView(TemplateView): 
    template_name = 'myapp/secret.html'

    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
    return super().dispatch(*args, **kwargs)

secret_view = SecretView.as_view()



#-- Case3 : ํด๋์ค์ ์ง์  ์ ์ฉ
from django.contrib.auth.decorators import login_required 
from django.utils.decorators import method_decorator 
from django.views.generic import TempalteView

@method_decorator(login_required, name='dispatch') 
class SecretView(TemplateView):
    emplate_name = 'myapp/secret.html'

secret_view = SecretView.as_view()
```

CBV๋ฅผ ์ฌ์ฉํ  ๋ LoginRequiredMixin์ ์ฌ์ฉํ์ฌ login_required์ ๋์ผํ ๋์์ ์ป์ ์ ์์ต๋๋ค. 

ํด๋น ๋ฏน์ค์ธ์ ์์ ๋ชฉ๋ก์์ ๊ฐ์ฅ ์ผ์ชฝ์ ์์ด์ผ ํฉ๋๋ค.

โฃ ๐ [๊ด๋ จ docs](https://docs.djangoproject.com/en/3.2/topics/auth/default/)

```python
#-- LoginRequiredMixin ์ ์ฉ
from djangno.contib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView

class TestListView(LoginRequiredMixin,ListView):
    model = Post
    template_name = 'instagram/post_list.html'
    pagenate_by = 10
```
---