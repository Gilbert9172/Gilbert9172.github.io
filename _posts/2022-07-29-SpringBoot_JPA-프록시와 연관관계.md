---
layout: post
title: 프록시와 연관관계
categories: spring
tags: jpa
---

## <span style="color:gray">들어가기 앞서...</span>

---

Member의 정보만 필요한 상황인데, Member를 조회할 때 Team도 꼭 같이 조회해야 할까?

회원 정보만 필요한 경우에 팀에 대한 정보까지 함께 조회하게 되면 불필요한 데이터를 

조회하는 것이기 때문에 최적화가 잘 된 것은 아니다.

그렇다면 경우에 따라 Member만 혹은 Member와 Team을 한 번에 조회해서 가져올 수 없을까?

이러한 의문을 JPA는 **<span style="background-color:#F0E68C">프록시 기술</span>** 을 사용해서 해결해준다.

<br>

## <span style="color:gray">프록시</span>

---

#### <span style="background-color:black; color:white">기초</span>

|메서드|설명|비고|
|------|----|----|
|`find()`|데이터베이스를 통해서 실제 엔티티 객체 조회|쿼리 나감|
|`getReference()`|데이터베이스 조회를 미루는 가짜(프록시) 엔티티 객체 조회|쿼리 안나감|

<br>

#### <span style="background-color:black; color:white">예시 코드로 알아보기</span>

`getReference()` 메서드에 대해서 코드로 알아보자!

```java
Member reference = em.getReference(Member.class, member.getId());
System.out.println(reference.getId());
//=== 이 시점까지는 쿼리가 나가지 않는다. ===//

System.out.println(reference.getName());
//=== 이 시점에서는 SELECT 쿼리가 나간다. ===//

System.out.println("누구냐 넌 = " + reference.getClass());
// 출력 결과 = ...Member$HibernateProxy$ZaRcv0TW
```

출력결과를 보면 `Member$HibernateProxy`라는 프록시 객체를 반환한다.

즉, `getReference()` 메소드는 하이버네이트에서 만드는 프록시 객체를 사용한다.

이제 반환된 프록시 객체의 정체에 대해서 자세히 알아보도록 하자.

<br>

#### <span style="background-color:black; color:white">프록시 특징 → 매우 중요!!!</span>

반환된 프록시 객체의 생김새는 아래와 같다.

|HiberbateProxy|
|--------------|
|Entity target = null|
|`getId()`|
|`getName()`|

<br>

• **실제 클래스를 상속** 받아서 만들어짐

• 실제 클래스와 겉 모양이 같다.

• 사용하는 입장에서는 진짜 객체인지 프록시 객체인지 구분하지 않고 사용하면 됨.

• **프록시 객체는 실제 객체의 참조(target)를 보관**

• 프록시 객체를 호출하면 프록시 객체는 실제 객체의 메소드 호출

• **프록시 객체는 처음 사용할 때 한 번만 초기화**

• **<span style="background-color:#F0E68C">프록시 객체를 초기화 할 때, 프록시 객체가 실제 엔티티로 바뀌는 것은 아님.</span>**

• **<span style="background-color:#F0E68C">초기화 되면 프록시 객체를 통해서 실제 엔티티에 "접근" 가능</span>**

• **<span style="background-color:#F0E68C">프록시 객체는 원본 엔티티를 상속받음. 따라서 타입 체크시 주의. (== 대신 instance of 사용)</span>**

```java
// == 대신 instance of 사용
Member m1 = em.find(Member.class, member.getId());
Member m2 = em.getReference(Member.class, member1.getId());

System.out.println(m1.getClass());                      // 출력결과 = Member
System.out.println(m2.getClass());                      // 출력결과 = Member$HibernateProxy$UWD3OQxd
System.out.println((m1.getClass() == m2.getClass()));   // 출력결과 = false
System.out.println((m1 instanceof Member));             // 출력결과 = true
System.out.println((m2 instanceof Member));             // 출력결과 = true
```

<br>

• 영속성 컨텍스트에 찾는 엔티티가 이미 있으면 `getReference()`를 호출해도 실제 엔티티 반환

```java
//...

em.flush();
em.clear();

Member m1 = em.find(Member.class, member.getId());
Member reference = em.getReference(Member.class, member.getId());

System.out.println(m1.getClass());          // 출력결과 = ...Member
System.out.println(reference.getClass());   // 출력결과 = ...Member
System.out.println((m1 == reference));      // 출력결과 = true
```

<br>

• 영속성 컨텍스트의 도움을 받을 수 없는 준영속 상태일 때, 프록시를 초기화하면 문제 발생

```java
em.flush();
em.clear();

Member refMember = em.getReference(Member.class, member.getId());
System.out.println("refMember = " + refMember.getClass());

em.detach(refMember);
refMember.getName();
```

