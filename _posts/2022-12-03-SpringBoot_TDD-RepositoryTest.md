---
layout: post
title: Repository 계층 테스트
categories: tdd
tags: jpa
---

## <span style="color:gray">기본 설정</span>

---

#### <span style="background-color:black; color:white">사용하는 어노테이션 설명</span>

**[ @DataJpaTest ]**

JPA 구성 요소에만 초점을 맞춘 JPA 테스트에 대한 어노테이션이다. 이 어노테이션을 사용하면 

전체 자동 구성이 비활성화되고, 대신 JPA 테스트와 관련된 구성만 적용된다. 기본적으로 해당 

어노테이션이 달려있는 테스트는 트랜잭션이 이루어지며, 각 테스트가 끝날 때 롤백된다. 

<img src = "/assets/img/tdd/DataJpaTest.png"><br>

또한 임베디드 인메모리 데이터베이스를 사용한다. 하지만 `@AutoConfigureTestDatabase` 어노테이션을 

사용하여 설정을 재정의할 수 있습니다.

SQL 쿼리는 application.yml 파일에 `spring.jpa.show-sql` 속성을 true로 설정하면 기록된다.

**▷ 레퍼런스** : **<a href="https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/autoconfigure/orm/jpa/DataJpaTest.html" target="_blank">org.springframework.boot.test.autoconfigure.orm.jpa</a>**

<br>

**[ @ActiveProfiles(value = "프로파일명") ]**

ActiveProfiles는 테스트 클래스에 대한 ApplicationContext를 로드할 때 사용해야 하는 

active bean definition 프로필을 선언하는 데 사용되는 클래스 수준 어노테이션이다.

**▷ 레퍼런스** : **<a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/test/context/ActiveProfiles.html" target="_blank">org.springframework.test.context</a>**

<br>

**[ @AutoConfigureTestDatabase ]**

애플리케이션-정의 또는 자동 구성된 DataSource 대신 사용할 테스트 데이터베이스를 

구성하기 위해 테스트 클래스에 적용할 수 있는 어노테이션이다.

**▷ 레퍼런스** : **<a href="https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/autoconfigure/jdbc/AutoConfigureTestDatabase.html" target="_blank">org.springframework.boot.test.autoconfigure.jdbc</a>**


<br>

## <span style="color:gray">테스트 코드 작성하기</span>

---

#### <span style="background-color:black; color:white">페이징 테스트 코드</span>

```java
@DataJpaTest
@ActiveProfile(value = "test")
@AutoConfigureTestDatabase(replace = Replace.NONE)
class RepositoryTest {

    @Autowired
    PlayerRepository playerRepository;

    @Autowired
    AgentRepository agentRepository;

    private Agent agent;

    @BeforeEach
    void setData() {
        /*--- Given ---*/
        agent = Agent.builder()
                .agentName("gilbert")
                .email("gilbert@naver.com")
                .phone("01012344321")
                .career(3)
                .password("hashedPassword")
                .active(1)
                .build();
        agentRepository.save(agent);

        List<Player> players = new ArrayList<>();
        for (long i = 0; i < 10L; i++) {
            Soccer soccer = Soccer.builder().agent(agent).build();
            playerRepository.save(soccer);
            players.add(soccer);
        }
    }

    @Test
    void playerBelongingToSameAgent() {

        /*--- when ---*/
        PageRequest pageRequest = PageRequest.of(0, 4, Sort.by(DESC, "playerId"));
        Page<Player> result = playerRepository.findClientByAgentId(agnet.getAgentId(), pageRequest);

        /*--- then ---*/
        assertThat(player.size).isEqualTo(result.getTotalElements());
        assertThat(result.getTotalPage()).isEqualTo(3);

    }

}
```