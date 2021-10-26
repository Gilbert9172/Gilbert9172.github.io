---
layout: post
title: Decorator
categories: python
---

### 💡 ***Decorator***

Django로 사용 하다가 보면 로그인 구현에서 <span style="color:#8A2BE2">**@login_required**</span>와 같이

장식자를 사용하는 경우가 있었다. 

오늘은 Decorator(장식자)에 대해서 제대로 알아봐야겠다.

---

### 🔎 ***자세히 알아보기***

Decorator란 대상 함수를 Wrapping하고, Wrapping된 함수의 앞 뒤에 추가적으로

꾸며질 구문들을 정의해서 손쉽게 재사용 가능하게 해주는 것이다.

Decorator는 감싸고 있는 함수를 호출하기 전이나 후에 추가로 코드를 실행하는

기능을 갖췄다고 한다. 이 기능으로 입력 인수와 반환 값을 접근하거나 수정할 수 있다. 

<br>

Decorator는 메인 구문이 있고, 여기에 부가적인 구문을 추가하고 싶을 때,

그리고 부가적인 구문을 반복해서 사용하고싶은 경우가 있을 경우 사용한다.

이 때 부가적인 작업을 Decorator로 선언해서 자유롭게 사용이 가능하다는 것이다.

<br>

결국 view.py에서 다른 기능의 함수를 정의할 때 <span style="color:#8A2BE2">**@login_required**</span>를 쓰는 이유도

똑같은 반복을 줄여서 보다 깔끔한 코드를 쓰기 위함이였다고 생각된다.

```python
# 프로필 수정 logic

@login_required
def profile_edit(request):
    if request.method == "POST":    
        # 기존에 저장되어 있는 프로필 가져오기.
        form = ProfileForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request,"프로필을 수정했습니다.")
            return redirect("root")
    else:
        form = ProfileForm(instance=request.user)
    return render(request,'accounts/profile_edit_form.html',{'form':form})
```