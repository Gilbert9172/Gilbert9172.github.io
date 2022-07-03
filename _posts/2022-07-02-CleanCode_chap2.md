---
layout: post
title: 제2장 - 의미 있는 이름
categories: book
tags: cleanCode 
---

## <span style="color:gray">의도를 분명히 밝혀라!</span>

변수나 함수 그리고 클래스 이름은 다음과 같은 굵직한 질문에 모두 답해야한다.

⒈ 변수(혹은 함수나 클래스)의 존재 이유는?

⒉ 수행 기능은?

⒊ 사용 방법은?

따로 주석이 필요하다면 의도를 분명히 드러내지 못했다는 말이다.

<br>

```java
public List<int[]> getThem() {
    List<int[]> list1 = new ArrayList<>();
    
    for (int[] x:theList) {
        if (x[0] == 4) {
            list1.add(x);
        };
    };
    return list1;
}
```

```java
public List<int[]> getFlaggedCells() {
    List<int[]> flaggedCells = new ArrayList<>();
    
    for (int[] cell: gameBoard) {
        if (cell[STATUS_VALUE] == FLAGGED) {
            flaggedCells.add(cell);
        };
    };
    return flaggedCells;
}

```

```java
public List<Cell> getFlaggedCells() {
    List<Cell> flaggedCells = new ArrayList<>();

    for (Cell cell : gameBoard) {
        if (cell.isFlagged()) {
            flaggeddCells.add(cell);
        };
    }
    return flaggedCells;
}
```

---

<br>

## <span style="color:gray">그릇된 정보를 피하다!</span>

그릇된 단서는 코드의 의미를 흐린다.


---

<br>

## <span style="color:gray">의미 있게 구분하라!</span>

변수 중 `info`, `Data` 는 불용어(a, an, the)와 마찬가지로 의미가 불분명한 불용어이다.

명확한 관례가 없다면 변수 moneyAmount는 money와 구분이 안된다. 

customerInfo는 customer와, accountData는 account와, theMessage는 message와 구분이 안된다.

***<span style="background-color:yellow">읽는 사람이 차이를 알도록 이름을 지어라!!</span>***

---

<br>

## <span style="color:gray">발음하기 쉬운 이름을 사용하라!</span>


---

<br>

## <span style="color:gray">검색하기 쉬운 이름을 사용하라!</span>

긴 이름이 짧은 이름보다 좋다. 검색하기 쉬운 이름이 상수보다 좋다.

이름을 의미 있게 지으면 함수가 길어진다.

---

<br>

## <span style="color:gray">인코딩을 피하라!</span>

---

<br>

## <span style="color:gray">자신의 기억력을 자랑하지 마라!</span>

명료함이 최고다.

---

<br>

## <span style="color:gray">클래스 이름</span>

클래스 이름과 객체 이름은 명사나 명사구가 적합하다. Customer, WikiPage, Account,

AddressParser 등이 좋은 예다. Manager, Processor, Data, Info 등과 같은 단어는 피하고

***<span style="background-color:yellow">동사는 사용하지 않는다.</span>***

---

<br>

## <span style="color:gray">메서드 이름</span>

메서드 이름은 동사나 동사구가 접합하다. postPayment, deletePage, save 등이 좋은 예다.

접근자(Accessor), 변경자(Mutator), 조건자(Predicate)는 javabean 표준에 따라 값 앞에

get, set, is를 붙힌다.

| | |
|-|-|
|접근자|get|
|변경자|set|
|조건자|is|

---

<br>

## <span style="color:gray">기발한 이름은 피하라!</span>

재미난 이름보다는 명료한 이름을 선택해야 한다. 간혹 프로그래머가 나름대로 재치를 발휘해 

구어체나 속어를 이름으로 사용하는 사례가 있는데 특정 문화에서만 사용하는 편이 좋다. 

***<span style="background-color:yellow">의도를 분명하고 솔직하게 표현해야 한다.</span>***

---

<br>

## <span style="color:gray">한 개념에 한 단어를 사용하라!</span>

---

<br>

## <span style="color:gray">말 장난을 하지마라!</span>

만약 기존 프로젝트에서 add를 두 개를 더하거나, 이어서 새로운 값을 만든다고 

가정하자. 새로 작성하는 메서드는 집합에 요소를 추가한다. 이때 add를 써도 

괜찮을까? 안된다. 왜냐면 기존 add와 지금은 add는 맥락이 전혀 다르다.

그러므로 insert나 append가 적당하다.


---