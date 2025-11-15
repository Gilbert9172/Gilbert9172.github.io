---
layout: post
title: 연관관계 매핑
categories: spring
tags: jpa
---

## <span style="color:gray">연관관계 매핑이 없다면?</span>

---

#### <span style="background-color:black; color:white">객체와 테이블 연관관계의 차이</span>

객체를 테이블에 맞추어 모델링을 하면 아래와 같이 작성해야 한다.

**<u>▷ Member 엔티티</u>**

```java
@Entity
public class Member {

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "USERNAME")
    private String name;

    @Column(name = "TEAM_ID")
    private Long teamId;
}
```

<br>

**<u>▷ Team 엔티티</u>**

```java
@Entity
public class Team {

    @Id @GeneratedValue
    private Long id;

    private String name;

}
```

```java
// 등록
Team team = new Team();
team.setName("TeamA")
em.persist(team);

Member member = new Member();
member.setName("member1");
member.setTeamId(team.getId());
em.persist(member);
```

```java
// 조회
Member findMember = em.find(Member.class, member.getId());

Long findTeamId = findMember.getTeamId();
Team findTeam = em.find(Team.class, findTeamId);
```

이렇게 객체를 테이블에 맞추어 데이터 중심으로 모델링하면, **<span style="background-color:#F0E68C">협력 관계를 만들수 없다.</span>**

테이블은 `외래키`로 조인을 사용해서 연관된 테이블을 찾는다. 반면에 객체는 `참조`를 

사용해서 연관된 객체를 찾는다. 이렇게 테이블과 객체 사이에는 이런 큰 간격이 있다.

<br>

## <span style="color:gray">단방향 연관관계</span>

---

#### <span style="background-color:black; color:white">코드로 알아보기</span>

이번에는 객체의 참조와 테이블의 외래키를 매핑해보겠다.

**<u>▷ Member 엔티티</u>**

```java
@Entity
public class Member {

    @Id @GeneratedValue
    private Long id;

    @Column(name = "USERNAME")
    private String name;

    @ManyToOne
    @JoinColumn(name = "TEAM_ID")
    private Team team;
}
```

Member 엔티티를 보면 현재 Team을 참조하고 있다. 하나의 팀에는 여러 명의 Member가 

소속될 수 있다. 즉, Member와 Team은 다대일 관계이므로, Member 객체의 team 속성에

`@ManyToOne` 어노테이션을 걸어줬다. 그리고 Member에서 Team을 참조할 때 어떤 컬럼으로

조인할지에 대한 정보도 `@JoinColumn(name = "TEAM_ID")`와 같이 셋팅해줘야 한다. 

만약 세팅해주지 않으면 아래와 같은 경고 문구를 확인할 수 있다.

<img src="/assets/img/jpa/연관관계 매핑 경고.png"><br>

**<u>▷ Team 엔티티</u>**

```java
@Entity
public class Team {

    @Id @GeneratedValue
    private Long id;
    private String name;
}
```

```java
Team team = Team.of("TeamA");
em.persist(team);

Member member = Member.of("gilbert", team);
em.persist(member);
```

조회할 경우 참조로 연관관계를 조회하기 때문에 객체 그래프 탐색이 가능하다.

```java
Member findMember = em.find(Member.class, member.getId());
Team findTeam = findMember.getTeam();
```

<br>

그러면 어떤 쿼리가 수행되는지 확인해보자!!!

> 쿼리를 확인하기 앞서 우선 영속성 컨텍스트를 flush해주고 clear해준다.

```sql
select
    member0_.MEMBER_ID as member_i1_1_0_,
    member0_.TEAM_ID as team_id3_1_0_,
    member0_.USERNAME as username2_1_0_,
    team1_.TEAM_ID as team_id1_4_1_,
    team1_.name as name2_4_1_ 
from
    Member member0_ 
left outer join Team team1_ 
    on member0_.TEAM_ID=team1_.TEAM_ID 
where
    member0_.MEMBER_ID=?
```


