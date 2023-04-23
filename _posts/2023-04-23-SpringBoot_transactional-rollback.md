---
layout: post
title: Transactional 애노테이션과 Rollback
categories: spring
tags: springBoot
---

## <span style="color:gray">@Transactional과 rollback의 관계</span>

---

#### <span style="background-color:black; color:white">문제의 코드</span>

```java
@Transactional
public void attemptPasswordAuth(String email, String inputPassword) {
    //... 생략
    if (!passwordEncoder.matches(inputPassword, account.getPassword())) {
        account.increaseLoginFailureCount();
        adminAccountRepository.save(account);
        throw new AdminAccountPasswordNotMatchedException();
    }
    //... 생략
}
```

위의 로직은 로그인시 비밀번호가 일치하지 않을 경우 login_fail_count를 +1 하는 로직이다.

물론 처음 코드를 봤을 때 발견하지 못했지만 위 코드는 로직상의 문제가 있다.

오늘은 위와 같이 코드를 작성했을 때 어떤 문제가 발생하는지 알아보고 어떻게 해결해야 하는지도 알아보자!

<br>

#### <span style="background-color:black; color:white">Checked & Unchecked Exception</span>

우선 Checked와 Unchecked의 특징을 리마인드 해보자.

<span style="background-color:#AFEEEE;">[ ▾ Checked ]</span>

- 예외처리가 필수이며, 처리하지 않으면 컴파일이 되지 않는다.
- Runtime Exception외 모든 예외
- Rollback이 되지 않고, 트랜잭션이 commit 까지 완료된다.

<br>

<span style="background-color:#AFEEEE;">[ ▾ Unchecked ]</span>
 
- 컴파일 때 체크되지 않고, Runtime에 발생하는 예외
- 에러 처리를 강제하지 않는다.
- Runtime Exception 하위의 모든 예외
- Rollback이 된다.

<br>

#### <span style="background-color:black; color:white">@Transactional과 rollback</span>

우선 결론을 정리하자면 아래와 같다.

- @Transactional + throw Unchecked Exception = Roll Back
- @Transactional + try-catch Unchecked Exception = Commit
- @Transactional + throw Checked Exception = Commit

<br>

#### <span style="background-color:black; color:white">내부 동작원리</span>

⒈ `TransactionInterceptor.invoke()` 메소드 호출

<img src = "/assets/img/spring/troubleshooting/txInvoke.png"><br>

⒉ `TransactionAspectSupport.invokeWithinTransaction(...)` 메서드 진입

```java
@Nullable
protected Object invokeWithinTransaction(Method method, @Nullable Class<?> targetClass, 
    final InvocationCallback invocation) throws Throwable {
    //... 생략
    if (txAttr == null || !(ptm instanceof CallbackPreferringPlatformTransactionManager)) {
			TransactionInfo txInfo = createTransactionIfNecessary(ptm, txAttr, joinpointIdentification);

			Object retVal;
			try {
				retVal = invocation.proceedWithInvocation();
			}
			catch (Throwable ex) {
				completeTransactionAfterThrowing(txInfo, ex);
				throw ex;
			}
			finally {
				cleanupTransactionInfo(txInfo);
			}

			//... 생략

			commitTransactionAfterReturning(txInfo);
			return retVal;
		}
    //... 생략
}
```

<br>

⒊ Case by Case

<details>
<summary><u>throw UncheckedException의 경우</u></summary>
<div markdown="1">

<br>

attemptPasswordAuth에서 던진 AdminAccountPasswordNotMatchedException을 아래에서 잡아서 처리한다.

```java
completeTransactionAfterThrowing(txInfo, ex);
```

해당 메서드 내부의 주요 로직을 살펴보자.

```java
protected void completeTransactionAfterThrowing(@Nullable TransactionInfo txInfo, Throwable ex) {
if (txInfo != null && txInfo.getTransactionStatus() != null) {
        if (logger.isTraceEnabled()) {
            logger.trace("Completing transaction for [" + txInfo.getJoinpointIdentification() +
                    "] after exception: " + ex);
        }
        // 이부분!!!
        if (txInfo.transactionAttribute != null && txInfo.transactionAttribute.rollbackOn(ex)) {
            try {
                txInfo.getTransactionManager().rollback(txInfo.getTransactionStatus());
            }
            //... 생략
        }
        else {
            //... 생략
        }   
    }
}
```

