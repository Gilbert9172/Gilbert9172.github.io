---
layout: post
title: JPA - 구동방식
categories: spring
tags: jpa
---

## <span style="color:gray">JPA - 구동방식</span>

---

#### <span style="background-color:black; color:white">JPA를 쓰기전 필요한 설정</span>

**<u>1. persistence.xml</u>**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<persistence version="2.2"
             xmlns="http://xmlns.jcp.org/xml/ns/persistence" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/persistence http://xmlns.jcp.org/xml/ns/persistence/persistence_2_2.xsd">
    <persistence-unit name="hello">
        <properties>
            <!-- 필수 속성 -->
            <property name="javax.persistence.jdbc.driver" value="org.h2.Driver"/>
            <property name="javax.persistence.jdbc.user" value="sa"/>
            <property name="javax.persistence.jdbc.password" value=""/>
            <property name="javax.persistence.jdbc.url" value="jdbc:h2:tcp://localhost/~/test"/>
            <property name="hibernate.dialect" value="org.hibernate.dialect.H2Dialect"/>
            <!-- 옵션 -->
            <property name="hibernate.show_sql" value="true"/>
            <property name="hibernate.format_sql" value="true"/>
            <property name="hibernate.use_sql_comments" value="true"/>
            <property name="hibernate.jdbc.batch_size" value="10"/>
            <property name="hibernate.hbm2ddl.auto" value="create" />
        </properties>
    </persistence-unit>
</persistence>
```

• `persistence-unit name=?` : EntitiyManagerFactory를 생성하기 위해 필요한 이름.

• `hibernate.dialect` : 어떤 데이터베이스를 사용할지 지정.

<br>

**<u>2. EntityManagerFactory 생성</u>**

**<span style="background-color:#F0E68C">하나만 생성해서 애플리케이션 전체에 서 공유한다.</span>**

EntityManagerFactory의 라이프 사이클은 Application의 라이플 사이클과 같다.

```java
import javax.persistence.Persistence;
import javax.persistence.EntityManagerFactory;

EntityManagerFactory entityManagerFactory = persistence.createEntityManagerFactory("persistence-unit name")
```

<br>

**<u>3. EntityManger 생성</u>**

**<span style="background-color:#F0E68C">엔티티 매니저는 쓰레드간에 공유하지 않는다. (사용하고 버려야 한다).</span>**

EntityManger의 라이프 사이클은 HttpServletRequest의 라이프 사이클과 같다.

```java
import javax.persistence.EntityManager;

EntityManager entityManager = emf.createEntityManager();
```

<br>

**<u>4. EntityManger, EntityManagerFactory 종료</u>**

```java
entityManager.close();
entityManagerFactory.close();
```

<br>

#### <span style="background-color:black; color:white">Member 생성, 조회, 수정</span>

```java
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Member {

    @Id
    private Long id;

    @Column(name="MEMBER_NM")
    private String name;

}
```

```java
Member member = new Member(1L,"Gilbert");
entityManager.persist(member);
```

이렇게 하면 에러가 발생한다. 

왜냐면 **<span style="background-color:#F0E68C">JPA의 모든 데이터 변경은 트랜잭션 안에서 실행되어야 하기 때문이다.</span>**

따라서 아래와 같이 트랜잭션 관련된 코드를 추가해줘야 한다.

```java
EntityTransaction tx = entityManager.getTransaction();
tx.begin();

try {
    /* 생성
    Member member = new Member(1L,"Gilbert");
    entityManager.persist(member);
    */

    /* 단일 조회
    Member member = entityManager.find(Member.class, 1L);
    */

    /* 컬렉션 조회 (JPQL)
    Member member = em.createQuery("SELECT m FROM MEMBER AS m", Member.class)
                        .setFirstResult(5)
                        .setMaxResulsts(8)
                        .getResultList();
    */

    /* 수정
    Member member = entityManager.find(Member.class, 1L);
    member.setName("gilbert")
    */

} catch (Exception e) {
    tx.rollback();
} finally {
    em.close();
}
```

<br>

마지막 수정 부분을 자세히 봐보자. 

```java
Member member = entityManager.find(Member.class, 1L);
member.setName("gilbert")
```

마지막 줄에 `entityManager.persist(member);`를 해줘야 DB에 반영된다고 생각할 수 있다.

하지만 위 코드를 작성하지 않아도 UPDATE 쿼리가 생성된다. 왜 그럴까?? 

JPA를 통해서 가져온 Entity는 JPA의 관리하에 들어간다고 한다. 그리고 데이터가 변경됐는지 

안됐는지를 JPA가 다 주시하고 있다. 따라서 데이터가 변경이 됐다면, JPA는 트랜잭션 커밋

직전에 UPDATE 쿼리를 생성해 전달한다. 그리고 커밋이 이루어지고 DB에도 변경된 데이터가 

정상적으로 반영된다.

<br>

#### <span style="background-color:black; color:white">JPQL</span>

• 테이블이 아닌 **<span style="background-color:#F0E68C">객체를 대상으로 검색하는 객체 지향 쿼리</span>**

• SQL을 추상화했기 때문에 **<span style="background-color:#F0E68C">특정 데이터베이스 SQL에 의존하지 않는다.</span>**

• JPQL을  한마디로 정의하면 **<span style="background-color:#F0E68C">객체 지향 SQL</span>** 이라고 할 수 있다.