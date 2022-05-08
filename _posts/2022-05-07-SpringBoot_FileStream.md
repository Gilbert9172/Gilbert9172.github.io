---
layout: post
title: FileStream
categories: spring
tags: springBoot
---

## <span style="color:gray">MultipartFile을 사용한 파일 업로드</span>

Multipart는 파일을 서버로 전송할 때 많이 사용한다.

```java
@PostMappint("/upload/image")
public String uploadProfileImage (@RequestParam(name="file") MultipartFile file) throws IOException {
    // ...
}
```

📚 [MultipartFile 관련 method docs](https://docs.spring.io/spring-framework/docs/3.0.6.RELEASE_to_3.1.0.BUILD-SNAPSHOT/3.1.0.BUILD-SNAPSHOT/org/springframework/web/multipart/MultipartFile.html)

---

<br>

## <span style="color:gray">클라이언트에게 받은 파일 저장</span>

`new File(저장할 경로)`

```java

public static void saveFile(MultipartFile file) {

    String folder = "/A/"
    String fileName = file.getOriginalName();

    File addFile = new File(folder + File.separator + fileName);
    file.transferTo(addFile);
}
```

---

<br>

## <span style="color:gray">파일 읽기(FileInputStream) / 파일 쓰기(FileOutPutStream</span>

**`write(byte buf[], int index, int size)`**

→ buf의 index 위치부터 size만큼의 바이트를 출력한다.

```java

// 파일 읽기
File readFile = new File("test.txt 경로");
FileInputStream fis = new FileInputStream(readFile);

// 읽어 온 파일 복사하기.
File copyFile = new File("copy.txt 경로")
FileOutputStream fod = new FileOutputStream(copyFile);


/*******************************************************
* test.txt에서 읽을 수 있는 바이트 수를 반환하고
* 그 크기만큼 byte[]를 생성한다.
*
* int bufSize = fis.available();
* byte[] buf = new byte[bufSize];
********************************************************/

// 보통은 아래와 같이 버터의 크기를 잡는 것이 일반적이다.
byte[] buf = new byte[1024];
int readCount=0;

// test.txt에서 buf 크기(1024)만큼 읽는 것을 반복한다.
while ((readCount = fis.read(buf)) != -1) {

    // 읽어온 데이터(buf)를 "copyFile.txt"에 출력한다.
    fos.write(buf, 0, readCount);
}

// 마지막에 FileInputStream과 FileOutputStream을 닫아 준다.
fis.close();
fos.close();
```

FileInputStream으로 읽어오는 데이터를 모두 사용하고 용량이 크지 않다면,

한번에 입력과 출력을 수행하는 것이 효율적이다. 하지만, 한번에 메모리에

담아서 처리하기에는 용량이 너무 크거나, 전체에 비해 일부의 데이터만 사용한다면,

한번에 읽어오는 것은 비효율을 유발할 수 있다.

---

<br>

## <span style="color:gray">참고 블로그</span>

📚 [FileStream 잘 정리된 블로그](https://passionha.tistory.com/236)

---