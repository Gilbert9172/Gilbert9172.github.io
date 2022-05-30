---
layout: post
title: for each
categories: spring
tags: mybatis
---

## <span style="color:gray">for each</span>

오늘은 자바에서 for문을 돌지 않고, Mybatis의 **`for each`** 를 사용하는, 동적 쿼리를 

사용해 보았다. 우선 코드는 n개 이상의 로우값을 업데이트 해줘야하는 경우여서 사용.

```xml
<update id="updateUseYn" parameterType="FileVo">
    <foreach collection="dataSeqList" item="fileVo" index="index" open="" close="" separator=";">
        UPDATE
            DRIVE_DATA
        SET
            USE_YN = #{useYn}
        WHERE
            DATA_SEQ = #{fileVo.dataSeq}
    </foreach>
</update>
```

---

<br>

## <span style="color:gray">속성 값</span>

<br>

**⒈ collection 속성**

```java
void updateUseYn(List<FileVo> dataSeqList, String useYn);
```
Mapper 인터페이스에서 위와 같은 추상메서드를 작성하였다.

collection 속성에는 앞에서 전달 받은 인자값을 사용한다. 

Map, Array, List, Set 등과 같은 반복 가능한 객체를 전달할 수 있다.

<br>

**⒉ item 속성**

위에서 본 dataSeqList의 별칭(alias)

<br>

**⒊ open 속성**

쿼리 구문이 시작될때 삽입할 문자열을 속성 값으로 삽입한다.

<br>

**⒋ close 속성** 

구문이 종료될때 삽입할 문자열을 속성 값으로 삽입한다.

<br>

**⒌ separator 속성**

반복되는 구문 사이에 삽입할 문자열을 속성값으로 삽입한다.

<br>
 

**⒍ index 속성**

index값을 부를 일종의 변수명을 속성값으로 삽입한다.

태그 내에 `#{index}`를 통해 호출할 때 0부터 반환된다.

---

<br>

## <span style="color:gray">실행 결과</span>

로그를 깔끔하게 정리해봤다. 원하는대로 3번의 쿼리가 반복 호출되었다.

```java
Preparing: 
    UPDATE DRIVE_DATA SET USE_YN = ? WHERE DATA_SEQ = ? ; 
    UPDATE DRIVE_DATA SET USE_YN = ? WHERE DATA_SEQ = ? ; 
    UPDATE DRIVE_DATA SET USE_YN = ? WHERE DATA_SEQ = ?

Parameters: 
    N(String), 9(String), 
    N(String), 10(String), 
    N(String), 11(String)

Updates: 
    1
```