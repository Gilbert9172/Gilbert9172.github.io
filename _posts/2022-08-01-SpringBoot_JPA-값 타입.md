---
layout: post
title: JPA의 데이터 타입 분류
categories: spring
tags: jpa
---

## <span style="color:gray">엔티티 타입</span>

---

• `@Entity`로 정의하는 객체

• 데이터가 변해도 **<span style="background-color:#F0E68C">식별자가 있어서 지속해서 추적 가능</span>**

• 공유 가능하다.

<br>

예를 들면 회원 엔티티의 키나 나이가 값을 변경해도 식별자(ID값)로 인식 가능.


<br>

## <span style="color:gray">값 타입</span>

---

• int, integer, string 처럼 단순히 값으로 사용하는 자바 기본 타입이나 객체

• **<span style="background-color:#F0E68C">식별자가 없고 값만 있으므로 변경시 추적 불가</span>**

예를 들면 아래와 같이 num의 값이 100에서 200으로 변하면 완전히 다른 값으로

변경이 되기 때문에 추적이 불가하다.

```java
int num = 100;
num = 200;
```

<br>

• **<span style="background-color:#F0E68C">🚨 생명 주기를 엔티티에 의존 🚨</span>** 

• 공유하지 않는 것이 안전 → 복사해서 사용

• **<span style="background-color:#F0E68C">🚨 불변 객체 🚨</span>** 로 만드는 것이 안전하다.

<br>

값 타입은 정말 값 타입이라 판단될 때만 사용해야 한다. 엔티티와 값 타입을 혼동해서

엔티티를 값 타입으로 만들면 안된다. 식별자가 필요하고, 지속해서 값을 추적, 변경해야 

한다면 그것은 값타입이 아닌 엔티티다.

<br>

#### <span style="background-color:black; color:white">기본 값 타입</span>

**<u>▷ 특징</u>**

• 자바 기본 타입

• 래퍼 클래스(Integer, Long...) 

• String

• **<span style="background-color:#F0E68C">🚨 생명 주기를 엔티티에 의존 🚨</span>** 

• 값 타입은 공유하면 안된다.

<br>

**<u>▷ 참고</u>**

int, double 같은 기본 타입은 절대 공유하면 안된다. 

기본 타입은 항상 값을 복사하는데 이를 코드로 이해해보자.

```java
int a = 10;
int b = a; //=> a의 10이 복사가 되서 b가 되는 것.

b = 20;

System.out.println(a);  // 10;
System.out.println(b);  // 20;
```

<br>

Integer 같은 래퍼 클래스나 String 같은 특수한 클래스는 공유 가능한 객체이지만 

변경할 수 있는 방법도 없기 때문에 변경 불가하다.

<br>

이렇게 자바의 기본 값 타입이 안전하게 잘 설계되어 있기 때문에 우리는 안전하게

개발을 할 수 있다. 근데 이건 정말 자바의 기본이라 우리가 딱히 인지하지 않고

있었는데 JPA에서 자세히 다루는 이유가 뭘까? 앞으로 그 이유를 차차 알게 될 것이다.

<br>

#### <span style="background-color:black; color:white">임베디드 타입(복합 값 타입)</span>

> 고통 카테고리를 가지는 속성들을 하나의 클래스로 뽑아내는 것이랑 비슷하다.

**<u>▷ 특징</u>**

• 새로운 값 타입을 직접 정의할 수 있다.

• JPA는 임베디드 타입이라고 한다.

• 주로 기본 값 타입을 모아서 만들어서 복합 값 타입이라고도 한다.

• int, String 과 같은 값 타입이다.

<br>

**<u>▷ 임베디드 타입 사용법</u>**

• `@Embeddable` : 값 타입을 정의하는 곳에 표시

• `@Enbedded` : 값 타입을 사용하는 곳에 표시

• 기본 생성자 필수

<br>

**<u>▷ 임베디드 타입의 장점</u>**

재사용성과 높은 응집도를 가지고 있으며, 해당 값 타입만 사용해서 의미 있는 

