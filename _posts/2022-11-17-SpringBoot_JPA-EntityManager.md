---
layout: post
title: EntityManager
categories: spring
tags: jpa
---

## <span style="color:gray">EntityManager란?</span>

---

#### <span style="background-color:black; color:white">EntityManager란</span>

엔티티 매니저는 엔티티를 저장하고, 수정하고, 삭제하고, 조회하는 등 엔티티와

관련되 모든 일을 처리한다. 이름 그대로 엔티티를 관리하는 관리자다. 

<br>

#### <span style="background-color:black; color:white">EntityManager & EntityManagerFactory</span>

EntityManagerFactory는 이름 그대로 EntityManager를 만드는 공장인데, 공장을 

만드는 비용은 상당히 크다. 따라서 한 개만 만들어서 애플리케이션 전체에서 공유하도록 

설계되어 있다. 반면에 공장에서 EntityManager를 생성하는 비용은 거의 들지 않는다.

<br>

그리고 EntityManagerFactory는 여러 스레드가 동시에 접근해도 안전하므로 서로 다른

스레드 간에 공유해도 되지만, EntityManager는 여러 스레드가 동시에 접근하면 동시성

문제가 발생하므로 스레드 간에 절대 공유하면 안된다.

<br>

#### <span style="background-color:black; color:white">그림으로 이해하기</span>

<img src="/assets/img/jpa/entityManager.jpg">

⒈ EntityManagerFactory와 Connection Pool을 생성한다.

⒉ EntityManagerFactory가 다수의 EntityManager를 생성한다.

⒊ EntityManager1은 아직 DB를 사용하는 시점에 DB Connection을 얻는다.

⒋ EntityManager2은 DB를 사용중이기 때문에 DB Connection을 얻었다.

⒌ 보통 트랜잭션을 시작할 때 DB Connection을 얻는다.


<br>

## <span style="color:gray">EntityManager 관리하기</span>

---

#### <span style="background-color:black; color:white">Container-Managed EntityManager</span>

이 방식은 컨테이너가 EntityManager를 관리하게 하는 방식이다.

```java
@PersistenceContext EntityManager em;
```

위와 같이 작성해 주면 WAS가 실행 될 때 컨테이너가 EntityManagerFactory에서 EntityManager를 

생성해준다. 이는 컨테이너가 EntityManager의 라이프 사이클을 관리하는 것이기 때문에 컨테이너가

트랜잭션 시작과 커밋 그리고 롤백을 담당하는 의미와도 같다.

<br>

컨테이너가 EntityManager를 열었으니 닫는 역할까지 해준다. 따라서 개발자는 EntityManager를 

수동으로 닫아줄 필요없이 안전하게 사용할 수 있다.

만약 개발자가 수동으로 EntityManager를 닫으려 한다면 `IllegalStateException` 예외가 발생한다.

<br>

#### <span style="background-color:black; color:white">Application-Managed EntityManager</span>

위 방식과 반대로 이 방식은 EntityManager의 라이프 사이클을 Application에서 관리하다. 

```java
EntityManagerFactory emf = Persistence.createEntityManagerFactory("name");
```

```java
public static EntityManager getEntityManger() {
    return emf.createEntityManager();
}
```


이 경우에는 개발자가 직접 EntityManager를 생성해주어야 한다. 개발자가 EntityManager를 

열었다는 의미는 닫아주는 작업까지가 개발자의 몫이라는 의미이다. 따라서 사용이 끝났다면 

꼭 EntityManager를 닫아주어야 한다.

<br>

## <span style="color:gray">EntityManager 동시성</span>

---

#### <span style="background-color:black; color:white">Thread-Safety</span>

위에서도 잠깐 언급했지만, EntityManagerFactory는 여러 쓰레드 간에 공유해도 문제가

없다. 반면에 EntityManager의 인스턴스는 쓰레드 간에 공유를 하면 안된다.

<br>

Application에서 EntityManager를 관리하는 방식은 그냥 EntityManageFactory에서 

EntityManager 인스턴스를 생성하면 되기 때문에 thread-confined(쓰레드 제한적인)한 

인스턴스를 생성만 하면 된다. 

<br>

반면에 Container에서 EntityManager를 관리하는 컨테이너에서 관리하기 때문에 

EntityManager 인스턴스를 개발자가 직접 생성하기 힘들다.

