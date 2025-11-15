---
layout: post
title: Promise, async, await, Generator
categories: lang
tags: javascript
---

## <span style="color:gray">[ Promise ]</span>

```javascript
const pr = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('ok') 
        reject(new Error('error'))
    }, 3000)
});

pr.then(
    function(result) {
        console.log(result + '가지러 가자');
    },
    function(err) {
        console.log(err + '다시 주문해주세요');
    }
);

console.log("시작")
pr.then(
    (result) => {
        console.log(result + '가지러 가자');
    }).catch(
        (err) => {
            console.log(err + '다시 주문해주세요');      
    }).finally(
        () => {
            console.log('---주문 끝---')
        }
    )
console.log('test');
```

---

<br>

## <span style="color:gray">[ Promise.all ]</span>

모든 호출이 끝나야 끝난다.

```javascript
const f1 = () => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res("1번 주문 완료");
        }, 1000);
    });
};

const f2 = () => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res("2번 주문 완료");
        }, 3000);
    });
};

const f3 = () => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res("3번 주문 완료");
        }, 2000);
    });
};

Promise.all([f1(), f2(), f3()]).then((res) => {
    console.log(res);
});
```

---

<br>

## <span style="color:gray">[ Promise.race ]</span>

***하나라도 완료되면 끝낸다.***

```javascript
Promise.race([f1(), f2(), f3()]).then((res) => {
    console.log(res);
});
```

---

<br>

## <span style="color:gray">[ async ]</span>

```javascript
async function getName() {
    // return "Mike";
    // return Promise.resolve("Tom")
    throw new Error("err...")
}

// console.log(getName());

getName().then((name) => {
    console.log(name);
}).catch((err) => {
    console.log(err)
}) 
```

---

<br>

## <span style="color:gray">[ await ]</span>

***async 내부에서만 사용가능하다.***

```javascript
function getName(name) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(name);
        }, 1000);
    });
};

async function showName() {
    const result = await getName("Mike");
    console.log(result);
};

console.log("시작");
showName();


const f1 = () => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res("1번 주문 완료");
        }, 1000);
    });
};

const f2 = (message) => {
    console.log(message);
    return new Promise((res, rej) => {
        setTimeout(() => {
            res("2번 주문 완료");
            // rej( new Error("ERRRRRRRR"));
        }, 3000);
    });
};

const f3 = (message) => {
    console.log(message);
    return new Promise((res, rej) => {
        setTimeout(() => {
            res("3번 주문 완료");
        }, 2000);
    });
};
console.log("시작");
async function order() {

    try {
        const result1 = await f1();
        const result2 = await f2(result1);
        const result3 = await f3(result2);
        console.log(result3);
    } catch (e) {
        console.log(e);
    }
    console.log("종료");
};

console.log("시작");
async function order() {

    try {
        const result = await Promise.all([f1(), f2(), f3()]);
        console.log(result);
    } catch (e) {
        console.log(e);
    }
    console.log("종료");
};
order();
```

---

<br>

## <span style="color:gray">[ Generator ]</span>

***함수의 실행을 중간에 멈췄다가 재개할 수 있는 기능***

```javascript
function* fn() {
    console.log(1);
    yield 1;
    console.log(2);
    yield 2;
    console.log(3);
    console.log(4);
    yield 3;
    return "finish";
}

const a = fn();
```

---