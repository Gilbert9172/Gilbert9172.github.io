---
layout: post
title: 다양한 연관관계 매핑
categories: spring
tags: jpa
---

## <span style="color:gray">다대일 [N:1]</span>

#### 다대일 단방향

***특징***

✔︎ 가장 많이 사용하는 연관관계

✔︎ 일대다의 반대

<br>

#### 다대일 양방향

***특징***

✔︎ 외래 키가 있는 쪽이 연관관계의 주인

✔︎ 양쪽을 서로 참조하도록 개발

다대일의 양방향 관계는 객체에서 필드만 추가하면 된다. 

DB테이블에는 아무런 영향을 주지 않는다.

```java
@Entity
public class Member {

    @Id @GeneratedValue
    @Column(name = "MEMBER_ID")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "TEAM_ID")
    private Team team;
}
```
```java
@Entity
public class Team {
    
    @Id @GeneratedValue
    @Column(name = "TEAM_ID")
    private Long id;

    @OneToMany(mappedBy = "team")
    private List<Member> members = new ArrayList<>();
}
```

---

<br>

## <span style="color:gray">일대다 [1:N]</span>

#### 일대다 단방향

> 권장하지 않는 모델

***특징***

✔︎ Update 쿼리가 한 번더 나간다.

✔︎ 일대다 단방향은 일대다(1:N)에서 일(1)이 연관관계의 주인

✔︎ DB 테이블에서 일대다 관계는 항상 다(N) 쪽에 외래 키가 있음.

✔︎ 객체와 테이블의 차이 때문에 반대편 테이블의 외래 키를 관리하는 특이한 구조

✔︎ @JoinColumn을 꼭 사용해야 한다.

✔︎ @JoinColumn을 사용하지 않으면 중간에 테이블이 하나 추가됨.

```java
@Entity
public class Member {

    @Id @GeneratedValue
    @Column(name = "MEMBER_ID")
    private Long id;
}
```

```java
public class Team {
    
    @Id @GeneratedValue
    @Column(name = "TEAM_ID")
    private Long id;

    @OneToMany
    @JoinColumn(name = "TEAM_ID")
    private List<Member> members = new ArrayList<>();
}
```

***<span style="background-color:yellow">다대일 양방향 매핑을 사용하자!!!</span>***

<br>

#### 일대다 양방향

***특징***

✔︎ 이런 매핑은 공식적으로 존재하지 않는다.

✔︎ @JoinColumn(insertable = false, updatable = false);

✔︎ 읽기 전용 필드를 사용해서 양방향 처럼 사용하는 방법

✔︎ 다대일 양방향을 사용하자.

```java
@Entity
public class Member {

    @Id @GeneratedValue
    @Column(name = "MEMBER_ID")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "TEAM_ID", inseratble = false, updatable = false);
    private Team team;
}
```
```java
public class Team {
    
    @Id @GeneratedValue
    @Column(name = "TEAM_ID")
    private Long id;

    @OneToMany
    @JoinColumn(name = "TEAM_ID")
    private List<Member> members = new ArrayList<>();
}
```

---

<br>

## <span style="color:gray">일대일 [1:1]</span>

✔︎ 일대일 관계는 그 반대도 일대일

✔ 주 테이블이나 대상 테이블 중에 외래 키를 선택 가능

✔︎ 외래 키에 데이터베이스 유니크(UNI) 조건 추가

<br>

#### 주 테이블의 외래 키

> 다대일 연관관계 매핑처럼 외래 키가 있는 곳이 연관관계 주인.

주 객체가 대상 객체를 참조하는 것처럼 주 테이블에 외래 키를 두고 대상 테이블을

참조한다. 외래 키를 객체 참조와 비슷하게 사용할 수 있어서 객체지향 개발자들이 

선호한다. 이 방법의 장점은 주 테이블이 외래 키를 가지고 있으므로, 주 테이블만

확인해도 대상 테이블과 연관관계가 있는지 알 수 있다.

