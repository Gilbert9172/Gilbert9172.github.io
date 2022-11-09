---
layout: post
title: JPA를 활용해서 기본적인 API 만들기
categories: spring
tags: jpa
---

## <span style="color:gray">회원등록 API 만들기</span>

---

#### <span style="background-color:black; color:white">V1 : 요청 값으로 Member 엔티티를 직접 받기.</span>

```java
@PostMapping("/api/v1/members")
public CreateMemberResponse saveMemberV1(@RequestBody @Valid Member member) {
    Long join = memberService.join(member);
    return new CreateMemberResponse(join);
}
```
```java
@Transactional
public Long join(Member member) throws IllegalStateException{
    validateDuplicateMember(member);
    memberRepository.save(member);
    return member.getId();
}
```
```java
public void save(Member member) {
    em.persist(member);
}
```

<br>

**<u>▷ 문제점</u>**

• Entity에 프레젠테이션 계층을 위한 로직이 추가된다.

• Entity에 API 검증을 위한 로직이 들어간다.(@JsonIgnore, @NotEmpty 등등)

• Entity가 변경되면 API 스펙이 변한다. → 유지보수가 힘들다.

<br>

실무에서는 회원 Entity를 활용한 다양한 API가 만들어지는데, 한 엔티티에 각각의 API를 위한 

모든 요청 요구사항을 담기는 어렵다.

**<span style="background-color:#F0E68C">결론은 API 요청 스팩에 맞추어 별도의 DTO를 파라미터로 받는다.</span>**

<br>

#### <span style="background-color:black; color:white">V2 : 엔티티 대신에 DTO를 받기</span>

```java
@Getter @Setter
public class CreateMemberRequest {

    @NotEmpty
    private String name;

}
```
```java
@PostMapping("/api/v2/members")
public CreateMemberResponse saveMemberV2(@RequestBody @Valid CreateMemberRequest request) {
    Long join = memberService.join(Member.of(request.getName()));
    return CreateMemberResponse.createResponse(join);
}
```

• `CreateMemberRequest`를 엔티티 대신에 RequestBody에 매핑한다.

• 엔티티와 프레젠테이션 계층을 위한 로직을 분리할 수 있다.

• 엔티티와 API 스펙을 명확히 분리할 수 있다.

• 엔티티가 변해도 API 스펙이 변하지 않는다.

<br>

#### <span style="background-color:black; color:white">참고</span>

참고로 실무에서는 엔티티를 API 스펙에 노출해서는 안된다. 엔티티를 반환하면 불필요한 

데이터도 전부 내려줘야 하기 때문이다. 따라서, 무조건 **<span style="color:#FF7F50">별도의 DTO를 반환해야 한다.</span>**

<br>

그리고 컬렉션을 `json 데이터`로 내려줄 때는 별도의 클래스로 감싸서 내려줘야 한다.

> 자바 제네릭 개념이 들어간다. → 자바의 정석 보기 

```java
@Getter @Setter
public class Result<T> {

    private T data;

    public Result(T data) {
        this.data = data;
    }
}
```


```java
@GetMapping("/...")
public Result<List<Member>> members (...) {
    ...
}
```