<br>

## <span style="color:gray">양방향 연관관계</span>

---

#### <span style="background-color:black; color:white">테이블의 연관관계</span>

테이블의 연관관계에서는 FK와 PK를 통해서 JOIN을 하면 원하는 값을 얻을 수 있다.

즉, 테이블의 연관관계는 외래키 하나로 양방향 관계가 성립이 된다.

엄밀히 말하면 테이블의 연관관계에는 방향이라는 것이 없다. 

<br>

#### <span style="background-color:black; color:white">객체 연관관계</span>

단방향 연관관계에서 `Member → Team`은 접근을 할 수 있었지만 이와 반대로

`Team → Member`는 불가능하다. 결국에 Team 엔티티에 `List<Member>`를 추가해줘야 

접근이 가능하다. 이 부분이 테이블의 외래키와 객체 참조의 가장 큰 차이점이다. 

<br>

#### <span style="background-color:black; color:white">코드로 알아보기</span>

**<u>▷ Team 엔티티</u>**

```java
@Entity
public class Team {

    @Id @GeneratedValue
    private Long id;
    private String name;

    @OneToMany(mappedBy = "team")
    private List<Member> members = new ArrayList<>();
}
```

여기서 **<span style="color:#A52A2A">mappedBy</span>** 는 나와 누구랑 연관되어 있는지?를 나타내주는 것이다.

위의 예제를 보면 `Team.members`는 `Member.team`과 연관이 있기 때문에

`@OneToMany(mappedBy = "team")`와 같이 정의해주면 된다.


<br>

여기서 가장 중요한 포인트는 **<span style="background-color:#F0E68C">객체와 테이블간에 연관관계를 맺는 차이를 이해해야 한다.</span>** 

엄밀히 말하면 객체의 양방향 관계는 양방향 관계가 아니라 **<span style="background-color:#F0E68C">2개의 단방향 관계이다.</span>**

따라서 객체를 양방향으로 참조하려면 단방향 연관관계를 2개 만들어야 한다.

반면에 테이블은 외래키 하나로 두 테이블의 연관관계를 관리한다. 

즉, 테이블은 외래 키 하나로 양방향 연관관계를 가지는 것이다. (양쪽으로 JOIN가능)

<br>

## <span style="color:gray">연관관계의 주인(Owner)</span>

---

<img src="/assets/img/jpa/relation.png">

위 그림에서 팀원이 바뀔 때 Member에 있는 team 프로퍼티를 수정해야 할지, 

아니면 Team에 있는 members 프로퍼티를 수정해야 할지 고민이 된다. 

즉, 두 클래스 중 하나로 외래키를 관리해야 한다. 이때 어떤 걸 주인으로 지정해야 할까?

<br>

연관관계의 주인을 정할 때는 아래의 규칙을 따라야 한다.

|설정 규칙|
|---------|
|객체의 두 관계중 하나를 연관관계의 주인으로 지정|
|연관관계의 주인만이 외래 키를 관리(등록, 수정)|
|**<span style="background-color:#F0E68C">주인이 아닌 쪽은 읽기만 가능</span>**|
|주인은 mappedBy 속성을 사용하면 안된다.|
|주인이 아니면 mappedBy 속성으로 주인을 지정한다.|

<br>

그래서 누구를 주인으로 선정해야 하는 걸까??

**<span style="background-color:#F0E68C">바로 외래 키가 있는 곳을 주인으로 정해야한다. 즉, N쪽이 주인이 된다.</span>**

추가적으로 비즈니스 로직을 기준으로 연관관계의 주인을 선택하면 안된다.

<br>

위의 예제의 경우에는 `Member.team`이 진짜 매핑(연관관계의 주인)이고,

`Team.members`는 가짜 매핑이 된다.



<br>

## <span style="color:gray">양방향 매핑시 주의사항</span>

---

#### <span style="background-color:black; color:white">문제1 : 연관관계의 주인에 값을 입력하지 않는 경우</span>

