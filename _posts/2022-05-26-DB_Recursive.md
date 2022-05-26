---
layout: post
title: 프록시, 프록시 패턴, 데코레이터 패턴
categories: sql
---

## <span style="color:gray">[ Recursive ]</span>

오늘은 드라이브 폴더 구조를 가져오는 코드를 작성하는 과정에서 재귀쿼리에 대해서 

알게 됐다. 오늘 사용해본 바, 재귀쿼리를 사용할 만한 경우는 3가지로 생각된다.

***⒈ 카테고리, 태그***

***⒉ 회사 부서 검색***

***⒊ 폴더 경로 검색***

---

<br>

## <span style="color:gray">[ 소스 코드 ]</span>

```sql

WITH RECURSIVE t3 (DATA_SEQ, PARENTS, FOLDER_NAME) AS
	(
		############# 첫 번째 쿼리 ################
		SELECT 
			t1.DATA_SEQ, 
			t1.PARENTS, 
			f1.FOLDER_NAME
		FROM DRIVE_DATA t1
		LEFT JOIN FOLDER f1 
			ON t1.DATA_SEQ = f1.DATA_SEQ 
		WHERE t1.DATA_SEQ = '180'
			AND t1.DATA_TYPE = '0'
		###########################################
	
		UNION ALL

		############# 두 번째 쿼리 ################
		SELECT 
			t2.DATA_SEQ, 
			t2.PARENTS, 
			f2.FOLDER_NAME 
		FROM DRIVE_DATA t2
		JOIN t3      # JOIN주의!!!
			ON t2.DATA_SEQ = t3.PARENTS
		LEFT JOIN FOLDER f2 
			ON t2.DATA_SEQ = f2.DATA_SEQ
	    ##########################################
	)
SELECT * FROM t3
SELECT t3.DATA_SEQ, t3.FOLDER_NAME FROM t3;

```

---

<br>

#### First Query Result

**`최초 행 반환 (non-recursive)`**

단순히 쿼리의 결과를 반환한다. 반복해서 호출되지는 않는다.

<img src="/assets/img/sql/recursive1.png">

---

<br>

#### Second Query Result

**`추가 행 반환 (recursive)`**

첫 번째 쿼리의 결과와 `UNION ALL`뒤에 나오는 쿼리의 모든 결과가 하나로 합해진다. 

<img src="/assets/img/sql/recursive2.png">

---

<br>

#### UNION ALL

**`각 쿼리의 모든 결과를 포함한 합집합(중복제거 안함)`**

추가적으로 `UNION`이라는 것도 있는데, 각 쿼리의 결과합을 반환하는 점에서는

동일하지만, 중복제거를 하지 않는다는 차이점이 있다.

---
