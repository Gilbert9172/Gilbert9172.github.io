---
layout: post
title: API 개발 고급 - 컬렉션 조회 최적화
categories: spring
tags: jpa
---

## <span style="color:gray">컬렉션 조회 최적화</span>

---

#### <span style="background-color:black; color:white">V1: 엔티티를 직접 노출</span>

```java
@GetMapping("/api/v1/orders")
public List<Order> ordersV1() {
    List<Order> all = orderRepository.findAll(new OrderSearch());
    for (Order order : all) {
        order.getMember().getName(); //Lazy 강제 초기화
        order.getDelivery().getAddress(); //Lazy 강제 초기환

        List<OrderItem> orderItems = order.getOrderItems();
        orderItems.stream().forEach(o -> o.getItem().getName()); //Lazy 강제초기화
    }
    return all;
}
```

앞선 <a href="https://gilbert9172.github.io/spring/2022/11/09/SpringBoot_JPA-API%EA%B3%A0%EA%B8%89_%EC%A7%80%EC%97%B0%EB%A1%9C%EB%94%A9%EA%B3%BC-%EC%84%B1%EB%8A%A5-%EC%B5%9C%EC%A0%81%ED%99%94/" target="_blank">지연로딩과 성능 최적화 포스팅</a>과 내용은 비슷하다.

한 가지 차이점은 이번 포스팅에서는 `orderItems`라는 컬렉션을 루프를 돌면서

초기화를 해준다는 점이다.

<br>

#### <span style="background-color:black; color:white">V2: 엔티티를 DTO로 변환</span>

```java
@GetMapping("/api/v2/orders")
public Result<List<OrderDto>> ordersV2() {
    List<OrderDto> collect = orderRepository.findAll(new OrderSearch()).stream()
            .map(OrderDto::new).collect(toList());
    return new Result<>(collect);
}
```
```java
@Getter @Setter
public class OrderDto {

    private Long orderId;
    private String name;
    private LocalDateTime orderDate;
    private OrderStatus orderStatus;
    private Address address;
    private List<OrderItemDto> orderItems;

    public OrderDto(Order order) {
        orderId = order.getId();
        name = order.getMember().getName();
        orderDate = order.getOrderDate();
        orderStatus = order.getStatus();
        address = order.getDelivery().getAddress();
        orderItems = order.getOrderItems().stream().
                map(OrderItemDto::new).collect(toList());
    }

}
```
```java
@Getter @Setter
public class OrderItemDto {

    private String itemName;    // 상품 명
    private int orderPrice;     // 주문 가격
    private int count;          // 주문 수량

    public OrderItemDto(OrderItem orderItem) {
        this.itemName = orderItem.getItem().getName();
        this.orderPrice = orderItem.getOrderPrice();
        this.count = orderItem.getCount();
    }

}
```

Order 엔티티를 OrderDto로 변환하는 작업은 똑같다. 여기서 주의해야 할 부분은 

OrderDto로 변환 작업을 할 때 **<span style="background-color:#F0E68C">컬렉션인 OrderItems도 루프를 돌려서 별도의</span>**

**<span style="background-color:#F0E68C">DTO로 변경해줘야 한다.</span>**

<br>

이 방법도 지연로딩으로 너무 많은 쿼리문이 수행된다.


<br>

#### <span style="background-color:black; color:white">V3: 엔티티를 DTO로 변환 - 페치 조인 최적화</span>

```java
public List<Order> findAllWithItem() {
    String jpql = "select distinct o from Order o" +
                  " join fetch o.member m" +
                  " join fetch o.delivery d" +
                  " join fetch o.orderItems oi" +
                  " join fetch oi.item i";
    return em.createQuery(jpql, Order.class).getResultList();
}
```

• `엔티티 → DTO` 변환 작업은 V2와 동일하다.

• `join fetch`로 SQL이 **한 번**만 실행된다.

<br>

여기서 `DISTINCT`를 사용한 이유는 일대다 조건이 있으므로 DB의 row가 증가한다.

<img src="/assets/img/jpa/활용2편/일대다뻥튀기.png">

JPA의 `DISTINCT`는 SQL에 distinct를 추가하고, 더해서 엔티티가 조회되면

애플리케이션 중복도 걸러준다.

따라서 위 예에서 join fetch 사용시 중복되는 엔티티를 제거해주는 것이다.

<br>

