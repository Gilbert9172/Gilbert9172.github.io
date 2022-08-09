---
layout: post
title: 롬복과 최신 트랜드
categories: spring
tags: springBoot
---

## <span style="color:gray">@RequiredArgsConstructor</span>

---

#### ***@RequiredArgsConstructor***

롬복 라이브러리가 제공하는 `@RequiredArgsConstructor` 어노테이션을 사용하면 final이 

붙은 필드를 못아서 생서자를 자동으로 만들어준다. 

<br>

**기존 코드**
```java
@RestController
@RequestMapping("/admin")
public class MainController {

    private final UserService userServcie;

    @Autowired
    public MainController(UserService userServcie) {
        this.userService = userSevice;
    }
}
```

<br>

**최신 트랜드 적용**
```java
@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class MainController {

    private final UserService userService;

}
```

<br>

최근에는 생성자를 딱 1개 두고, `@Autowired`를 생략하는 방법을 주로 사용한다.

여기에 Lombok 라이브러리의 `@RequiredArgsConstructor`를 함께 사용하면 기능은 

다 제공되면서, 코드는 깔끔하게 사용할 수 있다.

<br>

## <span style="color:gray">회고</span>

---

요즘 회사에서 나는 `@RequiredArgsConstructor`를 애용한다. 우선 굉장히 간편하다.

이번에 다시 정리한 이유는 최근에 `@Autowired`를 사용할 일이 있었기 때문이다.

겸사 겸사 리마인드 겸 생성자 주입을 왜 써야한는지, 그리고 수정자 주입, 필드 주입을

왜 쓰면 안되는지 되 짚어봤다. 요약하자면 생성자 주입을 써야하는 이유는 다음과 같다.

<br>

✔︎ 의존관계는 어플리케이션이 시작부터 끝날 때 까지 변경 될 일이 없다.

✔︎ 따라서 최초 1회만 호출되는 생성자를 통해서 의존성을 주입해야 한다. 

✔︎ 불변, 필수 의존관계에 사용한다.

✔︎ `@Autowired`는 DI프레임워크 관리하에서만 유의미하다.

✔︎ 따라서 필드 주입의 경우에는 순수한 자바 코드만으로 테스트하기 어렵다.