아래는 양뱡향 맵핑이 된 Member와 Team이 있다.

```java
@Entity
public class Member {

    @Id @GeneratedValue
    private Long id;

    @Column(name = "USERNAME")
    private String name;

    @ManyToOne  // 진짜 매핑(주인)
    @JoinColumn(name = "TEAM_ID")
    private Team team;
}
```
```java
@Entity
public class Team {

    @Id @GeneratedValue
    private Long id;
    private String name;

    @OneToMany(mappedBy = "team") //가짜 매핑
    private List<Member> members = new ArrayList<>();
}
```


값을 저장할 때 역방향(주인이 아닌 방향)만 연관관계 설정한다면 어떻게 될까?

```java
Team team = new Team();
team.setName("TeamA");
em.persist(team);

Member member = new Member();
member.setName("member1");

//== 역방향(주인이 아닌 방향)만 연관관계 설정 ==//
team.getMembers().add(member);

em.persist(member);
```

<img src="/assets/img/jpa/mistake.png">

`Member.team`에는 값이 들어가지 않게 된다...!

왜냐면 `Team.members`는 mappedBy여서 읽기 전용이기 때문에 JPA에서 

update나 insert 할 때는 `Team.members`를 보지 않는다.

<br>

#### <span style="background-color:black; color:white">문제2 : 연관관계의 주인만 값을 입력하는 경우</span>

**<u>▷ CASE 1 : 영속성 컨텍스트 비우기</u>**

아래와 같이 영속성 컨텍스트를 flush, clear 해주면 연관관계의 주인이 아닌 

`Team.members`에 값을 입력하지 않아도 문제가 되지 않는다.

```java
Team team = Team.of("TeamA");
em.persist(team);

Member member = Member.of("gilbert", team);
em.persist(member);

// team.getMembers().add(member);

em.flush();
em.clear();

Team findTeam = em.find(Team.class, team.getId());
List<Member> members = findTeam.getMembers();
System.out.println(findTeam.getMembers().size());

/*
 * [출력 결과] = 1
 */
```

<br>

**<u>▷ CASE 2 : 영속성 컨텍스트 비우지 않기</u>**

그러면 이번엔 반대로 영속성 컨텍스트를 비워주지 않는 경우를 살펴보자.


```java
Team team = Team.of("TeamA");
em.persist(team);

Member member = Member.of("gilbert", team);
em.persist(member);

// team.getMembers().add(member);

/* 영속성 컨텍스트 비우지 않기
em.flush();
em.clear();
*/

Team findTeam = em.find(Team.class, team.getId());
List<Member> members = findTeam.getMembers();
System.out.println(findTeam.getMembers().size());

/*
 * [출력 결과] = 0
 */
```

<br>

#### <span style="background-color:black; color:white">차이를 알아보자</span>

두 번째 문제에서 명확한 차이가 발견됐다. 그 이유를 알아보았다.

우선 CASE1(영속성 컨텍스트를 비우기)의 경우에는  `flush()`, `clear()` 메소드를 통해 

DB가 한 번 업데이트가 됐다. 반면에 CASE2(영속성 컨텍스트 비우지 않기)의 경우에는

DB 업데이트가 진행되지 않았다. 따라서 팀을 조회 할 때 

```java
Team findTeam = em.find(Team.class, team.getId());
```

**<span style="background-color:#F0E68C">DB에 SELECT 쿼리를 날리지 않고, 1차 캐시에 있던 team을 가져온 것이다.</span>**

<br>

CASE2에서 1차 캐시에 있는 team의 상태를 나타내보면 아래와 같을 것이다.

```java
System.out.println(findTeam.getId());        // 1     
System.out.println(findTeam.getName());      // TeamA
System.out.println(findTeam.getMembers());   // []   
```

마지막 결과에 주목해야 한다. `findTeam.getMembers()`가 빈 ArrayList를 반환하였다.

따라서 이런 문제를 예방하기 위해서, 그리고 객체 지향적으로 개발을 하기 위해서는