```java
@Service
public class ExampleService {

    @PersistenceContext EntityManager em;

    // omitted

}
```

위 코드를 보면 모든 작업에 대해서 하나의 EntityManager 인스턴스를 공유해야 하는

것 처럼 보인다. 하지만 컨테이너는 의존성을 주입할 때 단순하게 EntityManager를 

주입하지 않고 **<span style="background-color:#F0E68C">특수한 프록시(special proxy)를 주입한다.</span>**

    엔티티 매니저 = Shared EntityManager proxy for target factory 
                [org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean@37b470df]
                
    프록시 클래스 = class com.sun.proxy.$Proxy110

출력 결과에서도 `Shared EntityManager proxy for target factory` 라는 

문구와 함께 프록시객체를 사용하는 것을 확인할 수 있었다.

<br>

이렇게 주입된 EntityManager를 사용할 때마다 이 프록시는 기존 EntityManager를

재사용하거나 새로운 것을 생성한다. 일반적으로 OSIV 옵션이 활성상태일 때 기존 

EntityManager를 재사용한다.

<br>

## <span style="color:gray">트랜잭션 범위의 영속성 컨텍스트</span>

---

순수하게 J2SE 환경에서 JPA를 사용하면 개발자가 직접 EntityManager를 생성하고

트랜잭션도 하고 관리해야 한다. 하지만 스프링이나 J2EE 컨테이너 환경에서 JPA를

사용하면 컨테이너가 제공하는 전략을 따라야 한다.

<br>

#### <span style="background-color:black; color:white">스프링 컨테이너의 기본 전략</span>

스프링 컨테이너는 **트랜잭션 범위의 영속성 컨텍스트 전략** 을 기본으로 사용한다.

이 전략은 이름 그대로 **<span style="background-color:#F0E68C">트랜잭션의 범위와 영속성 컨텍스트의 생존 범위가 같다</span>** 는

뜻이다. 좀 더 풀어서 이야기하자면 이 전략은 트랜잭션을 시작할 때 영속성 

컨텍스트를 생성하고 트랜잭션이 끝날 때 영속성 컨텍스트를 종료한다. 

그리고 **<span style="background-color:#F0E68C">같은 트랜잭션 안에서는 항상 같은 영속성 컨텍스트에 접근한다.</span>**

<br>

스프링 프레임워크를 사용하면 보통 비즈니스 로직을 시작하는 서비스 계층에

`@Transactional` 어노테이션을 선언해서 트랜잭션을 시작한다. 외부에서는 

단순히 서비스 계층의 메소드를 호출하는 것처럼 보이지만 이 어노테이션이 있으면 

호출한 메소드를 실행하기 직전에 **스프링의 트랜잭션 AOP가 먼저 작동**한다.


<br>

#### <span style="background-color:black; color:white">트랜잭션이 같으면 같은 영속성 컨텍스트를 사용한다.</span>

트랜잭션 범위의 영속성 컨텍스트 전략은 다양한 위치에서 주입받아 사용해도

트랜잭션이 같으면 항상 같은 영속성 컨텍스트를 사용한다.

<br>

#### <span style="background-color:black; color:white">트랜잭션이 다르면 다른 영속성 컨텍스트를 사용한다.</span>

만약 여러 스레드에서 동시에 요청이 와서 같은 EntityManager를 사용해도

트랜잭션에 따라 접근하는 영속성 컨텍스트가 다르다. 조금 더 풀어서 이야기하자면 

**<span style="background-color:#F0E68C">스프링 컨테이너는 스레드마다 각각 다른 트랜잭션을 할당한다.</span>** 

따라서 같은 EntityManager를 호출해도 접근하는 영속성 컨텍스트가 다르므로 

멀티스레드 상황에 안전하다.

<br>

#### <span style="background-color:black; color:white">정리</span>

결론적으로 복잡한 멀티쓰레드 환경을 컨테이너가 처리해주기 때문에 개발자는

싱글 스레드 애플리케이션 처럼 단순하게 개발할 수 있고, 비즈니스 로직에 더욱더

집중할 수 있다.

<br>

#### <span style="background-color:black; color:white"></span>

<br>

## <span style="color:gray">References</span>

---

**<a href="https://www.baeldung.com/hibernate-entitymanager#entity-manager" target="_blank">▷ baeldung - EntityManager</a>**