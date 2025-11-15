---
layout: post
title: Oracle 문법 정리
categories: sql
---

## <span style="color:gray">날짜, 시간 관련 함수</span>

---

#### ***TRUNC(값,옵션)***

> 오라클의 기본적인 함수로 주로 소수점 절사나 날짜의 시간을 없앨때 사용

<br>

```sql
SELECT 
     CURRENT_DATE
    ,TRUNC(CURRENT_DATE, 'DD')		/* 시간 절사 */
    ,TRUNC(CURRENT_DATE, 'HH24')	/* 분,초 절사 */
    ,TRUNC(CURRENT_DATE, 'MI')		/* 초 절사 */
    ,TRUNC(CURRENT_DATE, 'YEAR')	/* 월,일 초기화 */
    ,TRUNC(CURRENT_DATE, 'MONTH')	/* 일 초기화 */
    ,TRUNC(CURRENT_DATE, 'DAY')     /* 요일 초기화(일요일) */
FROM dual;
```

<br>

|쿼리|결과|설명|
|----|----|----|
|TRUNC(CURRENT_DATE, 'DD')|2022-08-25 00:00:00.000|시간 초기화|
|TRUNC(CURRENT_DATE, 'HH24')|2022-08-25 21:00:00.000|분, 초 초기화|
|TRUNC(CURRENT_DATE, 'MI')|2022-08-25 21:30:00.000|초 초기화|
|TRUNC(CURRENT_DATE, 'YEAR')|2022-01-01 00:00:00.000|월, 일 초기화|
|TRUNC(CURRENT_DATE, 'MONTH')|2022-08-01 00:00:00.000|일 초기화|
|TRUNC(CURRENT_DATE, 'DAY')|2022-08-21 00:00:00.000|요일 초기화(일요일로)|

<br>

#### ***LAST_DAY(날짜)***

> 입력한 날짜의 마지막 날짜를 가져오는 함수.

```sql
SELECT 
    LAST_DAY(TO_DATE('2022-08-25', 'yyyy-mm-dd'))
FROM dual;
```

<br>

|결과|
|----|
|2022-08-31 00:00:00.000|

<br> 

TRUNC와 응용을 해보면 해당 월의 시작일과 마지막일을 구할 수 있다.

```sql
SELECT 
     TRUNC(CURRENT_DATE, 'MONTH') AS START_DATE
    ,LAST_DAY(TO_DATE('2022-08-25', 'yyyy-mm-dd')) AS LAST_DATE
FROM dual;
```

<br>

|시작날|마지막날|
|------|--------|
|2022-08-01 00:00:00.000|2022-08-31 00:00:00.000|

<br>

#### ***ADD_MONTH(날짜, 숫자)***

> 월을 더하거나 뺄 때 사용한다.

```sql
SELECT ADD_MONTHS(TO_DATE('2022-08-15'), 1)
FROM dual;
```

<br>

|결과|
|----|
|2022-09-15 00:00:00.000|

<br>

#### ***INTERVAL***

> INTERVAL은 년,월,일,시간,분,초 를 전부 더하거나 뺄 수 있다.

```sql
SELECT 
     TO_DATE('2022-08-25', 'yyyy-mm-dd') + (INTERVAL '1' YEAR)
    ,TO_DATE('2022-08-25', 'yyyy-mm-dd') + (INTERVAL '1' MONTH)
    ,TO_DATE('2022-08-25', 'yyyy-mm-dd') + (INTERVAL '1' DAY)
    ,TO_DATE('2022-08-25', 'yyyy-mm-dd') + (INTERVAL '1' HOUR)
    ,TO_DATE('2022-08-25', 'yyyy-mm-dd') + (INTERVAL '1' MINUTE)
    ,TO_DATE('2022-08-25', 'yyyy-mm-dd') + (INTERVAL '1' SECOND)
FROM dual;
```

<br>

```sql
SELECT 
     TO_DATE('2022-08-25', 'yyyy-mm-dd') + (INTERVAL '2:30' HOUR TO MINUTE)
    ,TO_DATE('2022-08-25', 'yyyy-mm-dd') - (INTERVAL '2:30' HOUR TO MINUTE)
    ,TO_DATE('2022-08-25', 'yyyy-mm-dd') + (INTERVAL '2:30' MINUTE TO SECOND)
    ,TO_DATE('2022-08-25', 'yyyy-mm-dd') - (INTERVAL '2:30' MINUTE TO SECOND)
FROM dual;
```

그리고 INTERVAL을 사용하면 위의 쿼리 처럼 몇시간 몇분도 더하거나 뺄 수 있다.

|결과|
|----|
|2022-08-25 02:30:00.000|
|2022-08-24 21:30:00.000|
|2022-08-25 00:02:30.000|
|2022-08-24 23:57:30.000|

<br>

#### ***TO_CHAR()***

이 함수는 시간이나 날짜 관련은 아니지만 내가 주로 시간,날짜를 다룰 때 애용해서 쓰는

함수다. 주로 날짜별로 GROUP BY 하는 경우나 시간대 별로 인원수를 구할 때 사용한다. 

아래의 쿼리는 회사 프로젝트 중 짠 쿼리로 날짜 별 대기 인원을 3달치 조회한 쿼리이다.

