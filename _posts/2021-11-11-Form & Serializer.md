---
layout: post
title: Form & Serializer
categories: django
tags: drf
---

### ๐ก ***Form & Serializer***

<br>

#### Serializer / ModelSerializer

โช ๋ฐ์ดํฐ ๋ณํ / ์ง๋ ฌํ ์ง์

โช Django์ Form/ModelForm๊ณผ ์ ์ฌ

Serializer๋ view ์๋ต์ ์์ฑํ๋ ๋ฐ์ ๋ฒ์ฉ์ ์ด๊ณ  ๊ฐ๋ ฅํ ๋ฐฉ๋ฒ์ ์ ๊ณตํด์ค๋ค.

ModelSerializer๋ Serializer ์์ฑ์ ์ํ Shortcut์ด๋ค.

---

<br> 

### ๐ก ***Feature ๋น๊ต*** 

<br> 

#### Form / ModelForm

html ์๋ ฅ form์ ํตํ ์๋ ฅ์ ๋ํ ์ ํจ์ฑ ๊ฒ์ฌ

์ฃผ๋ก Create/Update์ ๋ํ ์ฒ๋ฆฌ์์ ํ์ฉ โ ์ฅ๊ณ  admin์์ ํ์ฉ

CreateView/UpdateView CBV๋ฅผ ํตํ view์ฒ๋ฆฌ โ ๋จ์ผ view

<br> 

#### Serializer / ModelSerializer

๋ฐ์ดํฐ ๋ณํ ๋ฐ ์ง๋ ฌํ ์ง์ (JSON ํฌ๋งท)

์ฃผ๋ก JSON ํฌ๋งท ์๋ ฅ์ ๋ํ ์ ํจ์ฑ ๊ฒ์ฌ

List/Create ๋ฐ ํน์  ๋ฆฌ์์ค์ ๋ํ Retrieve/Edit/Delete ๋ฑ ์์ ํ์ฉ

APIView๋ฅผ ํตํ View ์ฒ๋ฆฌ โ ๋จ์ผ view โ 1๊ฐ์ URL ์ฒ๋ฆฌ

ViewSet์ ํตํ View ์ฒ๋ฆฌ โ 2๊ฐ view โ 2๊ฐ์ URL ์ฒ๋ฆฌ

---

<br> 

### ๐ก ***์ฃผ๋ ํธ์ถ ์ฃผ์ *** 

<br>

#### Form

์ผ๋ฐ์ ์ผ๋ก ์น ๋ธ๋ผ์ฐ์  ์์์ <span style="color:#B8860B">**HTML Form Submit**</span>์ ํตํด์ POST ์์ฒญ์ ๋ฐ๊ฒ ๋๋ค.

ํน์ <span style="color:#B8860B">**JavaScript์ ์ํ ๋น๋๊ธฐ ํธ์ถ**</span>๋ ๊ฐ๋ฅํ๋ค. 

๋ฌผ๋ก  https ํ๋กํ ์ฝ ์์ฒญ/์๋ต์ด๊ธฐ์ Android/ios ์ฑ์ ์ํ ์์ฒญ/์๋ต๋ ๊ฐ๋ฅํ๋ค.

<br>

#### Serializer

๋ค์ํ Client(์น)์ ๋ํ Data ์์ฃผ์ http(s) ์์ฒญ

---

<br>

### ๐ก ***Class ์ ์***

<br>

#### Form/ModelForm

```python
# form
from django import forms

class PostForm(forms.Form):
    email = forms.EmailField()
    content = forms.CharField(widget=forms.Textarea)
    created_at = forms.DateField()

# ModelForm
class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = '__all__'
```

<br>

#### Serializer/ModelSerializer

Form ์ชฝ์ HTML Form์ ์ข ๋ ํจ์จ์ ์ผ๋ก ์ฒ๋ฆฌํ๊ธฐ ์ํจ์ด๋ค. 

๋ฐ๋ฉด์ Serializer์ ๊ฒฝ์ฐ์๋ api ์์ฒญ์ ์ฒ๋ฆฌํ๋ ๊ฒ์ ๋ง์ถฐ์ ธ์๊ธฐ ๋๋ฌธ์

Form์์ ์ฌ์ฉํ widget์ Serializer์ ์๋ค.

```python
from rest_framework import serializers

# Serializer
class PostSerializer(serializers.Serializer):
    email = forms.EmailField()
    content = forms.CharField(max_length=200)
    created_at = forms.DateField()

# ModelSerializer
class PostModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
```
---

<br>

### ๐ก ***์ ํจ์ฑ ๊ฒ์ฌ ์ํ ์์ ***

<br>

#### Form
```python

```

<br>

#### Serializer
```python
```
---

<br>

### ๐ก ***clean VS validate***

์๋์ ๋ ์ฝ๋์์ <span style="color:#B8860B">**ValidationError**</span>๋ ์ด๋ฆ์ ๊ฐ์ง๋ง, ๋ค๋ฅธ ๋ก์ง์ ํ๋ค.

<br>

#### Form
```python
from django import forms

class PostForm(forms.Form):
    title = forms.CharField()

    def clean_title(self):
        value = self.cleaned_data.get('title','')
        if 'django' not in value:
            raise forms.ValidationError('์คํจ')
        return value
```

<br>

#### Serializer
```python
from rest_framework import ValidationError

class PostSerializer(serializers.Serializer):
    title = serializer.CharField(max_length=100)

    def validate_title(self,value):
        if 'django' not in value:
            raise ValidationError('์คํจ')
        return value
```
---
