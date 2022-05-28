---
layout: post
title: choose, when, otherwise
categories: spring
tags: mybatis
---

## <span style="color:gray">choose, when, otherwise</span>

`<if>`태그와 같이 조건식이 참일 경우 쿼리문을 실행해주는 역할을 한다. 

다른 점은 여러개의 `<if>`태그를 사용한 경우 조건식이 true를 반환하는 `<if>`태그는 모두 쿼리문이 실행된다. 

하지만 `<choose>`태그내의 여러개의 `<when>`태그이 있는 경우 조건식이 true를 반환하는 `<when>`태그를 찾으면 

거기서 멈추고 해당 `<when>`태그의 쿼리만 실행한다. 

다시말해 조건식을 가진 여러개의 `<when>`태그는 오로지 한 개의 `<when>`태그 내부 쿼리만 실행한다. 

대부분의 프로그래밍 언어에서 사용되는 if else와 비슷한 역할을 한다.


```xml
<choose>
    <when test='조건식1'>쿼리문1</when>
    <when test='조건식2'>쿼리문2</when>
    <when test='조건식3'>쿼리문3</when>
    <otherwise>쿼리문4</otherwise>
</choose>
```

---