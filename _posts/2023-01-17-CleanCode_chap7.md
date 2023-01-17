---
layout: post
title: 제7장 - 오류처리
categories: book
tags: cleanCode 
---

## <span style="color:gray">목차</span>

> 로버트 C 마틴 - 클린코드 7장 정리

---

• [오류 코드보다 예외를 사용하라.](#오류-코드보다-예외를-사용하라)

• [Try-Catch-Finally](#try-catch-finally)

• [Unchecked 예외를 사용하라.](#unchecked-에외를-사용하라)

• [wrapper 클래스를 정의하라.](#wrapper-클래스를-정의하라)

• [정상 흐름을 정의하라.](#정상-흐름을-정의하라)

• [null을 반환하지 마라.](#null을-반환하지-마라)

• [null을 전달하지 마라.](#null을-전달하지-마라)

<br>

## <span style="color:gray">오류 처리</span>

> 오류처리 코드로 인해 프로그램 논리를 이해하기 어려워지면 안된다.

---

#### <span style="background-color:black; color:white">오류 코드보다 예외를 사용하라.</span>

> 물론 Optional을 사용하면 더 쉽게 구현할 수 있다.
억지로 예시를 만들기 위해 아래와 같이 로직을 작성하였다.


<details>
<summary>예외 코드를 반환</summary>
<div markdown="1">

<br>

```java
public class TestServiceImpl implements TestService {

    public void isDuplicatedMember(Long memberId) {

        int count = memberRepository.countMemberById(memberId);

        if (count == 0) {
            // 이후 정상 로직
        } else {
            logger.log("이미 등록된 사용자입니다.");
        }
    }
}
```

</div>
</details>

<br>

<details>
<summary>예외 던지기</summary>
<div markdown="1">

<br>

```java
public class TestServiceImpl implements TestService {

    public void isDuplicatedMember(Long memberId) {
        
        try {
            tryCheckDuplication(memberId);
        } catch (DuplicatedException e) {
            // 별도의 로직
        }

    }

    private void tryCheckDuplication(Long memberId) throws DuplicatedException {
        
        int count = countMember(memberId);
        //...

    }

    private int countMember(Long memberId) {
        
        int count = memberRepository.countMemberById(memberId);
        if (count > 0) {
            throw new DuplicatedException("이미 등록된 회원입니다.");
        }
        return count;

    }
}
```

</div>
</details>

<br>

위 두 예시코드를 작성해보니 확실히 두 번째 예시가 예외처리코드와

메인 로직이 분리가 되어있어 한 눈에 코드를 파악하기가 좋았다.

<br>

#### <span style="background-color:black; color:white">Try-Catch-Finally</span>

try블록은 트랜잭션과 비슷하다. try블록에서 무슨일이 생기든지 catch블록은

프로그램 상태를 일관성 있게 유지해야 한다. 그러므로 예외가 발생할 코드를 짤 때는

Try-Catch-Finally 문으로 시작하는 편이 낫다.

<br>

#### <span style="background-color:black; color:white">Unchecked 에외를 사용하라.</span>

📖 <a href="https://gilbert9172.notion.site/Error-Exception-8d3799dee8f04d94bb3e024700c586e2" target="_blank">Java의 Unchecked, Checked Exception 정리내용</a>

<br>

**[ Checked 예외의 단점 ]**

<span style="color:#6495ED">throws "Checked 예외"</span>가 명시되어있는 메소드를 호출하는 경우, 하위 메소드를 

호출하는 상위 메소드 또한 <span style="color:#6495ED">throws "Checked 예외"</span>를 작성해줘야 한다.

그렇지 않을 경우 IDE에서 <span style="color:#DC143C">Add exception to method signature</span> 라는 경고문구가 나온다.

<img src = "/assets/img/book/cleanCode/checkedException.png"><br>

<br>

위에서 확인했듯이 Checked Exception은 <span style="color:#D6495EDC143C">상위 메소드와 굉장히 의존적이다.</span>

따라서 OOP의 원칙중 OCP를 위배하게 된다. 만약 `C()`메서드에서 다른 Checked 오류를 

던진다고 가정해보자. 이렇게 되면 함수에 throws 절을 수정해야 한다. 

또한 변경한 메서드 C를 호출하는 A,B 모두 throws 절을 수정해줘야 한다.

**<span style="background-color:#F0E68C">결과적으로 최하위 단계에서 최상위 단계까지 연쇄적인 수정이 일어난다...!</span>**

이렇게 Checked 예외는 OCP를 위배하며, 캡슐화를 꺠버리는 단점을 가지고 있다.

<br>

**[ Unchecked 예외를 사용하면? ]**

<img src = "/assets/img/book/cleanCode/uncheckedException.png"><br>

Unchecked 예외를 사용하여 예외처리를 진행하면 하위 메서드가 상위 메서드에 

의존적이지 않음을 확인할 수 있다. 만약 다른 Unchecked 예외로 변경하면??

<img src = "/assets/img/book/cleanCode/uncheckedException2.png"><br>

상위 메서드에 영향을 미치지 않음을 확인할 수 있다.

이번 장에서는 왜 Checked Exception 보다는 Unchecked Exception을 사용 해야하는 

이유를 잘 설명해준거 같다.

<br>

#### <span style="background-color:black; color:white">wrapper 클래스를 정의하라.</span>

<br>

#### <span style="background-color:black; color:white">정상 흐름을 정의하라.</span>

```java
try {
    Employee em = repository.findById(employee.getId());
    m_total += em.getSalary();
} catch (temporaryWorkerException e) {
    m_total += 0;
}
```

위 코드는 회사내 정규직의 총 급여를 계산하는 임시 코드이다.

계약직일 경우 총 급여에 포함하지 않기 위해 0원을 더한다.

만약 위의 코드처럼 특수한 상황을 처리하지 않으면 아래처럼 코드가 더 간결해질 것이다.

```java
Employee em = repository.findById(employee.getId());
m_total += em.getSalary();
```

위 코드를 위해서는 한 가지 더 처리를 해줘야한다.

> 고용형태가 계약직일 경우에는 0원을 반환하는 로직이다.

```java
public class Employee {
    private WorkType workType;
    private int salary;

    public int getSalary() {
        if (this.workType == WorkType.TEMPORARY) {
            return 0;
        }
        return this.salary;
    }
}
```

<br>

이를 **<span style="background-color:#F0E68C">특수 사례 패턴(Special Case Pattern)</span>** 이라고 부른다.

클래스를 만들거나 객체를 조작해 특수 사례를 처리하는 방식이다. 해당 패턴을 사용하면,

클래스나 객체가 예외적인 상황을 캡슐화해서 처리하기 때문에 클라이언트 코드가 예외적인 

상황을 처리할 필요가 없어진다. 

<br>

#### <span style="background-color:black; color:white">null을 반환하지 마라.</span>

<br>

#### <span style="background-color:black; color:white">null을 전달하지 마라.</span>