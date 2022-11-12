---
layout: post
title: 확장 기능
categories: spring
tags: dataJpa
---

## <span style="color:gray">사용자 정의 리포지토리 구현</span>

---

#### <span style="background-color:black; color:white">언제 쓸까?</span>

스프링 데이터 JPA 레포지토리는 인터페이스만 정의하고, 구현체는 스프링이

자동 생성해준다. 그렇다면 개발자가 직접 이를 구현하면 안되는 걸까?

해도 되긴하지만 구현해야 하는 기능이 너무 많아지게 된다.

<br>

JPA 직접 사용하거나, 스프링 JDBC Template, MyBatis, Querydsl 사용 등등..

위의 기술을 직접 사용해서 인터페이스의 메서드를 직접 구현하고 싶다면 

어떻게 해야하는지 알아보자.


<br>

#### <span style="background-color:black; color:white">예제 코드</span>

**<u>▷ 커스텀 인터페이스 생성</u>**

```java
public interface MemberRepositoryCustom {
    List<Member> findMemberCustom();
}
```

<br>

**<u>▷ 커스텀 인터페이스 구현체 생성</u>**

```java
@RequiredArgsConstructor
public class MemberRepositoryCustomImpl implements MemberRepositoryCustom {

    private final EntityManager em;

    @Override
    public List<Member> findMemberCustom() {
        return em.createQuery("select m from Member m",Member.class)
                .getResultList();
    }
}
```

<br>

**<u>▷ 커스텀 인터페이스 상속</u>**

```java
@Repository
public interface MemberRepository extends 
                JpaRepository<Member, Long>, MemberRepositoryCustom {
    //...
}
```

<br>

#### <span style="background-color:black; color:white">참고</span>

항상 사용자 정의 레포지토리가 필요한 것은 아니다. 그냥 임의의 레포지토리를

만들어도 된다. 예를 들어 `MemberQueryRepository`를 인터페이스가 아닌 클래스로

만들고 스프링 빈으로 등록해서 그냥 직접 사용하면 된다. 

물론 이 경우 스프링 데이터 JPA와는 아무런 관계 없이 별도로 동작한다.

<br>

결국 실무에서 일을 할 때는 두 가지로 나누는 것이 좋다.

    ⒈ 순수한 비즈니스 로직이 담긴 레포지토리

    ⒉ 단순히 화면이나 API 스펙을 맞추기 위한 로직이 담긴 레포지토리

<br>

JPA 레포지토리는 결국 사용자 정의 레포지토리도 상속을 받는 것이기 때문에 

사용자 정의 레포지토리가 많이지면 많아질 수록 덩치가 커지게 된다.

이런 문제는 개발자로 하여금 코드의 가독성을 떨어뜨리며 핵심 로직과 비핵심 

로직을 분간하기 어렵게 만든다.

<br>

## <span style="color:gray">Auditing</span>

---

실무에서는 데이터가 잘못 반영 됐을 때 언제, 누가 데이터를 변경했는지

추적하기 위해 테이블마다 수정날짜, 등록날짜, 수정자, 등록자를 거의 필수로

넣어줘야 한다. JPA와 스프링 데이터 JPA 모두 이런 기능을 제공한다.

<br>

#### <span style="background-color:black; color:white">순수 JPA 사용</span>

<a href="https://gilbert9172.github.io/spring/2022/07/27/SpringBoot_JPA-mappedSuperClass/" target="_blank">@MappedSuperclass 포스팅</a>에도 정리를 해두었다. 

이번에는 추가적인 내용도 함께 정리를 해보았다.

<br>

```java
@Getter
@MappedSuperclass
public class JpaBaseEntity {

    @Column(updatable = false)
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    @PrePersist
    public void prePersits() {
        LocalDateTime now = LocalDateTime.now();
        createDate = now;
        updateDate = now;
    }

    @PreUpdate
    public void preUpdate() {
        updateDate = LocalDateTime.now();
    }

}
```

