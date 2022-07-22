---
layout: post
title: 연관관계 매핑
categories: spring
tags: jpa
---

## <span style="color:gray">객체와 테이블 연관관계의 차이</span>

객체를 테이블에 맞추어 모델링을 하면 아래와 같이 작성해야 한다.

***Member 엔티티***
```java
@Entity
public class Member {

    @Id @GeneratedValue
    private Long id;

    @Column(name = "USERNAME")
    private String name;

    @Column(name = "TEAM_ID")
    private Long teamId;
}
```

***Team 엔티티***
```java
@Entity
public class Team {

    @Id @GeneratedValue
    private Long id;

    private String name;

}
```

```java
Team team = new Team();
team.setName("TeamA")
em.persist(team);

Member member = new Member();
member.setName("member1");
member.setTeamId(team.getId());
em.persist(member);
```

이렇게 객체를 테이블에 맞추어 데이터 중심으로 모델링하면, 협력 관계를 

만들수 없다. 테이블은 외래키로 조인을 사용해서 연관된 테이블을 찾는다.

반면에 객체는 참조를 사용해서 연관된 객체를 찾는다.

이렇게 테이블과 객체 사이에는 이런 큰 간격이 있다.

---

<br>

## <span style="color:gray">단방향 연관관계</span>

이번에는 객체의 참조와 테이블의 외래키를 매핑해보겠다.

***Member 엔티티***
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

Member 엔티티를 보면 현재 Team을 참조하고 있다. 회원은 하나의 팀에만 소속될 수 있다.

즉, Member와 Team은 다대일 관계이므로, `@ManyToOne` 어노테이션을 걸어줬다. 

그리고 Member에서 Team을 참조할 때 어떤 컬럼으로 조인할지에 대한 정보도 

`@JoinColumn(name = "TEAM_ID")` 셋팅해줘야 한다.

<br>

***Team 엔티티***
```java
@Entity
public class Team {

    @Id @GeneratedValue
    private Long id;
    private String name;
}
```

```java
Team team = new Team();
team.setName("TeamA")
em.persist(team);

Member member = new Member();
member.setName("memberA")
member.setTeam(team); //=> 단방향 연관관계(참조 저장)
em.persist(member);
```

조회할 경우 참조로 연관관계를 조회하기 때문에 객체 그래프 탐색이 가능하다.

```java
Member findMember = em.find(Member.class, member.getId());
Team findTeam = findMember.getTeam();
```

---

<br>

## <span style="color:gray">양방향 연관관계</span>

양방향 연관관계를 설정하기 위해선 Team엔티티를 수정해주면 된다.

***Team 엔티티***
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

여기서 ***<span style="color:#A52A2A">mappedBy</span>*** 가 등장한다...!

여기서 가장 중요한 포인트는 ***<span style="background-color:yellow">객체와 테이블간에 연관관계를 맺는 차이를 이해해야 한다.</span>*** 

엄밀히 말하면 객체의 양방향 관계는 양방향 관계가 아니라 ***<span style="background-color:yellow">2개의 단방향 관계이다.</span>***

따라서 객체를 양방향으로 참조하려면 단방향 연관관계를 2개 만들어야 한다.

반면에 테이블은 외래키 하나로 두 테이블의 연관관계를 관리한다. 

즉, 테이블은 외래 키 하나로 양방향 연관관계를 가지는 것이다. (양쪽으로 JOIN가능)

---

<br>

## <span style="color:gray">연관관계의 주인(Owner)</span>

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
|주인이 아닌 쪽은 읽기만 가능|
|주인은 mappedBy 속성을 사용하면 안된다.|
|주인이 아니면 mappedBy 속성으로 주인을 지정한다.|

<br>

그래서 누구를 주인으로 선정해야 하는 걸까??

***<span style="background-color:yellow">바로 외래 키가 있는 곳을 주인으로 정해야한다. 즉, N쪽이 주인이 된다.</span>***

추가적으로 비즈니스 로직을 기준으로 연관관계의 주인을 선택하면 안된다.

---

<br>

## <span style="color:gray">양방향 매핑시 주의사항</span>

양방향 매핑시에 무한 루프를 조심해야 한다. 

> Ex. toString(), lombok, JSON 생성 라이브러리

위의 실수를 하지 않으려면 Entity는 Controller에서 반환하지 않는게 좋다. 

웬만하면 DTO로 반환해야 한다. 그리고 가장 많이 하는 실수 중 하나는 연관관계의 

주인에 값을 입력하지 않는 것이다. 아래는 양뱡향 맵핑이 된 Member와 Team이 있다.

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

@Entity
public class Team {

    @Id @GeneratedValue
    private Long id;
    private String name;

    @OneToMany(mappedBy = "team") //가짜 매핑
    private List<Member> members = new ArrayList<>();
}
```

값을 저장할 때 만약 아래와 같이 코드를 작성한다면?

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

Member의 team 프로퍼티에는 값이 들어가지 않게 된다...!!

<img src="/assets/img/jpa/mistake.png">

<br>

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

근데 매번 양뱡향 세팅 코드를 작성하는 건 인간으로써 깜빡할 가능성이 높다.

그래서 양방향을 세팅할 때 연관관계 메서드를 미리 ㄴ작성해 두면 실수를 줄일 수 있다.

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
    private void changeTeam(Team a) {
        this.team = a;
        a.getMembers().add(this);
    }
}
```

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

---

<br>

## <span style="color:gray">양방향 매핑 정리</span>

솔직히 단방향 매핑만으로도 이미 연관관계 매핑은 완료된다. 

양방향 매핑은 반대 방향으로 조회(객체 그래프 탐색) 기능이 추가된 것 뿐이다. 

따라서 단방향 매핑을 잘 하고 양방향은 필요할 때 추가해도 된다. 왜냐면 어떠한

매핑이든 테이블에 영향을 주지 않기 때문이다. 

그러나 실무에서 JPQL을 사용하다 보면 결국엔 양방향을 사용하게 된다고 한다 ㅋ..

---