이렇게 코드를 작성하면 아래와 같은 에러 메세지를 반환한다.

**<span style="color:red">org.hibernate.LazyInitializationException : could not initialize proxy- no Session</span>**

현재 객체가 영속성 컨텍스트에 없다는 의미이다. 즉, 준영속 상태를 의미한다.

<br>

위 에러는 실무에서 정말 많이 만나는데, 아래와 같은 경우에서 자주 만난다.

보통 실무에서는 트랜잭션의 라이프사이클에 영속성 컨텍스트의 라이프 사이클을 맞추는데,

이때 **<span style="color:red">트랜잭션이 끝나고 영속성 컨텍스트를 조회하는 실수를 종종 한다.</span>**


<br>

#### <span style="background-color:black; color:white">항상 == 결과는 true</span>

JPA는 **<span style="background-color:#F0E68C">영속성 컨텍스트 내에서 PK가 같은 객체에 대한 == 비교를 할 때, 항상 true</span>** 를

반환한다. 이것은 JPA의 기본적인 동작원리임으로 기억해두자.

**<u>▷ find 먼저</u>**

영속성 컨텍스트에 찾는 엔티티가 이미 있으면 `getReference()`를 호출해도 실제 엔티티 반환한다.

```java
Member findMember = em.find(Member.class, member.getId());
Member refMember = em.getReference(Member.class, member.getId());

System.out.println(findMember.getClass());  //Member
System.out.println(refMember.getClass());   //Member
System.out.println((refMember.getClass() == findMember.getClass()));    //true
```

<br>

**<u>▷ reference 먼저</u>**

거의 이럴일은 없지만 프록시로 먼저 조회를 해버리면 그 다음에 `find()` 메서드로 조회를

하더라도 프록시 객체를 반환을 한다. 이것은 JPA의 기본적인 동작원리를 따르기 위함이다.

만약 findMember가 일반 Member 객체를 반환해 버린다면, == 비교시 false를 반환할 것이다.

```java
Member refMember = em.getReference(Member.class, member.getId());
Member findMember = em.find(Member.class, member.getId());

System.out.println(findMember.getClass());  //Member$HibernateProxy$xYZJ53Rk
System.out.println(refMember.getClass());   //Member$HibernateProxy$xYZJ53Rk
System.out.println((refMember.getClass() == findMember.getClass()));    //true
```

<br>

#### <span style="background-color:black; color:white">프록시 객체 초기화 과정</span>

<img src="/assets/img/jpa/프록시/프록시객체.png">

<br>

⒈ 최초에 `getXxx()` 메서드를 호출할 때 `target == null` 이다.

⒉ JPA가 영속성 컨텍스트에 **초기화**(진짜 Member 객체 가져와!)를 요청한다.

⒊ 영속성 컨텍스트가 DB조회를 수행한다.

⒋ 조회 결과인 **실제 엔티티 객체**를 참조변수(target)에 넣어준다.

⒌ 프록시 객체가 실제 엔티티 객체의 `getXxx()` 메서드를 호출한다. → `target.getXxx()`

<br>

#### <span style="background-color:black; color:white">프록시 확인을 도와주는 Util</span>

**<u>▷ 프록시 인스턴스의 초기화 여부 확인</u>**

```java
Member refMember = em.getReference(Member.class, member.getId());
System.out.println(emf.getPersistenceUnitUtil().isLoaded(refMember));   // false

refMember.getName();
System.out.println(emf.getPersistenceUnitUtil().isLoaded(refMember));   // true
```

<br>

**<u>▷ 프록시 클래스 확인 방법</u>**

```java
Member refMember = em.getReference(Member.class, member.getId());
System.out.println(refMember.getClass());   // Member$HibernateProxy$Tvj0aWtq
```

<br>

**<u>▷ 프록시 강제 초기화</u>**

```java
Member refMember = em.getReference(Member.class, member.getId());
Hibernate.initialize(refMember);
```

참고로 JPA표준에는 강제 초기화는 없기 때문에 인스턴스 메서드를 강제 호출해야 한다.

```java
refMember.getName();
```

<br>

## <span style="color:gray">즉시로딩과 지연로딩</span>

---

#### <span style="background-color:black; color:white">지연로딩</span>

`fetch = FetchType.LAZY`는 지연로딩을 위한 설정이다.

**<span style="background-color:#F0E68C">지연로딩을 사용하면 프록시 객체를 반환한다.</span>** 

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

```java
Member findMember = em.find(Member.class, member.getId());

//=> 프록시 객체 반환 = Team$HibernateProxy$jmh88Toc
System.out.println(findMember.getTeam().getClass());    

//=> 프록시 객체 초기화 진행.
System.out.println(findMember.getTeam().getName());
```

