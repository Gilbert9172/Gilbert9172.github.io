---
layout: post
title: 제6장 - 객체와 자료구조
categories: book
tags: cleanCode 
---

## <span style="color:gray">목차</span>

> 로버트 C 마틴 - 클린코드 6장 정리

---

• [객체와 자료구조](#객체와-자료구조)

• [디미터 법칙](#디미터-법칙law-of-demeter)

<br>

## <span style="color:gray">객체와 자료구조</span>

---

#### <span style="background-color:black; color:white">자료 추상화</span>

**[책 내용]**

자료를 세세하게 공개하기 보다는 추상적인 개념으로 표현하는 편이 좋다.

인터페이스나 조회/설정 함수만으로는 추상화가 이뤄지지 않는다. 

개발자는 객체가 포함하는 자료를 표현할 가장 좋은 방법을 심각하게 고민해야 한다.

아무 생각 없이 조회/설정 함수를 추가하는 방법이 가장 나쁘다.

<br>

**[내 생각]**

@Getter, @Setter 애노테이션을 함부로 남발하지 말고 필요한 부분에 한정해서

적용을 해야겠다. 또한 객체(엔티티) 내부의 자료구조를 유의미하게 표현할 수 있는 

함수를 작성하려고 노력해야겠다.

<br>

#### <span style="background-color:black; color:white">자료/객체 비대칭</span>

객체는 추상화 뒤로 자료를 숨긴 채 자료를 다루는 함수만 공개한다.

반면 자료구조는 자료를 그대로 공개하며 별다른 함수는 제공하지 않는다.

<br>

<details>
<summary>자료구조를 나타낸 예시 코드</summary>
<div markdown="1">

<br>

```java
public class Sqaure {
    public Point topLeft;
    public double side;
}

public class Rectangle {
    public Point topLeft;
    public double height;
    public double width;
}

public class Circle {
    public Point center;
    public double radius;
}
    

public class Geometry {

    public final double PI = 3.14;

    puoblic double area(Object shape) throws NoSuchShapeException {
        if (shape instanceof Square) {
            Square s = (Square)shape;
            return s.side * s.side;
        }

        else if (shape instanceof Rectangle) {
            Rectangle r = (Shape)shape;
            return r.height * r.width;
        }

        //...
    }

}
```

</div>
</details>

<br>

<details>
<summary>객체를 나타낸 예시 코드</summary>
<div markdown="1">

<br>

```java
public class Square implements Shape {
    private Point topLeft;
    private double side;

    public double area() {
        return side * side;
    } 
}

public class Rectangle implements Shape {
    private Point topLeft;
    private double height;
    private double width;

    public double area() {
        return height * width;
    }
}
```

</div>
</details>

<br>

<br>

위 두 예시 코드를 통해 알 수 있는 점은 아래와 같다.

<span style="color:#6495ED">자료구조를 사용하는 절차적인 코드는 기존 자료구조를 변경하지 않으면서 새 함수를 추가하기</span>

<span style="color:#6495ED">쉽지만, 새로운 자료구조를 추가하기는 어렵다.</span>

<br>

<span style="color:#DC143C">반면, 객체지향 코드는 기존 함수를 변경하지 않으면서 새로운 클래스를 추가하기는 쉽지만,</span>

<span style="color:#DC143C">새로운 함수를 추가하기는 어렵다. 그러려면 모든 클래스를 고쳐야하기 때문이다.</span>


<br>

다시 말해, 객체지향 코드에서 어려운 변경은 절차적인 코드에서 쉬우며, 절차적인 코드에서

어려운 변경은 객체지향 코드에서 쉽다. 서로 트레이드 오프 관계인 것이다.

<br>

그렇다면 어떤 상황에 어떤 방법을 써야할까?

새로운 자료타입이 필요한 경우라면 클래스와 객체 지향 기법이 가장 접합하다.

반면, 새로운 함수가 필요한 경우라면 절차적인 코드와 자료구조가 좀 더 적합하다.

<br>

## <span style="color:gray">디미터 법칙(Law of Demeter)</span>

---

#### <span style="background-color:black; color:white">디미터 법칙이란?</span>

객체에게 자료를 숨기는 대신 함수를 공개하도록 하는 것이다. 또한 여러개의 .(도트)를 사용하지

말라는 법칙이기도 하다. 디미터 법칙을 준수함으로써 캡슐화를 높혀 객체의 자율성과 응집도를 

높일 수 있다.

<br>

객체지향 프로그래밍에서 가장 중요한 것은 "객체가 어떤 데이터를 가지고 있는가"가 아니라,

`객체가 어떤 메세지를 주고 받는가`이다. 그렇기에 디미터의 법칙은 객체 지향 프로그래밍에서

상당히 중요한 개념인데, 디미터의 법칙이 위배된다는 것은 올바른 객체지향 프로그래밍을 하지

못하고 있다는 증거이기도 하다.

<br>

디미터 법칙의 핵심은 <span style="color:#DC143C">객체 구조의 경로를 따라 멀리 떨어져 있는 낯선 객체에 메시지를 보내는</span>

<span style="color:#DC143C">설계는 피하라는 것이다.</span> 즉, 다른 객체를 탐색해 뭔가를 일어나게 해서는 안된다는 것이다.

이러한 핵심적인 내용 떄문에 디미터 법칙은 `Don't Talk To Stranger`라고도 불린다.

또한 한 객체가 알아야 하는 다른 객체를 최소한으로 유지하라는 의미로 `Principle of` 

`least knowledge`라고도 불린다.

<br>

#### <span style="background-color:black; color:white">기차 충돌(Train Wreck)</span>

기차충돌이란 코드가 서로 얽히고 섥혀서 꼬리에 꼬리를 무는(일명 꼬꼬무) 형태를 말한다.

아래 예시 코드는 현재 진행중인 토이 프로젝트에서 억지로 만들어본 코드이다.

> agent가 소속된 에이전시의 회사 주소를 가져온다. → 꼬꼬무 형식이다.

```java
Agent agent = agentRepository.findById(1);

String agencyAddress = agent.getAgency().getAddress().fullAddress();
```

예제 코드를 보면 Agent가 Agency를 포함하고 있고, Agency가 Address를 포함하고 있다.

해당 함수는 많은 객체를 탐색할 수 있다는 것이다. 즉, 디미터 법칙에 위배된다.

<br>

#### <span style="background-color:black; color:white">구조체 감추기</span>

그렇다면 기차충돌을 없애고, 디미터 법칙에 충족하도록 코드를 개선해보자.

```java
public class Agent {
    private Agency agency;
    
    public String agencyAddress() {
        return agency.address();
    }
}

public class Agency {
    private Address address;

    public String address() {
        return address.fullAddress();
    }
}
```

위와 같이 코드를 개선하고 다시 Agency의 주소를 가져와보자.

```java
Agent agent = agentRepository.findById(1);

String agencyAddress = agent.agencyAddress();
```

개선되기 전의 코드와 비교했을 때 확실히 객체 내부 구조가 외부로 노출되지 않는 점을

확인할 수 있다. 또한 .(도트)가 3개에서 1개로 줄었다는 점도 확인할 수 있다.

참고로 꼭 1개의 .(도트)를 써야한다는 것은 아니다.

<br>

#### <span style="background-color:black; color:white">규칙화</span>

디미터 법칙은 "노출 범위를 제한하기 위해 객체의 모든 메서드는 다음에 해당하는 

메서드만을 호출해야한다" 고 말한다.

<br>

**⒈ 객체 자신의 메서드만 호출**

**⒉ 메서드의 파라미터로 넘어온 객체들의 메서드**

**⒊ 메서드 내부에서 생성, 초기화된 객체의 메서드**

**⒋ 인스턴스 변수로 가지고 있는 개체가 소유한 메서드**

```java
class Demeter {
    private Member member;

    public myMethod(OtherObject other) {
        // ...
    }

    public okLawOfDemeter(Paramemter param) {
        
        // 1. 객체 자신의 메서드
        myMethod();

        // 2. 메서드의 파라미터로 넘어온 객체들의 메서드
        param.paramMethod();    
        
        // 3. 메서드 내부에서 생성, 초기화된 객체의 메서드
        Local local = new Local();
        local.localMethod();

        // 4. 인스턴스 변수로 가지고 있는 객체가 소유한 메서드
        member.memberMethod();
    }
}
```

위의 규칙을 지켜서 노출 범위를 제한하면 좀 더 에러가 적고, 변화에 유연히

대처할 수 있는 클래스를 만들 수 있다.

<br>

#### <span style="background-color:black; color:white">주의사항</span>

**⒈ 자료구조라면 디미터 법칙을 거론할 필요가 없다.**

[여기에](#자료객체-비대칭)서 확인했 듯이 자료구조는 자료를 그대로 외부에 공개해야 한다.

<br>

**⒉ 하나의 .(도트)를 강제하는 것이 아니다.**

디미터 법칙은 결합도와 관련된 법칙이고 결합도가 문제 된다고 하는 것은 객체의 내부 구조가 

외부로 노출되는 경우를 말한다. 

<br>

예를 들어 Java Stream API의 경우 중간 연산, 마무리 연산을 하기위해 많은 .(도트)를 사용한다. 

하지만 이는 단순히 기존 객체의 타입을 변환시킬 뿐이지, 변화시킬 대상의 내부구조가 외부로 

들어나지는 않는다. 따라서 디미터 법칙에 위배되지 않는다.

<br>

이처럼 한 줄에 하나 이상의 점을 찍는 모든 케이스가 디미터 법을 위배하는 것은 아니다.

**<span style="background-color:#F0E68C">객체 내부 구현에 대한 어떤 정보도 외부로 노출되지 않는다면 괜찮다.</span>**

<br>

## <span style="color:gray">공부에 참고한 자료 링크</span>

---

• <a href="http://www.yes24.com/Product/Goods/11681152" target="_blank">클린 코드 - 로버트 C.마틴</a>

• <a href="https://mangkyu.tistory.com/147" target="_blank">티스토리 블로그 - 망나니 개발자</a>

• <a href="https://tecoble.techcourse.co.kr/post/2020-06-02-law-of-demeter/" target="_blank">Tecoble</a>

• <a href="https://dsmoon.tistory.com/entry/Object-VS-Data-structure" target="_blank">티스토리 블로그 - dsmoon</a>