단점으로 페이징이 불가능 하다는 점이다. 한 번 페이징을 걸어봤다.

```java
public List<Order> findAllWithItem() {
    String jpql = "select distinct o from Order o" +
                    " join fetch o.member m" +
                    " join fetch o.delivery d" +
                    " join fetch o.orderItems oi" +
                    " join fetch oi.item i";
    return em.createQuery(jpql, Order.class)
            .setFirstResult(1).setMaxResults(100).getResultList();
}
```
```sql
select 
    distinct ...
from
    orders order0_ 
inner join
    member member1_ 
        on order0_.member_id=member1_.member_id 
inner join
    delivery delivery2_ 
        on order0_.delivery_id=delivery2_.delivery_id 
inner join
    order_item orderitems3_ 
        on order0_.order_id=orderitems3_.order_id 
inner join
    item item4_ 
        on orderitems3_.item_id=item4_.item_id
```

생성된 쿼리를 보면 페이징 관련 SQL문이 빠졌다...!

원래 기대했던 쿼리는 아래와 같다.

```sql
-- 위는 동일
limit 100 offset 1;
```

<br>

그리고 로그를 보면 아래와 같은 경고문을 제공해준다.

<img src = "/assets/img/jpa/활용2편/메모리오류.jpg">

결국 하이버네이트는 모든 데이터를 DB에서 읽어오고, **<span style="background-color:#F0E68C">메모리에서 페이징을</span>**

**<span style="background-color:#F0E68C">하는 것이다.</span>** 지금은 예시라 데이터가 적지만, 실제로 데이터가 매우 많은

환경에서 위와 같이 작업하면 **<span style="color:red">메모리초과 에러</span>** 가 생길것 이다.

<br>

참고로 컬렉션 join fetch는 딱 1개만 사용할 수 있다. 컬렉션이 둘 이상에서

join fetch를 사용하면 데이터가 부정합하게 조회될 수 있다.

<br>

#### <span style="background-color:black; color:white">V3-1: 엔티티를 DTO로 변환 - 페이징과 한계 돌파</span>

V3-1에서는 `페이징 + 컬렉션 엔티티 조회` 문제를 해결하는 법을 알아보자!

아래의 해결방법을 잘 이해하면 대부분의 문제는 해결 가능하다.
 
<br>

**<u>▷ Step 1.</u>**

먼저 **XToOne** 관계를 모두 `join fetch` 한다. 

**XToOne** 관계는 row수를 증가시키지 않으므로 페이징 쿼리에 영향을 주지 않는다.

<br>

**<u>▷ Step 2.</u>**

컬렉션은 지연 로딩으로 조회한다.

<br>

**<u>▷ Step 3.</u>**

지연로딩 성능 최적화를 위해 아래와 같이 최적화 설정을 추가해준다.

|설정|설명|
|----|----|
|`hibernate.default_batch_fetch_size = n`|글로벌 설정|
|`@BatchSize(size = n)`|개별 설정|

위 옵션을 사용하면 컬렉션이나, 프록시 객체를 한꺼번에 설정한 size만큼 

**<span style="background-color:#F0E68C">IN쿼리로 조회한다.</span>** 참고로 개별 설정을 할 때 컬렉션이 아닌 경우에는 

엔티티에 어노테이션을 붙혀줘야 한다. 

```java
@BatchSize(size = 100) // ← 이 곳에 작성
@Entity
public class TestClass {
    //...
}
```

<br>

이제 코드로 직접 확인해보자.

```java
@GetMapping("/api/v3.1/orders")
public Result<List<OrderDto>> ordersV3_page(
        @RequestParam(value = "offset", defaultValue = "0") int offset,
        @RequestParam(value = "limit", defaultValue = "100") int limit) {
    List<OrderDto> orders =  orderRepository.findAllWithMemberDelivery(offset, limit).stream()
            .map(OrderDto::new).collect(toList());
    return new Result<>(orders);
}
```

```java
public List<Order> findAllWithMemberDelivery(int offset, int limit) {
    
    //→ XToOne 관계만 join fetch
    String jpql = "select o from Order o" +
            " join fetch o.member m" +
            " join fetch o.delivery d";

    return em.createQuery(jpql, Order.class)
            .setFirstResult(offset)
            .setMaxResults(limit)
            .getResultList();
}
```

<br>

아래는 실행된 쿼리 결과이다. 

