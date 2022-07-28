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

<br>

## <span style="color:gray">2022.07.28 추가</span>

위 코드를 보면 `keyProperty=dataSeq`라고 되어있다.

Insert 쿼리를 실행 후 `LAST_INSERT_ID()`를 얻으러면 서비스 로직에서 아래와 같이 가져와야한다.

```java
public Long registerBoard(BoardVo boardVo) {
    dashBoardMapper.registerBoard(boardVo);
    return boardVo.getBoardSeq();
}
```

|순서|설명|코드|
|----|----|----|
|1|우선 새로 INSERT 할 객체(BoardVo boardVo)를 받는다.|public Long registerBoard(BoardVo boardVo)|
|2|그리고 실제로 DB에 INSERT 작업을 한다.|dashBoardMapper.registerBoard(boardVo);|
|3|마지막으로 파라미터롤 받은 객체의 참조변수를 통해서 값을 가져온다.|return boardVo.getBoardSeq();|

<br>

나는 2번에서 새로운 seq를 반환해준다고 생각해서 아래와 같이 코딩을 했었다.

```java
public Long registerBoard(BoardVo boardVo) {
    return dashBoardMapper.registerBoard(boardVo);
}
```

이렇게 하면 단순히 registerBoard() 메서드의 반환 값을 받기 때문에 

제대로된 값(`LAST_INSERT_ID()`) 을 얻을수가 없었다.

---