```java
@Entity
public class Locker {

    @Id @GeneratedValue
    @Column(name = "LOCKER_ID")
    private Long id;

    private String name;

    //== 양뱡향일 경우 ==//
    @OneToOne(mappedBy = "locker")
    private Member member;
}
```
```java
@Entity
public class Member {

    @Id @GeneratedValue
    @Column(name = "MEMBER_ID")
    private Long id;

    @OneToOne
    @JoinColumn(name = "LOCKER_ID")
    private Locker locker;
}
```

<br>

***특징***

✔︎ 주 객체가 대상 객체의 참조를 가지고 있음

✔︎ 객체지향 개발자 선호

✔︎ JPA 매핑 편리

✔︎ 주 테이블만 조회해도 대상 테이블에 데이터가 있는지 확인 가능

✔︎ 값이 없으면 외래 키에 null 허용

<br>

#### 대상 테이블 외래 키

전통적인 데이터베이스 개발자들은 보통 대상 테이블에 외래 키가 있는 것을 선호한다.

이 방법의 장점은 테이블 관계를 일대일에서 다대일로 변경할 때 테이블 구조를 그대로

유지할 수 있다.

<img src = "/assets/img/jpa/OneToOne2.png">

위의 그림을 보면 일대일 관계 중 대상 테이블에 외래 키가 있는 단방향 관계는

JPA에서 지원을 해주지 않는다. 그리고 이런 모양으로 매핑할 수 있는 방법도 없다.

이때는 단방향 관계를 Locker에서 Member 방향으로 수정하거나, 양방향 관계로 

만들고 Locker를 연관관계의 주인으로 설정해야 한다.

<br>

***특징***

✔︎ 대상 테이블에 외래 키가 존재

✔︎ 전통적인 데이터베이스 개발자 선호

✔︎ 주 테이블과 대상 테이블을 일대일에서 일대다 관계로 변경할 때 테이블 구조 유지

✔︎ 프록시 ***<span style="background-color:yellow">기능의 한계로 지연 로딩으로 설정해도 항상 즉시 로딩됨.</span>***

---

<br>

## <span style="color:gray">다대다 [N:M]</span>

> 실무에서 쓰면 안된다!!

***특징***

✔︎ 관계형 데이터베이스는 정규화된 테이블을 2개로 다대다 관계를 표현할 수 없음.

✔︎ 연결 테이블을 추가해서 일대다, 다대일 관계로 풀어내야 한다.

✔︎ 객체는 컬렉션을 사용해서 객체 2개로 다대다 관계 가능.

<img src = "/assets/img/jpa/ManyToMany.png">

```java
@Entity
public class Product {

    @Id @GeneratedValue
    private Long id;

    private String name;

    @ManyToMany(mappedBy = "products")
    private List<Member> members = new ArrayList<>();
}
```
```java
@Entity
public class Member {

    @Id @GeneratedValue
    @Column(name = "MEMBER_ID")
    private Long id;

    @ManyToMany
    @JoinTable(name = "MEMBER_PRODUCT")
    private List<Product> products = new ArrayList<>();
}
```

<br>

***다대다 매핑의 한계***

✔︎ ***<span style="color:red">편리해 보이지만 실무에서 사용하지 않는다.</span>***

✔︎ 연결 테이블이 단순히 연결만 하고 끝나지 않음

✔︎ 중간 테이블에 추가적인 필드가 들어올 수 있음.

<br>

***다대다 매핑의 한계 극복***

✔︎ 연결 테이블용 엔티티 추가(중간 테이블을 엔티티로 승격)

✔︎ @ManyToMany → @OneToMany, @ManyToOne 

<img src = "/assets/img/jpa/ManyToMany2.png">

```java
@Entity
public class Member {

    @Id @GeneratedValue
    @Column(name = "MEMBER_ID")
    private Long id;

    @OneToMany(mappedBy = "member")
    private List<MemberProduct> memberProducts = new ArrayList<>();
}
```
```java
@Entity
@Table(name = "ORDERS")
public class MemberProduct {
    
    @Id @GeneratedValue
    @Column(name = "ORDER_ID")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "MEMBER_ID")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "PRODUCT_ID")
    private Product product;

    private int count;
    private int regDate;
}
```
```java
@Entity
public class Product {

    @Id @GeneratedValue
    private Long id;

    private String name;

    @OneToMany(mappedBy = "product")
    private List<MemberProduct> memberProducts = new ArrayList<>();
}
```
---