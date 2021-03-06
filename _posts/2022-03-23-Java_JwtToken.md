---
layout: post
title: Jwt Token
categories: lang
tags: java
---

## ๐  ***JWT Token***

[๊ณต์ ๋ฌธ์](https://jwt.io/introduction)

[์ ์ ๋ฆฌ๋ ๋ธ๋ก๊ทธ](https://mangkyu.tistory.com/56)

---


## ๐ ๋์ ์๋ฆฌ

ํด๋ผ์ด์ธํธ๊ฐ ๋ก๊ทธ์ธ์ ํ๋ฉด ์๋ฒ์์ Jwt Token์ ๋ฐ๊ธํด์ค๋ค.

ํด๋ผ์ด์ธํธ๋ ๋ฐ๊ธ ๋ฐ์ Jwt Token์ ์์ผ๋ก ์์ ๋ชจ๋  ์์ฒญ์ ํจ๊ป ๋ณด๋ธ๋ค.

์๋๋ฉด ์์ฒญ ๋ณด๋ด๋ ํด๋ผ์ด์ธํธ๋ฅผ ์๋ณํด์ผ ํ๊ธฐ ๋๋ฌธ์ด๋ค.

---

## ๐ ๊ตฌ์กฐ

### Header + Payload + Signature 

<br>

**Header**

์ฐ์  Jwt Token์ Header๋ฅผ ๋ง๋ค์ด์ค๋ค.

๋ณดํต header์๋ ํ ํฐ ํ์(JWT), ์ํธํ ์๊ณ ๋ฆฌ์ฆ(alg)์ด ๋ค์ด๊ฐ๋ค.

> HashMap์ ์์๋ ๋ณด์ฅ์ด ์๋๋ค.

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

ํ ํฐ์์ ์ฌ์ฉ์์ ๋ํ ์ ๋ณด์ ์กฐ๊ฐ์ธ Claim์ ์ ์ฅํ๋ค.

claim์๋ ๋ค์ํ ์ ๋ณด๊ฐ ๋ค์ด๊ฐ ์ ์๋๋ฐ ํฌ๊ฒ ์ธ๊ฐ์ง๋ก ๋ถ๋ฅ๋๋ค.

- ๋ฑ๋ก๋ ํด๋ ์(Registered Claim)

- ๊ณต๊ฐ ํด๋ ์(Public Claim)

- ๋น๊ณต๊ฐ ํด๋ ์(Private Claim)

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

๋ฉ์์ง๊ฐ ๋์ค์ ๋ณ๊ฒฝ๋์ง ์์๋์ง ํ์ธํ๋ ๋ฐ ์ฌ์ฉ๋๋ค.

Signature๋ Header์ Payload๋ฅผ BASE64๋ก ์ธ์ฝ๋ฉํ ๊ฐ์ ํฉ์น ํ, 

์ฃผ์ด์ง SecretKey๋ก ํด์ฌ์์ฌ ์์ฑ๋ ๊ฐ์ ๋งํ๋ค.

<br>

์๋์ ์ฝ๋๋ secetKey๋ฅผ ๋ฐ์ดํธ๋ก ๋ฐ๊ฟ์คฌ๋ค.

์ถํ์ ํ ํฐ์ ์์ฑํ  ๋ secetKey๋ฅผ ๋ฐ์ดํธ๋ก ๋ฃ์ด์ค์ผ ํด์ ๊ทธ๋ฐ๋ค๊ณ  ํ๋ค.

```java
public static Key createSigningKey() {
	byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(secretKey);
	return new SecretKeySpec(apiKeySecretBytes,SignatureAlgorithm.HS256.getJcaName());
}
```

<br>

**Generate Token**

> setSubject : ํ ํฐ ์ ๋ชฉ (ํ ํฐ์์ ์ฌ์ฉ์์ ๋ํ ์๋ณ๊ฐ์ด ๋๋ค.)

> ํ ํฐ ๋ง๋ฃ ์๊ฐ ์ค์ ์ Calnedar ๋ชจ๋์ ์ฌ์ฉํ๋ค.

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
			
			// signature (HS256๊ณผ Key๋ก Sign)
			.signWith(SignatureAlgorithm.HS256, createSigningKey())
			
			// ํ ํฐ ์์ฑ
			.compact();
	return builder;
}
```
---