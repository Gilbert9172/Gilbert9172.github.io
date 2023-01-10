---
layout: post
title: 영속성 관리 - 내부 동작 방식
categories: spring
tags: jpa
---

## <span style="color:gray">영속성 컨텍스트</span>

---

#### <span style="background-color:black; color:white">영속성 컨텍스트</span>

JPA에서 가장 중요한 2가지는 아래와 같다.

• 객체와 관계형 데이터베이스 매핑하기

• **<span style="background-color:#F0E68C">영속성 컨텍스트</span>**

영속성 컨텍스트는 JPA를 이해하는데 가장 중요한 용어이다.

쉽게 말하면 **<span style="background-color:#F0E68C">Entity를 영구 저장하는 환경</span>** 이라는 뜻이다.

<br>

```java
EntityManager.persist(entity);
```

> 중요!!!

위 코드는 Entity를 DB에 저장한다기 보단 영속성 컨텍스트를 통해서 Entity를 

**<span style="background-color:#F0E68C">영속화</span>** 한다는 의미이다. **`persist()`** 메서드는 Entity를 영속성 컨텍스트에 저장한다.

<br>

영속성 컨텍스트는 아래와 같은 특징을 가지고 있다.

• 영속성 컨텍스트는 논리적인 개념이다.

• 눈에 보이지 않는다.

• EntityManager를 통해서 영속성 컨텍스트에 접근한다.

---

<br>

## <span style="color:gray">Entity의 생명주기</span>

---

#### <span style="background-color:black; color:white">비영속성(new/transient)</span>

영속성 컨텍스트와 전혀 관계가 없는 새로운 상태.

<img src="/assets/img/jpa/transient.png">

```java
// 객체를 생성한 상태 (비영속성)
Member member = new Member();
member.setId("1");
member.setName("user1");
```

<br>

#### <span style="background-color:black; color:white">영속(managed)</span>

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

// 객체를 영속성 컨텍스트에 저장 => 영속 상태
em.persist(member);

tx.commit();
em.close();
emf.close();
```
`em.persist(member)` 시점에는 쿼리가 나가지 않고, `commit()` 메소드가 실행되는 

시점에서 쿼리가 나가게 된다. 

즉, `em.persist(member)`는 엔티티를  영속성 컨텍스트에 저장하는 역할을 하는 것을 

다시 한 번 확인할 수 있다.

<br>

#### <span style="background-color:black; color:white">준영속(detached)</span>

**<u>준영속 상태</u>**

• 영속 상태의 엔티티가 영속성 컨텍스트에서 분리(detatched)된 상태

• 영속성 컨텍스트가 제공하는 기능을 사용 못함.

|준영속 상태로 만드는 법|설명|
|-----------------------|----|
|`em.detach(entity);`|특정 엔티티만 준영속 상태로 전환|
|`em.clear();`|영속성 컨텍스트를 완전히 초기화|
|`em.close();`|영속성 컨텍스트를 종료|

```java
// 영속상태
Member member = em.find(Member.class, 1L);
member.setName("update_1)"); 

/* 특정 엔티티(member)만 준영속 상태로 전환 */
em.detach(member);

/* 영속성 컨텍스트를 완전히 초기화 */
em.persist(member);
```

<br>

#### <span style="background-color:black; color:white">삭제(removed)</span>

```java
// 객체를 삭제한 상태(삭제)
em.remove(member);
```

---

<br>

## <span style="color:gray">영속성 컨텍스트의 이점</span>

---

#### <span style="background-color:black; color:white">1차 캐시</span>

> 단일 트랜잭션 내에서만 유효하기 때문에 성능의 이점은 크게 없다.

```java
Member member = new Member("Gilbert", 20);

// 영속성 컨테스트에 저장
em.persist(member);

Member findMember = em.find(Member.class, "Gilbert");
```

처음에 `em.persist(member)`를 하면 **<span style="background-color:#F0E68C">1차 캐시</span>** 에 저장이된다. 

이후 member를 조회할 때 1차 캐시 데이터에서 값을 반환한다.

만약 1차 캐시에 값이 없을 경우 DB에서 객체를 조회한 후 조회한 값을 1차 캐시에 넣는다.


<br>

#### <span style="background-color:black; color:white">동일성(identity) 보장</span>

1차 캐시로 반복 가능한 읽기(Repeatable Read) 등급의 트랜잭션 격리 수준을

데이터베이스가 아닌 애플리케이션 차원에서 제공.

```java
Member a = em.find(Member.class, 1L);
Member b = em.find(Member.class, 1L);

