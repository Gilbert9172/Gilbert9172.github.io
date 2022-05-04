---
layout: post
title: Stream
categories: lang
tags: java
---

## <span style="color:gray">HttpServletRequest에서 request body 값 추출하기</span>

```java
// HttpServletRequest에서 body가져오기
String requestData = request.getReader().lines().collect(Collectors.joining());

// 가져온 body를 jsonObject로
JSONObject jsonObject = new JSONObject(requestData);

// jsonObject를 jsonArray로 
JSONArray jsonArray = jsonObject.getJSONArray("dataSeqList");

List<String> dataSeqList = new ArrayList<>();
for (int i = 0; i < jsonArray.length(); i++) {
    JSONObject resultObject = jsonArray.getJSONObject(i);
    dataSeqList.add(resultObject.get("dataSeq").toString());
}
return dataSeqList;
```

HttpServletRequest에서 requestbody 값을 꺼내야했다. 

맨 첫 번째 줄 코드를 보면 **`collect()`** 를 사용했는데, 구글링을 하다 보니 Stream부터

공부해야 할 것 같아 Stream부터 정리를 시작했다.

---

<br>

## <span style="color:gray">Stream</span>

<br>

### <span style="color:gray">[ Stream이란? ]</span>

**데이터의 연속적인 흐름**

> 다양한 데이터 소스를 표준화된 방법으로 다루기 위한 것.

컬렉션 프레임워트(List, Set, Map)과 배열을 Stream으로 바꿀수 있다.

그리고 n번의 중간 연산과 1번의 최종연산을 수행할 수 있다.


⒈ 스트림 만들기

⒉ 중간 연산 (n번 가능)

⒊ 최종 연산 (1번 가능)


```java
List<String> strArr = {"a", "b", "c", "d"}

// 1. 스트림 만들기
Stream<String> stream = Stream.of(strArr);


// 2. 중간 연산 
Stream<String> filteresStream    = stream.filter();   // 걸러내기

Stream<String> distinctedStream  = stream.distinct(); // 중복 제거

Stream<String> sortedStream      = stream.sort();       

Stream<String> limitedStream     = stream.limit(5);


// 3.최종 연산
int total = stream.count();
```

<br>

### <span style="color:gray">[ Stream 특징 ]</span>

⒈ 스트림은 데이터 소스로부터 데이터를 읽기만 할 뿐 변경하지 않는다.


⒉ 스트림은 iterator 처럼 1회용이다. 필요하면 다시 스트림을 생성해야 한다.

→ 닫힌 스트림에 연산을 수행하면 에러가 난다.


⒊ 최종 연산 전까지 중간 연산이 수행되지 않는다. → ***<span style="background-color:yellow">지연된 연산</span>***

```java
IntStream intStream = new Random().ints(1,46);

IntStream.distinct().limit(6).sorted()
        .forEach(i -> System.out.print(i));
```

⒋ 스트림은 작업을 내부 반복으로 처리한다.

⒌ 스트림의 작업을 병렬로 처리 → 병렬스트림

```java
stream.parallel().mapToint(s -> s.length())
```

⒍ 기본형 스트림 - IntStream, LongStream, DouboleStream...

→ ***<span style="background-color:yellow">오토박싱 & 언박싱의 비효율이 제거됨.</span>***

→ 숫자와 관련된 유용한 메서드를 Stream<T>보다 더 많이 제공