비록 V3 보다는 2개의 쿼리가 더 나갔지만, `페이징 + 컬렉션 엔티티 조회` 문제를 해결했다.

```sql
select
    ---...
from
    orders order0_ 
inner join
    member member1_ 
        on order0_.member_id=member1_.member_id 
inner join
    delivery delivery2
        on order0_.delivery_id=delivery2_.delivery_id 
limit 100 offset 1
```
```sql
select 
    --...
from 
    order_item orderitems0_ 
where 
    orderitems0_.order_id in (4, 11);
```
```sql
select 
    --...
from 
    item item0_
where 
    item0_.item_id in (4, 11);
```

<br>

#### <span style="background-color:black; color:white">V4: JPA에서 DTO로 바로 조회</span>

> <em>단건 조회에서 많이 사용하는 방식</em>

이 방법은 조금 코드가 복잡하다는 느낌이 들었다.

우선 이 방법 또한 엔티티에 바인딩 하는 것이 아닌 별도의 DTO에 데이터를

바인딩하는 것이기 때문에 별도의 Repository가 필요하다.

```java
@Repository
@RequiredArgsConstructor
public class OrderQueryRepository {

    private final EntityManager em;

    public List<OrderQueryDto> findOrderDtos() {
        List<OrderQueryDto> result = findOrders(); // 루트 쿼리 1번

        /** 
         * 조회한 주문(OrderQueryDto)의 Id값을 사용해서
         * 주문한 상품(OrderItemQueryDto)을 컬렉션으로 찾아서
         * OrderQueryDto.orderItems에 set해주기
         */
        result.forEach(o -> {
            List<OrderItemQueryDto> orderItems = findOrderItems(o.getOrderId()); // 컬렉션 쿼리 N번
            o.setOrderItems(orderItems);
        });
        return result;
    }

    // 모든 주문을 OrderQueryDto로 조회 하는 쿼리
    public List<OrderQueryDto> findOrders() {
        String jpql = 
                "select new com.jpabook.jpashop.api.model.order.OrderQueryDto(o.id, m.name, o.orderDate, o.status, d.address) " +
                " from Order o" +
                " join o.member m" +
                " join o.delivery d";
        return em.createQuery(jpql, OrderQueryDto.class).getResultList();
    }

    // 각 주문의 주문상품을 QueryOrderItemDto로 조회
    private List<OrderItemQueryDto> findOrderItems(Long orderId) {
        String jpql = 
                      "select new com.jpabook.jpashop.api.model.order.OrderItemQueryDto(oi.order.id, i.name, oi.orderPrice, oi.count) " +
                      " from OrderItem oi" +
                      " join oi.item i" +
                      " where oi.order.id = :orderId";
        return em.createQuery(jpql, OrderItemQueryDto.class)
            .setParameter("orderId", orderId).getResultList();
    } 
}
```

<br>

`OrderQueryDto` 클래스의 생성자에 컬렉션은 파라미터로 받지 않는다.

추후에 식별자(ORDER_ID)로 컬렉션만 따로 조회해서 setter로 값을 

넣어줄 것이기 때문이다.

```java
@Getter @Setter
public class OrderQueryDto {

    private Long orderId;
    private String name;
    private LocalDateTime orderDate;
    private OrderStatus orderStatus;
    private Address address;
    private List<OrderItemQueryDto> orderItems;

    public OrderQueryDto(Long orderId, String name, LocalDateTime orderDate,
                         OrderStatus orderStatus, Address address) {
        this.orderId = orderId;
        this.name = name;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.address = address;
    }

}
```
```java
@Getter @Setter
public class OrderItemQueryDto {

    @JsonIgnore
    private Long orderId;
    private String itemName;
    private int orderPrice;
    private int count;

    public OrderItemQueryDto(Long orderId, String itemName, int orderPrice, int count) {
        this.orderId = orderId;
        this.itemName = itemName;
        this.orderPrice = orderPrice;
        this.count = count;
    }

}
```

<br>

코드는 확인했으니 이제 어떤 쿼리가 몇 번 나가는지 확인해 보자.

|Query|설명|횟수|
|-----|----|----|
|`findOrders()`|주문 조회 쿼리|1번|
|`findOrderItems()`|주문상품 조회 쿼리|N번|

이 예제의 경우는 **<span style="color:#FF7F50">주문조회 쿼리가 1번</span>** 나가고, 

