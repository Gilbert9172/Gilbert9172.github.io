---
layout: post
title: Indexing
categories: sql
---

## <span style="color:gray">들어가기 앞서.</span>

---

#### <span style="background-color:black; color:white">성능 이슈를 만나다.</span>

현재 공기질 프로젝트를 유지보수를 담당하고 있는데, 새로운 이슈가 들어왔다.

**실시간 공기질 통계 페이지**가 열리는데 굉장히 오래걸리는 이슈였다.

책과 구글링 결과 Indexing이라는 방법을 알게됐다.

이 포스팅에서는 해당 이슈를 어떻게 해결했고, 해결하는 과정에서 알게된 정보를 정리하려고 한다.

<br>

## <span style="color:gray">문제를 해결해보자.</span>

---

#### <span style="background-color:black; color:white">테이블을 읽는 방식</span>

우선 DB에서 테이블을 읽어들이는 방식은 크게 `Full-Scan`, `Range-Scan`으로 나뉜다.

- Full-Scan : 테이블에 포함된 모든 레코드를 처음부터 끝까지 읽는 방식
- Range-Scan은 테이블의 일부 레코드에만 접근하는 방식

이 두 가지 방식 중에 **<span style="background-color:#F0E68C">Range-Scan을 할 때 Index를 이용하면 성능을 향상시키는데 도움이 된다.</span>**


<br>

#### <span style="background-color:black; color:white">Index란?</span>

***<span style="color:gray">Index는 RDBMS에서 검색 속도를 높이기 위한 기술이다.</span>***

인덱스란 "추가적인 쓰기 작업과 저장 공간을 활용하여 데이터베이스 테이블의 검색 속도를

향상시키기 위한 자료구조"이다. 이러한 인덱스는 자주 사용되는 값으로 만들어진 원본 테이블의 

사본이라고 생각할 수 있다.

<br>

만약 인덱스를 사용하지 않은 컬럼을 조회해야 하는 상황이라면 전체를 탐색하는 Full Scan을

수행해야 한다. 이 방법은 DB 전체를 비교탐색하기 때문에 처리 속도가 떨어진다.

보통 SELECT 쿼리의 WHERE절이나 JOIN을 사용했을 때 INDEX가 사용되며, 

**<span style="background-color:#F0E68C">SELECT 쿼리의 속도를 빠르게 하느데 목적을 두고 있다.</span>** 

CREATE, DELETE, UPDATE가 빈번한 속성에 인덱스를 걸게 되면 인덱스의 크기가 비대해져 

오히려 성능이 저하되는 역효과를 발생할 수 있다.

<br>

조금더 자세히 알아보면, SQL서버에서 데이터의 레코드는 내부적으로 아무런 순서없이 저장된다.

이때 데이터 저장 영역을 **`Heap 영역`** 이라고 한다. Heap 영역에서는 인덱스가 없는 테이블의

데이터를 찾을 때 전체 데이터 페이지의 처음 레코드부터 끝 페이지의 마지막 레코드까지 모두

조회하여 검색조건과 비교하게 된다. 이러한 데이터 검색방법을 위에 설명한 Full-Scan이라 한다.

<br>

#### <span style="background-color:black; color:white">Index 동작 원리</span>

⒈ Index Table(원본 테이블의 사본)에서 where절에 포함된 값을 찾는다.

⒉ 해당 값의 id 값을 가져온다.

⒊ 가져온 id값으로 <span style="color:#2E8B57">**원본 테이블**</span>에서 값을 조회한다.

<br>

아래 사진을 보면 Indexes에 Index Table이 생성된걸 확인 할 수 있다.

<img src="/assets/img/cs/indextable.png">

예를 들어 쿼리문을 아래와 같이 작성하였을 때

> SELECT * FROM table WHRER user_id="John"

Index가 없는 경우 John이 어떤 블록에 들어 있는지 모르기 때문에 모든 데이터를 

`db buffer cache`로 복사한 후 하나하나 찾는다. 

반면 Index가 있는 경우 where절의 컬럼(user_id)의 index가 만들어져 있는지 확인 후, 

인덱스에 먼저 가서 John의 정보가 어떤 ROWID를 가지고 있는지 확인한 후 해당 ROWID에 있는 

블록만 찾아가서 `db buffer cache`에 복사한다.

<br>

#### <span style="background-color:black; color:white">Index 사용 이유</span>

⒈ WHERE절과 일치하는 열을 빨리 찾기 위해.

