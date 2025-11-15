---
layout: post
title: 읽기 전용 쿼리의 성능 최적화
categories: spring
tags: dataJpa
---

## <span style="color:gray">읽기 전용 쿼리의 성능 최적화</span>

---

엔티티가 영속성 컨텍스트에 관리되면 1차 캐시부터 변경 감지까지 얻을 수 있는 

혜택이 많다. 하지만 영속성 컨텍스트는 변경 감지를 위해 스냅샷 인스턴스를

보관하므로 더 많은 메모리를 사용하는 단점이 있다.

이런 단점들을 극복하여 최적화하는 방법을 알아보자.

<br>

#### <span style="background-color:black; color:white">스칼라 타입으로 조회</span>

가장 확실한 방법은 엔티티가 아닌 **<span style="background-color:#F0E68C">스칼라 타입으로 모든 필드를 조회하는 것</span>** 이다.

스칼라 타입은 영속성 컨텍스트가 결과를 관리하지 않는다.

```sql
select m.username, m.age from Member m
```

<br>

#### <span style="background-color:black; color:white">읽기 전용 쿼리 힌트 사용</span>

하이버네이트는 전용 힌트인 `org.hibernate.readOnly` 를 사용하면 엔티티를 읽기

전용으로 조회할 수 있다.  **<span style="background-color:#F0E68C">읽기 전용이므로 영속성 컨텍스트는 스냅샷을 보관하지 않는다.</span>**

따라서 **<span style="color:#F08080">메모리 사용량을 최적화</span>** 할 수 있다. 

단 스냅샷이 없으므로 엔티티를 수정해도 데이터베이스에 반영되지 않는다.

<br>

**<u>▷ JPQL + QueryHint</u>**

```java
public Member readOnlyMember() {
    String jpql = "select m from Member m where m.id = 1L";
    return em.createQuery(jpql, Member.class)
        .setHint("org.hibernate.readOnly", true).getSingleResult();
}
```

```java
@Test
public void memberListWithHibernateReadOnly() throws Exception {

    Member member = memberJpaRepository.readOnlyMember();
    member.setAge(100);

    em.flush();
    em.clear();

    Member findMember = memberJpaRepository.findById(member.getId())
            .orElseThrow(NullPointerException::new);
    
    assertThat(member.getAge()).isNotEqualTo(findMember.getAge());
}
```

테스트 코드는 정상적으로 통과했다.

왜냐면 읽기 전용이라 나이가 100으로 DB에 반영이 되지 않았기 때문이다.

<br>

**<u>▷ Spring Data Jpa + QueryHint</u>**

Spring Data Jpa에서는 아래와 같이 사용하면 된다.

```java
@QueryHints(
    value = @QueryHint(name = "org.hibernate.readOnly", value = "true")
)
Member findReadOnlyByUsername(String username);
```

<br>

#### <span style="background-color:black; color:white">읽기 전용 트랜잭션</span>

스프링 프레임워크를 사용하면 트랜잭션을 읽기 전용 모드로 설정할 수 있다.

```java
@Transactional(readOnly=true)
```

트랜잭션에 위 옵션을 주면 스프링 프레임워크가 하이버네이트 세션의 플러시 

모드를 **MANUAL로 설정**한다. 이렇게 하면 강제로 플러시를 호출하지 않는 한 

**<span style="color:#F08080">플러시가 일어나지 않는다.</span>** 플러시가 이뤄지지 않기 때문에 스냅샷 비교와 같은 

**<span style="background-color:#F0E68C">무건운 로직들을 수행하지 않으므로 성능이 향상된다.</span>**

> <em>스냅샷을 보관은 하지만 비교로직이 이루어지지 않는다...?</em>

물론 트랜잭션을 시작했으므로 트랜잭션 시작, 로직수행, 커밋의 과정은 이루어는

진다. 단지 영속성 컨텍스트를 플러시 하지않을 뿐이다.

<br>

#### <span style="background-color:black; color:white">트랜잭션 밖에서 읽기</span>

트랜잭션 밖에서 읽는다는 뜻은 트랜잭션 없이 엔티티를 조회한다는 뜻이다.

스프링 프레임워크를 사용하면 아래와 같이 설정해주어야 한다.

```java
@Transactional(propagation = Propagation.NOT_SUPPORTED)
```

이렇게 트랜잭션을 사용하지 않으면 **<span style="color:#F08080">플러시가 일어나지 않으므로</span>** 조회 성능이

향상된다.

<br>

## <span style="color:gray">정리</span>

---

#### <span style="background-color:black; color:white">메모리 최적화하려면?</span>

**<span style="background-color:#F0E68C">읽어오는 데이터를 줄이고, 스냅샷으로 메모리를 낭비하지 않는다.</span>**

• 스칼라 타입으로 조회

• 읽기 전용 쿼리힌트 사용

<br>

#### <span style="background-color:black; color:white">속도 최적화하려면?</span>

**<span style="background-color:#F0E68C">플러시를 하지 않는다. → 스냅샷 비교와 같은 무거운 로직을 수행하지 않는다.</span>**

• 읽기 전용 트랜잭션 사용 → 스프링에서는 이 밥법이 편리하다.

• 트랜잭션 밖에서 읽기 

<br>

따라서 가장 효과적인 최적화 방법은 아래와 같이 

**읽기 전용 트랜잭션**과 **읽기 전용 쿼리 힌트**를 동시에 사용하는 것이다. 

```java
@Transactional(readOnly=true)
public List<Member> findMembers() {

    String jpql = "select m from Member m";
    
    return em.createQuery(jpql, Member.class)
        .setHint("org.hibernate.readOnly", true).getResultList();
}
```