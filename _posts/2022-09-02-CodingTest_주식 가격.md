---
layout: post
title: 기능개발
categories: algorithm
---

## <span style="color:gray">문제 파악</span>

---

#### ***문제***

***🔖 [프로그래머스 -  주식가격](https://school.programmers.co.kr/learn/courses/30/lessons/42584)***

<br>

#### ***주요 조건***

• 가격이 떨어지지 않은 기간이 몇 초인지 반환.

• **<span style="color:red">(주의)</span>** 1초뒤에 가격이 떨어진다 == 1초간 가격이 떨어지지 않았다. 

<br>

#### ***입출력 예시***

|prices|return|
|------|------|
|1, 2, 3, 2, 3|4, 3, 1, 1, 0|

    * prices : 초 단위로 기록된 주시가격이 담긴 배열.
    * return : 가격이 떨어지지 않은 기간(초).

<br>

## <span style="color:gray">문제 해결 과정</span>

---

#### ***핵심 로직***

***<span style="background-color:yellow">배열 순회시 선택된 요소보다 작은 값을 만나면 for문 종료</span>***

<br>

#### ***해결 순서***

⒈ Queue 생성

⒉ 선택된 요소보다 뒤에 있는 요소와 비교

⒊ 비교하는 요소가 값이 크거나 같은 경우는 +1

⒋ 작은 경우 for문 탈출

<br>

#### ***주요 함수***

|함수|사용 목적|
|----|----|
|`stream().boxed()`|int,lon,double 요소를 Integer, Long, Double 요소로 박싱해서 반환한다.|

<br>

## <span style="color:gray">소스 코드</span>

---

***🔖 [소스 코드](https://github.com/Gilbert9172/coding-test/blob/main/programmers/levelTwo/quiz42584.java)***

```java
public class quiz42584 {
    
    static Integer index = 0;

    public static void main(String[] args) {


        int[] prices = {1, 2, 3, 2, 3, 1};
        int[] answer = new int[prices.length];

        // int[] -> List<Integer> -> Queue<Integer>
        Queue<Integer> q = new LinkedList<>(Arrays.stream(prices).boxed().collect(Collectors.toList()));


        while (!q.isEmpty()) {

            Integer firstVal = q.poll();

            int count = 0;
            for (Integer nextVal : q) {
                if (nextVal >= firstVal){
                    count++;
                } else {
                    count ++;
                    break;
                }
            }
            answer[index] = count;
            index ++;
        }

        for (int i : answer) {
            System.out.println("i = " + i);
        }
    }
}
```
