---
layout: post
title: JOIN
categories: spring
tags: mybatis
---

## <span style="color:gray">나만 몰랐던 테이블 3개 이상일 때 JOIN</span>

오늘은 세 개 이상의 테이블을 JOIN해서 데이터 결과 값을 가져오는 쿼리를 작성했다.

<br>

**[ 첫 번째 쿼리문 ]**

```sql
SELECT
    df.DATA_SEQ, df.DATA_TYPE, df.`DEPTH`, df.PARENTS, df.FOLDER_NAME, df.COLOR, f2.FILE_NAME, f2.FILE_TYPE, f2.FILE_SIZE, f2.FILE_PATH
FROM (
    SELECT dd.DATA_SEQ, dd.DATA_TYPE, dd.`DEPTH`, dd.PARENTS, dd.`USE_YN`, f.FOLDER_NAME, f.COLOR
    FROM DRIVE_DATA dd
    LEFT JOIN FOLDER f ON dd.DATA_SEQ = f.DATA_SEQ
    WHERE dd.USE_YN = "Y"
    ) AS df
LEFT JOIN FILE f2 ON df.DATA_SEQ = f2.DATA_SEQ
WHERE df.USE_YN = "Y";
```

위 쿼리문의 첫 번째 문제점은 ***<span style="background-color:yellow">가독성</span>*** 이라는 피드백을 받았다.

<br>

**[ 두 번째 쿼리문 ]**

```sql
SELECT
    df.DATA_SEQ,
    df.DATA_TYPE,
    df.`DEPTH`,
    df.PARENTS,
    df.FOLDER_NAME,
    df.COLOR,
    f2.FILE_NAME,
    f2.FILE_TYPE,
    f2.FILE_SIZE,
    f2.FILE_PATH
FROM (
        SELECT
            dd.DATA_SEQ,
            dd.DATA_TYPE,
            dd.`DEPTH`,
            dd.PARENTS,
            dd.`USE_YN`,
            f.FOLDER_NAME,
            f.COLOR
        FROM
            DRIVE_DATA dd
        LEFT JOIN FOLDER f
            ON dd.DATA_SEQ = f.DATA_SEQ
        WHERE dd.USE_YN = "Y"
    ) AS df
LEFT JOIN FILE f2
    ON df.DATA_SEQ = f2.DATA_SEQ
WHERE
    df.USE_YN = "Y";
```

이전 보다 훨씬 눈에 잘들어온다. 하지만 쿼리문이 길어지는 부분이 쪼금 거슬린다.

<br>

**[ 세 번째 쿼리문 ]**

> ***회사 선임개발자 분이 피드백 해주셨다.***

```sql
SELECT
    dd.DATA_SEQ,
    dd.DATA_TYPE,
    dd.`DEPTH`,
    dd.PARENTS,
    f.FOLDER_NAME,
    f.COLOR,
    f2.FILE_NAME,
    f2.FILE_TYPE,
    f2.FILE_SIZE,
    f2.FILE_PATH
FROM 
    DRIVE_DATA dd
LEFT JOIN FOLDER f
    ON dd.DATA_SEQ = f.DATA_SEQ
LEFT JOIN FILE f2
    ON dd.DATA_SEQ = f2.DATA_SEQ
WHERE
    dd.USE_YN = "Y";
```

오늘 짠 쿼리문은 서로 다른 세 개의 테이블을 JOIN해서 데이터를 가져와야 해서 만들었다.

세 개의 쿼리 모두 동일한 결과를 반환한다. 하지만 마지막 쿼리문이 가장 가독성도 좋고

쿼리문의 길이도 적당한거 같다. (물론 추가적인 조건이 있다면 더 길어질수도)

사실 세 개 이상의 테이블을 JOIN하려면 무조건 SubQuery를 짜고, 나머지 테이블과 앞에서 만든 

`SubQuery 테이블` 을 다시 JOIN 해야한다고 생각했다. 

앞으로는 SubQuery를 짜는 방식과 JOIN을 두 번 이상 쓰는 두 가지 방식모두 고려해보면서 

쿼리문을 짜야겠다.

---
