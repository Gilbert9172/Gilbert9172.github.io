---
layout: post
title: Jwt Token
categories: lang
tags: java
---

## 🔎  ***JWT Token***

[공식 문서](https://jwt.io/introduction)

[잘 정리된 블로그](https://mangkyu.tistory.com/56)

---


## 🔎 동작 원리

클라이언트가 로그인을 하면 서버에서 Jwt Token을 발급해준다.

클라이언트는 발급 받은 Jwt Token을 앞으로 있을 모든 요청에 함께 보낸다.

왜냐면 요청 보내는 클라이언트를 식별해야 하기 때문이다.

---

## 🔎 구조

### Header + Payload + Signature 

<br>

**Header**

우선 Jwt Token의 Header를 만들어준다.

보통 header에는 토큰 타입(JWT), 암호화 알고리즘(alg)이 들어간다.

> HashMap은 순서는 보장이 안된다.

```java
// JWT Header
private static Map<String, Object> createHeader() {
	Map<String, Object> header = new HashMap<>();
	header.put("alg","HS256");
	header.put("typ","JWT");
	return header;
}
```

<br>

**Payload**

토큰에서 사용자에 대한 정보의 조각인 Claim을 저장한다.

claim에는 다양한 정보가 들어갈 수 있는데 크게 세가지로 분류된다.

- 등록된 클레임(Registered Claim)

- 공개 클레임(Public Claim)

- 비공개 클레임(Private Claim)

```java
// JWT Claims
private static Map<String, Object> createClaims(LoginVo loginVo) {
	Map<String, Object> claims = new HashMap<>();
	claims.put("email",loginVo.getEmail());
	claims.put("seq", loginVo.getUserSeq());
	claims.put("authCode", loginVo.getAuthCode());
	return claims;
}
```

<br>

**Signature**

메시지가 도중에 변경되지 않았는지 확인하는 데 사용된다.

Signature란 Header와 Payload를 BASE64로 인코딩한 값을 합친 후, 

주어진 SecretKey로 해쉬아여 생성된 값을 말한다.

<br>

아래의 코드는 secetKey를 바이트로 바꿔줬다.

추후에 토큰을 생성할 때 secetKey를 바이트로 넣어줘야 해서 그런다고 한다.

```java
public static Key createSigningKey() {
	byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(secretKey);
	return new SecretKeySpec(apiKeySecretBytes,SignatureAlgorithm.HS256.getJcaName());
}
```

<br>

**Generate Token**

> setSubject : 토큰 제목 (토큰에서 사용자에 대한 식별값이 된다.)

> 토큰 만료 시간 설정은 Calnedar 모듈을 사용했다.

```java
public static String generateJwtToken(LoginVo loginVo) {
	String builder = Jwts.builder()
			// header
			.setHeader(createHeader())

			// claim
			.setSubject(loginVo.getEmail())
			.setClaims(createClaims(loginVo))
			.setIssuedAt(new Date(System.currentTimeMillis()))
			.setExpiration(createExpireDateForOneDay())
			
			// signature (HS256과 Key로 Sign)
			.signWith(SignatureAlgorithm.HS256, createSigningKey())
			
			// 토큰 생성
			.compact();
	return builder;
}
```
---