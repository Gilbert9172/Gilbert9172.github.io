---
layout: post
title: 안전 영역
categories: algorithm
---

## <span style="color:gray">문제 파악</span>

---

#### ***문제***

***🔖 <a href="https://www.acmicpc.net/problem/2468" target="_blank">백준(실버1) - 안전 영역</a>***

<br>

#### ***주요 조건***

• **<span style="color:#BC8F8F">장마철에 물에 잠기지 않는 안전한 영역의 최대 개수</span>**

• **<span style="color:#BC8F8F">아무 지역도 물에 잠기지 않을 수도 있다.</span>**

<br>

#### ***TEST CASE***

|Test Case|
|---------|
|5|
|6 8 2 6 2|
|3 2 3 4 6|
|6 7 3 3 2|
|7 2 5 3 6|
|8 9 5 2 7|

<br>

## <span style="color:gray">문제 해결 과정</span>

---

#### ***핵심 로직***

• visited 배열을 초기화해준다.

• graph의 원본을 유지한다.

• 잠기는 경우와 잠기지 않은 경우를 각각 0과 1로 치환

<br>

#### ***해결 순서***

⒈ 주어진 빌딩의 최소 높이와 최대 높이를 확인한다.

⒉ 높이를 범위로 하는 반복문을 만든다.

⒊ 높이 보다 작은 빌딩은 0으로, 높은 빌딩은 1로 치환한다.

⒋ DFS로직을 수행하면서 물에 차지 않은 지역의 수를 카운팅한다.

<br>

## <span style="color:gray">소스 코드</span>

---

***🔖 <a href="" target="_blank">소스 코드</a>***

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;
import java.util.stream.Collectors;

public class 안전지역 {

    static int N;
    static int[][] graph;
    static int[][] graphCopy;
    static boolean[][] visited;
    static Set<Integer> reformedArray;
    static List<Integer> temp = new ArrayList<>();
    static int[] dx = {1, -1, 0, 0};
    static int[] dy = {0, 0, -1, 1};

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine(), " ");
        N = Integer.parseInt(st.nextToken());

        graph = new int[N][N];
        graphCopy = new int[N][N];

        for (int i = 0; i < N; i++) {
            String[] str = br.readLine().split(" ");
            for (int j = 0; j < N; j++) {
                graph[i][j] = Integer.parseInt(str[j]);
                graphCopy[i][j] = Integer.parseInt(str[j]);
            }
        }

        /**
         * ⒈ 주어진 빌딩의 최소 높이와 최대 높이를 확인한다.
         */
        flatGraphArray();
        int max = maxHeight();

        /**
         * ⒉ 높이를 범위로 하는 반복문을 만든다.
         */
        for (int i = 0; i <= max; i++) {

            visited = new boolean[N][N];
            /**
             * ⒊ 높이 보다 작은 빌딩은 0으로, 높은 빌딩은 1로 치환한다.
             */
            for (int j = 0; j < N; j++) {
                for (int k = 0; k < N; k++) {
                    if (graph[j][k] <= i) {
                        graphCopy[j][k] = 0;
                    }
                    else {
                        graphCopy[j][k] = 1;
                    }
                }
            }

            /**
             * ⒋ DFS 로직을 수행하면서 물에 차지 않은 지역의 수를 카운팅한다.
             */
            int count = 0;
            for (int j = 0; j < N; j++) {
                for (int k = 0; k < N; k++) {

                    if (!visited[j][k] && graphCopy[j][k] == 1) {
                        count++;
                        bfs(j,k);
                    }
                }
            }
            temp.add(count);
        }
        int answer = Collections.max(temp);
        System.out.println(answer);

    }

    private static Set<Integer> flatGraphArray() {
        reformedArray = Arrays.stream(graph).flatMapToInt(innerArray -> Arrays.stream(innerArray))
                .boxed()
                .collect(Collectors.toSet());
        return reformedArray;
    }

    private static int maxHeight() {
        return Collections.max(reformedArray);
    }

    private static void bfs(int row, int col) {

        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{row, col});

        while (!queue.isEmpty()) {

            int[] poll = queue.poll();
            int curRow = poll[0];
            int curCol = poll[1];

            for (int i = 0; i < dx.length; i++) {
                int newRow = curRow + dx[i];
                int newCol = curCol + dy[i];

                if (isInRange(newRow, newCol)) {
                    visited[newRow][newCol] = true;
                    queue.offer(new int[]{newRow, newCol});
                }
            }
        }
    }
    private static boolean isInRange(int newRow, int newCol) {
        if (newRow >= 0 && newRow < N && newCol >= 0 && newCol < N
                && !visited[newRow][newCol] && graphCopy[newRow][newCol] == 1) {
            return true;
        }
        return false;
    }
}
```