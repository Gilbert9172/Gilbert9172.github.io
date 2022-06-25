---
layout: post
title: Indexing
categories: sql
---

## <span style="color:gray">테이블을 읽는 방식</span>

DB에서 테이블을 읽어들이는 방식은 크게 Full-Scan, Range-Scan으로 나뉜다.

Full-Scan은 테이블에 포함된 모든 레코드를 처음부터 끝까지 읽는 방식이고,

Range-Scan은 테이블의 일부 레코드에만 접근하는 방식이다. 이 두 가지 방식 중에

Range-Scan을 할 때 ***`Index`*** 를 이용하면 성능을 향상시키는데 도움이 된다.

---

<br>

## <span style="color:gray">Indexing</span>

Index는 RDBMS에서 검색 속도를 높이기 위한 기술이다.

TABLE의 컬럼을 색인화하여 검색시 해당 테이블의 레코드를 Full Scan하지 않고, 색인화 되어있는 

INDEX를 검색하여 검색 속도를 빠르게 한다. 보통 SELECT 쿼리의 WHERE절이나 JOIN을 사용했을 떄 

INDEX가 사용되며, SELECT 쿼리의 속도를 빠르게 하느데 목적을 두고 있다. 

---

<br>

## <span style="color:gray">Index 알고리즘</span>

