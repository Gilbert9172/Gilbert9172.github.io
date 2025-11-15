---
layout: post
title: Iterator, ListIterator, Enumeration
categories: lang
tags: java
---

## <span style="color:gray">🔎 Iterator, ListIterator, Enumeration</span>

---

> 컬렉션에 저장된 데이터를 접근하는데 사용되는 인터페이스

• Enumeration은 Iterator의 구버전이다.

• ListIterator는 Iterator의 접근성을 향상시킨 것(양방향)

<br>

|Iterator 메서드|설명|
|---------------|----|
|boolean hasNext()|읽어 올 요소가 남아있는지 확인.|
|Object next()|다음 요소를 읽어온다.|

<br>

|Enumeration 메서드|설명|
|---------------|----|
|boolean hasMoreElements()|읽어 올 요소가 남아있는지 확인.|
|Object nextElemenet()|다음 요소를 읽어온다.|

<br>

## <span style="color:gray">🔎 Iterator</span>

---

> 컬렉션에 저장된 요소들을 읽어오는 방법을 표준화한 것.

#### ***interface Iterator***

```java
public interface Iterator<E> {

	boolean hasNext();

	default void remove() {
		throw new UnsupportedOperationException("remove");
	}

	default void forEachRemaining(Consumer<? super E> action) {
		Objects.requireNonNull(action);
		while(hasNext())
			action.accept(next());	
	}
}

```

<br>

#### ***사용법***


사용법은 컬렉션에 `iterator()`를 호출해서 Iterator를 구현한 객체를 얻어서 사용한다.

```java
List<Integer> list = new ArrayList<>();
Iterator it = list.iterator();

while(it.hasNext()) {
	System.out.println(it.next());
}
```

<br>

## <span style="color:gray">🔎 Map과 Iterator</span>

---


Map에는 `Iterator()`가 없다. (`Iterator()`는 Collection 인터페이스에 있다.)

그렇다면 Map은 어떻게 Iterator로 만들수 있을까??

정답은 바로 ***<span style="background-color:yellow">keySet(), entrySet(), values()를 호출하면 된다!!!</span>***

> 💡 오늘 코딩테스트 문제에서 이 부분이 활용됐다.

```java
Iterator it = map.keySet().iterator();
Iterator it = map.entrySet().iterator();
Iterator it = map.values().iterator();
```