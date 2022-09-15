---
layout: post
title: 게임 맵 최단거리
categories: algorithm
---

## <span style="color:gray">문제 파악</span>

---

#### ***문제***

***🔖 <a href="https://school.programmers.co.kr/learn/courses/30/lessons/1844" target="_blank">프로그래머스 - 게임 맵 최단거리</a>***

<a href="https://gilbert9172.github.io/algorithm/2022/09/12/CodingTest_%EB%AF%B8%EB%A1%9C%ED%83%90%EC%83%89/" target="_blank">미로탐색</a> 과 비슷한 유형의 문제이다.

<br>

#### ***주요 조건***

• **<span style="color:#BC8F8F">상대 진영에 도착하기 위해서 지나야하는 칸의 최소 갯수</span>**

• 상대 진영 주위에 벽이 있다면 상대 팀 진영에 도달할 수 없다. 이때는 `-1`을 반환한다.


<br>

## <span style="color:gray">문제 해결 과정</span>

---

#### ***핵심 로직***

• BFS를 구현한 최단거리 구하기

• **<span style="color:#CD5C5C">예외처리 : 목적지에 도달하지 못 할 경우</span>**

<br>

#### ***해결 순서***

⒈ 시작 촤표`(x,y)`를 Queue에 넣고 방문처리를 한다.

⒉ 상하좌우로 이동하며 이동할 수 있는 좌표를 찾는다.

⒊ 이동할 수 있는 경로의 좌표를 Queue에 넣고 방문처리 한다.

⒋ 최단 경로를 알아야 하므로 이전 좌표의 노드값에 1을 더하며 이동한다.

⒌ 마지막 노드까지 방문을 완료했다면, 마지막 좌표의 노드값을 반환한다.

⒍ 만약 벽에 가로막혀 마지막 노드를 방문을 하지 못한다면 -1을 반환한다.

<br>

## <span style="color:gray">소스 코드</span>

---

***🔖 <a href="https://github.com/Gilbert9172/coding-test/blob/main/programmers/levelTwo/%EA%B2%8C%EC%9E%84%EB%A7%B5%EC%B5%9C%EB%8B%A8%EA%B1%B0%EB%A6%AC.java" target="_blank">소스 코드</a>***

<img src="/assets/img/codingTest/게임 맵 최단거리.png">