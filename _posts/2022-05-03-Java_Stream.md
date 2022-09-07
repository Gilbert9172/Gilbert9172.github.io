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

**💡 [관련 링크](https://steady-coding.tistory.com/313)**

#### ***<span style="color:#A0522D">왜 스트림을 사용하는가?</span>***

✔︎ 다양한 데이터 소스를 표준화된 방법으로 다루기 위해

✔︎ 가독성이 좋다

✔︎ 재사용성

<br>

예를 들어 배열과 컬렉션을 sort할 때 서로 사용하는 법이 다르다. 

컬렉션의 경우 `Collections.sort()`, 배열의 경우 `Arrays.sort()`와 같이 사용한다.

위와 같은 번거로움을 해결하기 위해 만든 것이 Stream이다.

Stream은 데이터 소스를 추상화하고, 데이터를 다루는데 자주 사용되는 메서드들을 

정의해 놓았다. 데이터 소스를 추상화하였다는 것은, 두 가지 의미를 가진다.

***<span style="background-color:yellow">첫 째, 데이터 소스가 무엇이던 간에 같은 방식으로 다룰 수 있게 되었다는 것.</span>***

***<span style="background-color:yellow">둘 째, 코드의 재사용성이 높아진다는 것을 의미한다.</span>***

<br>

***스트림 이전 코드***

```java
String[] strArr = {"a", "b", "c", "d"};
Arrays.sort();

List<String> strList = Arrays.asList(strArr);
Collections.sort(strList);
``` 

<br>

***스트림 이후 코드***

```java
String[] strArr = {"a", "b", "c", "d"};
Stream<String> strStream1 = Arrays.stream(strArr);

List<String> strList = Arrays.asList(strArr);
Stream<String> strStream2 = strList.stream();
```

---

<br>

## <span style="color:gray">Stream 특징</span>

✔︎ 스트림은 데이터 소스로부터 데이터를 읽기만 할 뿐 변경하지 않는다.

✔︎ 스트림은 iterator 처럼 1회용이다. 필요하면 다시 스트림을 생성해야 한다.

✔︎ 최종 연산 전까지 중간 연산이 수행되지 않는다. → ***<span style="background-color:yellow">지연된 연산</span>***

```java
IntStream intStream = new Random().ints(1,46);

IntStream.distinct().limit(6).sorted()
        .forEach(i -> System.out.print(i));
```

✔︎ 스트림은 작업을 내부 반복으로 처리한다.

✔︎ 스트림의 작업을 병렬로 처리 → 병렬스트림

```java
stream.parallel().mapToint(s -> s.length())
```

✔︎ 기본형 스트림 - IntStream, LongStream, DouboleStream...

✔︎ ***<span style="background-color:yellow">오토박싱 & 언박싱의 비효율이 제거됨.</span>***

✔︎ 숫자와 관련된 유용한 메서드를 Stream<T>보다 더 많이 제공

---

<br>

## <span style="color:gray">Stream 만들기</span>

#### ***<span style="color:#A0522D">Collection</span>***

컬렉션의 최고 조상인 Collection에 `strean()`이 정의되어 있다. 그래서 Collection의 자손인

List와 Set을 구현한 컬렉션 클래스들은 모두 이 메서드로 스트림을 생성할 수 있다.

```java
List<Integer> list = Arrays.asList(1,2,3,4,5);
Stream<Integer> listStream = list.stearm();
```

<br>

#### ***<span style="color:#A0522D">Array</span>***

배열을 소스로 하는 스트림을 생성하는 메서드는 Stream과 Arrays에 static메서드로 정의되어 있다.

```java
Stream<String> strStream1 = Stream.of("a", "b", "c");
Stream<String> strStream2 = Stream.of(new String[]{"a", "b", "c"});
Stream<String> strStream3 = Arrays.stream(new String[]{"a", "b", "c"});
Stream<String> strStream4 = Arrays.stream(new String[]{"a", "b", "c"}, 0, 3);
```

그리고 int, long, double과 같은 기본형 배열을 소스로 하는 스트림을 생성하는 메서드도 있다.

```java
IntStream intStream1 = Arrays.stream(new int[]{1, 2, 3, 4, 5});
IntStream intStream2 = IntStream.of(1, 2, 3, 4, 5);
```
---

<br>

## <span style="color:gray">Stream 중간연산</span>

#### ***<span style="color:#A0522D">distinct()</span>***

<br>

#### ***<span style="color:#A0522D">filter()</span>***

filter 메서드로 스트림 내 요소들을 조건에 맞게 필터링할 수 있다.

```java
public class Filter {

    public static void main(String[] args) {

        int[] lst = {1, 2, 3, 4, 5, 6, 7};

        Arrays.stream(lst)
                .boxed()
                .filter(i -> i > 4).collect(Collectors.toList())
                .forEach(System.out::println);
    }
}
```


<br>

#### ***<span style="color:#A0522D">flatMap()</span>***

중첩된 구조를 한 단계 없애고 단일 원소 스트림으로 만들어준다.

```java
public class StreamFlatMap {

    public static void main(String[] args) {

        List<String> list1 = List.of("jung", "gilbert");
        List<String> list2 = List.of("kim", "gilbert");
        List<List<String>> combinedList = List.of(list1, list2);

        combinedList.stream()
                    .flatMap(list -> list.stream())
                    .filter(x -> "jung".equals(x))
                    .collect(Collectors.toList())
                    .forEach(System.out::println);

        System.out.println("====");

        // 2차원 배열
        String[][] arrays = new String[][]{
                {"jung", "gilbert"}, {"kim", "gilbert"}
        };

        Arrays.stream(arrays)
                .flatMap(arr -> Arrays.stream(arr))
                .collect(Collectors.toList())
                .forEach(System.out::println);
    }
}
```

<br>

#### ***<span style="color:#A0522D">map()</span>***

스트림의 요소에 저장된 값 중에서 원하는 필드만 뽑아내거나 특정 형태로 변환해야 할 때가

있다. 이 때 사용하는 것이 바로 `map()`이다. `map()`은 연산의 결과로 `Stream<T>`타입의 

스트림을 반환하는데, 스트림의 요소를 숫자로 변환하는 경우 IntStream과 같은 기본형 스트림으로 

변환하는 것이 더 유용할 수 있다.

<br>

아래 예시는 `map()`을 사용하여 `int 배열`을 `List<Integer>`로 바꿔 보는 연습을 한 것이다.

```java
int[] array = {1, 2, 3};

/* int[] → IntStream */
IntStream intStream = Arrays.stream(array);
IntStream intStream2 = IntStream.of(array);

/* IntStream → Stream<Integer> */
Stream<Integer> intStreamMap = intStream.mapToObj(i -> i);

/* 
 * Stream<Integer> intStreamBoxed = intStream.boxed(); 
 * 스트림은 1회용이기 때문에 이 부분을 주석으로 돌리지 않으면 에러가 난다.
 */

/* Stream<Integer> → List<Integer> */
List<Integer> arrayList = intStreamMap.collect(Collectors.toList());
List<Integer> arrayList2 = intStreatBoxed.collect(Collectors.toList()); 
```

<br>

아래 예시는 `List<Integer>`을 `int 배열`로 바꿔 보는 연습을 한 것이다.

```java

/* List<Integer> → Stream<Integer> */
Stream<Integer> stream1 = arrayList.stream();

/* Stream<Integer> → IntStream */
IntStream intStream = stream1.mapToInt(Integer::intValue);

/* IntStream → int[] */
int[] newArray = intStream.toArray();
```
<br>

```java
public static void main(String[] args) {

    List<User> userList = addDummyDate();

    userList.stream()
            .map(o -> o.getAge())
            .filter(age -> age > 30)
            .collect(Collectors.toList())
            .forEach(System.out::println);
}
```

<br>

#### ***<span style="color:#A0522D">boxed()</span>***

int, long, double 요소를 Integer, Long, Double 요소로 박싱해서 Stream을 생성합니다.

```java
Stream<Integer> intSteam1Boxed = intStream1.boxed();
```

<br>

#### ***<span style="color:#A0522D">정렬</span>***

> 이 부분은 개별 포스트로 따로 정리.

<br>

## <span style="color:gray">Stream 최종연산</span>

---

#### ***<span style="color:#A0522D">reduce()</span>***

스트림의 요소를 줄여 나가면서 수행하고 최종 결과를 반환한다.

처음 두 요소를 가지고 연산한 결과를 사용해 다음 요소와 연산한다.

초기값을 주는 경우는 초기값과 스트림의 초기값과 스트림의 첫 번째 요소로 연산을

시작하고, 연산한 결과를 사용해 다음 요소와 연산한다.

```java
public class StreamReduce {

    public static void main(String[] args) {

        int[] arr = {1,2,3};
        int result = Arrays.stream(arr).reduce(5, (a, b) -> a + b);
        System.out.println(result); // 11
    }
}
```