실제로 `findMember.getTeam().getName()`메소드를 호출하는 시점에 프록시 객체가 

**초기화 되면서** DB에서 값을 가져온다. 대부분 실무에서는 Lazy Loading을 사용한다.

<br>

#### <span style="background-color:black; color:white">즉시로딩</span>

`fetch = FetchType.EAGER`는 즉시로딩을 위한 설정이다. (디폴트 값 / 생략 가능)

즉시로딩은 한 번에 다 땡겨오기 때문에 **<span style="background-color:#F0E68C">프록시 객체가 사용이 안된다.</span>**

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

```java
Member findMember = em.find(Member.class, member.getId());

//=> 프록시 객체 반환 = Team
System.out.println(findMember.getTeam().getClass());    

//=> TeamA
System.out.println(findMember.getTeam().getName());
```

<br>

Member 테이블과 Team 테이블을 Join해서 가져온다.

```sql
select
    member0_.MEMBER_ID as member_i1_9_0_,
    member0_.createdBy as createdb2_9_0_,
    member0_.createdDate as createdd3_9_0_,
    member0_.lastModifiedBy as lastmodi4_9_0_,
    member0_.lastModifiedDate as lastmodi5_9_0_,
    member0_.TEAM_ID as team_id7_9_0_,
    memberprac0_.USERNAME as username6_9_0_,
    team1_.TEAM_ID as team_id1_18_1_,
    team1_.name as name2_18_1_ 
from
    MemberPrac memberprac0_ 
left outer join Team team1_ 
    on memberprac0_.TEAM_ID=team1_.TEAM_ID 
where
    memberprac0_.MEMBER_ID=?
```

<br>

#### <span style="background-color:black; color:white">프록시와 즉시로딩 주의</span>

• **<span style="background-color:#F0E68C">가급적 지연 로딩만 사용(특히 실무에서)</span>**

• 즉시 로딩을 적용하면 예상하지 못한 SQL이 발생

• **<span style="color:red">즉시 로딩은 JPQL에서 N+1 문제를 일으킨다.</span>**

• `@XToOne` : `@ManyToOne`, `@OneToOne`은 기본이 즉시로딩 → LAZY로 설정

• `@XToMany` :`@OneToMany`, `@ManyToMany`은 기본이 지연로딩

<br>

#### <span style="background-color:black; color:white">N+1 문제</span>

```java
@Entity
public class Member {

    ...

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "TEAM_ID")
    private Team team;

    ...
}
```

현재 Member 엔티티는 즉시로딩이 걸려있는데, 

이 상태에서 아래와 같이 JPQL을 잘성하면 어떤 결과가 나올까?

<br>

```java
// 총 Member는 5명, Team은 5팀

List<Member> memberList = em.createQuery("SELECT m FROM Member m").getResultList();
```



<br>

단순하게 생각한다면 Member들만 조회한다고 생각이 들수있다. 

하지만 `Member.team`에 **<span style="color:red">즉시로딩</span>** 이 걸려있기 때문에 아래와 같이 

**<span style="background-color:#F0E68C">1번의 회원 목록 조회 쿼리와 5(N)번의 Team 조회 쿼리가 수행 될 것이다.</span>**

```SQL
# 최초 회원 목록을 조회하는 쿼리 X 1번
select
    member0_.MEMBER_ID as member_i1_9_,
    member0_.createdBy as createdb2_9_,
    member0_.createdDate as createdd3_9_,
    member0_.lastModifiedBy as lastmodi4_9_,
    member0_.lastModifiedDate as lastmodi5_9_,
    member0_.TEAM_ID as team_id7_9_,
    member0_.USERNAME as username6_9_ 
from
    Member member0_

# 각각의 Member의 Team을 조회하는 쿼리 X 5번
select
    team0_.TEAM_ID as team_id1_18_0_,
    team0_.name as name2_18_0_ 
from
    Team team0_ 
where
    team0_.TEAM_ID=?
```

<br>

하지만 지연로딩을 사용하면 Team을 프록시 객체로 사용하기 때문에 

최초에 Member 목록 조회 쿼리 1번만 실행된다.

N+1문제의 해결방법으로는 Fetch Join, 엔티티 그래프 기능이 있다. (뒤에서 공부할 예정)

```java
String jpql = "SELECT m FROM Member m join fetch m.team";
List<Member> memberList = em.createQuery(jpql, Member.class).getResultList();
```

```sql
select
    member0_.MEMBER_ID as member_i1_9_0_,
    team1_.TEAM_ID as team_id1_18_1_,
    member0_.createdBy as createdb2_9_0_,
    member0_.createdDate as createdd3_9_0_,
    member0_.lastModifiedBy as lastmodi4_9_0_,
    member0_.lastModifiedDate as lastmodi5_9_0_,
    member0_.TEAM_ID as team_id7_9_0_,
    member0_.USERNAME as username6_9_0_,
    team1_.name as name2_18_1_ 
from
    Member member0_ 
inner join Team team1_ 
    on member0_.TEAM_ID=team1_.TEAM_ID
```

