---
layout: post
title: 쿼리 메소드 기능
categories: spring
tags: dataJpa
---

## <span style="color:gray">메소드 이름으로 쿼리 생성</span>

---

#### <span style="background-color:black; color:white">순수 JPA</span>

```java
public List<Member> findByUsernameAndAgeGreaterThan(String username, int age) {

    String jpql = "select m from Member m" +
                  " where m.username = :username" +
                  " and m.age > :age"

    return em.createQuery(jpql, Member.class)
            .setParameter("username", username)
            .setParameter("age", age)
            .getResultList();
}
```

<br>

#### <span style="background-color:black; color:white">스프링 데이터 JPA</span>

```java
@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    List<Member> findByUsernameAndAgeGreaterThan(String username, int age);

}
```

<br>

## <span style="color:gray">JPA NamedQuery</span>

---

#### <span style="background-color:black; color:white">순수 JPA</span>

```java
@Entity
@NamedQuery(
    name="Member.findByUsername",
    query="select m from Member m where m.username = :username"
    )
public class Member {
    //...
}
```
```java
public class MemberRepository {
    
    public List<Member> findByUsername(String username) {
        List<Member> resultList =
            em.createNamedQuery("Member.findByUsername", Member.class)
                .setParameter("username", username)
                .getResultList();
    }
}
```

<br>

#### <span style="background-color:black; color:white">스프링 데이터 JPA</span>

```java
@Entity
@NamedQuery(
    name="Member.findByUsername",
    query="select m from Member m where m.username = :username"
    )
public class Member {
    //...
}
```

```java
public interface MemberRepository extends JpaRepository<Member, Long> {

    @Query(name = "Member.findByUsername")
    List<Member> findByUsername(@Param("username") String username);
}
```

<br>

`@Query`를 생략하고 메서드 이름만으로 Named 쿼리를 호출할 수도 있다.

```java
public interface MemberRepository extends JpaRepository<Member, Long> {

    List<Member> findByUsername(@Param("username") String username);

}
```

<br>

## <span style="color:gray">@Query, 리포지토리 메소드에 쿼리 정의하기</span>

---

#### <span style="background-color:black; color:white">메서드에 JPQL 쿼리 작성</span>

```java
@Query("select m from Member m where m.username = :username and m.age = :age")
List<Member> findUser(@Param("username") String username, @Param("age") int age);
```

• `@org.springframework.data.jpa.repository.Query` 어노테이션을 사용

• 실행할 메서드에 **정적 쿼리**를 직접 작성하므로 이름없는 Named 쿼리라 할 수 있다.

• JPA Named 쿼리처럼 애플리케이션 실행시점에 문법 오류를 발견할 수 있다.

<br>

참고로 실무에서는 `메소드 이름으로 쿼리 생성 기능`은 파라미터가 증가하면

메서드 이름이 매우 지저분해진다. 따라서 `@Query` 기능을 자주 사용하게 된다.

<br>

## <span style="color:gray">@Query, 값, DTO 조회하기</span>

---

#### <span style="background-color:black; color:white">단순히 값 하나를 조회</span>

```java
@Query("select m from Member m")
List<String> findUsernameList();
```

<br>

#### <span style="background-color:black; color:white">DTO로 직접 조회</span>

```java
@Query("select new study.datajpa.dto.MemberDto(m.id, m.username, t.name) " +
       " from Member m join m.team t")
List<MemberDto> findMemberDto();
```

DTO로 직접 조회 하려면 JPA의 new 명령어를 사용해야 한다. 

그리고 위와 같이 생성자가 맞는 DTO가 필요하다. 

<br>

## <span style="color:gray">파라미터 바인딩</span>

---

#### <span style="background-color:black; color:white">컬렉션</span>

```java
@Query("select m from Member m where m.username in :names")
List<Member> findByNames(@Param("names") Collection<String> names);
```

<br>

## <span style="color:gray">반환 타입</span>

---

#### <span style="background-color:black; color:white">컬렉션</span>

• 결과가 없을 경우 : 빈 컬렉션 반환.

<br>

#### <span style="background-color:black; color:white">단건 조회</span>

• 결과가 없을 경우 : 없으면 `null` 반환

• 결과가 2건 이상 : `NonUniqueResultException` 예외 발생

<br>

참고로 `NonUniqueResultException` 예외가 터지면 스프링이 

`IncorrectResultSizeDataAccessException` 예외로 바꿔서 던진다.

<br>

## <span style="color:gray">페이징과 정렬</span>

---

#### <span style="background-color:black; color:white">스프링 데이터 JPA</span>

