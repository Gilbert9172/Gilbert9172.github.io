---
layout: post
title: Map Interface
categories: lang
tags: java
---

## <span style="color:gray">Map Interface</span>

---

#### <span style="background-color:black; color:white">HashMap</span>

<details>
<summary>예제 코드</summary>
<div markdown="1">

```java
public static void main(String[] args) {

    Map<String, String> mapTest = new HashMap<>();
    mapTest.put("Facebook", "USA5");
    mapTest.put("Facebook1", "USA4");
    mapTest.put("Facebook2", "USA3");
    mapTest.put("Facebook3", "USA2");
    mapTest.put("Facebook4", "USA1");
    
    for (Map.Entry<String, String> entry : mapTest.entrySet()) {
        System.out.println(entry.getKey() + ":" + entry.getValue());
    }

}

/**
 * Facebook1:USA4
 * Facebook:USA5
 * Facebook4:USA1
 * Facebook3:USA2
 * Facebook2:USA3
 */
```

</div>
</details>

<br>

**[ 특징 ]**

• 순서가 보장되지 않는다. 

• `hasCode()` 메서드를 사용해서 데이터를 저장한다.

• 다른 map에 비해 빠른 탐색 시간을 갖는다.

• `O(1)`의 시간복잡도를 갖는다.

• 다중 쓰레드 환경에서 <span style="color:red">Thread Safe 하지 않기 때문에</span> synchronized 처리가 필요하다. <a href="https://woooongs.tistory.com/67" target="_blank">(관련 포스팅)</a>

<br>

#### <span style="background-color:black; color:white">TreeMap</span>

<details>
<summary>예제 코드</summary>
<div markdown="1">

<br>

**[Comparator X]**

```java
public static void main(String[] args) {

    Map<String, String> mapTest = new TreeMap<>();
    mapTest.put("Facebook", "USA5");
    mapTest.put("Facebook1", "USA4");
    mapTest.put("Facebook2", "USA3");
    mapTest.put("Facebook3", "USA2");
    mapTest.put("Facebook4", "USA1");
    
    for (Map.Entry<String, String> entry : mapTest.entrySet()) {
        System.out.println(entry.getKey() + ":" + entry.getValue());
    }

}

/**
 * Facebook:USA5
 * Facebook1:USA4
 * Facebook2:USA3
 * Facebook3:USA2
 * Facebook4:USA1
 */
```

<br>

**[Comparator O]**

```java
public static void main(String[] args) {

    Map<String, String> mapTest = new TreeMap<>(Comparator.reverseOrder());
    mapTest.put("Facebook", "USA5");
    mapTest.put("Facebook1", "USA4");
    mapTest.put("Facebook2", "USA3");
    mapTest.put("Facebook3", "USA2");
    mapTest.put("Facebook4", "USA1");
    
    for (Map.Entry<String, String> entry : mapTest.entrySet()) {
        System.out.println(entry.getKey() + ":" + entry.getValue());
    }

}

/**
 * Facebook4:USA1
 * Facebook3:USA2
 * Facebook2:USA3
 * Facebook1:USA4
 * Facebook:USA5
 */
```

</div>
</details>

<br>

**[ 특징 ]**

• 입력된 key-value 쌍을 내부적으로 RedBlack-Tree로 저장하여 관리한다.

• 탐색, 추가, 삭제 모두 `O(logN)`의 시간복잡도를 갖는다.

• Comparator 인터페이스를 구현해서 사용자가 정렬된 순서를 조정할 수 있다.

• HashMap과 비교하면 좀 더 느린 속도를 갖는다.

<br>

#### <span style="background-color:black; color:white">LinkedHashMap</span>

<details>
<summary>예제 코드</summary>
<div markdown="1">

```java
public static void main(String[] args) {

    Map<String, String> mapTest = new LinkedHashMap<>();
    mapTest.put("Facebook", "USA5");
    mapTest.put("Facebook1", "USA4");
    mapTest.put("Facebook2", "USA3");
    mapTest.put("Facebook3", "USA2");
    mapTest.put("Facebook4", "USA1");
    
    for (Map.Entry<String, String> entry : mapTest.entrySet()) {
        System.out.println(entry.getKey() + ":" + entry.getValue());
    }

}

/**
 * Facebook:USA5
 * Facebook1:USA4
 * Facebook2:USA3
 * Facebook3:USA2
 * Facebook4:USA1
 */
```

</div>
</details>

<br>

**[ 특징 ]**

• 키의 순서는 삽입한 순서대로 정렬되어 있다.

• `Double-linked List`로 구현되어 있다.

• 모든 Map의 동작들을 제공하며 null 역시 허용한다.

• HashMap과 마찬가지로 동기화 처리가 되어있지 않기 때문에 <span style="color:red">Thread-Safe 하지 않다.</span>
 
<br>

#### <span style="background-color:black; color:white">HashTable</span>

**[ 특징 ]**

• HashMap의 특징을 가지고 있다. 

• HashMap보다는 느리다. 하지만 동기화된 HashMap 보다는 빠르다.

• null key, null value 모두 혀용하지 않는다.

• **<span style="background-color:#F0E68C">동기화를 지원한다 = Thread Safe하다</span>**

<br>

## <span style="color:gray">공부에 참고한 링크</span>

---

• <a href="https://soft.plusblog.co.kr/70" target="_blank">HashMap, TreeMap, LinkedHashMap 비교, 차이점</a>

• <a href="https://woooongs.tistory.com/67" target="_blank">HashMap 과 동시성</a>

• <a href="https://wonyong-jang.github.io/java/2020/10/16/Java-LinkedHashMap.html" target="_blank">LinkedHashMap</a>