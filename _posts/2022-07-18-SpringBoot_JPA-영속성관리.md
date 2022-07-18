---
layout: post
title: 영속성 관리 - 내부 동작 방식
categories: spring
tags: jpa
---

## <span style="color:gray">영속성 컨텍스트</span>

JPA에서 가장 중요한 2가지는 아래와 같다.

**✓** 객체와 관계형 데이터베이스 매핑하기

**✓** ***<span style="background-color:yellow">영속성 컨텍스트</span>***

영속성 컨텍스트는 JPA를 이해하는데 가장 중요한 용어이다.

쉽게 말하면 "Entity를 영구 저장하는 환경" 이라는 뜻이다.

<br>

```java
EntityManager.persist(entity);
```

위 코드는 entity를 DB에 저장한다기 보단 영속성 컨텍스트를 통해서 entity를 

**`영속화`** 한다는 의미이다. **`persist()`** 메서드는 entity를 영속성 컨텍스트에 

저장한다.

**✓** 영속성 컨텍스트는 논리적인 개념이다.

**✓** 눈에 보이지 않는다.

**✓** EntityManager를 통해서 영속성 컨텍스트에 접근한다.

---

<br>

## <span style="color:gray">Entity의 생명주기</span>

#### 비영속성(new/transient)

영속성 컨텍스트와 전혀 관계가 없는 새로운 상태.

<img src="/assets/img/jpa/transient.png">

```java
// 객체를 생성한 상태 (비영속성)
Member member = new Member();
member.setId("1");
member.setName("user1");
```

<br>

#### 영속(managed)

<img src="/assets/img/jpa/managed.png">

```java
EntityManagerFactory emf = Persistence.createEntityManagerFactory("hello");
EntityManager em = emf.createEntityManager();
EntityTransaction tx = em.getTransaction();

tx.begin();

// 비영속성
Member member = new Member();
member.setId("1");
member.setName("user1");

// 객체를 저장한 영속상태
em.persist(member);

tx.commit();
em.close();
emf.close();
```


<br>

#### 준영속(detached)

```java
Member member = em.find(Member.class, 1L);
// 영속상태
member.setName("update_1)"); 

// 회원 엔티티를 영속성 컨텍스트에서 분리(준영속 상태)
em.detach(member);
```

|준영속 상태로 만드는 법|설명|
|-----------------------|----|
|em.detach(entity);|특정 엔티티만 준영속 상태로 전환|
|em.clear();|영속성 컨텍스트를 완전히 초기화|
|em.close();|영속성 컨텍스트를 종료|

<br>

#### 삭제(removed)

```java
// 객체를 삭제한 상태(삭제)
em.remove(member);
```

---

<br>

## <span style="color:gray">영속성 컨텍스트의 이점</span>

#### 1차 캐시

> 단일 트랜잭션 내에서만 유효하다. (성능의 이점은 크게 없다.)

처음에 persist(member)를 하면 1차 캐시에 저장이된다. 

이후 member를 조회할 때 1차 캐시 데이터에서 값을 반환한다.

만약 1차 캐시에 값이 없을 경우 DB에서 객체를 조회한 후 조회한 값을 

1차 캐시에 넣는다.

<br>

#### 동일성(identity) 보장

```java
Member a = em.find(Member.class, 1L);
Member b = em.find(Member.class, 1L);

System.out.println(a == b); 
// true
```

1차 캐시로 반복 가능한 읽기(Repeatable Read) 등급의 트랜잭션 격리 수준을

데이터베이스가 아닌 애플리케이션 차원에서 제공.

<br>

#### 트랜잭션을 지원하는 쓰기 지연

```java
EntityManager em = emf.createEntityManager();
EntityTransaction transaction = em.getTransaction();

//엔티티 매니저는 데이터 변경시 트랜잭션을 시작해야 한다.
transaction.begin(); // [트랜잭션] 시작
em.persist(memberA);
em.persist(memberB);
//여기까지 INSERT SQL을 데이터베이스에 보내지 않는다.

//커밋하는 순간 데이터베이스에 INSERT SQL을 보낸다.
transaction.commit(); // [트랜잭션] 커밋
```

<img src="/assets/img/jpa/transaction-commit.png">

<br>

#### 변경감지(Dirty Checking)

```java
// 엔티티 수정
Member member = em.find(Member.class, 1L);
member.setName("testA");

❌ em.persist(member) ❌ 

// 엔티티 삭제
em.remove(member);
```

<img src="/assets/img/jpa/dirty-checking.png">

<br>

> 플러시 : 영속성 컨텍스트의 변경 내용을 데이터베이스에 반영

플러시가 발생하면 아래와 같은 상황들이 발생한다.

|상황|
|----|
|변경 감지|
|수정된 엔티티 `쓰기 지연 SQL 저장소`에 등록|
|`쓰기 지연 SQL 저장소`의 쿼리를 데이터베이스에 전송|

엔티티의 값이 변경이 되면, (flush) 1차 캐시에서 Entity와 스냅샷의 값을 비교한다.

만약 값이 다를 경우 `쓰기 지연 SQL 저장소`에 update쿼리가 생성된다. 그리고 커밋이 

이루어지면 자동으로 flush를 호출한다.

참고로 ***<span style="background-color:yellow">플러시를 한다고 해서 1차 캐시가 초기화되지는 않는다.</span>***

오로지 영속성 컨텍스트에 있는 변경 내용을 데이터베이스에 동기화 하는 것이다.

JPA는 트랜잭션이라는 작업단위가 가장 중요하기 때문에, 커밋 직전에만 동기화 하면 된다.

<br>

|플러시 하는 방법|
|----|
|em.flush() : 직접 호출|
|트랜잭션 커밋 : 플러시 자동 호출 |
|JPQL 쿼리 실행 : 플러시 자동 호출|

<br>

#### 지연 로딩 (Lazy Loading)

---

<br>

## <span style="color:gray">플러시 모드 옵션</span>

|옵션|설명|
|----|----|
|`em.setFlushMode(FlushModeType.COMMIT)`|커밋이나 쿼리르 실행할 때 (기본값)|
|`em.setFlushMode(FlushModeType.AUTO)`|커밋할 때만|