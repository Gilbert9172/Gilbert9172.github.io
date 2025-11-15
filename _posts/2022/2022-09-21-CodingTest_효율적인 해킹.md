---
layout: post
title: 효율적인 해킹
categories: algorithm
---

## <span style="color:gray">문제 파악</span>

---

#### ***문제***

***🔖 <a href="https://www.acmicpc.net/problem/1325" target="_blank">백준(실버1) - 효율적인 해킹</a>***

<br>

#### ***주요 조건***

• **<span style="color:#BC8F8F">A가 B를 신뢰하는 경우에는 B를 해킹하면, A도 해킹할 수 있다.</span>**

<br>

#### ***추가 학습***

이번 문제는 **<span style="color:red">시간초과</span>** 와 **<span style="color:red">메모리초과</span>** 를 모두 경험할 수 있었던 문제이다. 

우선 **<span style="color:red">메모리초과</span>** 가 났던 이유는 `인접행렬`을 사용했기 때문이다. 메모리 측면에서 보자면 인접행렬은

노드의 모든 관계를 저장하기 때문에 노드 개수가 많을수록 메모리가 불필요하게 낭비된다. 

<img src="/assets/img/codingTest/인접행렬.png"><br>

반면에 `인접리스트`의 경우에는 인접한 노드의 정보만 저장하기 때문에 메모리를 효율적으로 사용한다.

<img src="/assets/img/codingTest/인접리스트.png"><br>

이번 문제에서는 관련이 없지만 만약 방향이 없는 무향그래프도 있는데, 아래 그림으로 이해하면 쉽다.

<img src="/assets/img/codingTest/무향그래프.png"><br>

이번 문제에서 볼 수 있듯이 문제를 보고 DFS, BFS 인지 파악도 중요하지만, 

동시에 인접행렬을 사용할지 인접리스트를 사용할지 파악하는 것도 매우 중요하다고 생각된다.

<br>

그렇다면 **<span style="color:red">시간초과</span>** 가 났던 이유는 무엇일까?

예상하건데 최초에 이 문제를 풀 때 visited 배열 처리관련 로직을 빼먹었다. 

아마도 이 부분에서 무한루프에 빠지지 않았을까 예상해본다.

<br>

## <span style="color:gray">문제 해결 과정</span>

---

#### ***핵심 로직*** 

• **<span style="color:#BC8F8F">메모리관리를 위해 인접리스트를 사용한다.</span>**

• **<span style="color:#BC8F8F">노드를 몇 번 방문했는지 카운팅한다.</span>**

<br>

#### ***해결 순서***

⒈ 인접리스트를 생성한다.

⒉ 노드 방문 횟수를 저장하기 위한 count 배열을 생성한다.

⒊ 노드의 갯수를 범위로 하는 반복문을 작성한다.

⒋ 반복문을 순회하면서 BFS로직을 실행한다.

⒌ BFS 로직을 돌면서 노드에 방문할 때 마다, 해당 노드의 방문 횟수를 1 증가한다.

⒍ 가장 많이 방문한 노드를 반환한다.

<br>

## <span style="color:gray">소스 코드</span>

---

***🔖 <a href="https://github.com/Gilbert9172/coding-test/blob/main/backJoon/dfsbfs/%ED%9A%A8%EC%9C%A8%EC%A0%81%EC%9D%B8%ED%95%B4%ED%82%B9.java" target="_blank">소스 코드</a>***

```java
package dfsbfs;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;

public class 효율적인해킹 {

    static int[] count;
    static int N, M;
    static ArrayList<ArrayList<Integer>> graph = new ArrayList<>();

    public static void main(String[] args) throws IOException {

        // ⒈ 인접리스트를 생성한다.
        createAdjacencyList();

        // ⒉ 노드 방문 횟수를 저장하기 위한 count 배열을 생성한다.
        count = new int[N + 1];

        // ⒊ 노드의 갯수를 범위로 하는 반복문을 작성한다.
        for (int j = 1; j <= N; j++) {

            // ⒋ 반복문을 순회하면서 BFS로직을 실행한다.
            bfs(j);
        }

        // ⒍ 가장 많이 방문한 노드를 반환한다.
        StringBuilder result = NumberOfComputer();
        System.out.println(result);
    }

    public static void createAdjacencyList() throws IOException {

        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine(), " ");
        N = Integer.parseInt(st.nextToken());
        M = Integer.parseInt(st.nextToken());
        
        for (int i = 0; i <= N; i++) {
            graph.add(new ArrayList<>());
        }

        for (int i = 0; i < M; i++) {
            st = new StringTokenizer(br.readLine(), " ");
            int a = Integer.parseInt(st.nextToken());
            int b = Integer.parseInt(st.nextToken());
            graph.get(a).add(b);
        }
    }


    public static void bfs(int x) {
        boolean[] visited = new boolean[N + 1];
        Queue<Integer> queue = new LinkedList<>();
        queue.offer(x);
        visited[x] = true;

        while (!queue.isEmpty()) {
            Integer temp = queue.poll();
            for (Integer node : graph.get(temp)) {
                if (!visited[node]) {
                    visited[node] = true;
                    queue.offer(node);

                    // ⒌ BFS 로직을 돌면서 노드에 방문할 때 마다, 해당 노드의 방문 횟수를 1 증가한다.
                    count[node] ++;
                }
            }
        }
    }

    public static StringBuilder NumberOfComputer() {
        StringBuilder sb = new StringBuilder();
        int max = Arrays.stream(count).max().getAsInt();
        for (int i = 1; i < count.length; i++) {
            if (count[i] == max) {
                sb.append(i + " ");
            }
        }
        return sb;
    }
}
```