---
layout: post
title: 유기농 배추
categories: algorithm
---

## <span style="color:gray">문제 파악</span>

---

#### ***문제***

***🔖 <a href="https://www.acmicpc.net/problem/1012" target="_blank">백준 - 유기농 배추</a>***

***🔖 <a href="https://gilbert9172.github.io/algorithm/2022/07/14/%EB%8B%A8%EC%A7%80%EB%B2%88%ED%98%B8%EB%B6%99%EC%9D%B4%EA%B8%B0/" target="_blank">유사문제</a>***

<br>

#### ***주요 조건***

• **<span style="color:#BC8F8F">인접해 있는 노드들의 무리수를 구해야한다.</span>**

<img src="/assets/img/codingTest/유기농배추.png">



<br>

#### ***TEST CASE***

|Test Case|
|---------|
|1|
|5 3 6|
|0 2|
|1 2|
|2 2|
|3 2|
|4 2|
|4 0|

<br>

## <span style="color:gray">문제 해결 과정</span>

---

#### ***핵심 로직***

• 배추가 심어진 노드를 찾기. → **`이중for문`** 활용

• 최초 배추집단? 발견시 **`count +1`**

<br>

#### ***해결 순서***

⒈ 좌표의 값이 1인 노드를 찾는다.

⒉ 좌표를 순회하면서 이동할 수 있을 때까지 이동한다.

⒊ 더 이상 이동하지 못하면 로직 탈출

⒋ 위 방법을 반복한다.

<br>

## <span style="color:gray">소스 코드</span>

---

***🔖 <a href="https://github.com/Gilbert9172/coding-test/blob/main/backJoon/dfsbfs/%EC%9C%A0%EA%B8%B0%EB%86%8D%EB%B0%B0%EC%B6%94DFS.java" target="_blank">소스 코드-DFS</a>***

```java
public class 유기농배추DFS {

    static int n, a, b, c;
    static List<Integer> answer = new ArrayList<>();
    static int[] dx = {1, -1, 0, 0};
    static int[] dy = {0, 0, -1, 1};

    static boolean[][] visited;
    static int[][] graph;

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        n = Integer.parseInt(br.readLine());

        for (int i = 0; i < n; i++) {
            StringTokenizer st = new StringTokenizer(br.readLine(), " ");
            a = Integer.parseInt(st.nextToken());
            b = Integer.parseInt(st.nextToken());
            graph = new int[a][b];

            c = Integer.parseInt(st.nextToken());
            for (int j = 0; j < c; j++) {
                st = new StringTokenizer(br.readLine(), " ");
                int x = Integer.parseInt(st.nextToken());
                int y = Integer.parseInt(st.nextToken());
                graph[x][y] = 1;
            }

            visited = new boolean[a][b];

            int temp = 0;
            for (int l = 0; l < a; l++) {
                for (int k = 0; k < b; k++) {
                    if (graph[l][k] == 1 && !visited[l][k]) {
                        temp++;
                        dfs(l,k);
                    }
                }
            }
            answer.add(temp);
        }

        for (Integer integer : answer) {
            System.out.println(integer);
        }
    }

    private static void dfs(int row, int col) {

        visited[row][col] = true;
        for (int i = 0; i < dx.length; i++) {
            int newRow = row + dx[i];
            int newCol = col + dy[i];

            if (isInRange(newRow, newCol)) {
                dfs(newRow, newCol);
            }
        }
    }

    private static boolean isInRange(int newRow, int newCol) {
        if (newRow >= 0 && newRow < a && newCol >= 0 && newCol < b
                && !visited[newRow][newCol] && graph[newRow][newCol] == 1) {
            return true;
        }
        return false;
    }
}
```

<br>

***🔖 <a href="https://github.com/Gilbert9172/coding-test/blob/main/backJoon/dfsbfs/%EC%9C%A0%EA%B8%B0%EB%86%8D%EB%B0%B0%EC%B6%94BFS.java" target="_blank">소스 코드-BFS</a>***

```java
public class 유기농배추BFS {

    static int n, a, b, c;
    static List<Integer> answer = new ArrayList<>();
    static int[] dx = {1, -1, 0, 0};
    static int[] dy = {0, 0, -1, 1};

    static boolean[][] visited;
    static int[][] graph;

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        n = Integer.parseInt(br.readLine());

        for (int i = 0; i < n; i++) {
            StringTokenizer st = new StringTokenizer(br.readLine(), " ");
            a = Integer.parseInt(st.nextToken());
            b = Integer.parseInt(st.nextToken());
            graph = new int[a][b];

            c = Integer.parseInt(st.nextToken());
            for (int j = 0; j < c; j++) {
                st = new StringTokenizer(br.readLine(), " ");
                int x = Integer.parseInt(st.nextToken());
                int y = Integer.parseInt(st.nextToken());
                graph[x][y] = 1;
            }

            visited = new boolean[a][b];

            int temp = 0;
            for (int l = 0; l < a; l++) {
                for (int k = 0; k < b; k++) {
                    if (graph[l][k] == 1 && !visited[l][k]) {
                        temp++;
                        bfs(l,k);
                    }
                }
            }
            answer.add(temp);
        }

        for (Integer integer : answer) {
            System.out.println(integer);
        }
    }

    private static void bfs(int row, int col) {

        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{row, col});

        while (!queue.isEmpty()) {

            int[] current = queue.poll();
            int curRow = current[0];
            int curCol = current[1];
            visited[curRow][curCol] = true;

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
        if (newRow >= 0 && newRow < a && newCol >= 0 && newCol < b
                && !visited[newRow][newCol] && graph[newRow][newCol] == 1) {
            return true;
        }
        return false;
    }
}

```