⒉ Join을 실행할 때 다른 테이블에서 열을 추출하기 위해.

⒊ 특정하게 인덱스된 컬럼을 위한 `MIN()` 또는 `MAX()` 값을 찾기 위해.

<br>

#### <span style="background-color:black; color:white">Memory Engine</span>

구글링을 하면서 MySQL의 DB Engine을 설정함으로써 성능 개선하는 방법을 찾았다.

<img src = "/assets/img/sql/memoryEngine.png"><br>

설정은 간단하다. Memory를 선택해서 바꿔주기만 하면 된다. 그러면 이제 자세히 알아보자!

<br>

Memory Engine은 HEAP 테이블이라고도 부르며 메모리에 데이터를 저장하는 엔진이다.

이 엔진의 경우 **메모리**를 사용하기 때문에 속도가 매운 빠른 장점이 있다고 한다.

하지만 모든 데이터를 RAM(주기억장치)에 저장하기 때문에, 서버가 내려가게 되면 모든

데이터가 휘발되는 치명적인 단점을 가지고 있다.

<br>

결과적으로 속도는 빠르긴하지만, 이번 문제를 해결하는데 있어서 적절하지 않은 방법이라고

판단된다. 실시간 데이터를 다 지울수는 없다...

이 방법은 지속적인 데이터 보다, 정형화된 임시데이터를 사용할 때 좋을거 같다.

지금 생각나는 예로는 메일 인증번호나, 토큰 정보를 저장할 때 쓰면 좋을거 같다.

<br>

## <span style="color:gray">추가 학습</span>

---

#### <span style="background-color:black; color:white">이진트리</span>

우선 들어가기에 앞서 이진트리에 대해서 알아야한다.

**<span style="background-color:#F0E68C">이진트리는 각각의 노드가 최대 두 개의 자식 노드를 가지는 트리 자료구조이다.</span>**

이진트리에는 정이진트리, 완전이진트리, 균형이진트리 등이 있다. <a href="https://hsc-tech.tistory.com/7" target="_blank">참고 블로그</a>

|종류|설명|
|----|----|
|균형 이진트리(Balanced)|리프노드의 레벨차이가 최대 1레벨 까지만 나는 트리(균형을 유지)|
|완전 이진트리(Complete)|마지막 레벨을 제외한 모든 레벨에서 왼쪽부터 노드가 꽉 채워진 트리|
|정 이진트리(Full)|각 내부 노드가 두 개의 자식 노드를 같는 트리, 홀수 개의 자식 노드를 가질수 없다.|
|포화 이진트리(Perfect)|모든 레벨의 노드가 가득 차 있는 트리|

<br>

**<span style="color:red">균형이진트리는 검색할 때 최악의 경우에도 O(logN)의 안정성을 유지한다.</span>**

만약 균형이 맞지 않는, 한 쪽으로 치우친 트리의 경우 시간 복잡도가 최악의 경우 `O(N)`이다.

<br>

<details>
<summary>균형 이진트리</summary>
<div markdown="1">

```txt
이진트리에서 왼쪽 자식으로 내려갈지, 오른쪽 자식으로 내려갈지 탐색에 대한 기준이 

있다면 이를 이진 탐색트리 라고한다. 이진탐색트리는 트리의 높이만큼의 시간이 소요되므로 

탐색의 시간복잡도는 `O(h) (h= 트리의 높이)`이다.

일반적으로 이진트리의 삽입, 삭제, 탐색 수행시간은 H와 밀접한 연관을 가지고 있다. 

이로인해 트리의 높이를 최대한 줄여 트리가 균형을 잡히게하여 h를 logN에 바운드 시킨 

이진탐색 트리를 균형있는 이진 탐색 트리(balanced binary search tree) 라고한다.

BBST(balanced binary search tree)의 대표적인 예로 AVL Tree, RedBlack Tree, B-Tree, B+Tree 가 있다.
```

</div>
</details>

<br>

<details>
<summary>시간복잡도 logN 나오는 과정</summary>
<div markdown="1">