<br>

## <span style="color:gray">영속성 전이(CASCADE)</span>

> 라이프 사이클을 어떻게 관리할지 고민을 해봐야한다.

---

#### <span style="background-color:black; color:white">영속성 전이란??</span>

특정 엔티티를 영속 상태로 만들 때 **연관된 엔티티도 함께 영속 상태로 만들 때**

사용한다.예를 들면 부모 엔티티를 저장할 때 자식 엔티티도 함께 저장하고 싶은

경우에 사용하면 된다.

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
Child child1 = new Child();
Child child2 = new Child();

Parent parent = new Parent();
parent.addChild(child1);
parent.addChild(child2);

em.persist(parent);
em.persist(child1);
em.persist(child2);
```

위에서 보면 알 수 있듯이 `persist()` 메소드를 3번을 사용해야 한다. 

<br>

```java
@OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
private List<Child> childList = new ArrayList<>();
```
하지만 `cascade = CascadeType.ALL` 속성을 추가해주면 아래 코드 한 줄로

Child 인스턴스를 영속성 컨텍스트에 저장할 수 있다.

```java
em.persist(parent);
```

<br>

#### <span style="background-color:black; color:white">영속성 전이 주의사항</span>

• **<span style="background-color:#F0E68C">영속성 전이는 연관관계를 매핑하는 것과 아무 관련이 없음.</span>**

• 엔티티를 영속화할 때 연관된 엔티티도 함께 영속화하는 편리함을 제공할 뿐이다.

• 하나의 부모가 자식들을 관리할 때 의미가 있다.(단일 소유일 때)

• 라이프 사이클이 동일할 때


<br>

단일 소유일 때란, 다른 테이블에서 Child 엔티티를 사용하지 않는 경우를 말한다.

만약 다른 테이블에서 Child 엔티티와 연관관계가 있다면 **절대 사용하면 안된다.**

<br>

#### <span style="background-color:black; color:white">영속성 전이 종류</span>

> 주로 ALL과 PERSIST를 많이 사용하게 된다.

|종류|설명|
|----|----|
|ALL|모두 적용|
|PERSIST|영속|
|REMOVE|삭제|
|MERGE|병합|
|REFRESH|REFRESH|
|DETACH|DETACH|

<br>

## <span style="color:gray">고아객체</span>

---

#### <span style="background-color:black; color:white">고아객체란?</span>

부모 엔티티와 연관관계가 끊어진 자식 엔티티를 자동으로 삭제하는 기능이다.

`orphanRemoval = true` 를 작성하면 해당 기능을 사용할 수 있다.

```java
@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Parent {

    @Id
    @GeneratedValue
    @Column(name = "PARENT_ID")
    private Long id;

    @OneToMany(
        mappedBy = "parent",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<Child> childList = new ArrayList<>();

    public void addChild(Child child) {
        childList.add(child);
        child.setParent(this);
    }
}
```

<br>

컬렉션에서 `remove()` 메소드를 사용하면, JPA에서 DELETE 쿼리를 날린다.

```java
Parent findParent = em.find(Parent.class, parent.getId());
List<Child> childList = findParent.getChildList();

childList.remove(0);
```
```sql
DELETE FROM CHILD WHERE ID = #{childId};
```

<br>

#### <span style="background-color:black; color:white">고아객체 사용시 주의 사항</span>

• 참조가 제거된 엔티티는 다른 곳에서 참조하지 않는 고아객체로 보고 삭제하는 기능

• **<span style="background-color:#F0E68C">참조하는 곳이 하나일 때만 사용해야 한다!</span>**

• **<span style="background-color:#F0E68C">특정 엔티티가 개인 소유할 때 사용</span>**

• `@OneToOne`, `@OneToMany`만 사용 가능

<br>

참고로 개념적으로는 부모를 제거하면 자식은 고아가 된다. 

따라서 고아 객체 제거 기능을 활성화 하면, 부모를 제거할 때 자식도 함께 제거된다. 

이것은 `CascadeType.REMOVE`처럼 작동한다.

만약 `orphanRemoval = true`가 없고 `cascade = CascadeType.ALL`만 있어도 똑같이 작동한다.

<br>

#### <span style="background-color:black; color:white">영속성 전이와 고아객체의 생명주기 </span>

`orphanRemoval = true`과 `cascade = CascadeType.ALL` 두 옵션을 모두 활성화하면

부모 엔티티를 통해서 자식의 생명주기를 관리할 수 있다.  

이는 도메인 주도 설계(DDD)의 Aggregate Root 개념을 구현할 때 유용하다.