루트 쿼리에서 나온 주문의 갯수만큼 **<span style="color:green">주문상품 조회 쿼리가 2번</span>** 나간다.

즉, `주문 조회 쿼리` 결과의 길이만큼 쿼리가 더 나간다고 보면 될 것 같다.

<br>

#### <span style="background-color:black; color:white">V5: JPA에서 DTO 직접 조회 - 컬렉션 조회 최적화</span>

> <em>데이터를 한꺼번에 처리할 때 많이 사용하는 방식</em>

```java
public List<OrderQueryDto> findAllByDto_optimization() {
    
    // Step 1
    List<OrderQueryDto> result = findOrders();
    
    // Step 2
    List<Long> orderIds = toOrderIds(result);
    
    // Step 3
    Map<Long, List<OrderItemQueryDto>> orderItemMap = findOrderItemMap(orderIds);

    // Step 4
    result.forEach(o -> o.setOrderItems(orderItemMap.get(o.getOrderId())));

    return result;
}
```

<br>

코드를 한 줄 한 줄 살펴보자.

**<u>▷ Step 1</u>**

우선 `findOrders()`로 DB의 모든 주문을 조회한다. 

```java
List<OrderQueryDto> result = findOrders();
```

<br>

**<u>▷ Step 2</u>**

그리고 `toOrderIds()`메소드를 호출하여 Order의 식별자(order_id)로 구성된 

컬렉션을 생성한다.

```java
List<Long> orderIds = toOrderIds(result);
```
```java
private List<Long> toOrderIds(List<OrderQueryDto> result) {
    return result.stream()
            .map(OrderQueryDto::getOrderId)
            .collect(Collectors.toList());
}
```

<br>

**<u>▷ Step 3</u>**

Step 2에서 뽑은 식별자 컬렉션 `orderIds`를 `findOrderItemMap()` 메소드의

파라미터로 넘겨준다.

```java
Map<Long, List<OrderItemQueryDto>> orderItemMap = 
                                        findOrderItemMap(orderIds);
```

`findOrderItemMap()` 메소드 내부의 동작과정은 다음과 같다.

⒈ 전달 받은 파라미터 orderIds를 **<span style="color:#FF7F50">쿼리의 IN절</span>** 파라미터로 받는다.

⒉ 반환된 결과 orderItems를 `식별자 : 컬렉션` 구조의 Map으로 가공해준다.

```java
private Map<Long, List<OrderItemQueryDto>> findOrderItemMap(List<Long> orderIds) {
    String jpql = 
            "select new com.jpabook.jpashop.api.model.order.OrderItemQueryDto(oi.order.id, i.name, oi.orderPrice, oi.count) " +
            " from OrderItem oi" +
            " join oi.item i" +
            " where oi.order.id in :orderIds"; // ← 이 부분이 핵심

    List<OrderItemQueryDto> orderItems = em.createQuery(jpql, OrderItemQueryDto.class)
            .setParameter("orderIds", orderIds).getResultList();

    return orderItems.stream().collect(Collectors.groupingBy(OrderItemQueryDto::getOrderId));
}
```

<br>

**<u>▷ Step 4</u>**

order 컬랙션인 `result`를 루프로 돌면서 orderItems 필드에 데이터를 set해준다.

```java
result.forEach(o -> o.setOrderItems(orderItemMap.get(o.getOrderId())));
```

<br>

**<u>▷ 생성된 SQL 확인해보기</u>**

우선 컬렉션 orderItems를 제외한 데이터를 가져오는 쿼리가 1번 나간다.

```sql
select
    --...
from
    orders order0_ 
inner join
    member member1_ 
        on order0_.member_id=member1_.member_id 
inner join
    delivery delivery2_ 
        on order0_.delivery_id=delivery2_.delivery_id
```

그리고 IN절의 파라미터로 넘어온 식별자 컬렉션을 조회하는 쿼리가 1번 나간다.

```sql
select
    --...
from order_item orderitem0_ 
inner join item item1_ 
    on orderitem0_.item_id=item1_.item_id 
where orderitem0_.order_id in (4 , 11); -- ← 이 부분이 핵심
```

1번의 메인 쿼리, 1번의 컬렉션 쿼리로 쿼리가 총 2번 생성됐다.

<br>

V5 방법은 ToOne 관계들을 먼저 `fetch join`을 통해서 조회하고, 

