---
layout: post
title: InvalidDefinitionException 오류
categories: spring
tags: jpa
---

## <span style="color:gray">InvalidDefinitionException 에러를 마주치다.</span>

---

#### <span style="background-color:black; color:white">에러 메세지</span>

**[ 원문 ]**

```txt
com.fasterxml.jackson.databind.exc.InvalidDefinitionException: 

No serializer found for class org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor and no properties 

discovered to create BeanSerializer (to avoid exception, disable SerializationFeature.FAIL_ON_EMPTY_BEANS) 

(
through reference chain: 
-> sports.trademarket.dto.ResponseDto["data"]
-> sports.trademarket.entity.Offer["agent"]
-> sports.trademarket.entity.Agent$HibernateProxy$pIPDhJjk["agency"]
-> sports.trademarket.entity.Agency$HibernateProxy$IJn50lBt["hibernateLazyInitializer"]
)
```

<br>

**[ 번역 ]**

```txt
com.fasterxml.jackson.databind.exc.InvalidDefinitionException: 

org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor 클래스에 대한 직렬 변환기를 찾을 수 없습니다.

그리고 BeanSerializer를 생성하기 위해 발견된 속성이 없습니다.

(예외를 피하려면 SerializationFeature.FAIL_ON_EMPTY_BEANS를 비활성화세요.)
```

<br>

> <em>여기서 잠깐!! BeanSerializer란?</em>

JSON 객체 출력에 매핑되는 Java 객체를 **직렬화**할 수 있는 Serializer 클래스이다.

내부 처리는 대부분 직력화할 엑세스 값을 처리하는 일련의 BeanPropertyWriter에 

의해서 처리되며, 적절한 직렬 변환기를 호출하여 JSON을 작성한다.

**▷ 레퍼런스** : **<a href="https://fasterxml.github.io/jackson-databind/javadoc/2.5/com/fasterxml/jackson/databind/ser/BeanSerializer.html" target="_blank">fasterxml.github.io</a>**

<br>

#### <span style="background-color:black; color:white">문제 분석하기</span>

에러 본문을 보면 `직렬`이라는 단어가 등장한다. 그리고 `proxy.pojo...` 클래스에 대해서 언급했다.

우선 프록시 객체를 처리하는 부분에서 문제가 생겼다고 생각했다. 그리고 내가 작성한 코드에서 프록시를

사용하는 부분이 어디인지 생각해봤다. 🤔🤔🤔

<br>

JPA에서는 **지연로딩**이라는 개념을 사용한다. 지연로딩을 하게 되면 엔티티를 조회할 때 해당 엔티티에 

연관된 참조(엔티티) 조회를 잠시 미룬다. **<span style="background-color:#F0E68C">이때 해당 참조 변수는 참조하는 엔티티의 프록시 객체 할당된다.</span>**

<br>

즉, 지연로딩을 하는 과정에서 프록시 객체를 사용했고, 이 프록시 객체를 반환하는 과정에서 문제가 발생한 것이다.

<img src = "/assets/img/jpa/error/offer.png">

위 이미지를 보면 agent, player 각각 프록시 객체가 할당된 상태이다. 

결국 이번 에러는 위와 같은 상태에서 JSON 형태로 데이터를 반환해주려고 했기 때문에 발생한 것이다.

<br>

#### <span style="background-color:black; color:white">문제 해결하기</span>

해결은 간단했다. 직렬변환기를 사용할 수 있는 형태로 바꿔주는 것이다.

컨트롤러 부분에서 엔티티를 DTO로 변환해주는 코드를 추가적으로 작성해주었다.

```java
OfferDto.toDto(offer);
```

이렇게 DTO로 변환해 주는 과정에서 프록시 객체를 초기화 해주기 때문에 아래의 이미지 처럼 

직렬화할 수 있는 형태로 반환된다. 참고로 프록시를 초기화 하게 되면 추가적인 쿼리가 발생하게 된다.

<img src = "/assets/img/jpa/error/offerDto.png"><br>

<br>

이 외에도 에러 본문에서 알려준 `SerializationFeature.FAIL_ON_EMPTY_BEANS`을 비활성화

하는 방법, 즉시로딩을 사용하는 방법, @JsonIgnore 어노테이션을 쓰는 방법이 있다.

하지만 처음에 해결한 방법이 제일 베스트인거 같다. 

