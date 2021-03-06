---
layout: post
title: SelectKey
categories: spring
tags: mybatis
---

## <span style="color:gray">Select Key</span>

프로젝트 진행 중 새롭게 INSERT한 데이터의 시퀀스 값을 가져오고 싶었다.

그러던 와중 MyBatis에서 제공해주는 **`SelectKey`** 라는 기능을 할게 됐다.

<br>

우선 메인 쿼리를 작성하고, 아래의 코드와 같이 작성해주면 된다.

여기서 order라는 파라미터가 있는데 이것은 해당 SeletcKey를 메인 쿼리보다 

먼저 실행할지 나중에 실행할지를 선택해주는 파라미터이다.


```java
<insert id="addDriveData" parameterType="FileVo">
    INSERT INTO DRIVE_DATA (DATA_TYPE, DRIVE_SEQ, USER_SEQ ,DEPTH, PARENTS, USE_YN, REG_DATE)
    VALUES (#{dataType}, #{driveSeq} , #{userSeq}, #{depth}, #{parents}, #{useYn}, now())
    
    <selectKey keyProperty="dataSeq" order="AFTER" resultType="String">
        SELECT LAST_INSERT_ID() as DATA_SEQ
    </selectKey>
</insert>
```

위와 같이 코드를 작성할 경우, INSERT문이 성공적으로 실행되면 

이 때 생성된 dataSeq를 가져온다.

---