여기서 얻은 식별자 컬렉션 `orderIds`로 ToMany 관계인 OrderItems를

한 번에 조회 했다. 그리고 Map을 사용해서 매칭 성능을 향상 시켰다

> <em>Map의 시간 복잡도 : O(1)</em>

<br>

#### <span style="background-color:black; color:white">V6: JPA에서 DTO로 직접 조회, 플랫 데이터 최적화</span>

```java
@Getter @Setter
@EqualsAndHashCode(of = "orderId")
public class OrderQueryDto {
    //...
}
```
```java
public List<OrderFlatDto> findAllByDto_flat() {
    String jpql =
            "select new com.jpabook.jpashop.api.model.order.OrderFlatDto(o.id, m.name, o.orderDate, o.status, d.address, i.name, oi.orderPrice, oi.count)" +
            " from Order o" +
            " join o.member m" +
            " join o.delivery d" +
            " join o.orderItems oi" +
            " join oi.item i";

    return em.createQuery(jpql, OrderFlatDto.class).getResultList();
}
```
```java
@GetMapping("/api/v6/orders")
public List<OrderQueryDto> ordersV6() {
    List<OrderFlatDto> flats = orderQueryRepository.findAllByDto_flat();

    Set<Map.Entry<OrderQueryDto, List<OrderItemQueryDto>>> entries = flats.stream()
        .collect(
            groupingBy(
                    o ->
                        new OrderQueryDto(
                                o.getOrderId(),
                                o.getName(),
                                o.getOrderDate(),
                                o.getOrderStatus(),
                                o.getAddress()
                        ),
                    mapping(o ->
                                new OrderItemQueryDto(
                                        o.getOrderId(),
                                        o.getItemName(),
                                        o.getOrderPrice(),
                                        o.getCount()),
                                toList()
                    )
            )).entrySet();

    List<OrderQueryDto> collect = entries.stream().map(e ->
        new OrderQueryDto(
                e.getKey().getOrderId(),
                e.getKey().getName(),
                e.getKey().getOrderDate(),
                e.getKey().getOrderStatus(),
                e.getKey().getAddress(),
                e.getValue()
        )
    ).collect(toList());

    return collect;
}
```

우선 이 방법은 연관관계를 고려하지 않고 join을 통해 모든 데이터를 조회한다.

여기서 DB row가 증가하게 된다(뻥튀기). 이렇게 가져온 결과에서 DTO의 필드에 맞게

데이터를 가공하면 된다.

<br>

당연히 모든 엔티티를 join해서 조회했기 때문에 쿼리는 1번만 나간다.

하지만 join으로 인해 DB에서 어플리케이션에 전달되는 데이터에 중복 데이터가

추가되므로 상황에 따라 V5 보다 더 느릴수 있다.

그리고 위에 코드에서도 보이듯이 어플리케이션 레벨에서 추가적인 데이터 가공이

필수적이다. 마지막으로 이 방법은 페이징이 불가능하다.

이유는 일대다 관계를 join 했기 때문에 데이터 row수가 늘어나기 때문이다.

<br>

## <span style="color:gray">마무리하며...</span>

---

#### <span style="background-color:black; color:white">권장 순서</span>

⒈ 엔티티 조회 방식으로 우선 접근

- join fetch로 쿼리 수를 최적화
- 컬렉션 최적화 (페이징 필요 O : `BatchSize` / 페이징 필요 X : `join fetch`)


⒉ 엔티티 조회 방식으로 해결이 안되면 다이렉트 DTO조회 방법 사용

⒊ 다이렉트 DTO조회 방식으로도 해결이 안되면 `NativeSQL` or `스프링 JdbcTemplate`

<br>

#### <span style="background-color:black; color:white">참고</span>

**<span style="color:green">엔티티 조회 방식은</span>** `join fetch`나, `BatchSize` 같이 **<span style="color:green">코드를 거의 수정하지 않고</span>**

옵션만 약간 변경해서 다양한 성능 최적화를 시도할 수 있다. 

<br>

반면에 **<span style="color:#FF7F50">DTO를 직접 조회하는 방식은</span>** 성능을 최적화 하거나 성능 최적화 방식을 

변경할 때 **<span style="color:#FF7F50">많은 코드를 변경해야 한다.</span>**

적절한 선택은 개발자의 몫이다.