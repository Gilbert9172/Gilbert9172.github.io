---
layout: post
title: IoC, DI, 컨테이너
categories: spring
tags: springBoot
---

## <span style="color:gray">IoC (Inversion of Controller)</span>

---

#### <span style="background-color:black; color:white">IoC란?</span>

**<span style="background-color:#F0E68C">프로그램의 제어 흐름을 직접 제어하는 것이 아니라 외부에서 관리하는 것</span>**
 
일반적인 상황에서는 개발자가 직접 new 연산자를 통해 객체를 생성하고, 객체의 의존성을 맺어주고, 

실행했다. 하지만 Spring 에서는 `xml파일` 또는 `어노테이션 방식`으로 스프링 컨테이너에 Bean을

등록하기만 하면, 스프링 컨테이너에서 **Bean의 생명주기(생성 -> 의존성 설정 -> 초기화 -> 소멸)** 를 

전부 관리해준다. 즉, **<span style="color:red">Bean(객체)에 대한 제어권이 컨테이너로 넘어가게 된 것이다.</span>**

제어권이 컨테이너로 넘어가게 되면 **DI(의존성 주입)**, **AOP(관점 지향 프로그래밍)** 가 가능해진다.

<br>

<details>
<summary><span style="background-color:#E0FFFF">프레임워크 vs 라이브러리</span></summary>
<div markdown="1">

<br>

✔︎ 내가 작성한 코드를 제어하고, 대신 실행하면 프레임워크

✔︎ 반면에 내가 작성한 코드가 직접 제어의 흐름을 담당한다면 그것은 라이브러리.

</div>
</details>

<br>

## <span style="color:gray">DI (Dependency Injection)</span>

---

의존관계는 정적인 클래스 의존관계와, 실행 시점에 결정되는 동적인 객체(인스턴스) 의존관계 

이렇게 두 가지로 분리해서 생각해야 한다.

<br>

#### <span style="background-color:black; color:white">정적인 클래스 의존관계</span>

• 클래스가 사용하는 `import` 코드만 보고 의존관계를 쉽게 판단할 수 있다.

• 정적인 의존관계는 애플리케이션을 실행하지 않아도 분석할 수 있다.

• Intellij에서 Show Diagram을 보면 의존관계를 쉽게 볼 수 있다.

```java
@RestController
@RequestMapping("/main")
@RequiredArgsConstructor
public class MainController {

    private final MainService mainService;
    private final UserSevcie userService;

    //...
}
```

위 코드를 살펴보면 MainController는 MainService, UserService를 의존하다는 것을

알 수 있다. 하지만 현재 시점에서는 어떤 구현객체를 MainController에 주입 될 지

알 수가 없다.

<br>

#### <span style="background-color:black; color:white">동적인 객체 인스턴스 의존관계</span>

애플리케이션 실행 시점(런타임)에 외부에서 실제 구현 객체를 생성하고,

클라이언트에게 전달해서 클라이언트와 서버의 실제 의존관계가 연결된다.

그리고 이것을 **<span style="background-color:#F0E68C">의존관계 주입(Dependency Injection)이라고 부른다.</span>**

<br>

의존관계 주입을 사용하게 될 경우 객체 인스턴스를 생성하고, 그 `참조값`을 전달해서 연결된다.

따라서 클라이언트 코드를 변경하지 않고, 클라이언트가 호출하는 대상의 <span style="color:#4169E1">타입 인스턴스</span>를 변경할 수 있다.

또한, <span style="color:red">정적인 클래스 의존관계를 변경하지 않고(애플리케이션 코드를 변경하지 않고)</span>,

동적인 객체 인스턴스 의존관계를 쉽게 변경할 수 있다.

<br>

## <span style="color:gray">[ IoC 컨테이너, DI 컨테이너]</span>

---

객체를 생성하고 관리하면서 의존관계를 연결해 주는 것을 `IoC 컨테이너` 또는 `DI 컨테이너`라 한다.

의존관계 주입에 초점을 맞추어 최근에는 주로 `DI 컨테이너`라 한다.

또는 어샘블러, 오브젝트 팩토리 등으로 불리기도 한다.