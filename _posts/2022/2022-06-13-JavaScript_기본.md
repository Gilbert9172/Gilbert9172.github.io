---
layout: post
title: 자바스크립트 기본
categories: lang
tags: javascript
---

## <span style="color:gray">[ 변수 ]</span>

변수는 `문자`와 `숫자`, `$`와 `_`만 사용한다.

첫글자는 숫자가 될 수 없다. 

예약어는 사용할 수 없다.

가급적 상수는 대문자로~~

변수명은 읽기 쉽고 이해할  수 있게 선언.

---

<br>

## <span style="color:gray">[ let & const ]</span>

변하지 않는 값은 ***<span style="color:#DC143C">const</span>*** ,

변할 수 있는 값은 ***<span style="color:#4682B4">let</span>*** 으로 선언한다.

---

<br>

## <span style="color:gray">[ 형변환 ]</span>

자동형변환은 원인을 모르는 에러를 발생할 확률이 높다.

#### 명시적형변환

**`String()`**

> 문자형으로 변환

```javascript
console.log(
    String(3),
    String('test')
);
```

<br>

**`Number()`**

> 괄호 안에 타입을 int로 변환해준다.

```javascript
console.log(
    Number("1234"),     // 1234
    Number("12fa1"),    // NaN
    Number(true),       // 1
    Number(false),      // 0
    Number(null),       // 0
    Number(undefined),  // NaN
)
```

---

<br>

## <span style="color:gray">[ 연산자 ]</span>

```javascript
const a = 1;
const b = "1";

// 동등연산자
console.log(a == b);    // true

// 일치연산자(타입까지 비교해준다.)
console.log(a === b);   // false

```

---

<br>

## <span style="color:gray">[ function ]</span>

#### 함수 선언문

어디서든 호출이 가능하다. 자바스크립트는 내부적으로 초기화 단계에서

코드의 모든 함수 선언문을 찾아서 생성해둔다. 따라서 아래 코드와 같이

함수 호출 위치에 관계없이 코드가 실행이된다. 이를 호이스팅(hoisting)이라 한다.

```javascript
// Case1 (코드가 실제로 올라오는 것은 아님)
testMethod(test);

function testMethod(arg) {
    // 로직
}

// Case2
function testMethod(arg) {
    // 로직
}

testMethod(test);
```

<br>

#### 함수 표현식

함수 선언문과는 달리 순차적으로 실행된다.

```javascript
let sayHello = function() {
    console.log("hello");
}

```

<br>

#### 화살표 함수

```javascript
let add = function(num1, num2) {
    return num1 + num2;
}

// 화살표 함수
let add =         (num1, num2) => {
    return num1 + num2;
}        

// return문이 한 줄일 경우
let add = (num1, num2) => num1 + num2;

// 인수가 하나일 경우 괄호 생략
let sayHello = name => `Hello, ${name}`;

// 인수가 없는 경우
let showError = () => {
    alert('error!');
}
```

---

<br>

## <span style="color:gray">[ Object ]</span>