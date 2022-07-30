---
layout: post
title: MappedSuperclass
categories: spring
tags: jpa
---

## <span style="color:gray">@MappedSuperclass</span>

> 공통 매핑 정보가 필요할 때 사용한다.

• 상속 관계 매핑 X

• 엔티티X, 테이블과 매핑X

• 부모 클래스를 상속 받는 자식 클래스에 매핑 정보만 제공

• 조회, 검색 불가(`em.find(BaseEntity) 불가`)

• 직접 생성해서 사용할 일이 없으므로 추상 클래스 권장

• 테이블과 관계 없고, 단순히 엔티티가 공통으로 사용하는 매핑 정보를 모은는 역할

• 주로 등록일, 수정일, 등록자, 수정자 같은 전체 엔티티에서 공통으로 적용

---

<br>

## <span style="color:gray">예제</span>

**BaseEntity**
```java
@MappedSuperclass
public class BaseEntity {
    private String createdBy;
    private LocalDateTime createdDate;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedDate;
}
```

<br>

**Member**
```java
@Entity
public class Member extends BaseEntity {
    //...
}
```