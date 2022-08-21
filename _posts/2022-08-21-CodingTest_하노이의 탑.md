---
layout: post
title: 하노이 탑 이동 순서
categories: algorithm
---

## <span style="color:gray">문제 풀이</span>

---

***🔖 [문제](https://www.acmicpc.net/problem/11729)***

<br>

## <span style="color:gray">하노이 탑 이해하기</span>

---

***📚 [공식 설명 블로그](https://skmagic.tistory.com/257)***

하노이 탑 알고리즘은 기둥1에 있는 N개의 원반을 기둥2를 이용해서 기둥3으로 옮기는 알고리즘이다.

이 알고리즘의 메너니즘은 아래와 같이 동작한다.

<img src="/assets/img/codingTest/hanoi1.png">

<br>

#### ***Step 1***

기둥1에서 `N-1`개의 원반을 기둥3을 이용하여 기둥2로 옮긴다.

<img src="/assets/img/codingTest/hanoi2.png">

<br>

#### ***Step 2***

기둥1에서 1개의 원반을 기둥3으로 옮긴다.

<img src="/assets/img/codingTest/hanoi3.png">

<br>

#### ***Step 3***

기둥2에서 `N-1`개의 원반을 기둥1을 이용하여 기둥3으로 옮긴다.

<img src="/assets/img/codingTest/hanoi4.png">

<br>

## <span style="color:gray">하노이 탑 구현하기</span>

---

구현은 위 Step을 하나하나 작성하면 된다.


```java
public static void hanoi(int n, int from, int by, int to) {

    if (n == 1) {
        move(from, to);
        return;
    }

    hanoi(n - 1, from, to, by);
    move(from, to);
    hanoi(n - 1, by, from, to);
}
```