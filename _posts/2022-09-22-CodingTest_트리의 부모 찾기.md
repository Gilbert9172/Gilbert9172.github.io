---
layout: post
title: 트리의 부모 찾기
categories: algorithm
---

## <span style="color:gray">문제 파악</span>

---

#### ***문제***

***🔖 <a href="https://www.acmicpc.net/problem/11725" target="_blank">백준(실버2) - 트리의 부모 찾기</a>***

<br>

#### ***주요 조건***

• **<span style="color:#BC8F8F">각 노드의 부모노드를 구해야 한다.</span>**

• **<span style="color:#BC8F8F">메모리 관리를 위해 인접리스트를 사용해야 한다.</span>**

<br>

## <span style="color:gray">문제 해결 과정</span>

---

#### ***핵심 로직*** 

• ***<span style="background-color:yellow">방문한 노드의 부모 노드를 리스트에 추가해준다.</span>***


<br>

#### ***해결 순서***

⒈ `인접 리스트`를 생성해준다.

⒉ 부모 노드를 저장할 배열을 생성해준다.

⒊ BFS 로직을 수행한다.

⒋ BFS 로직 수행 과정에서 방문한 노드의 부모 노드를 2번에서 만든 부모 배열에 저장해준다.


<br>

## <span style="color:gray">소스 코드</span>

---

***🔖 <a href="https://github.com/Gilbert9172/coding-test/blob/main/backJoon/dfsbfs/%ED%8A%B8%EB%A6%AC%EC%9D%98%EB%B6%80%EB%AA%A8%EC%B0%BE%EA%B8%B0.java" target="_blank">소스 코드</a>***

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;

public class 트리의부모찾기 {

    static int N;
    static int[] parent;
    static List<List<Integer>> graph = new ArrayList<>();


    public static void main(String[] args) throws IOException {
        createAdjacencyList();
        parent = new int[N + 1];
        bfs(1);
        for (int i = 2; i < parent.length; i++) {
            System.out.println(parent[i]);
        }
    }

    public static void createAdjacencyList() throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine(), " ");
        N = Integer.parseInt(st.nextToken());

        for (int i = 1; i <= N + 1; i++) {
            graph.add(new ArrayList<>());
        }

        for (int j = 1; j < N; j++) {
            st = new StringTokenizer(br.readLine(), " ");
            int x = Integer.parseInt(st.nextToken());
            int y = Integer.parseInt(st.nextToken());
            graph.get(x).add(y);
            graph.get(y).add(x);
        }
    }

    public static void bfs(int node) {
        boolean[] visited =  new boolean[N+1];
        Queue<Integer> q = new LinkedList<>();
        q.offer(node);
        visited[node] = true;

        while (!q.isEmpty()) {
            Integer poll = q.poll();

            for (Integer temp :graph.get(poll)) {

                if (!visited[temp]) {
                    parent[temp] = poll;
                    q.offer(temp);
                    visited[temp] = true;
                }
            }
        }
    }
}

```