---
layout: post
title: 그래프
categories: cs
tags: dataStructure
---

## <span style="color:gray">그래프 구조</span>

---

#### <span style="background-color:black; color:white">그래프란?</span>

그래프는 정점(vertex)과 간선(edge)으로 구성된 자료구조를 의미한다. 

> vertex는 정점, edge는 정점과 정점을 연결하는 간선이다.

그래프는 네트워크 모델 즉, 객체와 이에 대한 관계를 나타내는 유연한 방식으로

이해할 수 있다. 

<br>

#### <span style="background-color:black; color:white">특징</span>

• 순환 혹은 비순환 구조를 가진다.

• 루트-노드 개념이 없다.

• 부모-자식 개념이 없다.

• 방향이 있는 그래프와 방향이 없는 그래프가 있다.

• 2개 이상의 경로가 가능하다.(무향/단방향/양방향)

<br>

## <span style="color:gray">그래프 구현 방법</span>

그래프를 구현하는 방법에는 인접행렬과 인접리스트 방식이 있다. 

#### <span style="background-color:black; color:white">인접 행렬</sapn>

> 2차원 배열로 그래프의 연결 관계를 표현하는 방식

<img src="/assets/img/codingTest/인접행렬.png"><br>

**장점**

✔ 2차원 배열 안에 모든 정점들의 간선 정보를 담기 때문에 두 점에 대한 정보를 조회할 때

`O(1)`의 시간 복잡도면 충분하다.

<br>

**단점**

✔︎ 모든 관계를 저장하므로 노드 개수가 많을수록 메모리가 불필요하게 낭비된다. 

<br>

#### <span style="background-color:black; color:white">인접 리스트</sapn>

<img src="/assets/img/codingTest/인접리스트.png"><br>

<br>

**장점**

✔︎ 특정한 노드와 연결된 모든 인접 노드를 순회해야 하는 경우에는 인접리스트 방식이

인접행렬방식에 비해 메모리 낭비가 적다.

✔︎ 정점들의 연결정보를 탐색할 때 O(n)의 시간복잡도를 갖는다. (n: 간선의 갯수)

<br>

**단점**

✔︎ 특정한 두 노드가 연결되어 있는지에 대한 정보를 얻는 속도가 느리다.

인접 리스트 방식에서는 연결된 데이터를 하나씩 확인해야 하기 때문이다.