메소드를 만들 수 있다. 또한 **임베디드 타입을 포함한 모든 값 타입**은, 값 타입을 

소유한 **<span style="background-color:#F0E68C">🚨 엔티티의 생명주기에 의존 🚨</span>** 한다.

<br>

**<u>▷ 임베디드 타입과 테이블 매핑</u>**

• 임베디드 타입은 엔티티의 값일 뿐이다.

• **<span style="background-color:#F0E68C">임베디드 타입을 사요하기 전과 후에 매핑하는 테이블은 같다.</span>**

• 객체와 테이블을 아주 세밀하게 매핑하는 것이 가능하다.

• 잘 설계한 ORM 애플리케이션은 매핑한 테이블의 수보다 **<span style="background-color:#F0E68C">클래스의 수가 더 많다.</span>**

<br>

**<u>▷ 임베디드 타입 예시 코드</u>**

임베디드 타입을 사용하기 전에는 Member엔티티 객체는 아래와 같다.

```java
@Entity
public class Member extends BaseEntity{

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="MEMBER_ID")
    private Long id;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private String city;
    private String address;
    private String zipCode;

}
```

<br>

임베디드 타입을 쓰면 보다 객체지향스럽게 엔티티 코드가 나온다.

```java
@Entity
public class Member extends BaseEntity{

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="MEMBER_ID")
    private Long id;

    @Embedded
    private Period period;

    @Embedded
    private Address address;

}
```

<br>

임베디드 타입을 사용하면 `isWorkTime()`과 같이 해당 값 타입만 사용해서 

의미 있는 메소드를 만들 수 있다

```java
@Embeddable
@Getter @Setter
@NoArgsConstructor
public class Period {

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    public boolean isWorkTime() {
        
        return 현재시간이 startDate와 endDate 사이?
    }

}
```

```java
@Embeddable
@Getter @Setter
@NoArgsConstructor
public class Address {

    private String city;
    private String address;
    private String zipCode;

}
```

<br>

**<u>▷ 임베디드 타입과 연관관계</u>**

엔티티는 임베디드 타입을 가질수 있으며, 임베디드 타입 또한 엔티티를 가질수 있다.


```java
@Embeddable
@Getter @Setter
@NoArgsConstructor
public class Address {

    private String city;
    private String address;
    private String zipCode;

    @OneToOne(fetch = LAZY)
    @JoinColumn(name = "MEMBER_ID")
    private MemberPrac memberPrac;

}
```

<br>

**<u>▷ 하나의 엔티티에서 같은 값 타입을 사용하려면?</u>**

`@AttributeOverride`, `@AttributeOverrides`를 사용해서 컬럼명 속성을 재정의하면 된다.

```java
@Entity
public class Member extends BaseEntity{

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="MEMBER_ID")
    private Long id;

    @Embedded
    private Period period;

    @Embedded
    private Address homeAddress;

    @AttributeOverrides({
              @AttributeOverride(name="city", column=@Column(name="WORK_CITY")),
              @AttributeOverride(name="street", column=@Column(name="WORK_STREET")),
              @AttributeOverride(name="zipCode", column=@Column(name="WORK_ZIP_CODE"))
          })
    private Address workAddress;

}
```

아래와 같이 컬럼들이 정의되는 것을 확인할 수 있다.

```sql
create table Member (
        MEMBER_ID bigint not null,
        createdBy varchar(255),
        createdDate timestamp,
        lastModifiedBy varchar(255),
        lastModifiedDate timestamp,
        city varchar(255),
        street varchar(255),
        zipCode varchar(255),
        endDate timestamp,
        startDate timestamp,
        USERNAME varchar(255),
        WORK_CITY varchar(255),
        WORK_STREET varchar(255),
        WORK_ZIP_CODE varchar(255),
        TEAM_ID bigint,
        primary key (MEMBER_ID)
    )
```

<br>

**<u>▷ 임베디드 타입과 null</u>**

임베디드 타입의 값이 null이면 당연히 매핑한 컬럼 값은 모두 null이다.


<br>

