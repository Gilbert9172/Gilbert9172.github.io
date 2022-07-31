---
layout: post
title: 프록시와 연관관계
categories: spring
tags: jpa
---

## <span style="color:gray">프록시</span>

#### 기초

|메서드|설명|비고|
|------|----|----|
|em.find()|데이터베이스를 통해서 실제 엔티티 객체 조회|쿼리 나감|
|em.getReference()|데이터베이스 조회를 미루는 가짜(프록시) 엔티티 객체 조회|쿼리 안나감|

<br>

#### 특징

• 실제 클래스를 상속 받아서 만들어짐

• 실제 클래스와 겉 모양이 같다.

• 사용하는 입장에서는 진짜 객체인지 프록시 객체인지 구분하지 않고 사용하면 됨.

• 프록시 객체는 실제 객체의 참조(target)를 보관

• 프록시 객체를 호출하면 프록시 객체는 실제 객체의 메소드 호출

• 프록시 객체는 처음 사용할 때 한 번만 초기화

• 프록시 객체를 초기화 할 때, 프록시 객체가 실제 엔티티로 바뀌는 것은 아님.

• 초기화 되면 프록시 객체를 통해서 실제 엔티티에 접근 가능

• 프록시 객체는 원본 엔티티를 상속받음. 따라서 타입 체크시 주의해야함

> ⚙︎ == 비교 실패, 대신 instance of 사용

• 영속성 컨텍스트에 찾는 엔티티가 이미 있으면 `em.getReference()`를 호출해도 실제 엔티티 반환

• 영속성 컨텍스트의 도움을 받을 수 없는 준영속 상태일 때, 프록시를 초기화하면 문제 발생

<br>

#### 프록시 객체 초기화

<img src="/assets/img/jpa/프록시/프록시객체.png">

⒈ getXxx();

⒉ 초기화 요청

⒊ DB조회

⒋ 실제 Entity 생성

⒌ target.getXxx();

--

<br>

## <span style="color:gray">즉시로딩과 지연로딩</span>

#### 지연로딩

> fetch = FetchType.LAZY (실무에서는 이걸로 다 쓴다.)

지연로딩을 사용하면 프록시객체를 반환한다. 

실제로 ***<span style="background-color:yellow">Team을 터치하는 시점에</span>*** 프록시객체가 초기화 되면서 DB에서 값을 가져온다.

```java
@Entity
public class Member {

    @Id @GeneratedValue
    private Long Id;

    @Column(name = "USERNAME")
    private String name;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "TEAM_ID")
    private Team team;
}
```

<br>

#### 즉시로딩

> fetch = FetchType.EAGER

즉시로딩은 한 번에 다 땡겨오기 때문에 프록시 객체가 사용이 안된다.

```java
@Entity
public class Member {

    @Id @GeneratedValue
    private Long Id;

    @Column(name = "USERNAME")
    private String name;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "TEAM_ID")
    private Team team;
}
```

<br>

#### 프록시와 즉시로딩 주의

• 가급적 지연 로딩만 사용(특히 실무에서)

• 즉시 로딩을 적용하면 예상하지 못한 SQL이 발생

• ***<span style="background-color:yellow">즉시 로딩은 JPQL에서 N+1 문제를 일으킨다.</span>***

예를 들어 `SELECT * FROM Member`라는 쿼리를 날렸다고 하자.

현재 멤버 테이블에는 두 명의 멤버가 있고, 각 멤버는 서로 다른 팀에 속햇있다.

이렇게 되면 JPA는 최초로 보냈던 쿼리를(`SELECT * FROM Member`)를 수행하고 

멤버가 속해있는 팀을 조회하는 아래의 쿼리를 두 번 날리게 된다. 

```sql
SELECT * 
FROM Team 
WHERE name = #{username}
```

N+1에서 N은 Team을 조회화는 쿼리의 수를 뜻하며,

1은 최초에 날렸던 멤버를 조회하는 쿼리를 뜻한다.

> 해결방법으로는 Fetch Join, 엔티티 그래프 기능이 있다. (뒤에서 공부할 예정)

• `@ManyToOne`, `@OneToOne`은 기본이 즉시로딩 → LAZY로 설정