코드를 보면 `@PrePersist`, `@PreUpdate` 어노테이션을 사용하였다.

자세한 설명이 <a href="https://ttl-blog.tistory.com/191" target="_blank">여기</a>에 잘 정리되어 있다.

<br>

최초에 등록일과 수정일을 같은 시간으로 한 이유는 아래와 같다.

    ⒈ (등록일 == 수정일) ? 최초 등록된 테이터 : 변경된 데이터 

    ⒉ `null` 값이 들어가는걸 예방하기 위해.

<br>

#### <span style="background-color:black; color:white">스프링 데이터 JPA 사용</span>

우선 사용하기 앞서 몇 가지 설정을 해주어야 한다.

**<u>▷ @EnableAuditing 설정</u>**

<img src ="/assets/img/dataJpa/auditing.png"><br>

**<u>▷ @EntitiyListeners 설정</u>**

```java
@Getter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class BaseTimeEtity {

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createDate;

    @LastModifiedDate
    private LocalDateTime updateDate;
}
```
```java
@Getter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class BaseEntity extends BaseTimeEtity {

    @CreatedBy
    @Column(updatable = false)
    private String createdBy;

    @LastModifiedBy
    private String lastModifiedBy;

}
```

<br>

**<u>▷ 등록자 및 수정자 설정 Bean 등록</u>**

<img src="/assets/img/dataJpa/등록자수정자등록.png"><br>

빨간 네모 표시는 세션 사용시 세션에서 id값을 가져오는 Bean을 등록하면

되고, 시큐리티 사용시 시큐리티 로그인 정보에서 ID를 받아오면 된다.

<br>

## <span style="color:gray">Web 확장</span>

---

#### <span style="background-color:black; color:white">도메인 클래스 컨버터</span>

HTTP 파라미터로 넘어온 엔티티의 아이디로 엔티티 객체를 찾아서 바인딩한다.

**<u>▷ 도메인 클래스 컨버터 사용 전</u>**

```java
@RestController
@RequiredArgsConstructor
public class MemberController {

    private final MemberRepository memberRepository;
    
    @GetMapping("/members/{id}")
    public String findMember(@PathVariable("id") Long id) {
        Member member = memberRepository.findById(id).get();
        return member.getUsername();
    }
}
```

<br>

**<u>▷ 도메인 클래스 컨버터 사용 후</u>**

```java
@RestController
@RequiredArgsConstructor
public class MemberController {

    private final MemberRepository memberRepository;

    @GetMapping("/members/{id}")
    public String findMember(@PathVariable("id") Member member) {
        return member.getUsername();
    }

}
```

Http 요청은 회원 `id`를 받지만 **<span style="background-color:#F0E68C">도메인 클래스 컨버터</span>** 가 중간에 동작해서 

회원 엔티티 객체를 반환한다. 도메인 클래스 컨버터가 용 빼는 재주가 있는건

아니고, 레퍼지토리를 사용해서 엔티티를 찾는 것이다.

<br>

여기서 주의해야 할 부분은 도메인 클래스 컨버터가 반환해주는 객체는 

**<span style="color:red">트랜잭션 범위 밖</span>** 에서 엔티티를 조회했기 때문에 영속 상태가 아니다.

즉, 엔티티의 필드 값을 변경해서 DB에 반영되지 않는다.

<br>

#### <span style="background-color:black; color:white">페이징과 정렬</span>

**<u>▷ 페이징과 정렬 예제</u>**

```java
@GetMapping("/members")
public Page<Member> list(@RequestParam("age") int age, Pageable pageable) {
    return memberRepository.findByAge(age, pageable);
}
```

파라미터로 `Pageable`을 받을 수 있다.

그리고 Pageable 인터페이스는 PageRequest 객체를 생성해준다.

|요청 파라미터|설명|
|-------------|----|
|page|현재 페이지, `0부터 시작`한다.|
|size|한 페이지에 노출할 데이터 건수|
|sort|정렬 조건을 정의한다.|

