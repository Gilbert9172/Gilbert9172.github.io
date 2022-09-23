---
layout: post
title: 촌수 계산
categories: algorithm
---

## <span style="color:gray">문제 파악</span>

---

#### <span style="background-color:black; color:white">문제</span>

***🔖 <a href="https://www.acmicpc.net/problem/2644" target="_blank">백준(실버2) - 촌수 계산</a>***

<br>

#### <span style="background-color:black; color:white">아이디어</span>

주어진 두 정점 사이의 촌수를 구해야 한다. 따라서 두 정점중 하나를 탐색 알고리즘의 시작노드로 

지정해야 한다. 그리고 남은 하나의 노드를 도착노드로 정해줘야 한다. 

또한, 자식노드로 이동할 때 (즉, Depth가 들어갈 때) depth를 카운팅 해주는것이 필요하다.

문제에서 친천관계를 정의할 수 없다면 -1을 출력하라고 했기 때문에 최초에 `int answer = -1`로

초기화 해준다.

<br>

## <span style="color:gray">문제 해결 과정</span>

---

#### <span style="background-color:black; color:white">핵심 로직</span>

• ***<span style="background-color:yellow">시작노드와 도착노드를 정해준다.</span>***

<br>

#### <span style="background-color:black; color:white">해결 순서</span>

⒈ 인접리스트로 그래프자료구조를 구현해준다.

⒉ 시작노드를 설정하고, 해당 노드부터 탐색을 시작한다.

⒊ Depth를 들어갈 때 count + 1을 해준다.

⒋ 도착 노드를 만나면 count + 1을 해준다.

<br>

## <span style="color:gray">소스 코드</span>

---

***🔖 <a href="https://github.com/Gilbert9172/coding-test/blob/main/backJoon/dfsbfs/%EC%B4%8C%EC%88%98%EA%B3%84%EC%82%B0.java" target="_blank">소스 코드</a>***

```java
package dfsbfs;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

public class 촌수계산 {

    static int N,M,a,b,c,d;
    static int answer = -1;
    static boolean[] visited;
    static List<List<Integer>> graph = new ArrayList<>();

    public static void main(String[] args) throws IOException {

        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        N = Integer.parseInt(br.readLine());

        StringTokenizer st = new StringTokenizer(br.readLine(), " ");
        a = Integer.parseInt(st.nextToken());
        b = Integer.parseInt(st.nextToken());

        M = Integer.parseInt(br.readLine());

        for (int j = 0; j <= N; j++) {
            graph.add(new ArrayList<>());
        }

        for (int i = 0; i < M; i++) {
            st = new StringTokenizer(br.readLine(), " ");
            c = Integer.parseInt(st.nextToken());
            d = Integer.parseInt(st.nextToken());
            graph.get(c).add(d);
            graph.get(d).add(c);
        }

        visited = new boolean[N + 1];
        dfs(a, 0);
        System.out.println(answer);
    }

    public static void dfs(int a, int count) {
        visited[a] = true;
        for (Integer neighborNode : graph.get(a)) {
            if (!visited[neighborNode]) {
                if (neighborNode == b) {
                    answer = count + 1;
                    return;
                }
                visited[neighborNode] = true;
                dfs(neighborNode, count + 1);
            }
        }
    }
}
```