• `@OneToMany`, `@ManyToMany`은 기본이

---

<br>

## <span style="color:gray">영속성 전이(CASCADE)</span>

#### 영속성 전이란??

특정 엔티티를 영속 상태로 만들 때 연관된 엔티티도 함께 영속 상태로 만들 때

> Ex. 부모 엔티티를 저장할 때 자식 엔티티도 함께 저장.

```java
@Entity
public class Parent {

    @Id @GeneratedValue
    @Column(name = "PARENT_ID")
    private Long id;
 
    @OneToMany(mappedBy = "parent")
    private List<Child> childList = new ArrayList<>();
}
```

```java
@Entity
public class Child {

    @Id @GeneratedValue
    @Column(name = "CHILD_ID")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "PARENT_ID")
    private Parent parent;
}
```

위 엔티티를 기반으로 DB에 값을 저장하면 아래와 같이 코드를 작성해야 한다.

```java
Child child1 = new child();
Child child2 = new child();

Parent parent = new Parent();
parent.addChild(child1);
parent.addChild(child2);

em.persist(parnet);
em.persist(child1);
em.persist(child2);
```

위에서 보면 알 수 있듯이 em.persist를 3번을 사용해야 한다. 

하지만 `cascade = CascadeType.ALL` 속성을 추가해주면 

```java
@OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
private List<Child> childList = new ArrayList<>();
```

`em.persist(parnet);`만 해주면 똑같이 작동한다.


<br>

#### 영속성 전이 주의사항

⚙︎ 영속성 전이는 연관관계를 매핑하는 것과 아무 관련이 없음.

⚙︎ 엔티티를 영속화할 때 연관된 엔티티도 함께 영속화하는 편리함을 제공할 뿐이다.

⚙︎ 하나의 부모가 자식들을 관리할 때 의미가 있다.(단일 소유일 때)

```
이게 무슨 말이냐면...

다른 테이블에서 CHILD엔티티를 알게 되면 쓰면 안된다는 뜻.

+) 라이프 사이클이 동일할 때.
```

<br>

#### 영속성 전이 종류

> 주로 ALL과 PERSIST를 많이 사용하게 된다.

|종류|설명|
|----|----|
|ALL|모두 적용|
|PERSIST|영속|
|REMOVE|삭제|
|MERGE|병합|
|REFRESH|REFRESH|
|DETACH|DETACH|

---

<br>

## <span style="color:gray">고아객체</span>

#### 고아객체란?

> 부모 엔티티와 견관관계가 끊어진 자식 엔티티를 자동으로 삭제

`orphanRemoval = true` 를 작성하면 해당 기능을 사용할 수 있다.

쿼리문으로 보면 아래의 쿼리가 DB로 날아가는 것이다.

```sql
DELETE FROM CHILD WHERE ID = #{childId};
```

<br>

#### 고아객체 사용시 주의 사항

⚙︎ 참조가 제거된 엔티티는 ***`다른 곳에서 참조하지 않는 고아객체로 보고`*** 삭제하는 기능

⚙︎ ***<span style="background-color:yellow">참조하는 곳이 하나일 때만 사용해야 한다!!</span>***

⚙︎ ***<span style="background-color:yellow">특정 엔티티가 개인 소유할 때 사용</span>***

⚙︎ `@OneToOne`, `@OneToMany`만 사용 가능

<br>

참고로 개념적으로는 부모를 제거하면 자식은 고아가 된다. 

따라서 고아 객체 제거 기능을 활성화 하면, 부모를 제거할 때 자식도 함께 제거된다. 

이것은 CascadeType.REMOVE처럼 작동한다.

만약 `orphanRemoval = true`가 없고 `cascade = CascadeType.ALL`만 있어도 똑같이 작동한다.

---

<br>

## <span style="color:gray">영속성 전이와 고아객체의 생명주기 </span>

`orphanRemoval = true`과 `cascade = CascadeType.ALL` 두 옵션을 모두 활성화하면

부모 엔티티를 통해서 자식의 생명주기를 관리할 수 있다.  

이는 도메인 주도 설계(DDD)의 Aggregate Root 개념을 구현할 때 유용하다.

---