```txt
왜 균형이진트리는 최악의 경우에도 시간 복잡도 O(logN)이 나오는 걸까?

예를 들어 2개의 자식 노드를 가지는 이진트리를 이용해서 M개의 노드 중 원하는 값의 

노드를 찾는다고 가정을 해보자. 처음에는 M개의 노드 모두 탐색 대상이지만, 

루트 노드에서 첫번째 자식 노드 층으로 이동하게 되면 탐색해야 할 대상의 수가 M/2개가 된다. 

그리고 순차적으로 검색해야할 대상의 수는 [M/2 개 => M/4 개 => M/8 개 => ...] 가 될 것이다.

만약 탐색을 해야하는 자료의 수가 2^n개라면, 이진 트리를 사용할 경우 n번의 탐색을 통해서 

원하는 값을 찾을 수 있게 된다. 이를 일반화하면 각 노드의 자식노드가 M개인 트리에서 

N개의 자료 중 원하는 자료를 탐색하는 알고리즘의 시간 복잡도는 [밑이 M인 logN] 이 된다.
```

</div>
</details>

<br>

#### <span style="background-color:black; color:white">Index 알고리즘</span>

**[ B-Tree ]**

> <a href="https://helloinyong.tistory.com/296 " target="_blank">왜 다른 균형트리는 안될까?</a>

<img src = "/assets/img/cs/b-tree.png"><br>

균형트리 중 B-Tree를 사용하는 이유는 B-Tree는 하나의 노드에 여러 개의 데이터 요소를 

저장할 수 있는 점과 데이터 탐색뿐 아니라 저장, 수정, 삭제에도 항상 `O(logN)`의 시간 복잡도를 

가지기 때문이다. 또 항상 정렬된 상태를 유지하고 있고 참조 포인터가 적어 방대한 데이터 양에도 

빠른 메모리 접근이 가능하다는 장점도 가지고 있다. B-Tree의 특징은 아래와 같다.

|특징|
|----|
|각 노드의 자료는 정렬되어 있다.|
|자료는 중복되지 않는다.|
|모든 리프노드는 같은 레벨에 있다.|
|루트노드는 자신이 리프노가 되지 않는 이상 적어도 2개 이상의 자식을 가진다.|
|루트노드가 아닌 노드들은 적어도 M/2개의 자식 노드를 가지고 있다. (최대M개)|

<br>

**[ B+Tree ]**

<img src = "/assets/img/cs/b+tree.png"><br>

B+Tree는 B-Tree의 데이터의 순차접근 문제를 개선하기 위해 제시되었다. 

B-Tree에서는 중복값 없이 한 개의 노드에만 key가 유일하게 존재했으나, 

B+Tree는 리프노드와 그 리프노드의 부모 노드에서 공존할 수 있다. B+Tree의 `리프 노드`는 

연결리스트로 구성되어 있으며 `순차 집합(Sequence Set)`이라고 하며 오름차순으로 정렬이 

되어 있다. 여기에 데이터가 담기는 것이다. 

리프 노드가 아닌 `비단말 노드`는 `인덱스 집합(Index Set)`이라고 부르며 

데이터로의 빠른 접근을 위한 인덱스 역할만 하기 때문에 키와 포인터로만 구성된다. 

<br>

따라서 B+Tree는 **<span style="background-color:#F0E68C">기존의 B-Tree 구조에 데이터의 연결 리스트로 구현된 색인구조라고 할 수 있다.</span>**

이 때문에 순차적인 탐색에 매우 유리하다. 오늘날 DB에서 가장 중요한 것은 검색속도이기 때문에

주로 **DB에서 B+Tree를 사용**하는 이유이기도 하다.

|특징|
|----|
|데이터노드(Sequence Set)의 자료는 정렬되어 있다.|
|데이터노드(Sequence Set)에서는 데이터가 중복되지 않는다.|
|모든 리프노드는 같은 레벨에 있다.|
|리프노드가 아닌 노드의 키값의 수는 그 노드의 서브 트리수 보다 하나가 적다.|
|모든 리프노드는 연결리스트로 연결되어 있다.|

<br>



<br>

## <span style="color:gray">참고한 사이트 및 블로그</span>

***📚 [rebro](https://rebro.kr/169)***

***📚 [velog.io/@gillog](https://velog.io/@gillog/SQL-Index%EC%9D%B8%EB%8D%B1%EC%8A%A4)***

***📚 [B+Tree 실습](https://www.cs.usfca.edu/~galles/visualization/BPlusTree.html)***

***📚 [ssocoit.tistory](https://ssocoit.tistory.com/217)***

***📚 [8iggy.tistory](https://8iggy.tistory.com/191)***

***📚 [gmlwjd9405.github.io](https://gmlwjd9405.github.io/2018/08/12/data-structure-tree.html)***

***📚 [ookyungmin.github.io](https://kookyungmin.github.io/study/2018/07/29/data_structure_02/)***