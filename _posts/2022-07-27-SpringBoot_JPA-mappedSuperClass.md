---
layout: post
title: MappedSuperclass
categories: spring
tags: jpa
---

## <span style="color:gray">@MappedSuperclass</span>

**<span style="background-color:#F0E68C">속성을 전체적으로 공통으로 사용할 때 사용하자.</span>**

---

#### <span style="background-color:black; color:white">특징</span>

• 공통 매핑 정보가 필요할 때 사용한다.

• 상속 관계 매핑 X

• 엔티티X, 테이블과 매핑X

• 부모 클래스를 상속 받는 자식 클래스에 매핑 정보만 제공

• 조회, 검색 불가(`em.find(BaseEntity) 불가`)

• 직접 생성해서 사용할 일이 없으므로 **추상 클래스 권장**

• 테이블과 관계 없고, 단순히 엔티티가 공통으로 사용하는 매핑 정보를 모은는 역할

• 주로 등록일, 수정일, 등록자, 수정자 같은 전체 엔티티에서 공통으로 적용

<br>

#### <span style="background-color:black; color:white">예제</span>

**<u>▷ BaseEntity</u>**

• `@MappedSuperclass`를 꼭 추가해줘야 한다.

• `@Entity`는 추가할 필요 없다.

• 추상클래스로 작성한다.

```java
@MappedSuperclass
public abstract class BaseEntity {

    private String createdBy;
    private LocalDateTime createdDate;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedDate;

}
```

<br>

**<u>▷ Member</u>**

```java
@Entity
public class Member extends BaseEntity {

    @Id @GeneratedValue
    @Column(name = "MENBER_ID")
    private Long id

    private String phoneNum;

}
```

<br>

**<u>▷ 테이블 생성 결과</u>**

BaseEntity 클래스의 필드가 MemberPrac 테이블의 컬럼으로 추가된 것을 확인할 수 있다.

```sql
create table MemberPrac (
    MEMBER_ID bigint not null,
    createdBy varchar(255),
    createdDate timestamp,
    lastModifiedBy varchar(255),
    lastModifiedDate timestamp,
    USERNAME varchar(255),
    TEAM_ID bigint,
    primary key (MEMBER_ID)
)
```