System.out.println(a == b); 
// true
```

a를 가져올 때 SELECT 쿼리가 한 번 실행된다. 그리고 반환된 객체를 

영속성 컨텍스트에 저장한다. b를 가져올 때는 이미 1차 캐싱에 원하는 데이터가 

있기 때문에 별도의 SELECT 쿼리를 날리지 않는다.

<br>

#### <span style="background-color:black; color:white">트랜잭션을 지원하는 쓰기 지연</span>

```java
EntityManager em = emf.createEntityManager();
EntityTransaction transaction = em.getTransaction();

//엔티티 매니저는 데이터 변경시 트랜잭션을 시작해야 한다.
transaction.begin(); // [트랜잭션] 시작
em.persist(memberA);
em.persist(memberB);
```

현 시점 까지는 memberA와 memberB는 영속성 컨텍스트에 저장된다. 그리고 저장됨과 

동시에, 두 개의 INSERT 쿼리가 **쓰기 지연 SQL 저장소**에 쌓인다.

즉, 여기까지는 INSERT 쿼리를 데이터베이스에 보내지는 않는다.

<br>

```java
// [트랜잭션] 커밋
transaction.commit();
```

그리고 `transaction.commit();`을 호출하는 순간 쓰기 지연 SQL 저장소에 있는 

두 개의 INSERT 쿼리가 `flush`가 되면서 DB에 날아간다. 그리고 DB `commit`이 이루어진다.


<img src="/assets/img/jpa/transaction-commit.png">

<br>

persistence.xml 파일에 batch_size 설정을 추가해주면 여러 개의 구문을 여러 번 

network를 통해 보내는 것이 아니라 합쳐서 1개로 보내기에 성능 개선을 할 수 있다. 

```xml
<property name="hibernate.jdbc.batch_size" value="10"/>
```

<br>

#### <span style="background-color:black; color:white">변경감지(Dirty Checking)</span>

```java
// 엔티티 수정
Member member = em.find(Member.class, 1L);
member.setName("testA");

// 필요 없음.
❌ em.persist(member) ❌ 

// 엔티티 삭제
em.remove(member);
```

`em.find(Member.class, 1L)`이 부분에서 찾은 member 객체를 영속성 컨텍스트에

저장해준다. 따라서 `persist()` 메소드는 사용하지 않아야 한다.

<br>

`transaction.commit();` 메소드가 호출이되면 내부적으로 `flush()` 메소드가 호출된다.

그리고 스냅샷(Original 상태)과 엔티티를 비교한다. 만약 데이터에 변화가 있다면 

**쓰기 지연 SQL 저장소**에 UPDATE SQL을 생성한다. 마지막으로 UPDATE SQL을 DB에

반영하고 커밋이 이루어진다.

<img src="/assets/img/jpa/dirty-checking.png">

<br>

#### <span style="background-color:black; color:white">지연 로딩 (Lazy Loading)</span>

---

<br>

## <span style="color:gray">플러시</span>

---

#### <span style="background-color:black; color:white">플러시</span>

> 플러시 : 영속성 컨텍스트의 변경 내용을 데이터베이스에 반영

플러시가 발생하면 아래와 같은 상황들이 발생한다.

|상황|
|----|
|변경 감지(dirty checking)|
|수정된 엔티티를 `쓰기 지연 SQL 저장소`에 등록|
|`쓰기 지연 SQL 저장소`의 쿼리를 데이터베이스에 전송|

<br>

#### <span style="background-color:black; color:white">영속성 컨텍스트를 플러시하는 방법</span>

|플러시 하는 방법|
|----|
|`em.flush()` : 직접 호출|
|트랜잭션 커밋 : 플러시 자동 호출 |
|JPQL 쿼리 실행 : 플러시 자동 호출|

<br>

참고로 **<span style="color:red">플러시를 한다고 해서 1차 캐시가 초기화되지는 않는다.</span>**

오로지 **<span style="background-color:#F0E68C">영속성 컨텍스트에 있는 변경 내용을 데이터베이스에 동기화 하는 것이다.</span>**

> == 쓰기 지연 SQL 저장소에 있는 쿼리들을 DB에 보내는 것.

JPA는 트랜잭션이라는 작업단위가 가장 중요하기 때문에, **커밋 직전에만 동기화 하면 된다.**

<br>

#### <span style="background-color:black; color:white">플러시 모드 옵션</span>

가급적 AUTO를 쓰는게 좋다.

|옵션|설명|
|----|----|
|`em.setFlushMode(FlushModeType.AUTO)`|커밋이나 쿼리를 실행할 때 (기본값)|
|`em.setFlushMode(FlushModeType.COMMIT)`|커밋할 때만|