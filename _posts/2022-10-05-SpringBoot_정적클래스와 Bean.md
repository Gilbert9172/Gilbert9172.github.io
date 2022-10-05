---
layout: post
title: 정적클래스와 Bean
categories: spring
tags: springBoot
---

## <span style="color:gray">Static(정적)</span>

---

#### <span style="background-color:black; color:white">Static에 대해서 알아보자</span>

**<u>언제 static을 붙일까?</u>**

클래스를 설계할 때, 멤버변수 중 모든 인스턴스에 공통적으로 사용해야하는 것에 

static을 붙인다. 인스턴스를 생성하면, 각 인스턴스들은 서로 독립적이기 때문에

서로 다른 값을 유지한다. 경우에 따라서는 각 인스턴스들이 공통적으로 같은 값을

가져야하는 경우가 있는데 이럴 때 static을 붙인다.

<br>

**<u>인스턴스 변수가 없어도 된다.</u>**

static이 붙은 정적필드와 정적 메소드는 클래스에 고정된 멤버이기 때문에, 클래스 로더가

바이트코드를 메모리 영역에 적재할 때, 클래스 별로 관리된다. 따라서 클래스의 로딩이 

끝나면 바로 사용할 수 있다.

<br>

**<u>static이 붙은 메서드(함수)에서는 인스턴스 변수를 사용할 수 없다.</u>**

> 오늘 이 부분에서 고민을 많이 하였다.

static 메서드는 인스턴스 생성 없이 호출가능한 반면, 인스턴스 변수는 인스턴스를 생성해야만

존재한다. **<span style="background-color:yellow">static이 붙은 메서드(클래스메서드)를 호출할 때 인스턴스가 생성되어 있을 수도,</span>**

**<span style="background-color:yellow">그렇지 않을 수도 있어서 static이 붙은 메서드에서 인스턴스변수 사용을 허용하지 않는다.</span>**

반대로, 인스턴스변수나 인스턴스메서드에서는 static이 붙은 멤버들을 사용하는 것이 언제나

가능하다. 인스턴스변수가 존재한다는 것은 static이 붙은 변수가 이미 메모리에 존재한다는

것을 의미하기 때문이다.

일반적으로 인스턴스변수와 관련된 작업을 하는 메소드는 인스턴스메소드 (static X)이고,

static변수(클래스변수)와 관련된 작업을 하는 메소드는 클래스메소드 (static O)이다.

<br>

**<u>메서드 내에서 인스턴스 변수를 사용하지 않는다면, static을 붙이는 것을 고려한다.</u>**

메서드의 작업내용중에서 인스턴스 변수를 필요로 한다면, static을 붙일 수 없다. 

반대로 인스턴스변수를 필요로 하지 않는다면, 가능하면 static을 붙이는 것이 좋다. 

메서드 호출시간이 짧아지기 때문에 효율이 높아진다. static을 안붙인 메서드는 실행시 호출 되어야할

메서드를 찾는 과정이 추가적으로 필요하기 때문에 시간이 더 걸린다.

<br>

**<u>클래스 설계시 static의 사용지침</u>**

먼저 클래스의 멤버변수중 모든 인스턴스에 공통된 값을 유지해야하는 것이 있는지 살펴보고

있으면, static을 붙여준다. 작성한 메서드 중에서 인스턴스 변수를 사용하지 않는 메서드에 

대해서 static을 붙일 것을 고려한다.

<br>

**<u>정적 클래스는 상태를 가지지 않는다.</u>**

생성자나 필드를 통해 의존성을 주입할 수도 없다. 

<br>

📚 출저 : [Vaert Street:티스토리](https://vaert.tistory.com/101)

<br>

## <span style="color:gray">언제 static 함수 모음 Class를 만들어야 할까?</span>

---

만약 A라는 클래스가 외부 자원에 의존하며, 그 자원에 따라 결과가 달라지게 된다고 하자.

이럴 경우에는 클래스를 static으로 만들면 안되고 `POJO Bean`으로 만들어야 한다.

<br>

📚 출저 : [권남, 코드로 말하다.](http://kwon37xi.egloos.com/4844149)

<br>

## <span style="color:gray">그 외 참고 블로그들</span>

---

📚 [okky](https://okky.kr/articles/291799)
📚 [jaehoney:티스토리](https://jaehoney.tistory.com/153)
📚 [tecoble](https://tecoble.techcourse.co.kr/post/2020-07-16-static-method/)
📚 [kephilab:티스토리](https://kephilab.tistory.com/50)