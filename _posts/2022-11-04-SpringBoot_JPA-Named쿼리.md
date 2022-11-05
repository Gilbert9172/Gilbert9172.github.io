---
layout: post
title: Named 쿼리
categories: spring
tags: jpa
---

## <span style="color:gray">Named 쿼리</span>

---

#### <span style="background-color:black; color:white">특징</span>

• **미리 정의**해서 이름을 부여해두고 사용하는 JPQL

• **정적쿼리**에서만 사용할 수 있다.

• 어노테이션, XML에 정의

• 애플리케이션 로딩 시점에 초기화 후 재사용

• **<span style="background-color:#F0E68C">애플리케이션 로딩 시점에 쿼리를 검증</span>**

<br>

#### <span style="background-color:black; color:white">사용방법</span>

**<u>▷ 어노테이션 설정</u>**

```java
@NamedQuery(
        name = "Member.findByUsername",
        query = "select m from Member m where m.username = :username"
)
@Entity
public class Member {
    ...
}
```
```java
List<Member> resultList = em.createNamedQuery("Member.findByUsername", Member.class)
                    .setParameter("username", "member1")
                    .getResultList();
```

<br>

**<u>▷ xml 설정</u>**

```xml
▷ [META-INF/persistence.xml]
<persistence-unit name="jpabook" >
    <mapping-file>META-INF/ormMember.xml</mapping-file>
```
```xml
▷ [META-INF/ormMember.xml]
<?xml version="1.0" encoding="UTF-8"?>
<entity-mappings xmlns="http://xmlns.jcp.org/xml/ns/persistence/orm" version="2.1">
    <named-query name="Member.findByUsername">
        <query>
            <![CDATA[
                select m
                from Member m
                where m.username = :username
            ]]>
        </query>
    </named-query>
</entity-mappings>
```
 
