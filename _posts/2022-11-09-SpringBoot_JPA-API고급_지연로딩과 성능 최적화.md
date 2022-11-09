---
layout: post
title: API 개발 고급 - 지연로딩과 성능 최적화
categories: spring
tags: jpa
---

## <span style="color:gray">지연 로딩과 조회 성능 최적화</span>

---

#### <span style="background-color:black; color:white">V1: 엔티티를 직접 노출</span>

```java
@GetMapping("/api/v1/simple-orders")
public List<Order> ordersV1() {
    List<Order> all = orderRepository.findAll(new OrderSearch());
    for (Order order : all) {
        order.getMember().getName(); //Lazy 강제 초기화
        order.getDelivery().getAddress(); //Lazy 강제 초기환 }
    }
    return all;
}
```

• 엔티티를 직접 노출하는 것은 좋지 않다.

• Order 엔티티의 member와 delivery는 지연로딩이다. → **프록시 객체로 생성된다.**

<br>

그리고 가장 치명적인 문제가 있다. 기본적으로 jackson라이브러리는 프록시 객체를 

json으로 어떻게 생성해야 하는지 모른다. 자세히 에러를 살펴보자.

```txt
Could not write JSON: Infinite recursion (StackOverflowError)
(through reference chain: 
com.jpabook.jpashop.domain.Order["member"]
->com.jpabook.jpashop.domain.Member["orders"]
->org.hibernate.collection.internal.PersistentBag[0]
->com.jpabook.jpashop.domain.Order["member"]
->com.jpabook.jpashop.domain.Member["orders"]
...무한반복
```

위 에러 로그를 보면 Order가 Member 조회, 다시 Member의 Order조회, 

연관관계 끼리 조회를 **<span style="color:#FF7F50">무한 반복하는 치명적인 에러가 발생한다.</span>**


<img src = "/assets/img/jpa/활용2편/stackoverflow.png">

<br>

Hibernate5Module을 사용하면서 연관관계가 잡혀있는 필드중 한 곳에 

`@JsonIgnore`를 사용하면 해결이 되긴한다.

<br>

**<u>▷ 참고</u>**

참고로 **<span style="background-color:#F0E68C">지연로딩을 피하기 위해 즉시로딩을 설정하면 안된다!</span>**

즉시로딩 때문에 연관관계가 필요 없는 경우에도 데이터를 항상 조회해서 성능 문제가 

발생할 수 있기 때문이다. 

<br>

#### <span style="background-color:black; color:white">V2: 엔티티를 DTO로 변환</span>

```java
@GetMapping("/api/v2/simple-orders")
public Result<List<SimpleOrderDto>> orderV2() {
    // Order 엔티티 조회
    List<Order> orders = orderRepository.findAll(new OrderSearch());

    // Entity → DTO 
    List<SimpleOrderDto> collect = orders.stream()
            .map(SimpleOrderDto::of).collect(toList());

    return new Result<>(collect);
}
```
```java
@Getter @Setter
public class SimpleOrderDto {
    private Long orderId;
    private String name;
    private LocalDateTime orderDate;
    private OrderStatus orderStatus;
    private Address address;

    // Entity 데이터를 DTO 필드에 바인딩
    public SimpleOrderDto(Order order) {
        orderId = order.getId();                    //Lazy 초기화
        name = order.getMember().getName();
        orderDate = order.getOrderDate();
        orderStatus = order.getStatus();
        address = order.getDelivery().getAddress(); // Lazy 초기화
    }

    public static SimpleOrderDto of(Order order) {
        return new SimpleOrderDto(order);
    }
}
```

• 엔티티를 DTO로 변환하는 일반적인 방법이다.

<br>

이 방법의 문제는 쿼리가 **<span style="color:#FF7F50">1 + N + N 번</span>** 실행된는 점이다.

**<u>▷ Order 조회 쿼리 : 1번 발생</u>**

```sql
select
    order0_.order_id as order_id1_6_,
    order0_.delivery_id as delivery4_6_,
    order0_.member_id as member_i5_6_,
    order0_.order_date as order_da2_6_,
    order0_.status as status3_6_ 
from
    orders order0_ 
inner join
    member member1_ 
        on order0_.member_id=member1_.member_id
```

<br>

**<u>▷ 주문한 Member 조회 쿼리 : N(2)번 발생</u>**

```sql
select
    member0_.member_id as member_i1_4_0_,
    member0_.city as city2_4_0_,
    member0_.street as street3_4_0_,
    member0_.zipcode as zipcode4_4_0_,
    member0_.name as name5_4_0_ 
from
    member member0_ 
where
    member0_.member_id=4
```
```sql
select
    member0_.member_id as member_i1_4_0_,
    member0_.city as city2_4_0_,
    member0_.street as street3_4_0_,
    member0_.zipcode as zipcode4_4_0_,
    member0_.name as name5_4_0_ 
from
    member member0_ 
where
    member0_.member_id=11
```

<br>

**<u>▷ 주문의 Delivery 조회 쿼리 : N(2)번 발생</u>**

```sql
select
    delivery0_.delivery_id as delivery1_2_0_,
    delivery0_.city as city2_2_0_,
    delivery0_.street as street3_2_0_,
    delivery0_.zipcode as zipcode4_2_0_,
    delivery0_.status as status5_2_0_ 
from
    delivery delivery0_ 
where
    delivery0_.delivery_id=5
```
```sql
select
    delivery0_.delivery_id as delivery1_2_0_,
    delivery0_.city as city2_2_0_,
    delivery0_.street as street3_2_0_,
    delivery0_.zipcode as zipcode4_2_0_,
    delivery0_.status as status5_2_0_ 
from
    delivery delivery0_ 
where
    delivery0_.delivery_id=12
```

