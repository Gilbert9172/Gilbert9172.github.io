---
layout: post
title: 기능개발
categories: algorithm
---

## <span style="color:gray">문제 파악</span>

---

#### ***문제***

***🔖 [프로그래머스 - 기능개발](https://school.programmers.co.kr/learn/courses/30/lessons/42586)***

<br>

#### ***주요 조건***

• 뒤에 있는 기능이 먼저 개발되더라도 앞에 있는 기능이 개발중이라면 배포되지 않는다.

• 앞에 있는 기능이 배포가 되면 같이 그때 같이 배포된다.

<br>

#### ***입출력 예시***

|progresses|speeds|return|
|----------|------|------|
|[93, 30, 55]|[1,30,5]|[2,1]|
|[95, 90, 99, 99, 80, 99]|[1, 1, 1, 1, 1, 1]|[1, 3, 2]|


<br>

## <span style="color:gray">문제 해결 과정</span>

---

#### ***핵심 로직***

***<span style="background-color:yellow">두 개의 큐의 첫번째 요소 값을 비교하기!!!</span>***

<br>

#### ***해결 순서***

⒈ 각 작업이 완료(100)될 때 까지 걸리는 기간(Day) 구하기.

⒉ 핵심 로직에 따라 결과 도출하기.

<br>

#### ***주요 함수***

|함수|사용 목적|
|----|----|
|`stream().mapToInt(i -> i).toArray();`|ArrayList 타입을 primitive int 배열로 변환|
|`queue.element();`| 큐의 가장 첫번쨰 요소 반환(제거하지는 않음)|

<br>

## <span style="color:gray">소스 코드</span>

---

***🔖 [소스 코드](https://github.com/Gilbert9172/coding-test/blob/main/programmers/levelTwo/quiz42586.java)***

```java
import java.util.*;

/**
 * 기능개발
 */
public class quiz42586 {

    static int complete = 100;
    static List<Integer> temp = new ArrayList<>();

    public static void main(String[] args) {

        // TEST_CASE
        int[] progresses = {93, 30, 55};
        int[] speeds = {1, 30, 5};

        //1. 각 작업이 완료(100)될 때 까지 걸리는 시간 구하기.
        Queue<Integer> q1 = processCompleteTimeTakenQueue(progresses, speeds);

        // 2. 핵심로직 : 두 개의 큐의 첫번째 요소 값을 비교후 결과 도출
        compareTwoQueue(q1);

        // 3. ArrayList → int[]
        int[] answer = arrayListToIntArray();

        // 4. 출력
        Arrays.stream(answer).forEach(System.out::println);
    }


    public static Queue<Integer> processCompleteTimeTakenQueue(int[] progresses, int[] speeds) {

        Queue<Integer> q1 = new LinkedList<>();

        for (int i = 0; i < progresses.length; i++) {
            int datesRequiredToComplete = (complete - progresses[i]) / speeds[i];

            if ((complete - progresses[i]) % speeds[i] > 0) {
                datesRequiredToComplete += 1;
            }
            q1.offer(datesRequiredToComplete);
        }
        return q1;
    }


    public static void compareTwoQueue(Queue<Integer> q1) {
        Integer firstVal = q1.poll();
        Queue<Integer> q2 = new LinkedList<>();
        q2.offer(firstVal);

        while (!q1.isEmpty()) {

            Integer firstValOfQ1 = q1.element();
            Integer firstValOfQ2 = q2.element();

            if (firstValOfQ2 >= firstValOfQ1) {
                q2.offer(q1.poll());
            } else if (firstValOfQ2 < firstValOfQ1) {
                temp.add(q2.size());
                q2.clear();
                q2.offer(q1.poll());
            }
        }
        temp.add(q2.size());
    }

    public static int[] arrayListToIntArray() {
        return temp.stream().mapToInt(Integer::intValue).toArray();
    }
}
```