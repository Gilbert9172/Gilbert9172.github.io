---
layout: post
title: resultMap
categories: spring
tags: mybatis
---

## <span style="color:gray">resultMap</span>

resultMap엘리먼트는 마이바티스에서 가장 중요하고 강력한 엘리먼트다. 

사실 join매핑과 같은 복잡한 코드는 굉장히 많은 코드가 필요하다. ResultMap은 가단한 구문에서는 

매핑이 필요하지 않고 복잡한 구문에서 관계를 서술하기 위해서 필요하다.

[MyBatis 공식문서](https://mybatis.org/mybatis-3/ko/sqlmap-xml.html#Result_Maps)를 읽어봤지만 솔직히 이해가 잘 안됐다.

그래서 일단 바로 프로젝트에 적용해 보았다.

<br>

## <span style="color:gray">association</span>

> `<association>` 프로퍼티는 "has-one" 타입의 관계를 다룬다. 

우선 프로젝트에서 내가 가져와야할 데이터의 형식은 아래와 같다.

```txt
{
    "data": {
        "sharedDataInfo": [
                             {
                                "A": "a",
                                "B": {
                                        "id": "test",
                                        "email": "test@test.com",
                                    }
                            }
                          ]
            }
}
```

처음에 resultMap을 사용하지 않고 코드를 짰을 때는 아래와 같았다.

```java
@Override
public List<SharedDataInfo> getSharerInfo(String userSeq) {

	// 1. 내가 공유받은 데이터들.
	List<SharedDataInfo> sharedDataInfoList = driveMapper.findNowner(userSeq);

	List<SharedDataInfo> test = new ArrayList<>();

	// 2.
	for (SharedDataInfo sharedDataInfo : sharedDataInfoList) {
		// 2-1 : 해당 객체의 dataSeq가져온다.
		String dataSeq = sharedDataInfo.getDataSeq();

		// 2-2 : 해당 dataSeq의 ownerSeq를 가져온다.
		FileVo fileVo = driveMapper.getDriveData(dataSeq);
		String ownerSeq = fileVo.getUserSeq();

		// 2-3 : USER TABLE에서 ownerSeq의 정보 가져온다.
		SharerInfo sharer = driveMapper.getSharerInfo(ownerSeq);
		sharedDataInfo.setSharerInfo(sharer);
		test.add(sharedDataInfo);
	}
	return test;
}
```

<br>

resultmap을 적용했을 때 java 코드

```java
@Override
public List<SharedDataInfo> getSharerDataListInfo(String userSeq) {

    String driveSeq = commonMapper.getDriveSeq(userSeq);

    List<String> sharedDataDataSeq = driveMapper.findNowner(userSeq);
    List<SharedDataInfo> sharedDataInfoList = new ArrayList<>();

    for (String dataSeq : sharedDataDataSeq) {
        SharedDataInfo sharedDataInfo = driveMapper.getFileFolder(dataSeq, userSeq, driveSeq);
        sharedDataInfoList.add(sharedDataInfo);
    }
    return sharedDataInfoList;
}
```

<br>

## <span style="color:gray">association 파해쳐보기</span>

**resultMap**
```xml
<resultMap id="getSharedDataInfo" javaType="SharedDataInfo">
    <result property="dataType" column="DATA_TYPE"/>
    <result property="folderName" column="FOLDER_NAME"/>
    <result property="fileName" column="FILE_NAME"/>
    <association property="sharerInfo" column="USER_SEQ" select="getSharerInfo">
        <result property="id" column="ID"/>
        <result property="email" column="EMAIL"/>
        <result property="nickName" column="NICKNAME"/>
    </association>
</resultMap>
```

- id : 해당 resultmap의 식별 값
- javaType : resultmap의 결과 값을 매핑해줄 자바 클래스
- property : 자바클래스의 필드명
- column : 데이터베이스 컬럼명
- `<association>`태그 내에 있는 column : JOIN할 데이터베이스 컬럼명
- select : 돌아야 할 쿼리의 식별 값

<br>

우선 `getFileFolder` 쿼리가 돌고, 그 결과 값들이 resultMap에 세팅이된다.

그리고 나서 `<association>` 태그에 있는 select에 명시된 `getShareInfo` 쿼리를 실행한다.

그리고 나오는 값을 DTO에 알맞게 셋팅해준다.

<br>

**getFileFolder**
```xml
<select id="getFileFolder" parameterType="String" resultMap="getSharedDataInfo">
    SELECT
        dd.DATA_SEQ,
        dd.USER_SEQ,
        dd.DATA_TYPE,
        f1.FILE_NAME,
        f2.FOLDER_NAME
    FROM
        DRIVE_DATA dd
    LEFT JOIN FILE f1
        ON dd.DATA_SEQ = f1.DATA_SEQ
    LEFT JOIN FOLDER f2
        ON dd.DATA_SEQ = f2.DATA_SEQ
    WHERE dd.DATA_SEQ = #{dataSeq}
        AND dd.USE_YN = 'Y'
</select>
```

<br>

**getShareInfo**
```xml
<select id="getSharerInfo" parameterType="String" resultType="SharerInfo">
    SELECT
        ID,
        EMAIL,
        NICKNAME
    FROM
        USER
    WHERE USER_SEQ = #{userSeq}
</select>
```

