---
layout: post
title: DAO, DTO, VO
categories: spring
tags: springBoot
---

## <span style="color:gray">DAO (Data Access Object)</span>

✓ 데이터베이스의 Data에 접근하기 위한 객체

✓ DB를 사용해 데이터의 CRUD를 담당하는 객체

DAO 패턴은 비즈니스 로직과 DB를 분리하기 위해 사용하는 패턴이다.

DAO를 만들어서 DB의 접근을 전담하게 만들고, DB를 사용하는 방법이 변경되더라도 클라이언트

로직이 변경되지 않도록 DB로직을 캡슐화하여 분리한다. 

<br>

→ User객체

→ UserDao (User객체의 CRUD를 담당하는 interface)

→ UserDaoImpl (UserDao의 구현 클래스)

<br>

## <span style="color:gray">[ DTO vs VO ]</span>

<img src="/assets/img/spring/dto_vo.png">


<br>

## <span style="color:gray">DTO (Data Tranfer Object)</span>

의미 그대로 데이터를 담아 각 계층 간으로 전달하는 객체이다.

로직을 갖고 있지 않은 순수한 데이터 객체이며 메서드로는 `getter`(제한성),`setter`(은닉성)만을 갖는다.

DTO는 <span style="background-color:#4682B4; color:white">데이터 전달만을 위한 객체</span>이기 때문에 다른 메서드를 가지고 있어선 안된다.

<br>

## <span style="color:gray">VO (Value Object)</span>

✓ DTO와 달리 VO는 Read-Only 속성을 가지는 객체

VO는 DTO와 반대로 로직을 포함할 수 있으며, 특정 값 자체를 표현하기 때문에 불변성의 보장을

위해 생성자를 사용하여야 한다.

또한 VO는 서로 다른 이름을 갖는 VO 인스턴스라도 모든 속성 값이 같다면 두 인스턴스는 같은 

객체인 것이 핵심이다. 

즉, VO는 값 그자체를 나타내기 때문에 setter 같은 성격의 변조 가능성이 있는 메서드가

존재하면 안되며, 두 객체의 '필드 값이 같다면' 모두 같은 객체로 만드는 것이 핵심이다.

<br>

## <span style="color:gray">정리</span>

오늘은 회사에서 DTO를 써야할지, VO를 써야할지 동료직원과 이야기를 나누다가

내가 개념이 잘 안잡혔다고 느껴서 구글링을 통해 알아봤다.

결과적으로 어떤걸 딱 써야한다라고 정해진 건 없다고 한다. 그냥 프로젝트마다, 

회사마다, 개발자마다 다 다른것 같다.

하지만 그래도 각 객체들이 어떤 역할을 하고 어떤 특징을 가지고 있는지는 알고

넘어가야한다고 생각한다.

---