#### <span style="background-color:black; color:white">컬레션 값 타입</span>

**<u>▷ 특징</u>**
 
• 값 타입을 하나 이상 지정할 때 사용

• `@ElementCollection`, `@CollectionTable` 어노테이션 사용

```java
@ElementCollection
@CollectionTable(
        name = "ADDRESS",
        //=> 조인 식별자는 넣어주어야 한다.
        joinColumns = @JoinColumn(name = "MEMBER_ID")
)
private List<Address> addressHistory = new ArrayList<>();
```

• 데이터베이스는 컬렉션을 같은 테이블에 저장할 수 없다.

• 컬렉션을 저장하기 위한 별도의 테이블이 필요함.

<br>

**<u>▷ 저장</u>**

```java
Member member1 = new Member();
member1.setUsername("member1");
member1.setHomeAddress(new Address("city1", "street1", "10000"));

member1.getFavoriteFoods().add("치킨");
member1.getFavoriteFoods().add("족발");
member1.getFavoriteFoods().add("피자");

member1.getAddressHistory().add(new Address("city2", "street2", "20000"));
member1.getAddressHistory().add(new Address("city3", "street3", "30000"));

//=> 여기 주목
em.persist(member1);
```

위 코드를 보면 마지막에 Member 객체 하나만 영속성 컨텍스트에 저장해주고 

값 타입 컬렉션은 따로 저장해주지 않았다. 그러나 DB에는 기대하던데로 데이터가

잘 삽입되었다. 왜 그럴까? 

<br>

이유는, 값 타입의 라이프 사이클은  **<span style="background-color:#F0E68C">🚨 엔티티의 생명주기에 의존 🚨</span>** 하기 때문이다.

위의 예제로 보면 FavoriteFood와 AddressHistory의 라이프 사이클은 모두 

Member 엔티티의 라이프 사이클에 의존한다.

<br>

참고로 값 타입 컬렉션은 `영속성 전이(Cascade) + 고아 객체 제거 기능`을 필수로

가진다고 볼 수 있다.

<br>

**<u>▷ 조회</u>**

기본적으로 `@ElementCollection` 어노테이션은 **<span style="background-color:#F0E68C">지연로딩</span>** 전략을 사용한다.

<img src="/assets/img/jpa/값타입/@ElementCollection.png"><br>

<br>

**<u>▷ 수정</u>**

```java
Member findMember = em.find(Member.class, member1.getId());

❌ 잘못된 방법 → 부작용 위험 ❌
findMember.getHomeAddress().setCity("New City");

⭕️ 올바른 방법 → 새로운 인스턴스 삽입 ⭕️
findMember.getAddressHistory().remove(new Address("city2", "street2", "20000"));
findMember.getAddressHistory().add(new Address("city20", "street20", "21111"));

// 치킨을 한식으로 변경
findMember.getFavoriteFoods().remove("치킨");
findMember.getFavoriteFoods().add("한식");
```

값 타입을 수정할 때는 **<span style="background-color:#F0E68C">인스턴스 단위</span>** 로 데이터를 업데이트 해줘야한다.

그리고 **정확히 일치하는 값**을 제거해줘야 한다. 이떄 `hashCode()` 메소드의 위력이

발휘된다.

<br>

데이터가 잘 바뀌는 것을 확인할 수 있다.

|MEMBER_ID|FOOD_NAME|
|---------|---------|
|1|족발|
|1|피자|
|1|한식|


|MEMBER_ID|CITY|STREET|ZIPCODE|
|---------|----|------|-------|
|1|city3|street3|30000|
|1|city20|street20|21111|

<br>

이제 JPA가 날린 쿼리를 확인해 보자.

```sql
delete 
from
    ADDRESS 
where
    MEMBER_ID=1
```
```sql
insert into ADDRESS (MEMBER_ID, city, street, zipCode) 
values (?, ?, ?, ?)
```
```sql
insert into ADDRESS (MEMBER_ID, city, street, zipCode) 
values (?, ?, ?, ?)
```

