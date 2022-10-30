---
layout: post
title: 고급 매핑
categories: spring
tags: jpa
---

## <span style="color:gray">상속관계 매핑</span>

---

• **<span style="background-color:#F0E68C">객체의 상속구조</sapn>** 와 **<span style="background-color:#F0E68C">DB의 슈퍼타입-서브타입 관계</sapn>** 를 매핑

• 관계형 데이터베이스는 상속 관계가 없다.

• 슈퍼타입-서브타입 관계라는 `논리 모델링 기법`이 객체 상속과 유사하다.

<br>

슈퍼타입-서브타입 `논리모델`을 실제 `물리 모델`로 구현하는 방법은 아래와 같다.

|방법|전략|주요 어노테이션|
|----|----|---------------|
|각각 테이블로 변환|조인 전략|JOINED|
|통합 테이블로 변환|단일 테이블 생성 전략(default)|SINGLE_TABLE|
|서브타입 테이블로 변환|구현 클래스마다 테이블 생성 전략|TABLE_PER_CLASS|

<br>

## <span style="color:gray">조인 전략</span>

---

#### <span style="background-color:black; color:white">예시 코드</span>

<img src="/assets/img/jpa/고급매핑/스크린샷 2022-10-30 오후 10.53.22.png">

위 이미지와 같이 DB에 ITEM, ALBUM, MOVIE, BOOK 테이블이 생성된다.

그리고 이 테이블들은 외래키인 `ITEM_ID`를 통해서 **<span style="background-color:#F0E68C">조인 전략</span>** 이 수행된다.

```java
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "ITEM_TYPE")
public class Item {

    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private int price;
}
```
```java
@Entity
@DiscriminatorValue("M")
public class Movie extends Item {
    private String director;
    private String actor;
    private String name;
    private int price;
}
```

<br>

#### <span style="background-color:black; color:white">DB 저장, 조회</span>

**<u>▷ 저장</u>**

```java
Movie movie = new Movie();
movie.setDirector("감독A");
movie.setActor("배우A");
movie.setName("영화A");
movie.setPrice(10000);
em.persist(movie);
```

DB 테이블에는 아래와 같이 데이터가 들어가게 된다. ID 컬럼이 외래키가 된다.

|ITEM_TYPE|ID|NAME|PRICE|
|---------|--|----|-----|
|M|1|영화A|10000|

|ACTOR|DIRECTOR|ID|
|-----|--------|--|
|배우A|감독A|1|

<br>

**<u>▷ 조회</u>**

내부적으로 조인을 하여 쿼리를 날린다.

```java
Movie findMovie = em.find(Movie.class, movie.getId());
```
```sql
select
    movie0_.id as id1_5_0_,
    movie0_1_.name as name2_5_0_,
    movie0_1_.price as price3_5_0_,
    movie0_.actor as actor1_8_0_,
    movie0_.director as director2_8_0_ 
from
    Movie movie0_ 
inner join ItemPrac movie0_1_ 
    on movie0_.id=movie0_1_.id 
where
    movie0_.id=?
```

<br>

#### <span style="background-color:black; color:white">어노테이션 설명</span>

|어노테이션|설명|비고|
|----------|----|----|
|@Inheritance(strategy = InheritanceType.JOINED)|JOIN전략||
|@DiscriminatorColumn(name = "ITEM_TYPE")|DTYPE 컬럼 생성|있는게 좋다.|
|@DiscriminatorValue("M")|DTYPE 컬럼에 들어갈 엔티티 이름의 별칭|

<br>

#### <span style="background-color:black; color:white">장단점</span>

|장점|단점|
|----|----|
|테이블 정규화|조회 시 조인을 많이 사용, 성능저하 → 엄청 저하되진 않음|
|외래 키 참조 무결성 제약조건 활용가능|조회 쿼리가 복잡함|
|저장공간 효율화|데이터 저장시 INSERT SQL 2번 호출 → 큰 단점 아님|

<br>

## <span style="color:gray">단일 테이블 전략</span>

---

#### <span style="background-color:black; color:white">예시 코드</span>

<img src="/assets/img/jpa/고급매핑/스크린샷 2022-10-30 오후 10.54.53.png">

위 이미지와 같이 하나의 ITEM이라는 테이블에 모든 컬럼이 다 들어간다.

```java
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public class Item {

    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private int price;
}
```

- `@DiscriminatorColumn` 없어도 DTYPE 컬럼 생성

<br>

#### <span style="background-color:black; color:white">장단점</span>

|장점|단점|
|----|----|
|조인이 필요 없으므로 일반적으로 조회 성능이 빠름|자식 엔티티가 매핑한 컬럼은 모두 Null허용|
|조회 쿼리가 단순|단일 테이블에 모든 것을 저장하므로 테이블이 커짐(성능 저하-캐바캐)|

<br>

## <span style="color:gray">구현 클래스마다 테이블 전략</span>

**<span style="color:red">이 전략은 데이터베이스 설계자와 ORM 전문가 둘 다 추천X</span>**

---

#### <span style="background-color:black; color:white">예시 코드</span>

<img src="/assets/img/jpa/고급매핑/스크린샷 2022-10-30 오후 10.55.54.png">

각각 ALBUM, MOVIE, BOOK 테이블이 생성이 되는데, 부모 클래스의 필드(id,name,price)가 

하위 클래스에 모두 중복으로 들어가게 된다. 그리고 **<span style="background-color:#F0E68C">ITEM 테이블이 생성되지 않는다.</span>**

```java
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class Item {

    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private int price;
}
```
<img src = "/assets/img/jpa/고급매핑/TABLE-PER-CLASS.png">

<br>

#### <span style="background-color:black; color:white">장단점</span>

|장점|단점|
|----|----|
|서브 타입을 명확하게 구분해서 처리할 때 효과적|여러 자식 테이블을 함께 조회할 때 성능이 느림(UNION SQL 필요)|
|not null 제약조건 사용 가능|자식 테이블을 통합해서 쿼리하기 어려움|

이 전략은 데이터를 삽입할 때 문제가 되지 않는다. 그런데 Item 타입으로 조회할 때, 

`UNION ALL`로 Item을 상속 받은 모든 테이블을 조회한다. 따라서 성능 저하가 초래된다.

<br>

## <span style="color:gray">정리</span>

---

기본적으로 `JOIN전략`과 `단일 테이블 전략`을 생각하면서 개발을 하고 DBA와 고민해서

선택을 하는게 좋다. 추천은 **<span style="background-color:#F0E68C">기본적으론 JOIN전략</span>** 을 베이스로 가져가고,

**<span style="background-color:#F0E68C">만약 테이블이 단순하고 확장 가능성이 없다고 판단되면 단일 테이블 전략을 가져가는게 좋다.</span>**

어떤 걸 선택하든 장단점은 있기 때문에 상황에 맞춰 적절한 전략을 선택해야 한다.