순수한 JPA만 사용했을 때는 페이징코드와 count 코드를 함께 작성해줘야 했다.

하지만 스프링 데이터 JPA를 사용하면 이 모든걸 **한 번에** 처리해준다.

<br>

**<u>▷ 페이징과 정렬 파라미터</u>**

> <em>패키지 : org.springframework.data.domain</em>


이 기능은 엄청나다. 관계형 DB든, 비관계형 DB든 페이징을 공통화를 시켜준다.

• `Sort` : 정렬 기능

• `Pageable` : 페이징 기능(내부에 **Sort** 포함)

<br>

**<u>▷ 특별한 반환 타입</u>**

> <em>패키지 : org.springframework.data.domain</em>

• `Page` : count 쿼리 결과를 포함하는 페이징

```java
public interface Page<T> extends Slice<T> {
    
    // 전체 페이지 수
    int getTotalPages();
    
    // 전체 데이터 수
    long getTotalElements(); 

    // 변환기
    <U> Page<U> map(Function<? super T, ? extends U> converter); 
}
```

<br>

• `Slice` : count 쿼리 결과 없이 다음 페이지 확인 가능

`Slice`는 내부적으로 `limt + 1` 만큼 조회를 한다.

흔히 보는 더보기 버튼이라고 생각하면 된다.

```java
public interface Slice<T> extends Streamable<T> {

    // 현재 페이지
    int getNumber();

    // 페이지 크기
    int getSize();

    // 현재 페이지에 나올 데이터 수
    int getNumberOfElement();

    // 조회된 데이터
    List<T> getContent();

    // 정렬 정보
    boolean hasContent();

    // 현재 페이지가 첫 페이지인지 여부
    boolean isFirst();

    // 현재 페이지가 마지막 페이지 인지 여부
    boolean isLast();

    // 다음 페이지 여부
    boolean hasNext();

    // 이전 페이지 여부
    boolean hasPrevious();

    // 페이지 요청 정보
    Pageable getPageable();

    // 다음 페이지 객체
    Pageable nextPageable();

    // 이전 페이지 객체
    Pageable previousPageable();

    // 변환기
    <U> Slice<U> map(Function<? super T, ? extends U> converter) 
}
```

<br>

#### <span style="background-color:black; color:white">예제 코드</span>

```java
public interface MemberRepository extends Repository<Member, Long> {

    Page<Member> findByAge(int age, Pageable pageable);
}
```
```java
// PageRequest.of(첫 번째 페이지, 페이지당 보여줄 데이터 수, 정렬조건)
PageRequest pageRequest
                = PageRequest.of(0, 3, Sort.by(Sort.Direction.DESC, "username"));

Page<Member> page = memberRepository.findByAge(age, pageRequest);
```

<br>

PageRequest 생성자의 첫 번째 파라미터에는 현재 페이지를, 두 번째 파라미터에는

조회할 데이터 수를 입력한다. 여기에 추가로 정렬 정보도 파라미터로 사용할 수

있다. 참고로 페이지는 0부터 시작한다.

<br>

#### <span style="background-color:black; color:white">페이지를 유지하면서 엔티티를 DTO로 변환하기</span>

```java
Page<MemberDto> dtoPage = page.map(
    m -> new MemberDto(m.getId(), m.getUsername(), m.getTeam().getName());
)
```

<br>

#### <span style="background-color:black; color:white">참고 : count 쿼리 분리</span>

```java
@Query(
        value = "select m from Member m join m.team t where m.age > :age",
        countQuery = "select count(m) from Member m where m.age > :age"
)
Page<Member> findMemberByAge(int age, )
```

위의 코드의 경우 count할 때 join이 필요가 없다. 이런 경우를 대비해

`@Query`는 쿼리를 분리해서 정의할 수 있는 방법을 제공한다.

그리고 이렇게 쿼리를 count를 할 때 분리하면 불필요한 join이 발생하지

않기 때문에 성능적으로 이득을 볼 수 있다.

<br>

## <span style="color:gray">벌크 연산</span>

---

#### <span style="background-color:black; color:white">JPA를 사용한 벌크성 수정 쿼리</span>

JPA를 사용한 벌크 연산은 <a href="https://gilbert9172.github.io/spring/2022/11/04/SpringBoot_JPA-%EB%B2%8C%ED%81%AC%EC%97%B0%EC%82%B0/" target="_blank">벌크 연산 정리 포스팅</a>에 정리가 되어있다.

