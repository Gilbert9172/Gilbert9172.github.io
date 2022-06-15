---
layout: post
title: PostgreSql 시간 다루기
categories: sql
---

## <span style="color:gray">시간 다루기</span>

> 꾸준히 추가

```sql
# 현재 시간
SELECT current_timestamp ;
# 결과 : 2022-06-15 21:45:29.645 +0900

# 현재 시간
SELECT now() ;
# 결과 : 2022-06-15 21:45:29.645 +0900

# 현재 날짜(년월일)
SELECT now()::date ;
# 결과 : 2022-06-15

# 현재 시간
SELECT now()::date::timestamp ;
# 결과 : 2022-06-15 00:00:00.000

# 내일
SELECT (now() + INTERVAL '24 HOURS')::date ;
# 결과 : 2022-06-16

# 문자열로 반환
SELECT to_char(now(), 'YYYY-MM-DD HH24:MI:SS');
# 결과 : 2022-06-15 22:28:26

# 문자열을 timestamp로 1
SELECT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')::timestamp ;
# 결과 : 2022-06-15 22:28:26.000

# 문자열을 timestamp로 2
SELECT to_timestamp('20220609', 'YYYYMMDD');
# 결과 : 2022-06-15 00:00:00.000 +0900
```

<br>

## <span style="color:gray">Epoch & Extract</span>

date나 timestamp 타입에 사용 사능한 Epoch를 이용하면 초 단위로 환산된 값을 알 수 있다.

***📚 [Extract Function](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-extract/)***


```sql
# 현재 시간 → 초로 반환
SELECT EXTRACT(EPOCH FROM now()::INTEGER);
# 결과 : 1655299956

# 현재 시간 → 시간만 반환
SELECT EXTRACT(HOUR FROM now()::INTEGER);
# 결과 : 22

# 3분 뒤를 초로 반환
SELECT EXTRACT(EPOCH from now() + INTERVAL '3 min')::INTEGER ;
# 결과 : 1655300715

# 3분 뒤를 timestamp로 반환
SELECT to_timestamp(EXTRACT(EPOCH from now() + INTERVAL '3 min')::INTEGER) ;
# 결과 : 2022-06-15 22:46:02.000 +0900

# 50분전 (5분 간격으로)
SELECT 
    to_timestamp(EXTRACT(EPOCH FROM now() - INTERVAL '5 min' * B)) AS A
FROM 
    generate_seires(0,10,1) AS B;

# 결과 : 2022-06-15 22:46:02.633 +0900
# 결과 : 2022-06-15 22:41:02.633 +0900
# 결과 : 2022-06-15 22:36:02.633 +0900
# 결과 : 2022-06-15 22:31:02.633 +0900
# 결과 : 2022-06-15 22:26:02.633 +0900
# 결과 : 2022-06-15 22:21:02.633 +0900
# 결과 : 2022-06-15 22:16:02.633 +0900
# 결과 : 2022-06-15 22:11:02.633 +0900
# 결과 : 2022-06-15 22:06:02.633 +0900
# 결과 : 2022-06-15 22:01:02.633 +0900
# 결과 : 2022-06-15 21:56:02.633 +0900

```