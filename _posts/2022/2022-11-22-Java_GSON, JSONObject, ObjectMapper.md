---
layout: post
title: GSON, JSONObject, ObjectMapper
categories: lang
tags: java
---

## <span style="color:gray">GSON</span>

---

#### <span style="background-color:black; color:white">Gson이란?</span>

Gson은 Java 객체를 JSON 표현으로 변환하는 데 사용할 수 있는 Java 라이브러리이다.

뿐만 아니라 JSON에서 Java 객체로도 변환을 할 수 있다.

<a href="https://codechacha.com/ko/java-gson/" target="_blank">이 블로그</a>에 Gson 관련해서 잘 정리되어 있다.

<br>

#### <span style="background-color:black; color:white">JAVA Object → JSON</span>

```java
public static String loginSuccessMessage() {
    Map<String, Object> err = new LinkedHashMap<>();
    err.put("resultCd", "200");
    err.put("resultMsg", "Login Success");
    err.put("data", 1);

    Gson gson = new GsonBuilder().setPrettyPrinting().create();
    return gson.toJson(err);
}
```

Java의 Map객체가 JSON으로 직력화 되어, 아래와 같은 결과를 얻을 수 있다.

```json
{
    "resultCd": "200",
    "resultMsg": "Login Success",
    "data": -1
}
```

<br>

#### <span style="background-color:black; color:white">순서 유지하기</span>

Map은 순서를 보장하지 않는 성질을 가지고 있기 때문에, LinkedHashMap을 사용해서

객체를 만들면 순서가 보장된다.

순서를 유지하기 때문에 HashMap 보다는 메모리 사용량이 많지만, 성능적으로 큰 이슈는

없다고 한다.

<br>

#### <span style="background-color:black; color:white">LinkedHashMap</span>

특징을 몇 가지 찾아보았다.

• FIFO 구조로 데이터를 저장한다.

• HashMap과 사용법은 동일하다.

• **<span style="background-color:#F0E68C">key 값의 순서가 보장된다.</span>**

<br>

## <span style="color:gray">ObjectMapper</span>

---

#### <span style="background-color:black; color:white">ObjectMapper란?</span>

ObjectMapper는 기본 POJO(Plain Old Java Objects) 또는 범용 JSON 트리 모델(JsonNode)에서 

JSON을 읽고 쓰는 기능과 변환 수행을 위한 관련 기능을 제공한다.

<br>

참고로 LinkedHashMap을 써도 순서가 뒤죽박죽으로 나온다.

<br>

#### <span style="background-color:black; color:white">Object to Json</span>

```java
Student st = new Student("gilbert");

ObjectMapper objMapper = new ObjectMapper();
String result = objMapper.writeValueAsString(st);
```

```json
{
    "name" : "gilbert"
}
```

API 응답에 대한 메세지를 커스텀해서 내려줄 때는 아래의 메소드를 사용한다.

**<u>▷ writeValue 메소드</u>**

```java
public void writeValue(Writer w, Object value)
    throws IOException, StreamWriteException, DatabindException{
    _writeValueAndClose(createGenerator(w), value);
}
```

<br>

**<u>▷ 예제 코드</u>**

```java
response.setStatus(HttpStatus.UNAUTHORIZED.value());
response.addHeader(CONTENT_TYPE.getName(), APPLICATION_JSON_VALUE);
response.setCharacterEncoding("UTF-8");

Map<String, Object> err = new LinkedHashMap<>();
err.put("resultCd", HttpStatus.UNAUTHORIZED.value());
err.put("resultMsg", "자격 증명 필요");
err.put("data", -1);

ObjectMapper objectMapper = new ObjectMapper();
objectMapper.writeValue(response.getWriter(), err);
```

<br>

#### <span style="background-color:black; color:white">Json to Object</span>

```java
ObjectMapper objMapper = new ObjectMapper();
String json = "{\"name\":\"gilbert\"}";

Student st = objMapper.readValue(json, Student.class);
```
```java
System.out.println(st.name);
// gilbert
```