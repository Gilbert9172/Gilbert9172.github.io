---
layout: post
title: 엔티티 매핑
categories: spring
tags: jpa
---

## <span style="color:gray">엔티티 매핑</span>

---

#### <span style="background-color:black; color:white">엔티티 매핑 소개</span>

|설명|어노테이션|
|----|----------|
|객체와 테이블 매핑|@Entity, @Table|
|필드와 컬럼 매핑|@Column|
|기본 키 매핑|@Id|
|연관관계 매핑|@ManyToOne, @JoinColumn|

<br>

## <span style="color:gray">객체와 테이블 매핑</span>

---

#### <span style="background-color:black; color:white">@Entity</span>

• `@Entity`가 붙은 클래스는 JPA가 관리하는 엔티티라고 한다.

• JPA를 사용해서 테이블과 매핑할 클래스는 `@Entity` 필수

• **<span style="background-color:#F0E68C">기본 생성자 필수(파라미터가 없는 pulic 또는 protected 생성자)</span>**

• final 클래스, enum, interface, inner 클래스 사용 ❌

• 저장할 필드에 final 사용 ❌

<br>

#### <span style="background-color:black; color:white">@Entity 속성 정리</span>

**<u>name</u>**

```java
@Entity(name="test")
public class Test() {...}
```

<br>

**<u>@Table</u>**

```java
@Entity
@Table(name = "TB_MEMBER")
public class Member {...}
```

엔티티와 매핑할 DB 테이블 지정

|속성|기능|기본값|
|----|----|------|
|name|매핑할 테이블 이름|엔티티 이름을 사용|
|catalog|데이터베이스 catalog 매핑|
|schema|데이터베이스 schema 매핑|
|uiqueConstraints|DDL 생성시에 유니크 제약 조건 생성|

<br>

## <span style="color:gray">데이터베이스 스키마 자동 생성</span>

---

#### <span style="background-color:black; color:white">특징</span>

• 애플리케이션 실행 시점에 자동으로 DDL을 생성

• 테이블 중심에서 객체 중심으로 개발 가능

• **<span style="background-color:#F0E68C">데이터베이스 방언을 활용해서 데이터베이스에 맞는 적절한 DDL 생성</span>**

<br>

여기서 자동으로 생성된 DDL은 개발단(Ex. localhost)에서만 사용해야 한다.(운영서버에서는 Nope!)

만약 사용하고 싶다면 꼼꼼히 다듬은 후에 사용해야 한다.

<br>

#### <span style="background-color:black; color:white">DDL 생성기능</span>

DDL 생성 기능은 DDL을 자동 생성할 때만 사용되고, JPA의 실행 로직에는 영향을 주지 않는다.

```java
// 제약조건 추가: 회원 이름은 필수, 10자 초과X
@Column(nullable = false, length = 10)
private String userName;

// 유니크 제약 조건 추가
@Table(uniqueConstraints = {
    @UniqueConstraint(name="NAME_AGE_UNIQUE", columnNames = {"NAME" : "AGE"})
})
```

<br>

#### <span style="background-color:black; color:white">속성</span>

```xml
<property name="hibernate.hbm2ddl.auto" value="create"/>
```

|옵션|설명|
|----|----|
|create|기존테이블 삭제 후 다시 생성 (DROP + CREATE)|
|create-drop|create와 같으나 종료시점에 테이블 DROP|
|update|변경분만 반영 => 운영DB에는 사용하면 안됨|
|validate|엔티티와 테이블이 정상 매핑되었는지만 확인|
|none|사용하지 않음|

<br>

#### <span style="background-color:black; color:white">주의사항</span>

> 스크립트 짜서 해라!!

***<span style="color:Red">운영장비에는 절대!!! create, create-drop, update 사용하면 안된다.</span>***

|Case|Option|
|----|------|
|개발 초기 단계|create / update|
|테스트 서버|update / validate (가급적이면 둘다 쓰지 않기)|
|스테이징과 운영서버|validate / none|

<br>

## <span style="color:gray">필드와 컬럼 매핑</span>

---

#### <span style="background-color:black; color:white">예제</span>

```java
// pk
@Id
private Long id;

// 컬럼명
@Column(name = "name")
private String name;

private Integer age;

// enum 타입 매핑
@Enumerated(EnumType.STRING)
private RoleType roleType;

// 날짜 타입 매핑
@Temporal(TemporalType.TIMESTAMP)
private Date createdDate;

// 큰 데이터를 넣고 싶을 때
// @Lob + String = C-LOB
@Lob
private String description;

// 특정 필드를 컬럼에 매핑하지 않음 => 메모리에서만 쓸 때
@Transient
private String temp;
```

<br>

**<u>@Column</u>**

<img src="/assets/img/jpa/columnMapping.png">

unique = true 의 경우에는 자동으로 생성되는 이름을 해석하기 힘들다.

따라서 class 레벨에서 `@Table`을 지정해서 사용하는게 좋다.

<br>

**<u>@Enumerated</u>** ***<span style="color:red">(ORDINAL 사용금지)</span>***

