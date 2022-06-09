---
layout: post
title: PostgreSql 시간 다루기
categories: sql
---

## <span style="color:gray">시간 다루기</span>

#### 현재 시간

```sql
select now();

select current_timestamp;
```

> 결과 : 2022-06-09 21:45:29.645 +0900

<br>

```sql
select to_char(now(), 'YYYY-MM-DD HH24:MI:SS');
```
> 결과 : 2022-06-09 21:57:02

```sql
select to_timestamp('20220609', 'YYYYMMDD');
```
> 결과 : 2022-06-09 00:00:00.000 +0900



<!-- 
## <span style="color:gray">Casting(형변환)</span>

```sql
SELECT EXTRACT(EPOCH FROM now())::INTEGER;
```

결과 값의 타입을 **`::`** 뒤에 있는 타입으로 형변환 해준다.

## <span style="color:gray">Epoch</span>

date나 timestamp 타입에 사용 사능한 Epoch를 이용하면 초 단위로 환산된 값을 알 수 있다.  -->