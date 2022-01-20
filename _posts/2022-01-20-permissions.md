---
layout : post
title : Permissions
categories : django
tags : drf
--- 


### 🔎  ***object level permissions***

"객체 수준의 허가(권한)" 는 DRF의 generic view가 **`get_object()`** 메소드를 호출할 때 실행된다. 

"view 수준의 허가(권한)" 과 마찬가지로 해당 객체에 대한 작업을 진행할 수 없을 경우에는

exceptions.PermissionDenied 예외가 발생한다.

만일 내가 작성하는 view에서 "객체 수준의 권한"을 강화하고 싶거나, genric view에서 

**`get_object`** 를 재정의하고 싶다면, 꼭 **`.check_object_permissions(request, obj)`** 메소드를 

꼭 작성해줘야 한다. 

```python
# views.py
def get_object(self,pk):
    post = get_object_or_404(self.queryset, pk=pk)
    self.check_object_permissions(self.request, post) 
    return post
```

<br>

### 🔎 ***permissions 커스텀하기***

rest_framework/permissions.py 로 가보면 다음과 같이 정의되어 있다.

```python
class BasePermission(metaclass=BasePermissionMetaclass):
    """
    A base class from which all permission classes should inherit.
    """

    def has_permission(self, request, view):
        """
        Return `True` if permission is granted, `False` otherwise.
        """
        return True

    def has_object_permission(self, request, view, obj):
        """
        Return `True` if permission is granted, `False` otherwise.
        """
        return True
```

**`has_permission`** 메소드의 경우에는 모든 HTTP 요청에 사용가능하다 

> POST, GET, PUT, DELETE

반면에 **`has_object_permissions`** 메소드의 경우에는 **`get_object`** 메소드로 부터 

호출이 되기 때문에, GET, PUT, DELETE 에만 사용할 수 있다.

```python
from rest_framework.permissions import BasePermission

class CustomObjectPermission(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
```

---

