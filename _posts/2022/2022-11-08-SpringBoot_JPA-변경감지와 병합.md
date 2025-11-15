---
layout: post
title: 변경감지와 병합
categories: spring
tags: jpa
---

## <span style="color:gray">변경감지와 병합</span>

---

#### <span style="background-color:black; color:white">준영속 엔티티</span>

영속성 컨텍스트가 더는 관리하지 않는 엔티티를 말한다. 

임의로 만들어낸 엔티티도 기존 식별자를 가지고 있으면 준 영속 엔티티로 볼 수 있다.

<a href="https://gilbert9172.github.io/spring/2022/07/18/SpringBoot_JPA-%EC%98%81%EC%86%8D%EC%84%B1%EA%B4%80%EB%A6%AC/" target="_blank">▷ 준영속성 정리 포스팅</a>

<br>

#### <span style="background-color:black; color:white">준영속 엔티티를 수정하는 2가지 방법</span>

**<u>▷ 변경 감지(Dirty Checking) 기능 사용</u>**

```java
@Transactional
public void updateItem(UpdateItemDto updateItemDto) {
    Item findItem = itemRepository.findOne(updateItemDto.getId());
    findItem.updateDetails(updateItemDto);
}
```
```java
public void updateDetails(UpdateItemDto updateItemDto) {
    this.name = updateItemDto.getName();
    this.price = updateItemDto.getPrice();
    this.stockQuantity = updateItemDto.getStockQuantiry();
}
```

영속성 컨텍스트에서 엔티티를 다시 조회한 후에 데이터를 수정하는 방법이다.

더 자세한 내용은 <a href="https://gilbert9172.github.io/spring/2022/07/18/SpringBoot_JPA-%EC%98%81%EC%86%8D%EC%84%B1%EA%B4%80%EB%A6%AC/" target="_blank">변경감지 정리 포스팅</a>에 저번에 정리해두었다.

<br>

**<u>▷ 병합(merge) 사용</u>**

병합은 기존에 있는 엔티티의 값을 수정하는 것이다.

```java
public void save(Item item) {
    if (item.getId() == null) {
        em.persist(item);
    } else {
        em.merge(item);
    }
}
```

<br>

<img src="/assets/img/jpa/활용1편/병합.png">

병합의 동작방식은 아래와 같다.

`merge()`를 실행한다.

파라미터로 넘어온 준영속 엔티티의 식별자 값으로 1차 캐시에서 엔티티를 조회한다.

만약 1차 캐시에 엔티티가 없으면 DB에서 엔티티를 조회하고, 1차 캐시에 저장한다.

조회한 영속 엔티티(mergeMember)에 member 엔티티의 값을 채워넣는다.

이때 mergeMember의 모든 값을 member에 밀어 넣는다.

마지막으로 **영속상태인 mergeMember를** 반환하다.

<br>

3 Step으로 정리하자면,

⒈ 준영속 엔티티의 식별자 값으로 영속 엔티티를 조회한다.

⒉ 영속 엔티티의 값을 준영속 엔티티의 값으로 모두 교체한다.(병합)

⒊ 트랜잭션 커밋 시점에서 변경 감지 기능이 동작해서 DB에 UPDATE 쿼리 실행.

<br>

한 가지 주의해야 할 사항이 있다.

변경 감지 기능을 사용하면 원하는 속성만 변경할 수 있지만, 

병합을 사용하면 **<span style="background-color:#F0E68C">모든 속성이 변경된다.</span>** 만약 병합시 값이 없으면 null로 

업데이트가 될 위험도 있다. 왜냐면 병합은 모든 필드를 교체하기 때문이다.