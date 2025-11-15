---
layout: post
title: 조합
categories: algorithm
---

## <span style="color:gray">조합</span>

---

#### 들어가기 앞서...

앞선 문제에서 `순열`을 사용한 문제를 풀어보았다. 

순열이란 서로 다른 n개의 값 중에서 r개의 숫자를 순서를 부여해 뽑는 경우를 말한다. 

순서를 고려하기 때문에 `1,2,3`,  `1,3,2`를 다른 것으로 취급한다는 이야기이다.

순열이 나오면 항상 따라다니는 녀석이 있다. 그 녀석은 바로 `조합`!!!

오늘은 조합이 뭔지, 그리고 어떻게 코드로 구현하는지 한 번 알아봤다.

<br>

#### 조합이란?

조합이란, 임의의 집합을 순서가 없이 선택하는 것을 말한다.

예를 들면 `1,2`,  `2,1`을 같은 것으로 취급한다.

<br>

## <span style="color:gray">Java 구현</span>

---

#### 1. 중복을 허용하지 않는 조합

|파라미터|설명|
|--------|----|
|count|선택횟수|
|idx  |현재 넣어야할 인텍스 순서|
|n    |nCr의 n|
|r    |nCr의 r|
      
```java
public class NormalCombination {

    static int[] target = {1,2,3};
    static int[] result = new int[target.length];

    public static void main(String[] args) {
        combination(0, 0, target.length, 2)
    }

    public static void combination(count, idx, int n, int r) {
        // 탈출 조건
        if (count == r) {
            System.out.println(Arrays.toString(result));
            return;
        }

        // 수행동작
        for (int i = idx; i < n; i++) {
            result[count] = target[i];
            combination(count + 1, idx + 1, n, r);
        }
    }
}
```

<br>

위 코드의 동작방식은 아래와 같다.

• result에 target의 0번 째 요소에 값을 넣어준다.

• count + 1, idx + 1 을 해준다.

• count가 r(뽑으려는 숫자의 갯수)과 같다면 탈출 조건을 탄다.

• 위 방법을 반복한다.


<br>

#### 2.중복을 허용하는 조합.

중복을 허용하는 경우는 `1,1`과 같은식의 결과도 인정하는 것이다.

|파라미터|설명|
|--------|----|
|count|선택횟수|
|idx  |현재 넣어야할 인텍스 순서|
|n    |nCr의 n|
|r    |nCr의 r|

```java
public class DuplicatedCombination {

    public static void main(String[] args) {

    }

    public static void combination(int count, int idx, int n, int r) {
        // 탈출 조건
        if (count == r) {
            System.out.println(Arrays.toString(result));
            return;
        }

        // 수행동작
        for (int i = idx; i < n; i ++) {
            result[count] = target[i];
            combination(count + 1, i, n, r);
        }
    }
}
```

<br>

위 코드의 동작방식은 아래와 같다.

• resul에 target의 0번 째 요소에 값을 넣어준다.

• 자신을 재귀 호출한다. 이때 `count + 1`을 해준다.

```txt
왜 count에만 1을 더해줄까?

중복이 가능한 조합의 경우에는 같은 수를 반복적으로 선택이 가능하다.

따라서 현재의 인덱스 값을 그대로 넘겨주어야 한다.
```

• count가 r(뽑으려는 숫자의 갯수)과 같다면 탈출 조건을 탄다.

• 위 방법을 반복한다.