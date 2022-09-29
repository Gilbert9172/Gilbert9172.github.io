---
layout: post
title: 영역 구하기
categories: algorithm
---

## <span style="color:gray">문제 파악</span>

---

#### <span style="background-color:black; color:white">문제</span>

***🔖 <a href="https://www.acmicpc.net/problem/2583" target="_blank">백준(실버1) - 영역 구하기</a>***

**[백준(실버1) - 그림](https://gilbert9172.github.io/algorithm/2022/09/24/CodingTest_%EA%B7%B8%EB%A6%BC/)** 과 유사한 문제이다.

<br>

#### <span style="background-color:black; color:white">주요 조건</span>

• 이번 문제는 분리된 각 영역의 면적과 그 갯수를 구하는 문제이다.

<br>

#### <span style="background-color:black; color:white">아이디어</span>

우선 주어진 좌표 `x1, y1, x2, y2` 를 가지고 인접행렬을 만들어야 한다.

넓이에 포함된 좌표는 1로 나타내고 그렇지 않은 영역은 0으로 나타낸다.

그리고 0으로 나타낼 좌표는 `x1 ~ x2`, `y1 ~ y2` 사이 범위의 좌표가 이에 해당된다.

이번 문제는 ***<span style="background-color:yellow">주어진 좌표를 통해 연결된 지점을 찾는 것이 중요 포인트다.</span>***

그리고 이 문제의 경우는 모든 노드를 방문해야 하는 문제이기 때문에 DFS,BFS 모두 구현이 가능하다.

마지막으로 각 지역의 넓이는, 연결된 노드로 넘어갈 경우 count + 1을 해준다. 

이때 방문배열을 꼭 확인해야 함을 숙지해야 한다.

<br>

## <span style="color:gray">문제 해결 과정</span>

---

#### <span style="background-color:black; color:white">핵심 로직</span>

• ***<span style="background-color:yellow">좌표를 사용해서 인접행렬을 생성한다.</span>***

<br>

#### <span style="background-color:black; color:white">해결 순서</span>

⒈ 좌표의 범위를 활요하여 인접행렬 생성

⒉ BFS 또는 DFS 로직 수행

<br>

## <span style="color:gray">소스 코드</span>

---

***🔖 <a href="https://github.com/Gilbert9172/coding-test/blob/main/backJoon/dfsbfs/%EC%98%81%EC%97%AD%EA%B5%AC%ED%95%98%EA%B8%B0DFS2583.java" target="_blank">DFS 풀이</a>***

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;
import java.util.stream.Collectors;

public class 영역구하기DFS2583 {

    static int M,N,K;
    static int x1,y1,x2,y2, count;
    static int[][] graph;
    static boolean[][] visited;
    static int[] dx = {0, 0, -1, 1};
    static int[] dy = {1, -1, 0, 0};
    static List<Integer> areaList = new ArrayList<>();

    public static void main(String[] args) throws IOException {
        generateMatrixAndVisited();

        for (int i = 0; i < N; i++) {
            for (int j = 0; j < M; j++) {
                Position pos = new Position(i,j);
                if (isNeverVisited(pos)) {
                    count = 0;
                    addAreaToList(pos);
                }
            }
        }
        Collections.sort(areaList);
        printAnswer();
    }

    private static class Position {

        private int row;
        private int col;

        public Position(int row, int col) {
            this.row = row;
            this.col = col;
        }

        public int getRow() {
            return this.row;
        }

        public int getCol() {
            return this.col;
        }
    }

    private static boolean isNeverVisited(Position position) {
        return !visited[position.getRow()][position.getCol()] && graph[position.getRow()][position.getCol()] == 0;
    }

    private static void addAreaToList(Position position) {
        int area = dfs(position);
        areaList.add(area);
    }

    private static void generateMatrixAndVisited() throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine(), " ");

        M = Integer.parseInt(st.nextToken());
        N = Integer.parseInt(st.nextToken());
        K = Integer.parseInt(st.nextToken());

        graph = new int[N][M];
        visited = new boolean[N][M];

        for (int i = 0; i < K; i++) {
            st = new StringTokenizer(br.readLine(), " ");

            x1 = Integer.parseInt(st.nextToken());
            y1 = Integer.parseInt(st.nextToken());
            x2 = Integer.parseInt(st.nextToken());
            y2 = Integer.parseInt(st.nextToken());


            for (int x = x1; x < x2; x++) {
                for (int y = y1; y < y2; y++) {
                    graph[x][y] = 1;
                }
            }
        }
    }

    private static int dfs(Position pos) {

        visited[pos.getRow()][pos.getCol()] = true;
        count++;

        for (int i = 0; i < dx.length; i++) {
            int nextRow = pos.getRow() + dx[i];
            int nextCol = pos.getCol() + dy[i];

            Position nextPos = new Position(nextRow, nextCol);

            if (isInRange(nextPos)) {
                dfs(nextPos);
            }
        }
        return count;
    }

    private static boolean isInRange(Position nextPos) {
        if (nextPos.getRow() >= 0 && nextPos.getRow() < N && nextPos.getCol() >= 0 && nextPos.getCol() < M
                && !visited[nextPos.getRow()][nextPos.getCol()] && graph[nextPos.getRow()][nextPos.getCol()] == 0) {
            return true;
        }
        return false;
    }

    private static void printAnswer() {
        System.out.println(areaList.size());
        System.out.println(areaList.stream().map(i -> String.valueOf(i)).collect(Collectors.joining(" ")));
    }
}
```

<br>

***🔖 <a href="https://github.com/Gilbert9172/coding-test/blob/main/backJoon/dfsbfs/%EC%98%81%EC%97%AD%EA%B5%AC%ED%95%98%EA%B8%B02583BFS.java" target="_blank">BFS 풀이</a>***

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;
import java.util.stream.Collectors;

public class 영역구하기2583BFS {

    static int M,N,K;
    static int x1,y1,x2,y2;
    static int[][] graph;
    static boolean[][] visited;
    static int[] dx = {0, 0, -1, 1};
    static int[] dy = {1, -1, 0, 0};
    static List<Integer> areaList = new ArrayList<>();

    public static void main(String[] args) throws IOException {
        generateMatrixAndVisited();

        for (int i = 0; i < N; i++) {
            for (int j = 0; j < M; j++) {
                Position pos = new Position(i,j);
                if (isNeverVisited(pos)) {
                    addAreaToList(pos);
                }
            }
        }
        Collections.sort(areaList);
        printAnswer();
    }

    private static class Position {

        private int row;
        private int col;

        public Position(int row, int col) {
            this.row = row;
            this.col = col;
        }

        public int getRow() {
            return this.row;
        }

        public int getCol() {
            return this.col;
        }
    }

    private static boolean isNeverVisited(Position position) {
        return !visited[position.getRow()][position.getCol()] && graph[position.getRow()][position.getCol()] == 0;
    }

    private static void addAreaToList(Position position) {
        int area = bfs(position);
        areaList.add(area);
    }

    private static void generateMatrixAndVisited() throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine(), " ");

        M = Integer.parseInt(st.nextToken());
        N = Integer.parseInt(st.nextToken());
        K = Integer.parseInt(st.nextToken());

        graph = new int[N][M];
        visited = new boolean[N][M];

        for (int i = 0; i < K; i++) {
            st = new StringTokenizer(br.readLine(), " ");

            x1 = Integer.parseInt(st.nextToken());
            y1 = Integer.parseInt(st.nextToken());
            x2 = Integer.parseInt(st.nextToken());
            y2 = Integer.parseInt(st.nextToken());


            for (int x = x1; x < x2; x++) {
                for (int y = y1; y < y2; y++) {
                    graph[x][y] = 1;
                }
            }
        }
    }

    private static int bfs(Position pos) {

        int count = 1;
        Queue<Position> q = new LinkedList<>();
        q.offer(pos);

        while (!q.isEmpty()) {
            Position currentPosition = q.poll();
            int curRow = currentPosition.getRow();
            int curCol = currentPosition.getCol();

            visited[curRow][curCol] = true;

            for (int i = 0; i < dx.length; i++) {
                int nextRow = curRow + dx[i];
                int nextCol = curCol + dy[i];

                Position nextPos = new Position(nextRow, nextCol);

                if (isInRange(nextPos)) {

                    visited[nextRow][nextCol] = true;
                    count ++;
                    q.offer(nextPos);
                }
            }
        }
        return count;
    }

    private static boolean isInRange(Position nextPos) {
        if (nextPos.getRow() >= 0 && nextPos.getRow() < N && nextPos.getCol() >= 0 && nextPos.getCol() < M
                && !visited[nextPos.getRow()][nextPos.getCol()] && graph[nextPos.getRow()][nextPos.getCol()] == 0) {
            return true;
        }
        return false;
    }

    private static void printAnswer() {
        System.out.println(areaList.size());
        System.out.println(areaList.stream().map(i -> String.valueOf(i)).collect(Collectors.joining(" ")));
    }
}
```