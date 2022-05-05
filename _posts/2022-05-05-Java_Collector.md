---
layout: post
title: Collector
categories: lang
tags: java
---

## <span style="color:gray">collect()와 Collectors</span>

***▸ **`collect()`** 는 Collector를 매개변수로 하는 스트림의 <span style="background-color:yellow">최종연산</span>***

***▸ **`Collector`** 는 `collect()`에 필요한 메서드를 정의해 높은 <span style="background-color:yellow">인터페이스</span>***

***▸ **`Collectors`** 는 다양한 기능의 컬렉터(<span style="background-color:yellow">Collector를 구현한 클래스</span>)를 제공***

---

<br>

```java
List<String> names = stuStream.map(Student::getName)            // Stream<Student> → Stream<String>
                              .collect(Collectors.toList());    // Stream<String> → List<String>

ArrayList<String> list = naems.stream()
                              .collect(Collectors.toCollection(ArrayList::new));

// toMap(key값, value값)
Map<String, Person> map = personStream.collect(Collectors.toMap(p -> p.getRegId(), p -> p);

```
---