분명히 하나의 인스트턴스만 수정했는데 왜 ADDRESS 테이블에서 MEMBER_ID가

1인 데이터를 전부 삭제한 후, 두 번의 INSERT 쿼리를 보낸걸까..?

다음으로는 갑 타입 컬렉션의 제약사항에 대해서 알아보겠다.

<br>

**<u>▷ 값 타입 컬렉션의 제약사항</u>**

• 값 타입은 엔티티와 다르게 식별자 개념이 없다. → 변경시 추적 불가

• 값은 변경하면 추적이 어렵다.

• 값 타입 컬렉션에 변경 사항이 발생하면, **<span style="background-color:#F0E68C">주인 엔티티와 연관된 모든 데이터</span>** 를

**<span style="background-color:#F0E68C">삭제</span>** 하고, **<span style="background-color:#F0E68C">값 타입 컬렉션에 있는 현재 값을 모두 다시 저장</span>** 한다.

그런데 이렇게 기존에 있던 데이터가 전부 지워지는 끔찍한 상황을

맞이할 것이다. 이 문제를 해결하는 방법은 없을까?

<br>

사실 `@OrderColumn` 어노테이션을 쓰면 해결이 아예 안되는 것은 아니다.

```java
@OrderColumn(name = "address_history_order")
@ElementCollection
@CollectionTable(
        name = "ADDRESS",
        joinColumns = @JoinColumn(name = "MEMBER_ID")
)
private List<Address> addressHistory = new ArrayList<>();
```

|ADDRESS_HISTORY_ORDER|MEMBER_ID|CITY|STREET|ZIPCODE|
|---------|----|------|-------|---------------------|
|0|1|city3|street3|30000|0|
|1|1|city20|street20|21111|1|

하지만 이 또한 개발자의 의도대로 흘러가지 않는 경우가 많다.

<br>

그렇다면 이 문제는 어떻게 해결할 수 있을까? 정답은 바로!!!

갑 타입 컬렉션을 매핑하는 테이블은 모든 컬럼을 묶어서 기본 키를 구성하면 한다.

이때 **<span style="color:red">null은 입력하면 안되고, 중복 저장 또한 해선 안된다.</span>**

<br>

**<u>▷ 값 타입 컬렉션 대안</u>**

실무에서는 상황에 따라 값 타입 컬렉션 대신에 **일대다 관계**를 고려해 볼 수도 있다.

일대다 관계를 위한 별도의 엔티티를 만들고, 여기에서 값 타입을 사용하면 된다.

그리고 `영속성 전이(Cascade) + 고아 객체 제거 기능`을 사용해서 값 타입 

컬렉션 처럼 사용하면 된다.

```java
@Entity
@Table(name = "ADDRESS")
public class AddressEntity {

    @Id @GeneratedValue
    private Long id;

    private Address address;

    public AddressEntity(Address address) {
        this.address = address;
    }

}
```

```java
@Entity
public class Member {

    @Id @GeneratedValue
    @Column(name="MEMBER_ID")
    private Long id;

    @OneToMany()
    @JoniColumn(name = "MEMBER_ID") // Address Entity의 FK
    private List<AddressEntity> addressHistory = new ArrayList<>();

}
```

|ID|CITY|STREET|ZIPCODE|MEMBER_ID|
|--|----|------|-------|---------|
|2|city2|street2|20000|1|
|3|city3|street3|30000|1|

<br>

## <span style="color:gray">값 타입과 불변 객체</span>

---

값 타입은 복잡한 객체 세상을 조금이라도 단순화하려고 만든 개념이다.

따라서 값 타입은 단순하고 안전하게 다룰수 있어야 한다.

<br>

#### <span style="background-color:black; color:white">값 타입의 공유 참조 && 값 타입의 복사</span>

임베디드 타입 같은 값 타입을 여러 엔티티에서 공유하면 부작용(Side-Effect)이

발생하여 매우 위험하다! 코드로 어떤 부작용이 생기는지 알아보자!

<br>

아래 코드에서 하나의 Address 객체를 두 개의 Member 엔티티가 공유해서 쓴다.

