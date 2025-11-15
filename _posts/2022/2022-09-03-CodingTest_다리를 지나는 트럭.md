---
layout: post
title: 다리를 지나는 트럭
categories: algorithm
---

## <span style="color:gray">문제 파악</span>

---

#### ***문제***

***🔖 [프로그래머스 -  다리를 지나는 트럭](https://school.programmers.co.kr/learn/courses/30/lessons/42583)***

<br>

#### ***주요 조건***

• 모든 트럭이 다리를 건너려면 최소 몇 초가 걸리는가?

• 다리에 완전히 오르지 않은 트럭의 무게는 무시한다.

<br>

#### ***입출력 예시***

|bridege_length|weight|truck_weights|return|
|--------------|------|-------------|------|
|2|10|[7,4,5,6]|8|
|100|100|[10]|101|
|100|100|[10,10,10,10,10,10,10,10,10,10]|110|

    * bridege_length : 다리에 올라갈 수 있는 트럭의 수
    * weight : 다리가 견딜 수 있는 무게
    * truck_weights :트럭 별 무게 
    * return : 모든 트럭이 다리를 건너는데 걸리는 시간(초)

<br>

## <span style="color:gray">문제 해결 과정</span>

---

#### ***핵심 로직***

***<span style="background-color:yellow">큐가 비어있는지, 꽉차있는지, 1개 이상의 요소가 있는지에 대한 조건을 잘 생각해야 한다.</span>***

그리고 최대 무게를 초과할 경우에는 무게가 0인 가상의? 트럭객체를 큐에 삽입해줘야 한다.

> 이 부분을 생각하지 못 했다...😧😧😧

이 경우에는 for문을 종료하지 않아야 하며, 무게는 추가하지 않고 시간은 추가해줘야 한다.

<br>

#### ***해결 순서***

⒈ Queue 생성

⒉ 조건에 맞는 로직 처리

|조건|실행 로직|무게|시간|
|----|---------|----|----|
|큐가 비어있다면|큐에 트럭 추가|+|+|
|큐가 꽉 차 있다면|큐에서 맨 앞 트럭 제거|-|+|
|큐에 자리가 있고, 트럭을 추가할 수 있다면|큐에 트럭 추가|+|+|
|큐가 자리가 있지만, 무게 초과로 트럭을 추가할 수 없다면|0을 더한다.||

<br>

#### ***주요 함수***

|함수|사용 목적|비고|
|----|---------|----|
|for 문|하나의 트럭 단위로 로직이 실행되어야 함.|-|
|`remove`|큐의 첫 번째 요소를 제거 + 그 값을 반환|큐가 비어 있는 경우 null을 반환|
|`poll()`|큐의 첫 번째 요소를 제거 + 그 값을 반환|큐가 비어 있는 경우 NoSuchElementException 에러 발생|
|`peek()`|큐의 맨 앞에 있는 값 반환|비어있는 경우 null을 반환|
|`element()`|큐의 맨 앞에 있는 값 반환|큐가 비어 있는 경우 NoSuchElementException 에러 발생|

<br>

## <span style="color:gray">소스 코드</span>

---

***🔖 [소스 코드](https://github.com/Gilbert9172/coding-test/blob/main/programmers/levelTwo/quiz42583.java)***

```java
public class quiz42583 {

    public static void main(String[] args) {

        int bridge_length = 2;
        int weight = 10;
        int[] truck_weights = {7, 4, 5, 6};

        int answer = 0;
        Queue<Integer> q = new LinkedList<>();

        int max = 0;
        for (int truck_weight : truck_weights) {

            while (true) {

                // 1. 큐가 비어있을 경우
                if (q.isEmpty()) {
                    q.offer(truck_weight);
                    max += truck_weight;
                    answer++;
                    break;
                }

                // 2. 큐가 꽉 차있을 경우
                else if (q.size() == bridge_length) {
                    max -= q.poll();
                }

                // 3. 큐에 여유가 있을 경우
                else {
                    // 3-1. 다음 트럭이 들어오면 최대 무게를 초과하는 경우.
                    if (max + truck_weight > weight) {
                        q.offer(0);
                        answer++;
                    } 
                    // 3-2. 다음 트럭이 들어와도 최대 무게를 초과하지 않는 경우.
                    else { 
                        q.offer(truck_weight);
                        max += truck_weight;
                        answer++;
                        break;
                    }
                }
            }
        }
        System.out.println(answer + bridge_length);
    }
}
```

> 참고

마지막에 `bridge_length`를 결과에 더해줬다.

마지막 트럭이 다리에 올라가면 for문은 종료된다. 그런데 문제에서 원하는 결과는

모든 트럭이 다리를 지나는데 걸리는 시간(초)이다. 따라서 다리의 길이 만큼 더해주어야 한다.

뭔가 문제 설명이 부족한 느낌은 있었다. "트럭은 1초에 1만큼의 거리를 이동한다" 라는 조건이

더 있었다면 어떘을까? 라는 생각을 해본다.