|기본값|
|------|
|spring.data.web.pageable.default-page-size=20|
|spring.data.web.pageable.max-page-size=2000|

<br>

**<u>▷ 포스트맨에서 요청 보내보기</u>**

포스트맨에서 아래의 URL로 요청을 보내면 적절한 응답을 받는다.

<img src="/assets/img/dataJpa/paging.png"><br>

```json
{
    "content": [
        {
            "createDate": "2022-11-12T18:08:51.933885",
            "updateDate": "2022-11-12T18:08:51.933885",
            "createdBy": "1f2de0ba-fad9-4344-9be1-d3bf930f674e",
            "lastModifiedBy": "1f2de0ba-fad9-4344-9be1-d3bf930f674e",
            "id": 50,
            "username": "member49",
            "age": 59,
            "team": null
        },
        ...
    ],
    "pageable": {
        "sort": {
            "sorted": true,
            "unsorted": false,
            "empty": false
        },
        "pageNumber": 0,
        "pageSize": 3,
        "offset": 0,
        "paged": true,
        "unpaged": false
    },
    "totalPages": 17,
    "totalElements": 49,
    "last": false,
    "numberOfElements": 3,
    "size": 3,
    "sort": {
        "sorted": true,
        "unsorted": false,
        "empty": false
    },
    "first": true,
    "number": 0,
    "empty": false
}
```

<br>

**<u>▷ 페이징과 정렬 별도의 DTO로 응답하기</u>**

기존의 리턴 타입을 `Page<MemberDto>`로 변경해주고, Page인터페이스가 제공해주는

`map()` 메소드를 사용하여 별도의 DTO로 변환하여 응담을 해주면 된다.

```java
@GetMapping("/members")
public Page<MemberDto> list(@RequestParam("age") int age, Pageable pageable) {
    return memberRepository.findByAge(age, pageable).map(MemberDto::new);
}
```
```json
{
    "content": [
        {
            "id": 50,
            "username": "member49",
            "teamName": null
        },
        ...
    ],
    "pageable": {
        "sort": {
            "unsorted": false,
            "sorted": true,
            "empty": false
        },
        "pageNumber": 0,
        "pageSize": 3,
        "offset": 0,
        "paged": true,
        "unpaged": false
    },
    "totalPages": 17,
    "totalElements": 49,
    "last": false,
    "numberOfElements": 3,
    "size": 3,
    "number": 0,
    "first": true,
    "sort": {
        "unsorted": false,
        "sorted": true,
        "empty": false
    },
    "empty": false
}
```

<br>

**<u>▷ 개별설정</u>**

`@PageableDefault` 어노테이션 사용

```java
@RequestMapping(value = "/members_page", method = RequestMethod.GET) {
    public String list(
                        @PageableDefault(size = 12, sort = “username”,
                        direction = Sort.Direction.DESC) Pageable pageable
                    )
}
```

<br>

**<u>▷ Page를 1부터 시작하기</u>**

스프링 데이터는 Page를 0부터 시작한다. 만약 1부터 시작하려면 어떻게 해야할까?

<br>

첫 번째 방법으로는 Pageable, Page를 파리미터와 응답 값으로 사용히지 않고, 직접 

클래스를 만들어서 처리하는 것이다. 그리고 직접 PageRequest(Pageable 구현체)를 

생성해서 리포지토리에 넘긴다. 물론 응답값도 Page 대신에 직접 만들어서 제공해야 한다.

<br>

두 번째 방법은 `spring.data.web.pageable.one-indexed-parameters=true` 로 설정한다. 

그런데 이 방법은 web에서 page 파라미터를 -1 처리 할 뿐이다. 

따라서 응답값인 Page 에 모두 0 페이지 인덱스를 사용하는 한계가 있다.

<br>

그냥 기본적으로 0부터 쓰는게 제일 깔끔하다.