|옵션|설명|
|----|----|
|ORDINAL|enum 순서를 데이터베이스에 저장|
|STRING|enum 이름을 데이터베이스에 저장|

<br>

**<u>@Temporal</u>**

> 참고 : LocalDate, LocalDateTime을 사용할 때는 생략 가능

날짜 타입(Date, Calendar)을 매핑할 때 사용.

<br>

**<u>@Lob</u>**

• 데이터베이스 BLOB, CLOB 타입과 매핑

• @Lob에는 지젖ㅇ할 수 있는 속성이 없다.

• 매핑하는 필드 타입이 문자면 CLOB, 나머지는 BLOB

<br>

## <span style="color:gray">기본 키 매핑</span>

---

#### <span style="background-color:black; color:white">직접할당</span>

**<u>@Id</u>**

id 직접 할당.

```java
@Id
private Long id;
```

<br>

#### <span style="background-color:black; color:white">자동 생성 (@GeneratedValue)</span>

**<u>IDENTITY 전략</u>**

> 기본키 생성을 데이터베이스에 위임. (주로 MySQL, PostgreSQL, SQL Server, DB2에서 사용)

JPA는 보통 트랜잭션 커밋 시점에서 INSERT SQL이 실행되는데, IDENTITY의 경우에는

`em.persist()` 시점에 <span style="color:red">즉시 INSERT SQL을 실행</span>하고, DB에서 식별자를 조회한다.

그래서 IDENTITY 전략의 경우에는 쿼리들을 모아서 flush하는게 불가능하다.

참고로 AUTO_INCREMENT는 데이버테이스에 INSERT SQL을 실행한 이후에 ID값을 알 수 있다.

<br>

**<u>SEQUENCE 전략</u>**

> 데이터베이스 시퀀스 오브젝트 사용. (ORACLE의 경우 @SequenceGenerator 필요)

데이터베이스 시퀀스는 유일한 값을 순서대로 생성하는 특별한 데이터베이스 Object.

주로 오라클, PostgreSQL, H2 데이터베이스에서 사용한다.

그리고 Sequence 전략은 IDENTITY 전략과는 다르게 **<span style="background-color:#F0E68C">버퍼기능</span>** 을 지원한다.

```java
@Entity
public class Member {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
}
```

동작 방법은 아래와 같다.

|순서|동작 방법|
|----|---------|
|1|em.persist(member) 시점에는 시퀀스 값 없음|
|2|DB에서 시퀀스 값을 조회해서 가져옴|
|3|member에 시퀀스 값을 넣어줌|
|4|영속성 컨텍스트에 저장|
|5|INSERT 쿼리는 안날아감(Commit 때 flush)|

추가 적으로 테이블 마다 시퀀스를 따로 관리하고 싶다면 `@SequenceGenerator` 어노테이션을

사용하면 된다.

```java
@Entity
@SequenceGenerator(
    name = "MEMBER_SEQ_GENERATOR",
    sequenceName = "MEMBER_SEQ",
    initialValue = 1,
    allocationSize = 1
)
public class Member {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "MEMBER_SEQ_GENERATOR")
    private Long id;
}

```

<br>

그런데 여기서 의문점은 2번에서 매번 DB조회를 하면 성능저하가 생기지 않을까

하는 부분이다. 이런 부분을 막고자 `allocationSize` 라는 속성이 있다.

```java
@Entity
@SequenceGenerator(
    name = "MEMBER_SEQ_GENERATOR",
    sequenceName = "MEMBER_SEQ", //매핑할 데이터베이스 시퀀스 이름
    initialValue = 1, 
    allocationSize = 50)
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "MEMBER_SEQ_GENERATOR"
    private Long id;
}
```
allocationSized을 50으로 지정해두면 처음에 persist할 때 1-51까지 미리 시퀀스를 

메모리에 올려둔다. 따라서 50번 까지는 DB에 접근을 하지 않기 때문에 성능 최적화를

할 수 있다.

<br>

**<u>Table 전략</u>**

> 키 생성 전용 테이블을 하나 만들어서 DB 시퀀스를 흉내내는 전략 (잘 안씀)

장점 : 모든 데이터베이스에 적용 가능

단점 : 성능 이슈

```sql
create table MY_SEQUENCES (
    sequence_name varchar(255) not null,
    next_val big int,
    primary key ( sequence_naem )
)
```

```java
@Entity
@TableGenerator(
    name = "MEMBER_SEQ_GENERATOR",
    table = "MY_SEQUENCES",
    pkColumnValue = "MEMBER_SEQ",
    allocationSize = 1
    )
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "MEMBER_SEQ_GENERATOR")
    private Long id; 
}
```

<br>

**<u>권장하는 식별자 전략</u>**

**<span style="background-color:#F0E68C">Long Type + 대체키 + 키 생성 전략 사용</span>**

→ 기본 키 제약 조건 : null이면 안된다, 유일해야 한다, 변하면 안된다.

→ 미래까지 이 조건을 만족하는 자연키는 찾기 어렵다. 대체키 사용

→ 비즈니스 키와 관련 없는 키를 사용해야 한다.

> 자연키 : 주민번호, 전화번호 등등

---












