---
layout: post
title: 특정 거리의 도시 찾기
categories: algorithm
---

## <span style="color:gray">문제 파악</span>

---

#### <span style="background-color:black; color:white">문제</span>

***🔖 <a href="https://www.acmicpc.net/problem/18352" target="_blank">백준(실버2) - 특정 거리의 도시 찾기</a>***

이번 문제는 <a href="https://github.com/Gilbert9172/coding-test/blob/main/backJoon/dfsbfs/%ED%8A%B8%EB%A6%AC%EC%9D%98%EB%B6%80%EB%AA%A8%EC%B0%BE%EA%B8%B0.java" target="_blank">트리의 부모 찾기</a>와 비슷한 유형의 문제이다. 두 문제 모두 해당 노드의

부모노드를 사용해서 해결하는 문제이기 때문이다. 이번 문제는 조금은 심화? 된거 같다.

<br>

#### <span style="background-color:black; color:white">주요 조건</span>

• 최단 거리가 K인 도시가 하나도 존재하지 않으면 -1을 출력한다.

• 최단 거리가 K인 모든 도시의 번호를 한 줄에 하나씩 오름차순으로 출력한다.

<br>

#### <span style="background-color:black; color:white">아이디어</span>

예를 들어 1에 인접한 노드 2,3이 있다고 하면, 1에서 2,3을 차례로 방문할 것이다.

방문을 할 때 Map에 키-벨류로 값을 저장해 줘야한다. 여기서 부모 노드는 1이 되고, 

자식 노드는 2와3이 된다고 해석할 수 있다. 그러다면 `2 : 부모 벨류 + 1`, `3 : 부모 벨류 + 1`와

같은 형식으로 데이터를 만들수 있다.

<br>

## <span style="color:gray">문제 해결 과정</span>

---

#### <span style="background-color:black; color:white">핵심 로직</span>

• ***<span style="background-color:yellow">노드를 방문하면 해당 노드를 키값으로 하며, 벨류는 부모노드의 벨류에 1을 더한다.</span>***

• 문제에서 오름차순으로 나열하라 했기 때문에 Sorting을 한 번 해줘야한다.

<br>

#### <span style="background-color:black; color:white">해결 순서</span>

⒈ 인접리스트를 생성한다.

⒉ 방문확인 배열을 생성한다.

⒊ BFS 로직을 수행한다.

⒋ 방문을 한 노드의 부모노드의 벨류값 + 1을, 현재 방문한 노드의 벨류값으로 저장해준다.

⒌ value 값이 k인 값들만 answerList에 추가해 준다.

⒍ 오름차순 출력이기 때문에 배열을 정렬해준다.

⒎ answerList가 비어있을 경우에는 -1을 출력한다.

⒏ 그렇지 않다면 answerList의 요소를 순서대로 출력한다.

<br>

## <span style="color:gray">소스 코드</span>

---

***🔖 <a href="https://github.com/Gilbert9172/coding-test/blob/main/backJoon/dfsbfs/%ED%8A%B9%EC%A0%95%EA%B1%B0%EB%A6%AC%EC%9D%98%EB%8F%84%EC%8B%9C%EC%B0%BE%EA%B8%B0.java" target="_blank">소스 코드</a>***

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;

public class 특정거리의도시찾기 {

    static int n,m,k,x;
    static boolean[] visited;
    static Map<Integer, Integer> map = new HashMap<>();
    static List<List<Integer>> graph = new ArrayList<>();

    public static void main(String[] args) throws IOException {

        generateAdjacencyList();
        generateVisitedArray();
        bfs(x);
        answer();

    }

    private static void generateAdjacencyList() throws IOException {

        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine(), " ");

        n = Integer.parseInt(st.nextToken());
        m = Integer.parseInt(st.nextToken());
        k = Integer.parseInt(st.nextToken());
        x = Integer.parseInt(st.nextToken());

        for (int i = 0; i <= n; i++) {
            graph.add(new ArrayList<>());
        }

        for (int j = 0; j <m; j++) {
            st = new StringTokenizer(br.readLine(), " ");
            int a = Integer.parseInt(st.nextToken());
            int b = Integer.parseInt(st.nextToken());
            graph.get(a).add(b);
        }
    }

    private static void generateVisitedArray() {
        visited = new boolean[n + 1];
    }

    private static void bfs(int startNode) {

        Queue<Integer> q = new LinkedList<>();
        q.offer(startNode);
        map.put(startNode, 0);

        while (!q.isEmpty()) {
            Integer temp = q.poll();
            visited[temp] = true;

            for (Integer neighborNode : graph.get(temp)) {
                if (!visited[neighborNode]) {
                    map.put(neighborNode, map.get(temp) + 1);
                    q.offer(neighborNode);
                    visited[neighborNode] = true;
                }
            }
        }
    }

    private static void answer() {
        List<Integer> answerList = new ArrayList<>();
        for (Integer key : map.keySet()) {
            if (map.get(key).equals(k)) {
                answerList.add(key);
            }
        }

        Collections.sort(answerList);
        if (answerList.isEmpty()) {
            System.out.println(-1);
        } else {
            for (Integer integer : answerList) {
                System.out.println(integer);
            }
        }
    }
}
```