**<span style="background-color:#F0E68C">연관관계의 주인, 그리고 주인이 아닌 곳 모두에 값을 입력해주어야 한다.</span>**

<br>

#### <span style="background-color:black; color:white">문제1, 2의 해결 방안 : 양쪽 다 값을 입력해주자.</span>


순수하게 객체 관계를 고려하면 항상 양쪽 다 값을 입력해줘야 한다.

```java
Team team = new Team();
team.setName("TeamA");
em.persist(team);

Member member = new Member();
member.setName("member1");

//== 양뱡향 setting =//
team.getMembers().add(member);
member.setTeam(team);

em.persist(member);
```

이렇게 하면 올바르게 데이터가 삽입된다.

<img src="/assets/img/jpa/solve.png">

<br>

#### <span style="background-color:black; color:white">연관관계 메서드를 만들자.</span>

근데 매번 양뱡향 세팅 코드를 작성하는 건 개발자가 깜빡할 가능성이 높다.

그래서 양방향을 세팅할 때 **<span style="background-color:#F0E68C">연관관계 메서드</span>** 를 미리 작성해 두면 실수를 줄일 수 있다.

```java
@Entity
public class Member {

    @Id @GeneratedValue
    private Long id;

    @Column(name = "USERNAME")
    private String name;

    @ManyToOne  // 진짜 매핑(주인)
    @JoinColumn(name = "TEAM_ID")
    private Team team;

    //== 연관관계 메소드 ==//
    public void changeTeam(Team a) {
        this.team = a;
        a.getMembers().add(this);
    }
}
```

<br>

현재 Member 인스턴스의 team을 `newTeam`로 저장해주고,

`newTeam`에 소속된 회원들 컬렉션에 현재 member 인스턴스(this)를 추가해준다.

```java
public void changeTeam(Team newTeam) {
    this.team = newTeam;
    newTeam.getMembers().add(this);
}
```

<br>

반대로 Team에 연관관계 메서드를 걸어줄 수도 있다.

```java
public void addMember(Member member) {
    member.setTeam(this);
    members.add(member);
}
```

여기서 주의할 부분은 연관관계 메서드를 양쪽에 모두 작성해줄 경우 문제가

생길수도 있기 때문에 한 곳에만 작성해주도록 하자.

<br>

결과적으로 아래의 코드를 수행하면 아무 문제 없이 정장 작동함을 확인할 수 있다.

```java
Team team = new Team();
team.setName("TeamA");
em.persist(team);

Member member = new Member();
member.setName("member1");

//== 양뱡향 setting =// 
member.changeTeam(team);

em.persist(member);
```

<br>

#### <span style="background-color:black; color:white">문제3 : 양방향 매핑시에 무한 루프를 조심해야 한다.</span>

> 문제의 원인 : toString(), lombok, JSON 생성 라이브러리

위의 실수를 하지 않으려면 EController에서 Entity를 반환하지 말고, **<span style="background-color:#F0E68C">DTO를 반환하자.</span>**

그리고 가장 많이 하는 실수 중 하나는 연관관계의 주인에 값을 입력하지 않는 것이다. 

<br>

## <span style="color:gray">양방향 매핑 정리</span>

---

솔직히 **<span style="background-color:#F0E68C">단방향 매핑만으로도 이미 연관관계 매핑은 완료된다.</span>**

양방향 매핑은 반대 방향으로 조회(객체 그래프 탐색) 기능이 추가된 것 뿐이다. 

따라서 단방향 매핑을 잘 하고 **양방향은 필요할 때 추가**해도 된다. 

왜냐면 어떠한 매핑이든 테이블에 영향을 주지 않기 때문이다. 

그러나 실무에서 JPQL을 사용하다 보면 **결국엔 양방향을 사용하게 된다**고 한다 ㅋ..

<br>

**<span style="background-color:#F0E68C">처음에는 단방향 매핑만 한다! 그리고 개발 단계에서 필요하면 양방향을 추가한다!</span>**