---
layout: post
title: 그림
categories: algorithm
---

## <span style="color:gray">문제 파악</span>

---

#### <span style="background-color:black; color:white">문제</span>

***🔖 <a href="https://www.acmicpc.net/problem/1926" target="_blank">백준(실버1) - 그림</a>***

<br>

#### <span style="background-color:black; color:white">아이디어</span>

그래프를 순회하면서 노드의 값이 1이면서 방문한적 없는 곳부터 탐색을 시작한다.

이동할 때, 그림의 크기를 알기 위해 다음 노드로 이동시 count에 1을 더하면서 이동한다.

그리고 탐색이 종료되면, 그림의 크기를 List에 저장한다. 이렇게 모든 노드의 탐색을 

종료하게 되면 List의 크기는 그림의 갯수가 되고, 해당 List의 최대값은 가장 넓은 그림의 

넓이가 된다. 만약 List가 비어있다면 그림의 갯수와 가장 넓은 그림의 넓이는 0이 된다.

<br>

## <span style="color:gray">문제 해결 과정</span>

---

#### <span style="background-color:black; color:white">핵심 로직</span>

• ***<span style="background-color:yellow">노드를 이동할 때 마다 count에 1을 더 해준다.</span>***

<br>

#### <span style="background-color:black; color:white">해결 순서</span>

⒈ `인접 행렬`과  `방문배열`을 생성한다.

⒉ 노드의 값이 1이면서 방문한 적 없는 노드를 찾아 탐색을 시작한다. (이중 for문)

⒊ 다음 노드로 이동할 때 마다 count에 1을 더 해준다.

⒋ 탐색을 마치고 반환 되는 값은 해당 그림의 넓이이다.

⒌ picSizeList에 그림의 넓이를 추가해준다.

⒍ 그림의 갯수는 List의 크기이며, 해당 List의 최대값은 가장 넓은 그림의 넓이가 된다.

<br>

## <span style="color:gray">추가 학습</span>

---

<img src="/assets/img/codingTest/그림.png">

오늘은 자바 기본타입의 위대함?을 알았다. 위의 그림을 보면 메모리와 시간차이가 대략 **<span style="color:red">2배</span>** 정도

차이가 나는것을 확인할 수 있다. 확실하진 않지만 아래의 두 코드에서 이런 차이가 생긴 것 같다.

<br>

**▷ 1. 메모리 많이 사용하는 코드**
```java
for (int i = 0; i < n; i++) {
    String[] str = br.readLine().split(" ");
    for (int j = 0; j < m; j++) {
        graph[i][j] = Integer.parseInt(str[j]);
    }
}
```

<br>

**▷ 2.  메모리를 효율적으로 사용하는 코드**

```java
for (int i = 0; i < n; i++) {
    String line = br.readLine();
    for (int j = 0, idx = 0; j < m; j++, idx+=2) {
        graph[i][j] = line.charAt(idx) - '0';
    }
}
```

<br>

위 코드의 큰 차이점은 `타입`이다. 1번 코드의 경우에는 값을 int로 변형하였다. 

int 타입의 경우에는 기본적으로 **<u>4바이트의 메모리</u>** 를 차지한다고 한다. 

반면에 2번 코드를 보면 char타입으로 데이터를 처리하였다. 찾아보니 char타입의

경우에는 기본적으로 **<u>2바이트의 메모리</u>** 를 차지한다고 한다.

우연인지는 모르겠지만, 위 이미지에서도 대략 2배 가량의 메모리와 시간 차이가 나는걸 볼 수 있다.

<br>

오늘을 계기로 자바 기본 타입에 대해서 다시 한 번 복습을 해야할 거 같다. 

그리고 개발을 함에 있어서 메모리도 고려하면서 개발하려는 개발자가 되어야겠다.

<br>

## <span style="color:gray">소스 코드</span>

---

***🔖 <a href="https://github.com/Gilbert9172/coding-test/blob/main/backJoon/dfsbfs/%EA%B7%B8%EB%A6%BC.java" target="_blank">소스 코드</a>***

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;

public class 그림 {

    static int n,m;
    static List<Integer> picSizeList = new ArrayList<>();
    static int[][] graph;
    static boolean[][] visited;
    static int[] dx = {0, 0, -1, 1};
    static int[] dy = {1, -1, 0, 0};

    public static void main(String[] args) throws IOException {
        generateAdjacencyMatrix();
        generateVisitedArray();

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (graph[i][j] == 1 && !visited[i][j]) {
                    int picSize = bfs(i, j);
                    picSizeList.add(picSize);
                }
            }
        }

        if (picSizeList.isEmpty()) {
            System.out.println(0+"\n"+0);
        } else {
            System.out.println(picSizeList.size() +"\n"+ Collections.max(picSizeList));
        }
    }

    private static void generateAdjacencyMatrix() throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine(), " ");

        n = Integer.parseInt(st.nextToken());
        m = Integer.parseInt(st.nextToken());

        graph = new int[n][m];

        for (int i = 0; i < n; i++) {
            String line = br.readLine();
            for (int j = 0, idx = 0; j < m; j++, idx+=2) {
                graph[i][j] = line.charAt(idx) - '0';
            }
        }
    }

    private static void generateVisitedArray() {
        visited = new boolean[n][m];
    }

    private static int bfs(int row, int col) {

        int count = 1;

        Queue<int[]> q = new LinkedList<>();
        q.offer(new int[]{row, col});
        visited[row][col] = true;

        while (!q.isEmpty()) {
            int[] current = q.poll();
            int curRow = current[0];
            int curCol = current[1];

            for (int i = 0; i < dx.length; i++) {
                int nextRow = curRow + dx[i];
                int nextCol = curCol + dy[i];

                if (isInRange(nextRow, nextCol)) {
                    visited[nextRow][nextCol] = true;
                    count ++;
                    q.offer(new int[]{nextRow, nextCol});
                }
            }
        }
        return count;
    }

    private static boolean isInRange(int nextRow, int nextCol) {
        if (nextRow >= 0 && nextRow < n && nextCol >= 0 && nextCol < m
                && !visited[nextRow][nextCol] && graph[nextRow][nextCol] == 1) {
            return true;
        }
        return false;
    }
}
```