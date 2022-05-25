---
layout: post
title: 프록시, 프록시 패턴, 데코레이터 패턴
categories: spring
tags: springBoot
---

## <span style="color:gray">[ Proxy ]</span>

클라이언트가 요청한 결과를 서버에 직접 요청하는 것이 아니라, 

어떤 대리자를 통해서 대신 간접적으로 서버에 요청할 수 있다. 

그리고 프록시가 중간에서 여러가지 일을 할 수 있다.

<br>

## <span style="color:gray">[ Proxy의 주요기능 ]</span>

**접근 제어**

→ 캐싱

→ 권한에 따른 접근 차단(실제 서버에 접근하는 것을 제어)

→ 지연 로딩

<br>

**부가 기능**

→ 원래 서버가 제공하는 기능에 더해서 부가 기능을 수행한다.

→ Ex) 요청 값이나, 응답 값을 중간에 변형한다.

→ Ex) 실행 기간을 측정해서 추가 로그를 남긴다.

---

<br>

## <span style="color:gray">[ GoF 디자인패턴 ]</span>

***<span style="background-color:yellow">디자인패턴에서 가장 중요한 건 패턴을 만든 의도가 중요!!!</span>***

프록시 패턴과 데코레이터 패턴, 모두 프록시를 사용하는 방법이지만 GoF 패턴에서는 이 둘을

의도(intent)에 따라서 구분한다.

---

<br>

## <span style="color:gray">[ 프록시 패턴 ]</span>

> 프록시와 이름만 같을 뿐, 전혀 다른 존재.

***<span style="background-color:yellow">접근 제어가 목적이다.</span>***

- target : 프록시가 호출한 실제 객체

<br>

프록시 패턴의 핵심은 매인객체와 클라이언트 코드를 전혀 변경하지 않고, 

프록시를 도입해서 접근 제얼르 했다는 점이다. 그리고 클라이언트 코드의 변경 없이

자유롭게 프록시를 넣고 뺄 수 있다. 실제 클라이언트 입장에서는 프록시 객체가 

주입되었는지, 실제 객체가 주입되었는지 알지 못한다.

---

<br>

## <span style="color:gray">[ 데코레이터 패턴 ]</span>

***<span style="background-color:yellow">새로운 기능 추가가 목적.</span>***