---
layout: post
title: DRF에서 ModelSerializer란?
categories: django
tags : drf  
---

[DRF ModelSerializer documentation 정리](https://www.django-rest-framework.org/api-guide/serializers/#modelserializer) 

<br>

### 💡 ***ModelSerializer***

종종 Django 모델 정의에 밀접하게 매핑되는 serializer 클래스가 필요하다. 

ModelSerializer 클래스는 모델 필드에 해당하는 필드가 있는 Serializer 클래스를 

자동으로 만들 수 있는 shortcut을 제공한다.

ModelSerializer 클래스는 일반 Serializer와 같지만 몇 가지 차이점이 있다.

<br>

- 모델을 기반으로 필드를 자동적으로 정의한다.  

- unique_together validator와 같은 serializer를 자동을 생성한다.

- 여기에는 .create() 및 .update()의 간단한 기본 구현이 포함된다.

<br>

```python
class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account


        #-- 필드 설정 관련 --#
        # 1. 특정 필드 설정
        fields = ['id', 'account_name', 'users', 'created']

        # 2. 모든 필드 설정
        fields = '__all__'

        # 3. 특정 필드 제외
        exclude = ['users']

        #-- read only 설정 --#
        read_only_fields = ['account_name']
```
---