```java
Address address1 = new Address("city", "street", "10000");
Member member1 = new Member("member1", address1);
em.persist(member1);

Member member2 = new Member("member2", address1);
em.persist(member2);

member1.getHomeAddress().setCity("newCity");
```

마지막에 address의 city 값을 `newCity`로 바꿔줬더니 이런 쿼리가 **<span style="color:red">2번</span>** 나갔다.

즉, 원치 않은 UPDATE 쿼리가 한 번더 나가는 **<span style="color:red">부작용이 발생</span>** 한 것이다.

```sql
update
    Member
set
    createdBy=?,
    createdDate=?,
    lastModifiedBy=?,
    lastModifiedDate=?,
    city=?,
    street=?,
    zipCode=?,
    endDate=?,
    startDate=?,
    TEAM_ID=?,
    USERNAME=? 
where
    MEMBER_ID=?
```

이렇게 값 타입의 실제 인스턴스인 값을 공유하는 것은 매우 위험하기 

때문에 **<span style="color:red">항상 인스턴스를 복사해서 사용해야 한다.</span>**

```java
Address address1 = new Address("city", "street", "10000");
Member member1 = new Member("member1", address1);
em.persist(member1);

//=> 값 타입 복사
Address address2 = new Address(address.getCity(), address.getStreet(), address.getZipCode());
Member member2 = new Member("member2", address2);
em.persist(member2);

member1.getHomeAddress().setCity("newCity");
```

<br>

#### <span style="background-color:black; color:white">객체 타입의 한계</span>

물론 항상 값을 복사해서 사용하면 공유 참조로 인해 발생하는 부작용을


피할 순 있다. 하지만 문제는 임베디드 타입 처럼 **<span style="background-color:#F0E68C">직접 정의한 값 타입은</span>** 

**<span style="background-color:#F0E68C">자바의 기본(primitive) 타입이 아니라 객체 타입이다.</span>**

앞서 봤듯 자바 기본 타입에 값을 대입하면 기본적으로 값을 복사한다.

객체 타입은 참조 값을 직접 대입하는 것을 막을 방법이 없다. 

결과적으로 **<span style="color:red">객체의 공유 참조는 피할 수 없다!</span>**

<br>

#### <span style="background-color:black; color:white">불변 객체</span>

객체 공유 참조를 피하는 방법이 아예 없는 것일까..? 그렇지는 않다.

객체를 만들 때 애초에 **<span style="background-color:#F0E68C">불변 객체</span>** 로 만들면된다!

불변 객체란 생성 시점 이후 절대 값을 변경할 수 없는 객체를 말한다.

<br>

• 객체 타입을 수정할 수 없게 만들면 부작용을 원천 차단

• 값 타입은 불변 객체(Immutable object)로 설계 해야한다.

• 생성자로만 값을 설정하고 수정자(Setter)를 만들지 않으면 된다.

• 참고로 Integer, String은 자바가 제공하는 불변 객체이다.

• 만약 값을 바꿀라면 새로운 값 타입 인스턴스를 생성해야 한다.

<br>

결론 : 불변이라는 작은 제약으로 부작용이라는 큰 재앙을 막을 수 있다.

<br>

## <span style="color:gray">값 타입 비교</span>

---

#### <span style="background-color:black; color:white">동일성(Identity) 비교</span>

• 인스턴스의 참조 값을 비교

• == 사용

<br>

#### <span style="background-color:black; color:white">동등성(Equivalence) 비교</span>

• 인스턴스의 값을 비교

• `equals()` 메소드 사용

• 값 타입은 `equals()` 메소드를 사용해서 동승성 비교를 해야한다.

• 값 타입의 `equals()` 메소드를 적절하게 재정의한다. → 주로 모든 필드 사용

```java
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Address address = (Address) o;
    return Objects.equals(city, address.city) 
            && Objects.equals(street, address.street) 
            && Objects.equals(zipCode, address.zipCode);
}

@Override
public int hashCode() {
    return Objects.hash(city, street, zipCode);
}
```