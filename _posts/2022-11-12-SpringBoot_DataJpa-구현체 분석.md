---
layout: post
title: 구현체 분석
categories: spring
tags: dataJpa
---

## <span style="color:gray">스프링 데이터 JPA 구현체 분석</span>

---

#### <span style="background-color:black; color:white">SimpleJpaRepository</span>

스프링 데이터 JPA가 제공하는 공통 인터페이스의 구현체이다.

`SimpleJpaRepository`를 자세히 살펴보자.

```java
@Repository
@Transactional(readOnly = true)
public class SimpleJpaRepository<T, ID> implements JpaRepositoryImplementation<T, ID> {
    // 기능이 엄청 많다....
}
```

• `@Repository` 적용 : JPA 예외를 스프링이 추상화한 예외로 변환

• `@Transactional` :  트랜잭션 적용

• `@Transactional(readOnly = true)` → <a href="https://gilbert9172.github.io/spring/2022/11/12/SpringBoot_DataJpa-%EC%9D%BD%EA%B8%B0%EC%A0%84%EC%9A%A9-%EC%BF%BC%EB%A6%AC%EC%9D%98-%EC%84%B1%EB%8A%A5-%EC%B5%9C%EC%A0%81%ED%99%94/" target="_blank">읽기전용 쿼리 성능최적화 포스팅</a> 확인하기.

<br>

JPA의 모든 변경은 트랜잭션 안에서 동작한다. 

서비스 계층에서 트랜잭션을 시작하지 않으면 레파지토리에서 트랜잭션을

시작하며, 서비스 계층에서 트랜잭션을 시작했다면 레파지토리는 해당 

트랜잭션을 전파 받아서 사용한다. 그래서 스프링 데이터 JPA를 사용할 때

트랜잭션 없이도 데이터 등록, 변경이 가능했던 것이다.