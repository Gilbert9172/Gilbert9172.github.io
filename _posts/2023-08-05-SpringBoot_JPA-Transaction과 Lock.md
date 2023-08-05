---
layout: post
title: Transaction과 Lock
categories: spring
tags: jpa
---

## <span style="color:gray">Transaction과 Lock</span>

---

#### <span style="background-color:black; color:white">트랜잭션과 격리 수준</span>

트랜잭션은 ACID라는 원자성, 일관성, 격리성, 지속성을 보장해야 한다.

<br>

▼ 원자성 (Atomicity)

▼ 일관성 (Consistency)

▼ 격리성 (Isolation)

▼ 지속성 (Durability)

<br>

#### <span style="background-color:black; color:white">낙관적 락과 비관적 락의 기초</span>

<img src="/assets/img/jpa/jpa_lock.png"><br>

<br>

> 낙관적(Optimistic) 락

트랜잭션 대부분은 충돌이 발생하지 않는다고 낙관적으로 가정하는 방법이다. JPA가 제공하는 

낙관적 락은 버전(@Version)을 사용한다. 따라서 낙관적 락을 사용하려면 버전이 있어야 한다.

데이터 베이스가 제공하는 락 기능을 사용하는 것이 아닌, <span style="background-color:#F0E68C">JPA가 제공하는 버전 관리 락을 사용한다.</span>

낙관적 락은 트랜잭션을 커밋하기 전까지는 트랜잭션의 충돌을 알 수 없다.

즉, 트랜잭션 커밋 시점에 충돌을 알 수 있다.

```java
@Getter
@Entity
public class Board {

    @Id
    private String id;
    
    @Version
    private Integer version;
}
```

<br>

> 비관적(Pessimistic) 락

트랜잭션의 충돌이 발생한다고 가정하고 우선 락을 걸고 보는 방식이다.

이것은 <span style="background-color:#F0E68C">데이터베이스가 제공하는 락 기능을 사용한다.</span> 대표적으로 select for update 구문이 있다.

<br>

JPA가 제공하는 비관적 락은 데이터베이스 트랜잭션 락 메커니즘에 의존하는 방법이다.

주로 `PESSIMISTIC_WRITE` 모드를 사용한다. 

- 엔티티가 아닌 스칼라 타입을 조회할 때도 사용할 수 있다.
- 데이터를 수정하는 즉시 트랜잭션 충돌을 감지할 수 있다.

<br>

▼ PESSIMISTIC_WRITE

비관적 락이라 하면 일반적으로 이 옵션을 뜻한다.

- 용도 : 데이터베이스에 `WRITE_LOCK`(쓰기 잠금)을 건다.
- 동작 : 데이터베이스 select for update를 사용해서 락을 건다.
- 이점 : NON-REPEATABLE READ를 방지한다. 락이 걸린 row는 다른 트랜잭션이 수정할 수 없다.

<br>

▼ PESSIMISTIC_READ

데이터를 반복 읽기만 하고 수정하지 않을 때 쓴다. 일반적으로 많이 사용하지 않는다.

데이터베이스에 `READ_LOCK`(읽기 잠금)을 건다.

<br>

비관적 락은 사용하면 락을 획득할 때까지 트랜잭션이 대기한다. 무한정 기다릴 수는 없으므로,

타임아웃 시간을 줄 수 있다. 참고로 타임아웃은 데이터베이스 특성에 따라 동작하지 않을 수 있다.

```java
public interface UserRepository extends JpaRepository<User, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @QueryHints({@QueryHint(name = "javax.persistence.lock.timeout", value ="3000")})
    User findByIdForUpdate(Long id);
}
```

위 예시 코드를 보면,

- PESSIMISTIC_WRITE를 사용했고,
- 데드락을 고려하여 타임아웃을 줬으며,
- forUpdate라고 네이밍함으로써 Write_Lock을 걸었다고 명시적으로 표현하고 있다.

<br>

## <span style="color:gray">Lock(잠금)</span>

---

#### <span style="background-color:black; color:white">Lock이란?</span>

Lock이란 트랜잭션 처리의 순차성을 보장하며, 공유 리소스의 동시성을 제어하기 위한 기능이다.

여러 커넥션에서 동일한 자원을 동시에 변경 하려고 하는데, 잠금이 없다면 하나의 데이터를 여러 커넥션에서 

동시에 변경할 수 있게 된다. 결과적으로 해당 데이터는 예측할 수 없는 상태가 된다.

잠금은 여러 커넥션에서 동시에 동일한 자원(레코드나 테이블)을 변경할 경우 어느 한 시점에는 하나의 커넥션만 

변경할 수 있게 해주는 역할을 한다.

<br>

#### <span style="background-color:black; color:white">Lock의 종류</span>

> 공유 잠금 (Shared Lock)

다른 트랜잭션이 같은 데이터를 읽는 것을 허용한다.

공유 잠금은 공유 잠금끼리 동시에 접근이 가능하지만, 공유 잠금이 설정된 데이터에 배타 잠금은 사용할 수 없다.

다른 말로 읽기 잠금 (Read Lock)이라고도 한다.

<br>

> 배타 잠금 (Exclusive Lock)

다른 트랜잭션이 같은 데이터를 읽거나 쓰는 것(INSERT, UPDATE, DELETE)을 허용하지 않는다.

배타 잠금은 잠금이 해제될 때까지 다른 트랜잭션(공유 잠금, 배타 잠금 포함)은 해당 데이터에 접근할 수 없다.

다른 말로 쓰기 잠금 (Write Lock)이라고도 한다.