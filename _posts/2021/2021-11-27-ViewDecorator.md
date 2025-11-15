---
layout: post
title: View Decorator
categories: django
tags: django
---

### 💡 ***View Decorator***

Decorator란 어떤 함수를 감싸는(Wrapping)하는 함수이다. 

function과 class에만 적용이 가능하다. 다음과 같이 사용할 수 있다.

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

### 💡 ***django 기본 decorator***

<br>

#### django.views.decorator.http

‣ 📝 [소스 코드](https://github.com/Gilbert9172/django/blob/main/django/views/decorators/http.py)

뷰가 특정 요청 메서드만 허용하도록 하는 데코레이터다. 

사용법은 다음과 같다. 

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

지정 method가 아닐 경우, HttpResponseNotAllowed 응답 (상태코드 405) 반환한다.

---

<br>

#### django.contrib.auth.decorators

‣ 📝 [소스 코드](https://github.com/Gilbert9172/django/blob/main/django/contrib/auth/decorators.py)

⒈ user_passes_test 

사용자가 주어진 테스트를 통과했는지 확인하는 뷰용 데코레이터, 

필요한 경우 로그인 페이지로 리디렉션합니다. 

테스트는 호출 가능해야 하며 사용자 개체를 가져오고 사용자가 통과하면 True를 반환합니다.

<br>

⒉ login_requires

사용자가 로그인했는지 확인하는 뷰용 데코레이터, 리디렉션 필요한 경우 로그인 페이지로 이동합니다

<br>

⒊ permission_required

사용자에게 특정 권한이 있는지 확인하는 보기용 데코레이터 필요한 경우 로그인 페이지로 리디렉션합니다. 

raise_exception 매개변수에 PermissionDenied 예외가 발생한 경우 제기된다.

---

<br>

### 💡 ***CBV에 decorator 사용하기***

```python
#-- Case1 : 요청을 처리하는 함수를 wrapping하기 → 가독성 Bad
from django.contrib.auth.decorators import login_required 
from django.views.generic import TempalteView

class SecretView(TemplateView): 
    template_name = 'myapp/secret.html'
    view_fn = SecretView.as_view()

secret_view = login_required(view_fn)



#-- Case2 : 클래스 멤버함수에 method_decorator를 활용
from django.contrib.auth.decorators import login_required 
from django.utils.decorators import method_decorator 
from django.views.generic import TempalteView

class SecretView(TemplateView): 
    template_name = 'myapp/secret.html'

    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
    return super().dispatch(*args, **kwargs)

secret_view = SecretView.as_view()



#-- Case3 : 클래스에 직접 적용
from django.contrib.auth.decorators import login_required 
from django.utils.decorators import method_decorator 
from django.views.generic import TempalteView

@method_decorator(login_required, name='dispatch') 
class SecretView(TemplateView):
    emplate_name = 'myapp/secret.html'

secret_view = SecretView.as_view()
```

CBV를 사용할 때 LoginRequiredMixin을 사용하여 login_required와 동일한 동작을 얻을 수 있습니다. 

해당 믹스인은 상속 목록에서 가장 왼쪽에 있어야 합니다.

‣ 📝 [관련 docs](https://docs.djangoproject.com/en/3.2/topics/auth/default/)

```python
#-- LoginRequiredMixin 적용
from djangno.contib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView

class TestListView(LoginRequiredMixin,ListView):
    model = Post
    template_name = 'instagram/post_list.html'
    pagenate_by = 10
```
---