---
layout: post
title: Optional
categories: lang
tags: java
---

# Optional

<br>

## <span style="color:gray">Optional이란??</span>

nul이 올 수 있는 값을 감싸는 Wrapper 클래스

```java
Optional<User> user = userDetailsMapper.findUserByEmail("test@gmail.com");



System.out.println("user = " + user);
//user = Optional[com.webiznet.arthive.app.model.User@69b37f5c]

System.out.println("user = " + user.get());
// user = com.webiznet.arthive.app.model.User@69b37f5c

System.out.println("user = " + user.get().getUserId());
// user = gilbert
```


<br>

### Optional.of()

만약 어떤 데이터가 null이 절대 아닌 경우에 사용.

```java
Optional<User> user1 = Optional.of(user);
```

<br>

### Optional.ofNullable()

값이 null이 올 수도 있고, 아닐 수도 있는 경우에 사용.

```java
Optional<User> user = Optional.ofNullable(user);
```

만약 `user = null` 일 경우에는 `orElse()` 또는 `orElseGet()` 메소드를 사용할 수 있다.

```java
User user = userMapper.findUserByEmail("test1@gmail.com");

Optional<User> optionalUser= Optional.ofNullable(user);

// if user == null
User userEmail = optionalUser.orElse(emptyUser());
User userEmail1 = optionalUser.orElseGet(()->emptyUser());

log.info("optionalUser = {}", optionalUser);
// optionalUser = Optional.empty

log.info("userEmail = {}", userEmail.getEmail());
// userEmail = Email Not Found

log.info("userEmail = {}", userEmail1.getEmail());
// userEmail = Email Not Found
```
---

<br>

### orElse & orElseGet

결과는 동일하지만, 그 동작 방식에는 차이가 있다.

**orElse** : 파라미터로 값을 받는다. 

```java
public T orElse(T other) {
    return value != null ? value : other;
}
```

T other의 other 자리에 메서드가 들어갈 경우, null이든 null이 아니든 

해당 메서드가 실행되고, 해당 메서드의 return 값이 T other 자리에 들어간다.

<br>

**orElseGet** : 파라미터로 함수형 인터페이스를 받는다.

```java
public T orElseGet(Supplier<? extends T> supplier) {
    return value != null ? value : supplier.get();
}
```
파라미터에 method를 전달하고, value 가 null 이면 other.get() 즉, 메소드를 실행

<br>

회사에서 로그인 구현할 때 개발한 코드를 Optional을 사용하여 리팩토링? 해보았다.

```java
@Sevice
@RequiredArgsConstructor
public class UserDetailServiceImpl implements UserDetailsService {

    private final UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        

        // orElseGet
        User user = Optional.ofNullable(userMapper.findUserByEmail(email))
                            .orElseGet(()->notFoundUser(email));
        return new CustomUserDetail(user);



        // orElse
        User user = Optional.ofNullable(userMapper.findUserByEmail(email))
                            .orElse(notFoundUser(email));
        return new CustomUserDetail(user);
    }

    private User notFoundUser(String a) {
        User notFoundUser = User.builder().email(a).build();
        log.info("Method Not FoundUser");
        return notFoundUser;
    }
}
```

**orElse의 경우 출력 결과**

```java
// userMapper.findUserByEmail(email) == null 
Method Not FoundUser

// userMapper.findUserByEmail(email) != null
Method Not FoundUser
generateJwtToken
regenerateJwtToken
```

<br>

**orElseGet의 출력 결과**

```java
// userMapper.findUserByEmail(email) == null 
Method Not FoundUser

// userMapper.findUserByEmail(email) != null 
generateJwtToken
regenerateJwtToken
```

---

<br>

> 결과 비교

orElse의 경우 null 이든 아니든, `notFoundUser(email)` 메서드가 실행된다.

반면에 orElseGet의 경우에는 null 일 때만 `notFoundUser(email)` 메서드가 실행된다.

---

<br>

## <span style="color:gray">올바른 Optional 사용법</span>

⒈ Optional 변수에 Null을 할당하지 않기.

⒉ 값이 없을 때 `Optional.orElseX()`로 기본 값을 반환하기

⒊ 단순히 값을 얻으려는 목적으로만 Optional을 사용하지 않기

⒋ 생성자, 수정자, 메소드 파라미터 등으로 Optional을 넘기지 않기

⒌ Collection의 경우 Optional을 사용하지 말고 빈 Collection으로 처리하기

⒍ 반환 타입으로만 사용하기

---

<br>

### <span style="color:gray">참고 블로그</span>

[Optional 관련 참고 블로그](https://mangkyu.tistory.com/203)

---