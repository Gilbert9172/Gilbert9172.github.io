---
layout: post
title: 미로탐색
categories: algorithm
---

## <span style="color:gray">문제 파악</span>

---

#### ***문제***

***🔖 [백준 - 미로탐색](https://www.acmicpc.net/problem/2178)***




<br>

#### ***주요 조건***

• (1,1)에서 (N,M)으로 이동할 때 지나야 하는 **<span style="color:#BC8F8F">최소</span>** 칸 수

• `최소 칸 수 = 최단거리` 이기 때문에 BFS알고리즘을 떠올려야 한다.

<br>

#### ***입출력 예시***

|결과|
|----|
|15|

<br>

## <span style="color:gray">문제 해결 과정</span>

---

#### ***핵심 로직***

• 상하좌우 이동에 관련된 로직 필요

• 최단거리를 구하는 문제이므로 BFS 로직 필요

• 이동한 칸 수를 알아야 하기 때문에, 이전 노드의 값에 1을 더하기

<br>

#### ***해결 순서***

⒈ 방문한 노드를 저장할 Queue 생성

⒉ 최초 진입 지점인 (0,0)을 방문처리

⒊ ***<span style="background-color:yellow">현재 위치에서 이동할 수 있는 노드의 좌표 확인</span>***

⒋ 이동할 노드가 이동 범위 내에 있다면, 해당 좌표를 Queue에 삽입

⒌ 현재 이동한 노드를 방문처리 해준다.

⒍ ***<span style="background-color:yellow">이동 칸 수를 확인해야 하기 때문에 이전 노드의 값에 1을 더해준다.</span>***

⒎ 마지막 노드까지 방문을 했다면 while문 종료

<br>

## <span style="color:gray">적어도 이것만은 기억하자!!!</span>

---

⒈ 위치 이동에 관련된 문제라면 ***<span style="color:#BC8F8F">상하좌우 이동을 위한 로직</span>*** 을 꼭 작성하자.

⒉ 물론 모든 경우는 아니겠지만, ***<span style="color:#BC8F8F">최단 거리를 구하는 문제의 경우에는 BFS를 먼저 고려해보자.</span>***

<br>

## <span style="color:gray">소스 코드</span>

---

***🔖 [소스 코드](https://github.com/Gilbert9172/coding-test/blob/main/backJoon/dfsbfs/%EB%AF%B8%EB%A1%9C%ED%83%90%EC%83%89.java)***

```java
import java.util.*;
import java.util.stream.Collectors;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class 미로탐색 {

    static int n;
    static int m;
    static boolean[][] visited;
    static List<List<Integer>> graph = new ArrayList<>();
    //순서대로 : 상,하,좌,우 
    //(블로그 build 오류로 주석 처리) static int[][] move = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}}; 

    public static void main(String[] args) throws IOException {
        // 입력조건을 위한 로직
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        n = Integer.parseInt(st.nextToken());
        m = Integer.parseInt(st.nextToken());

        for (int i = 0; i < n; i++) {
            String[] str = br.readLine().split("");
            List<Integer> inputList = Arrays.stream(str)
                                            .map(Integer::parseInt)
                                            .collect(Collectors.toList());
            graph.add(inputList);
        
        }

        visited = new boolean[n][m];

        // bfs로직
        bfs(0,0);
        
        //결과
        System.out.println(graph.get(n-1).get(m-1));
    }

    public static void bfs(int row, int col) {

        // 1. 방문한 노드를 저장할 Queue 생성 && 최초 진입 노드 좌표 큐에 삽입
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{row, col});

        while(!queue.isEmpty()) {
            int[] current = queue.poll();
            int curRow = current[0];
            int curCol = current[1];

            //2. 진입 노드 방문처리
            visited[curRow][curCol] = true;

            //3. 현재 위치에서 이동할 수 있는 노드의 좌표 확인
            for (int i = 0; i < move.length; i++) {
                int newRow = curRow + move[i][0];
                int newCol = curCol + move[i][1];

                if (isInRange(newRow, newCol)) {

                    // 4. 이동할 노드가 이동 범위 내에 있다면, 해당 좌표를 Queue에 삽입
                    queue.offer(new int[]{newRow, newCol});

                    // 5. 현재 이동한 노드를 방문처리 해준다.
                    visited[newRow][newCol] = true;

                    // 6. 이전 노드의 값에 +1
                    int beforeNode = graph.get(curRow).get(curCol);
                    graph.get(newRow).set(newCol, beforeNode + 1);

                    // 7. 마지막 노드까지 방문을 했다면 while문 종료
                    if (visited[n-1][m-1]) {
                        return ;
                    }
                }
            }
        }
    }

    public static boolean isInRange(int newRow, int newCol) {
        /*
         * 해당 열과 행이 0보다는 커거나 같아야 하며,
         * 주어진 범위(n,m) 보다는 작아야 하며,
         * 해당 좌표를 방문한 이력이 있으면 안되며,
         * 해당 좌표가 이동가능한 길이여야 한다.
         */
        if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < m
            && !visited[newRow][newCol] && graph.get(newRow).get(newCol) == 1) {
                return true;
            }
        return false;
    }
}
```