N번 실행 되는 이유는 최초에 Order를 조회할 때 member와 delivery가 프록시 

객체로 생성된다. 그리고 Entity 데이터를 DTO 필드에 바인딩할 때, 프록시 객체가

초기화 되면서 DB에 SELECT 쿼리가 나가는 것이다. 

<br>

이 예제에서는 2명의 Member가 각각 주문을 했기 때문에 총 5번의 쿼리가 나갔지만,

만약 한 명의 Member가 주문을 2번 했다면 총 **4번**의 쿼리가 나간다.

이는 최초에 프록시 member를 초기화 할 때 1차 캐시에 Member엔티티를 저장해두기 

때문에, 다음에도 똑같은 member를 사용할 때는 1차 캐시에서 데이터를 가져와서 

사용하기 때문이다.



<br>

#### <span style="background-color:black; color:white">V3: 엔티티를 DTO로 변환 - 페치 조인 최적화 </span>

V3은 V2에서 생기는 N+1 문제를 **<span style="background-color:#F0E68C">fetch join</span>** 을 활용해 최적화하는 방식이다.

> 컨트롤러 코드는 생략

```java
public List<Order> findAllWithMemberDelivery() {
    String jpql = "select o from Order o" +
                  " join fetch o.member m" +
                  " join fetch o.delivery d";
    return em.createQuery(jpql, Order.class).getResultList();
}
```

<br> 

생성된 쿼리는 아래와 같이 한 번에 Order, Member, Delivery를 조회한다.

기본적으로 inner join을 사용하며 `left join fetch` 를 명시해주면

`left outer join`으로 쿼리가 생성된다.

```sql
select
    order0_.order_id as order_id1_6_0_,
    member1_.member_id as member_i1_4_1_,
    delivery2_.delivery_id as delivery1_2_2_,
    order0_.delivery_id as delivery4_6_0_,
    order0_.member_id as member_i5_6_0_,
    order0_.order_date as order_da2_6_0_,
    order0_.status as status3_6_0_,
    member1_.city as city2_4_1_,
    member1_.street as street3_4_1_,
    member1_.zipcode as zipcode4_4_1_,
    member1_.name as name5_4_1_,
    delivery2_.city as city2_2_2_,
    delivery2_.street as street3_2_2_,
    delivery2_.zipcode as zipcode4_2_2_,
    delivery2_.status as status5_2_2_ 
from
    orders order0_ 
inner join
    member member1_ 
        on order0_.member_id=member1_.member_id 
inner join
    delivery delivery2_ 
        on order0_.delivery_id=delivery2_.delivery_id
```

<br>

비록 Order엔티티에 Member와 Delivery가 Lazy로 설정되어 있지만,

fetch join을 사용하면 fetch join이 우선권을 갖는다.

fetch join에 대한 자세한 내용은 <a href="https://gilbert9172.github.io/spring/2022/10/19/SpringBoot_JPA-Fetch-Join/" target="_blank">Fetch Join 정리 포스팅</a> 에 정리해뒀다.

<br>

#### <span style="background-color:black; color:white">V4: JPA에서 DTO로 바로 조회</span>

```java
public List<OrderSimpleQueryDto> findOrderDtos() {

    String jpql = 
            "select new com.jpabook.jpashop.api.model.read.OrderSimpleQueryDto(o.id, m.name, o.orderDate, o.status,d.address)" +
            " from Order o" +
            " join o.member m" +
            " join o.delivery d";

    return em.createQuery(jpql, OrderSimpleQueryDto.class).getResultList();
}
```

• 일반적인 SQL을 사용할 때 처럼 원하는 값을 선택해서 조회한다.

• `new` 명령어를 사용해서 JPQL의 결과를 즉시 DTO로 반환한다.

<br>

이 방법은 SELECT 절에서 원하는 데이터를 직접 선택하기 때문에 

`DB → App` 네크워크 용량을 최적화 할 수 있지만, 성능은 생각보다 미비하다.

<br>

그리고 직접 쿼리를 작성하기 때문에 기존에 Entity를 기반으로 조회하던

Repostiory대신 별도의 Repository를 만들어야 한다. 그리고 이렇게 새로 만든 

Repository에는 API 스펙에 맞춘 코드가 들어가기 때문에, Repository 재사용성이

떨어진다는 단점을 가지고 있다.

<br>

개인적으로 느낀점은 new 연산자 뒤에 패키지 명을 적어줘야 한다는 점이

쫌 별로였다. 실수를 유발할 수도 있고, 코드가 너무 길어 줄을 넘어가는

경우가 있었기 때문이다.

<br>

## <span style="color:gray">마무리하며...</span>

---

#### <span style="background-color:black; color:white">정리</span>

엔티티를 DTO로 변환하거나, DTO로 바로 조회하는 두 가지 방법을 살펴봤다.

두 방법 모두 장단점을 가지고 있다. 따라서 개발 상황에 맞게 적절한 선택을

하면 된다. 하지만 엔티티로 조회하면 리포지토리 재사용성도 좋고, 개발도

단순해진다. 

<br>

#### <span style="background-color:black; color:white">권장 방법</span>

⒈ 우선 엔티티를 DTO로 변환하는 방법을 사용한다.

⒉ 필요하면 `join fetch`로 성능을 최적화 한다. → 대부분의 성능이슈 해결

⒊ 그래도 안되면 DTO로 직접 조회하는 방식을 사용한다.

⒋ 최후의 방법은 직접 SQL을 짜서 개발하는 것이다.