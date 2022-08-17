---
layout: post
title: 타겟 넘버
categories: algorithm
---

## <span style="color:gray">문제 풀이</span>

---

***🔖 [문제](https://school.programmers.co.kr/learn/courses/30/lessons/43165)***

```java
public class quiz43165 {

    static int[] numbers = {4, 1, 2, 1};
    static int target = 4;
    static int answer = 0;

    public static void main(String[] args) {
        dfs(0, 0);
        System.out.println(answer);
    }

    public static void dfs(int index, int sum) {
        //1. 탈출 조건
        if (index == numbers.length) {
            if (sum == target) answer++;
            return;
        }

        //2. 수행 동작
        dfs(index + 1, sum + numbers[index]);
        dfs(index + 1, sum - numbers[index]);
    }
}
```

이번 문제는 DFS 알고리즘을 사용해서 해결하는 문제였다. 

어떤 알고리즘을 사용해야 하는지 까지는 금방 찾았는데 역시나 구현에서 막혔다.

[유튜브 강의](https://www.youtube.com/watch?v=S2JDw9oNNDk)를 보고 나서야 이해가 됐다.


<br>

## <span style="color:gray">재귀함수</span>

---

#### ***재귀함수 공부 포인트***

재귀함수를 구현할 때는 아래 두 가지가 핵심포인트다.

✔︎ 수행동작을 먼저 구현한다.

✔︎ 탈출 조건을 구현한다. 

그리고 재귀함수를 제대로 이해하기 위해서는 코드를 뚫어져라 보기 보단, 

직접 그림을 그려가면서 재귀함수의 플로우를 익혀야 한다고 한다.

<br>

#### ***재귀함수란?***

연습하려고 매우 간단한 재귀함수를 만들어 봤다.

```java
public class E01 {

    static int count = 0;

    public static void main(String[] args) {
        recursive(count);
    }

    public static void recursive(int count) {
        if (count == 5) return;         // 탈출조건
        recursive(count + 1);           // 수행동작
        System.out.println(count + "번째");
    }
}
```

위 코드를 디버깅 돌려보면 아래와 같이 확인할 수 있다.

<img src="/assets/img/codingTest/recursiveEx.png">

> 출력 결과 : 4번째 → 3번째 → 2번째 → 1번째 → 0번째

탈출 조건을 타지 않은 재귀로직들은 일단 `대기 상태`이다. 

그리고 탈출 조건을 만나면 마지막에 호출된 재귀함수 부터 차례로 값을 반환해준다.

<br>

이것을 그림으로 나타내면 아래와 같다고 생각된다.

<img src="/assets/img/codingTest/recursiveMap.jpg">