중간에 rollbackOn이라는 메서드가 있다. DefaultTransactionAttribute 클래스를 보면 

UncheckedException만 rollback 시킨다는 설명을 확인할 수 있다.

<span style="color:red">결국 AdminAccountPasswordNotMatchedException은 RuntimeException이기 때문에</span>

<span style="color:red">Commit이 되지 않고, Rollback이 되는 것을 확인할 수 있었다.</span>

<br>

```java
txInfo.getTransactionManager().rollback(txInfo.getTransactionStatus());
```

추가적으로 위 메서드의 내부동작이 궁금하다면, AbstractPlatformTransactionManager 클래스의

`rollback(...)`, `processRollback(...)` 메서드를 보면 된다.

</div>
</details>

<br>

<details>
<summary><u>try-catch Unchecked Exception의 경우</u></summary>
<div markdown="1">

<br>

만약 코드를 아래와 같이 작성하면 rollback이 될까 commit이 될까?

```java
@Transactional
public void attemptPasswordAuth(String email, String inputPassword) {

    if (!passwordEncoder.matches(inputPassword, account.getPassword())) {
        try {
            account.increaseLoginFailureCount();
            adminAccountRepository.save(account);
            throw new AdminAccountPasswordNotMatchedException();
        } catch (AdminAccountPasswordNotMatchedException e) {
            return;
        }
    }
    // 이후 로직...
}
```

애초에 `attemptPasswordAuth(...)` 메서드에서 발생한 RuntimeException을 try-catch를 통해 내부에서 

처리하였기 때문에 `invocation.proceedWithInvocation()` 실행이 되어도 catch에서 잡을 Exception이 

없게 된다. 따라서 catch 부분은 통과하고 finally 부분 실행 이후 `commitTransactionAfterReturning()` 

메서드를 통해 커밋이 실행된다.

<span style="color:red">결국 Unchecked Exception이지만, 메서드 내부에서 예외처리를 해주면 Rollback이 되지 않고,</span>

<span style="color:red">Commit 됨을 확인했다.</span>

<br>

</div>
</details>

<br>

<details>
<summary><u>throw CheckedException의 경우</u></summary>
<div markdown="1">

<br>

CheckedException의 경우에는 TransactionAspectSupport 클래스의 

completeTransactionAfterThrowing 메서드를 파악하면 된다.

```java
protected void completeTransactionAfterThrowing(@Nullable TransactionInfo txInfo, Throwable ex) {
    if (txInfo != null && txInfo.getTransactionStatus() != null) {
        if (logger.isTraceEnabled()) {
            logger.trace("Completing transaction for [" + txInfo.getJoinpointIdentification() +
                    "] after exception: " + ex);
        }
        if (txInfo.transactionAttribute != null && txInfo.transactionAttribute.rollbackOn(ex)) {
            try {
                txInfo.getTransactionManager().rollback(txInfo.getTransactionStatus());
            }
            catch (TransactionSystemException ex2) {
                logger.error("Application exception overridden by rollback exception", ex);
                ex2.initApplicationException(ex);
                throw ex2;
            }
            catch (RuntimeException | Error ex2) {
                logger.error("Application exception overridden by rollback exception", ex);
                throw ex2;
            }
        }
        else {
            // !!!여기!!!
            try {
                txInfo.getTransactionManager().commit(txInfo.getTransactionStatus());
            }
            catch (TransactionSystemException ex2) {
                logger.error("Application exception overridden by commit exception", ex);
                ex2.initApplicationException(ex);
                throw ex2;
            }
            catch (RuntimeException | Error ex2) {
                logger.error("Application exception overridden by commit exception", ex);
                throw ex2;
            }
        }
    }
}
```

위에서 rollbackOn 메서드는 오로지 uncheckedException의 경우에만 롤백을 한다고 했다.

따라서 checkedException의 경우에는 else 조건절을 타게 되고, 해당 조건절에서 

