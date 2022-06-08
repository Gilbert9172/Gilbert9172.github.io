---
layout: post
title: PostgreSql 시간 다루기
categories: sql
---

## <span style="color:gray">Casting(형변환)</span>

```sql
SELECT EXTRACT(EPOCH FROM now())::INTEGER;
```

결과 값의 타입을 **`::`** 뒤에 있는 타입으로 형변환 해준다.

## <span style="color:gray">Epoch</span>

date나 timestamp 타입에 사용 사능한 Epoch를 이용하면 초 단위로 환산된 값을 알 수 있다. 