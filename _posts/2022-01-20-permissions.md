---
layout : post
title : Permissions
categories : django
tags : drf
--- 


### π  ***object level permissions***

"κ°μ²΄ μμ€μ νκ°(κΆν)" λ DRFμ generic viewκ° **`get_object()`** λ©μλλ₯Ό νΈμΆν  λ μ€νλλ€. 

"view μμ€μ νκ°(κΆν)" κ³Ό λ§μ°¬κ°μ§λ‘ ν΄λΉ κ°μ²΄μ λν μμμ μ§νν  μ μμ κ²½μ°μλ

exceptions.PermissionDenied μμΈκ° λ°μνλ€.

λ§μΌ λ΄κ° μμ±νλ viewμμ "κ°μ²΄ μμ€μ κΆν"μ κ°ννκ³  μΆκ±°λ, genric viewμμ 

**`get_object`** λ₯Ό μ¬μ μνκ³  μΆλ€λ©΄, κΌ­ **`.check_object_permissions(request, obj)`** λ©μλλ₯Ό 

κΌ­ μμ±ν΄μ€μΌ νλ€. 

```python
# views.py
def get_object(self,pk):
    post = get_object_or_404(self.queryset, pk=pk)
    self.check_object_permissions(self.request, post) 
    return post
```

<br>

### π ***permissions μ»€μ€ννκΈ°***

rest_framework/permissions.py λ‘ κ°λ³΄λ©΄ λ€μκ³Ό κ°μ΄ μ μλμ΄ μλ€.

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

**`has_permission`** λ©μλμ κ²½μ°μλ λͺ¨λ  HTTP μμ²­μ μ¬μ©κ°λ₯νλ€ 

> POST, GET, PUT, DELETE

λ°λ©΄μ **`has_object_permissions`** λ©μλμ κ²½μ°μλ **`get_object`** λ©μλλ‘ λΆν° 

νΈμΆμ΄ λκΈ° λλ¬Έμ, GET, PUT, DELETE μλ§ μ¬μ©ν  μ μλ€.

```python
from rest_framework.permissions import BasePermission

class CustomObjectPermission(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
```

---

