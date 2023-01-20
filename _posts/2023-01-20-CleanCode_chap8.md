---
layout: post
title: 제8장 - 경계
categories: book
tags: cleanCode 
---

## <span style="color:gray">들어가기 앞서</span>

> 로버트 C 마틴 - 클린코드 8장

---

#### <span style="background-color:black; color:white">목표</span>

• 책을 그대로 정리하지 않기.

• 책 내용을 참고하여 이해하기 쉽게 정리하기.

<br>

#### <span style="background-color:black; color:white">목차</span>

• [외부 코드 사용하기](#외부-코드-사용하기)

• [어뎁터 패턴](#어뎁터-패턴)

<br>

## <span style="color:gray">경계</span>

---

#### <span style="background-color:black; color:white">외부 코드 사용하기</span>

**<span style="background-color:#7FFFD4;">[ ▾ 이해하기 ]</span>**

이 책에서는 Map 인터페이스를 예시를 들어 설명을 해주었다. 그러나 현재 지금

시점에서는 이해가 잘 되지 않는다. 단순하게 이해한 것을 정리해 보자면 아래와 같다.

- 누구든지 Map을 사용하면 삭제 및 삽입을 할 수 있다.
- 위와 같은 상황이 발생하면 프로젝트 여기 저기에 코드가 잠복해 있을 수 있다.
- 혹시라도 인터페이스가 변동되면 `수정 포인트`가 너무 많다.

위의 문제들 때문에 "Map 인터페이스를 한 번 감싸서 불필요한 기능들을 노출하지

않게끔 별도의 Wrapper 클래스를 정의해야 한다." 라고 이해했다.

<br>

**<span style="background-color:#7FFFD4;">[ ▾ 언제 wrapping을 해야할까?]</span>**

책에서는 아래의 경우에 사용하라고 하는 것 같다.

- 프로그램에 필요한 인터페이스만 제공해야 할 때
- 설계 규칙과 비즈니스 규칙을 따르도록 해야 할 때

그리고 항상 wrapper 클래스를 만드는 것은 아니라고 한다. (캡슐화 강요 아님)

개인적인 의견으로는 뭔가 크기가 정해진 list나 map을 사용할 때 쓰면 어떨가 싶다.

<br>

아래는 직접 만들어본 예제이다.

```java
@Component
@NoArgsConstructor
public class TestEx {

    private Map<int, int> discountPolicy = new HashMap<>();

    public String getById(String id) {
        return discountPolicy.get(id);
    }

    @PostConstruct
    public void init() {
        discountPolicy.put(1, 15);
        discountPolicy.put(2, 20);
    }
    
}
```

우선 할인 정책률을 가지고 있는 Map이다.

클라이언트 코드에서 함부로 할인률을 바꾸면 안되기 때문에 오직 `getById()` 메서드만

외부로 노출해주었다. 또한 `@PostConstructor` 애노테이션을 사용하여 Bean초기화 

시점에 map에 필요한 값 들을 넣어주었다.

<br>

Id가 1번일 경우에는 15% 할인을, Id가 2번일 경우에는 20% 할인이 들어간다.

뭔가 예제를 만들고 보니깐 Java의 Enum 클래스로 만들어도 됐을 것 같다는 생각이든다.

아마 아직 해당 내용에 대해 제대로 이해하지 못한 상태여서 그런거 같다.

> 추후에 이해가 된다면 포스팅을 수정해야 한다.

<br>

## <span style="color:gray">어뎁터 패턴</span>

---


#### <span style="background-color:black; color:white"></span>

<br>

#### <span style="background-color:black; color:white"></span>

<br>

#### <span style="background-color:black; color:white"></span>

<br>

#### <span style="background-color:black; color:white"></span>

<br>