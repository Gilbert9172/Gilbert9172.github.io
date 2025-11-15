---
layout : post
title : Getter & Setter
categories : lang
tags : java
---

### 🔎 ***Getter와 Setter 메소드***

> Setter

일반적으로 객체지향 프로그래밍에서 객체의 필드를 객체 외부에서 직접적으로

접근하는 것을 막는다. 그 이유는 외부에서 마음대로 바꿀경우 <span style="color:#CD5C5C">**객체의 무결정성**</span>이

깨질수 있기 때문이다. 이러한 문제점을 막기 위해서 객체지향 프로그래밍에서는 

필드는 공개하지 않고 메소드를 공개함으로써 필드를 바꾸는 방법을 선호한다.

그 이유는 메소드는 매개값을 검증해서 유효한 값만 객체의 필드로 저장할 수 있기

때문이다. 이러한 역할을 하는 메소드가 **`Setter`** 메소드이다.

```java
void setProduct (int num) {
    if (num < 0) {
        this.num = 0;
        return num;
    } else {
        this.num = num;
        return num;
    }
}
```
---

<br>

> Getter 

외부로 부터 객체의 데이터를 읽을 때 사용하는 메소드이다.

필드값을 그냥 사용하면 부적절한 경우가 발생하 수 있다.

예를 들면 원화로 되어있는 데이터를 달러로 가져오고 싶을 경우.

```java
void getMoney (double money) {
    double money = money % 1200;
    return money;
}
```

📌 클래스를 선언할 때 가능하다면 필드를 private로 선언해서, 

외부로부터 보호하고, 필드에 대한 Getter와 Setter 메소드를 

작성해서 필드의 값을 안전하게 변겅/사용하는 것이 좋다. 📌

<img src="/assets/img/java/getter_setter.png">

<br>

필드 타입이 boolean인 경우는 아래와 같이 선언해준다.

<img src="/assets/img/java/boolean_getter.png">

<br>

만약 읽기 전용으로만 개발을 할 경우 Getter만 선언해주거나, 

Setter의 접근 권한자는 private로 설정해준다.

그리고 eclipse에서 [Source]-[Generate Getters and Setters]를 클릭해주면

알아서 생성해준다.

---