주의할 점을 리마인드 해보면 벌크 **<span style="color:red">연산은 영속성 컨텍스트를 무시하고</span>**

바로 DB에 update쿼리를 날린다.

```java
public int bulkPlusAge(int age) {

    String jpql = "update Member m set m.age = m.age + 1 where m.age > :age";

    return em.createQuery(jpql).setParameter("age", 1).executeUpdate();
}
```

<br>

#### <span style="background-color:black; color:white">스프링 데이터 JPA를 사용</span>

```java
public interface memberRepository extends JpaRepository<Member, Long> {

    @Modifying //← 여기가 핵심
    @Query("update Member m set m.age = m.age + 1 where m.age > :age")
    int bulkPlusAge(@Param("age") int age);
}
```

벌크성 수정, 삭제 쿼리는 `@Modifying` 어노테이션을 붙혀주기만 하면 된다.

그리고 벌크성 작업을 하면 영속성 컨텍스트를 초기화 해줘야 하는데, 

`@Modifying` 어노테이션의 **<span style="background-color:#F0E68C">clearAutomatically 속성을 true로 주면된다.</span>**

이 옵션이 없으면 DB와 Application의 데이터의 동일성이 깨진다.

<br>

## <span style="color:gray">@EntityGraph</span>

---

#### <span style="background-color:black; color:white">JPA의 fetch join</span>

`fetch join`은 연관된 엔티티들을 한 번의 SQL로 조회하는 방법이다.

이 부분은 <a href="https://gilbert9172.github.io/spring/2022/10/19/SpringBoot_JPA-Fetch-Join/" target="_blank">Fetch Join 포스팅</a>에 정리가 되어있다.

```java
@Query("select m from Member m join fetch m.team m")
List<Member> findAllWithFetchJoin();
```

<br>

#### <span style="background-color:black; color:white">스프링 데이터 JPA에서 사용하기</span>

스프링 데이터 JPA는 fetch join을 보다 간편하게 사용할 수 있게 도와준다.

참고로 LEFT OUTER JOIN을 사용한다. 

<br>

**<u>▷ 공통 메서드 오버라이드</u>**

```java
@Override
@EntityGraph(attributePaths = {"team"})
List<Member> findAll();
```

<br>

**<u>▷ JPQL + @EntityGraph </u>**

```java
@EntityGraph(attributePaths = {"team"})
@Query("select m from Member m")
List<Member> findMemberWithJpqlAndEntityGraph();
```

<br>

**<u>▷ 메서드 이름으로</u>**

```java
@EntityGraph(attributePahts = {"team"})
List<Member> findByUsername(String username);
```

<br>

#### <span style="background-color:black; color:white">NamedEntityGraph</span>

JPA NamedQuery와 유사하다.

```java
@NamedEntityGraph(
    name = "Member.all", 
    attributeNodes = @NamedAttributeNode("team")
)
@Entity
public class Member {
    //...
}
```

```java
@EntityGraph("Member.all")
List<Member> findMemberEnityGraph();
```

<br>

## <span style="color:gray">JPA Hint</span>

---

#### <span style="background-color:black; color:white">JPA Hint란?</span>

JPA 쿼리 힌트를 사용하려면 `org.springframework.data.jpa.repository.QueryHints` 

어노테이션을 사용하면 된다. 참고로 이것은 SQL 힌트가 아니라 JPA 구현체에서 

제공하는 힌트이다.

이 기능은 단순한 조회 기능을 최적화해주는 기능같다. 그래서 데이터를 수정해도

Update 쿼리가 나가지 않는다.

```java
@QueryHints(
    value = @QueryHint(name = "org.hibernate.readOnly", value = "true")
)
Member findReadOnlyByUsername(String username);
```

<br>

#### <span style="background-color:black; color:white">쿼리 힌트 Page 추가 예제</span>

반환 타입으로 `Page` 인터페이스를 적용하면 추가로 호출하는 페이징을 위한

count 쿼리 힌트도 적용된다. 기본값은 true이다.

```java
@QueryHints(
    value = @QueryHint(name = "org.hibernate.readOnly", value = "true"),
    forCounting = true
)
Page<Member> findReadOnlyByUsername(String username, Pageable pageable);
```

<br>

## <span style="color:gray">Lock</span>

---

#### <span style="background-color:black; color:white">Lock이란?</span>

쿼리 시 락을 걸려면 `org.springframework.data.jpa.repository.Lock`

어노테이션을 사용하면 된다. 

> 추가 공부 필요

```java
@Lock(LockModeType.PESSIMISTIC_WRITE)
List<Member> findByUsername(String username);
```