`txInfo.getTransactionManager().commit(txInfo.getTransactionStatus())` 메서드를 통해 

commit이 이루어진다.


</div>
</details>

<br>

#### <span style="background-color:black; color:white">문제점 정리</span>

정리해보자면 최초에 작성한 코드의 문제는 아래와 같다.

1. 비밀번호가 틀린 경우 AdminAccountPasswordNotMatchedException을 터트린다.
2. AdminAccountPasswordNotMatchedException은 UnCheckedException이기에 Commit이 안된다.
3. login_fail_count가 기대한대로 db에 업데이트가 안된다.

<br>

#### <span style="background-color:black; color:white">Solution1 - try/catch</span>

위에서 정리한 대로 attemptPasswordAuth 메서드 내부에서 try-catch로 Exception을 처리하면 된다.

```java
@Transactional
public void attemptPasswordAuth(String email, String inputPassword) {

    if (!passwordEncoder.matches(inputPassword, account.getPassword())) {
        try {
            account.increaseLoginFailureCount();
            adminAccountRepository.save(account);
            throw new AdminAccountPasswordNotMatchedException();
        } catch (AdminAccountPasswordNotMatchedException e) {
            return;
        }
    }
    // 이후 로직...
}
```

<br>

#### <span style="background-color:black; color:white">Solution2 - noRollbackFor</span>

`@Transactional`은 보다 코드를 간략하게 작성할 수 있는 방식을 제공한다.

따라서 이번 트러블 슈팅의 해결책으로 @Transactional에서 제공해주는 noRollbackFor을 사용해보려한다.

코드는 정말 간단하다.

```java
@Transactional(noRollbackFor = AdminAccountPasswordNotMatchedException.class) // <= 요기
public void attemptPasswordAuth(String email, String inputPassword) {
    if (!passwordEncoder.matches(inputPassword, account.getPassword())) {
        account.increaseLoginFailureCount();
        adminAccountRepository.save(account);
        throw new AdminAccountPasswordNotMatchedException();
    }
    // 이후 로직...
}
```

그러면 이제 내부 동작원리에 대해서 알아보자!

<br>


<details>
<summary><u>noRollbackFor의 내부동작 이해하기</u></summary>
<div markdown="1">

<br>

⒈ completeTransactionAfterThrowing 호출

```java
completeTransactionAfterThrowing(txInfo, ex);
```

<br>

⒉ `txInfo.transactionAttribute.rollbackOn(ex)` 호출

> RuleBasedTransactionAttribute.java 참고

rollBackRules에 `AdminAccountPasswordNotMatchedException`이 있는 것을 확인할 수 있다.

<img src = "/assets/img/spring/troubleshooting/rollbackon1.png"><br>

<br>

⒊ 최초에 null이었던 winner에 NoRollbackRuleAttribute 할당

<img src = "/assets/img/spring/troubleshooting/rollbackon2.png"><br>

<br>

⒋ false를 반환

```java
!(winner instanceof NoRollbackRuleAttribute);
```

3번에서 winner에 NoRollbackRuleAttribute 인스턴스가 할당됐기 때문에 false 반환.

<br>

⒌ `TransactionAspectSupport.commitTransactionAfterReturning(...)`

```java
protected void completeTransactionAfterThrowing(@Nullable TransactionInfo txInfo, Throwable ex) {
    if (txInfo != null && txInfo.getTransactionStatus() != null) {
        //... 생략
        if (txInfo.transactionAttribute != null && txInfo.transactionAttribute.rollbackOn(ex)) {
            try {
                txInfo.getTransactionManager().rollback(txInfo.getTransactionStatus());
            }
            //... 생략
        }
        else {
            try {
                txInfo.getTransactionManager().commit(txInfo.getTransactionStatus());
            }
            //... 생략
        }
    }
}
```

`txInfo.transactionAttribute.rollbackOn(ex) == false` 이기 때문에 else 조건절을 탄다.

결과적으로 `txInfo.getTransactionManager().commit(txInfo.getTransactionStatus())`를 통해

Commit이 이루어진다.

</div>
</details><br>
