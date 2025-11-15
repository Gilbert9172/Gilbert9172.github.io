---
layout: post
title: 포인트컷, 어드바이스, 어드바이저
categories: spring
tags: springBoot
---

## <span style="color:gray">[ Pointcut ]</span>

> 대상 여를 확인하는 필터 역할

어디에 부가 기능을 적용할지, 어디에 부가 기능을 적용하지 않을지 판단하는 필터링 로직이다. 

주로 클래스와 메서드 이름으로 필터링을 한다. 이름 그대로 어떤 포인트에 기능을 적용할지 

하지 않을지 잘라서(cut) 구분하는 것이다.

---

<br>

## <span style="color:gray">[ Advice ]</span>

> 부가 기능 로직만 담당

프록시가 호출하는 부가 기능이다. 단순하게 프록시 로직이라고 생각하면 된다.

---

<br>

## <span style="color:gray">[ Advisor ]</span>

> Pointcut + Advice

단순하게 하나의 포인트컷과 하나의 어드바이스를 가지고 있다.

---