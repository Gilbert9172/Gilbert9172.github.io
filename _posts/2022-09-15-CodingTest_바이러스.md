---
layout: post
title: 바이러스
categories: algorithm
---

## <span style="color:gray">문제 파악</span>

---

#### ***문제***

***🔖 <a href="https://www.acmicpc.net/problem/2606" target="_blank">프로그래머스 - 바이러스</a>***

<br>

#### ***주요 조건***

• **<span style="color:#BC8F8F">1번 컴퓨터에 연결된 컴퓨터들만 바이러스가 걸린다.</span>**

<br>

#### ***TEST CASE***

|Test Case|
|---------|
|7|
|6|
|1 2|
|2 3|
|1 5|
|5 2|
|5 6|
|4 7|

<br>

## <span style="color:gray">문제 해결 과정</span>

---

#### ***핵심 로직***

• 재귀를 활용한 DFS로직 구현

• 큐를 활용한 BFS로직 구현

• 1번 노드는 결과에 반영이 안된다.

<br>

#### ***DFS 해결 순서***

⒈ 노드에 연결된 노드들을 나타내는 **<span style="color:#BC8F8F">인접리스트</span>** 를 생성한다.

⒉ 1과 연결된 노드부터 방문을 한다. `(2,5)`

⒊ 2번 노드를 방문 처리한다. 2번 노드에 연결된 노드를 확인한다. `(1, 3, 5)`

⒋ 1번은 이미 방문했기 때문에 3번 노드를 방문한다.

⒌ 위와 같은 방법으로 노드를 순회하면서 `count + 1`을 해준다.

⒍ 4번과 7번은 1번 노드에 인접해 있지 않기 때문에 DFS로직 수행 대상에서 제외된다.

<br>

#### ***BFS 해결 순서***

⒈ 그래프의 연결 관계를 2차원 배열로 나타내는 방식인 **<span style="color:#BC8F8F">인접행렬</span>** 을 생성한다.

⒉ 1번 노드를 방문 처리하고 이후 연결된 노드들을 전부 순회한다.

<br>

## <span style="color:gray">소스 코드</span>

---

***🔖 <a href="https://github.com/Gilbert9172/coding-test/blob/main/backJoon/dfsbfs/%EB%B0%94%EC%9D%B4%EB%9F%AC%EC%8A%A4BFS.java" target="_blank">소스 코드 - BFS</a>***

그래프의 연결관계를 2차원 배열로 나타내는 `인접행렬`을 사용하여 풀이하였다.

넓이 우선 탐색 방식이므로 방문 순서는 `1 → 2 → 5 → 3 → 6`가 된다.

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.LinkedList;
import java.util.Queue;
import java.util.StringTokenizer;

public class 바이러스BFS {

    static int n, m, answer;
    static int[][] graph;

    public static void main(String[] args) throws IOException {

        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        n = Integer.parseInt( br.readLine());
        m = Integer.parseInt( br.readLine());

        graph = new int[n + 1][n + 1];

        for (int i = 0; i < m; i++) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            int a = Integer.parseInt(st.nextToken());
            int b = Integer.parseInt(st.nextToken());

            graph[a][b] = graph[b][a] = 1;
        }

        boolean[] visited = new boolean[n+1];
        bfs(1, visited);
        System.out.println(answer);

    }

    public static void bfs(int node, boolean[] visited) {

        Queue<Integer> queue = new LinkedList<>();
        queue.offer(node);

        while (!queue.isEmpty()) {

            Integer temp = queue.poll();
            visited[temp] = true;

            for (int i = 1; i <= n; i++) {
                if (!visited[i] && graph[temp][i] == 1) {
                    visited[i] = true;
                    queue.offer(i);
                    answer ++;
                }
            }
        }
    }
}
```

<br>

***🔖 <a href="https://github.com/Gilbert9172/coding-test/blob/main/backJoon/dfsbfs/%EB%B0%94%EC%9D%B4%EB%9F%AC%EC%8A%A4DFS.java" target="_blank">소스 코드 - DFS</a>***

그래프의 연결 관계를 vector의 배열로 나타내는 `인접 리스트`를 사용하여 풀이하였다.

깊이 우선 탐색이기 때문에 BFS보다 속도가 빠르면 방문 순서는 `1 → 2 → 3 → 5 → 6`가 된다.

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;

public class 바이러스DFS {

    static int n,m,answer;
    static List<List<Integer>> graph = new ArrayList<>();

    public static void main(String[] args) throws IOException {

        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        n = Integer.parseInt( br.readLine());
        m = Integer.parseInt( br.readLine());

        for (int j = 0; j <= n; j++) {
            graph.add(new ArrayList<>());
        }

        for (int i = 0; i < m; i++) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            int a = Integer.parseInt(st.nextToken());
            int b = Integer.parseInt(st.nextToken());
            graph.get(a).add(b);
            graph.get(b).add(a);
        }

        boolean[] visited = new boolean[n+1];
        dfs(1, visited);
        System.out.println(answer);
    }

    public static void dfs(int node, boolean[] visited) {

        visited[node] = true;

        List<Integer> neighborNodes = graph.get(node);
        for (Integer neighborNode : neighborNodes) {
            if (!visited[neighborNode]) {
                answer ++;
                dfs(neighborNode, visited);
            }
        }
    }
}
```


