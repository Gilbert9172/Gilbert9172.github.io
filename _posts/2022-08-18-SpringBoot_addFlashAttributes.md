---
layout: post
title: Redirect
categories: spring
tags: springBoot
---

## <span style="color:gray">Redirect</span>

---

> GET 요청시 URL에 쿼리스트링을 남기지 마시오.

오늘 프로젝트 진행 도중 위와 같은 요구사항이 있었다. 그런데 GET 요청을 

했을 때는 URL뒤에 쿼리스트링이 꼭 붙는데 어떻게 제거할 수 있을까?

이에 대한 해답은 바로 RedirectAttributes 인터페이스에 정의되어 있는 

***<span style="background-color:yellow">addFlashAtrributes</span>*** 를 사용하면 가능하다. 

<br>

## <span style="color:gray">addFlashAttributes</span>

---

