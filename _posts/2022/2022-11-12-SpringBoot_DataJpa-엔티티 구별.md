---
layout: post
title: 엔티티 구별
categories: spring
tags: dataJpa
---

## <span style="color:gray">병합(merge)</span>

---

#### <span style="background-color:black; color:white">병합(merge)이란?</span>

우선 병합에 대해서 제대로 이해하고 있어야 한다. 

<a href="https://gilbert9172.github.io/spring/2022/11/08/SpringBoot_JPA-%EB%B3%80%EA%B2%BD%EA%B0%90%EC%A7%80%EC%99%80-%EB%B3%91%ED%95%A9/" target="_blank">병합(merge) 정리 포스팅</a>에 정리해뒀다.

<br>

## <span style="color:gray">새로운 엔티티를 판단하기</span>

---

#### <span style="background-color:black; color:white">기본 판단 전략</span>

• 식별자가 객체일 때 `null`로 판단

• 식별자가 자바 기본타입(primitive type)일 때 `0`으로 판단

• **<span style="background-color:#F0E68C">Persistable</span>** 인터페이스를 구현해서 판단 로직 변경 가능

<br>

**<u>▷ Persistable Interface</u>**

```java
public interface Persistable<ID> {

	@Nullable
	ID getId();

	boolean isNew();
}
```

<br>

#### <span style="background-color:black; color:white">@GeneratedValue 있을 때</span>

`@GeneratedValue` 어노테이션이 있을 때는 `save()` 메소드 호출시점에 식별자가 

없기 때문에 새로운 엔티티로 인식해서 정상 작동한다.

<br>

#### <span style="background-color:black; color:white">@GeneratedValue 없을 때</span>

`@GeneratedValue` 어노테이션이 없이 `@Id`만 사용해서 직접 식별자를 할당하면, 

```java
Item item = new Item("id")
itemRepository.save(item);
```

이미 식별자가 있다고 판단하여 아래 이미지에 있는 `em.merge()`를 호출한다.

<img src="/assets/img/dataJpa/save.png"><br>

merge는 우선 DB를 호출해서 값을 확인하고, DB에 값이 없으면 새로운 엔티티로

인지하므로 매우 비효율적이다.

<br>

## <span style="color:gray">직접 엔티티를 판단하기</span>

---

#### <span style="background-color:black; color:white">Persistable 구현</span>

`@GeneratedValue` 없을 때는 **<span style="background-color:#F0E68C">Persistable</span>** 인터페이스를 구현해서

새로운 엔티티 확인 여부를 직접 구현하게는 효과적이다.

<br>

```java
@Entity
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor(access = PROTECTED)
public class Item implements Persistable<String> {

    @Id
    private String id;
    
    @CreatedDate
    private LocalDateTime createdDate;
    
    public Item(String id) {
        this.id = id;
    }
    
    @Override
    public String getId() {
        return id; 
    }
    
    @Override
    public boolean isNew() {
        return createdDate == null;
    }
}
```

<br>

참고로 `@CreatedDate`을 조합해서 사용하면 이 필드로 새로운 엔티티 여부를 편리하게

확인할 수 있다. `@CreatedDate`에 값이 없으면 새로운 엔티티로 판단한다.