```sql
SELECT 
     REGEXP_REPLACE(TO_CHAR(er.EVALUATE_RESERVE_DT , 'yyyy-mm-dd'), '\-', '') AS EVALUATE_RESERVE_DT
    ,COUNT(*) AS EVALUATE_RESERVE_CNT

FROM EVALUATE_RESERV er

WHERE er.EVALUATE_RESERVE_DT 
    BETWEEN TRUNC(CURRENT_DATE, 'MONTH') 
        AND LAST_DAY(ADD_MONTHS(TRUNC(CURRENT_DATE, 'MONTH'),2))

GROUP BY TO_CHAR(er.EVALUATE_RESERVE_DT , 'yyyy-mm-dd')

ORDER BY EVALUATE_RESERVE_DT;
```

조회 결과는 아래와 같다.

|EVALUATE_RESERVE_DT|EVALUATE_RESERVE_CNT|
|-------------------|--------------------|
|20220819|1|
|20220820|1|
|20220825|10|
|20220915|2|
|20221031|3|

<br>

## <span style="color:gray">정규식(REGEX)</span>

---

***📚 [참고 블로그](https://neocan.tistory.com/348)***

***📚 [Oracle Documents](https://docs.oracle.com/cd/B19306_01/server.102/b14200/functions130.htm)***

<br>

#### ***REGEX_REPLACE***

> 정규식 패턴에 해당하는 문자를 지정한 문자로 변환해주는 함수

<img src="/assets/img/sql/oracle/regex1.png">

<br>

**전화번호 포맷 변경 쿼리**

```sql
SELECT 
     m.PHONE_NUM AS ORIGINAL
    ,REGEXP_REPLACE(m.PHONE_NUM, '(\d{3})(\d*)(\d{4})', '\1-\2-\3') AS REGEX_1
    ,REGEXP_REPLACE(m.PHONE_NUM, '(.{3})(.*)(.{4})', '\1-\2-\3') AS REGEX_2
FROM "MEMBER" m;
```

|파라미터|설명|
|--------|----|
|PHONE_NUM|해당 문자열 |
|'(.{3})(.*)(.{4})'|정규식 패턴|
|'\1-\2-\3'|위치-추가할 문자|

<br>

|ORIGINAL|REGEX_1|REGEX_2|
|--------|-------|-------|
|01067671234|010-6767-1234|010-6767-1234|
|01042121353|010-4212-1353|010-4212-1353|
|01093714621|010-9371-4621|010-9371-4621|
|01035821562|010-3582-1562|010-3582-1562|
|01012331232|010-1233-1232|010-1233-1232|
|01025252343|010-2525-2343|010-2525-2343|

<br>

**전화번호 가운데 마스킹**

```sql
SELECT 
    m.PHONE_NUM 
    ,REGEXP_REPLACE(m.PHONE_NUM, '(\d{3})(\d*)(\d{4})', '\1-\2-\3') AS REGEX_1
    ,REGEXP_REPLACE(REGEXP_REPLACE(m.PHONE_NUM, '(\d{3})(\d*)(\d{4})', '\1-\2-\3'), '-(.*)-',
    '-'||LPAD('*',LENGTH(REGEXP_REPLACE(m.PHONE_NUM, '(\d{3})(\d*)(\d{4})', '\2')), '*')||'-') AS MAKING
FROM "MEMBER" m;
```

<br>

|ORIGINAL|REGEX_1|MAKING|
|--------|-------|-------|
|01067671234|010-6767-1234|010-****-1234|
|01042121353|010-4212-1353|010-****-1353|
|01093714621|010-9371-4621|010-****-4621|
|01035821562|010-3582-1562|010-****-1562|
|01012331232|010-1233-1232|010-****-1232|

<br>

마지막 쿼리문이 이해가 잘 안되서 뜯어서 보기로 했다.

```sql
1. REGEXP_REPLACE(m.PHONE_NUM, '(\d{3})(\d*)(\d{4})', '\1-\2-\3')

2. '-(.*)-'

3. '-'||LPAD('*',LENGTH(REGEXP_REPLACE(m.PHONE_NUM, '(\d{3})(\d*)(\d{4})', '\2')), '*')||'-'
```

1번 쿼리는 위에서 봤던 쿼리로, 전화번호를 `xxx-xxxx-xxxx` 포맷으로 바꿔준다.

2번 쿼리문은 **1번 쿼리문 결과**에 대한 정규식 패턴을 정의한 것이다.

마지막을 3번 쿼리가 쫌 복잡하다. 

<br>

쿼리를 보기 전에 우선적으로 알아야 하는 문법 두 가지가 있다.

|문법|설명|
|----|----|
|`LPAD("값", "총 문자길이", "채움문자")`|지정한 길이만큼 왼쪽부터 특정문자로 채워준다.|
|`||`|concat(문자열 합치기)|

`REGEXP_REPLACE()`에서 세번 째로 받는 파라미터는 `replace_string` 이다. 

즉, 세번 째에 있는 쿼리문은 대체할 문자를 지정해 둔 것으로 보면 될 것 같다.

<br>

우선 앞 뒤로  CONCAT(`||`)을 사용해서 `-`를 붙혀줬다. 그리고 LPAD 함수를 사용하여 

`LENGTH(REGEXP_REPLACE(m.PHONE_NUM, '(\d{3})(\d*)(\d{4})', '\2'))` 만큼 *로 대체해준다.

바로 윗 문장의 쿼리는 **전화번호 가운데 자리의 길이를 구하는 쿼리이다.**

즉, 간단하게 표현하자면 `LPAD("*", 4 ,"*")` 라고 보면 쉽게 이해가 된다.

> `LPAD("*", 4 ,"*")` : 왼쪽 부터 *(별)로 채워서 4자리를 만든다.

<br>

#### ***오라클 순서 매기기***

[참고 블로그](https://coding-factory.tistory.com/443)

<br>

#### ***NULL 처리방법***

[참고 블로그](https://developer-talk.tistory.com/257)