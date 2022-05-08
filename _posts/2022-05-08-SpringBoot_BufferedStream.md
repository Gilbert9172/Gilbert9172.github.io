---
layout: post
title: BufferedStream
categories: spring
tags: springBoot
---

## <span style="color:gray">BufferedStream</span>

> 버퍼 : 데이터를 한 곳에서 다른 한 곳으로 전송하는 동안 일시적으로 그 데이터를 보관하는 메모리 영역

> 버퍼링 : 버퍼를 활용하는 방식 또는 버퍼를 채우는 동작

앞에서 정리한 포스팅에서는 FileStream을 사용하여 파일의 입출력에 대해서 알아보았다.

FileStream의 경우 1 byte 단위로 입/출력이 이루어지면 기계적인 동작이 많아지므로

효율이 떨어지게 된다. 또한 사용자가 일일이 버퍼와 크기를 지정하여 입출력을 하게 되는

것도 정적이고 불편하다. 

<br>

BufferedOutputStream 클래스는 `flush()`메서드가 호출되거나, 

***<span style="background-color:yellow">버퍼가 꽉 찰 때까지 데이터를 버퍼에 저장했다가 한꺼번에 스트림에 쓰는 방식이다.</span>***

예를 틀면 100byte에 해당하는 정보를 스트림에 쓰려고 한다면 기존의 방식은 1byte씩 100번의 `write()` 메서드를 

호출해야했다. 하지만 버퍼링을 사용한다면 100byte를 버퍼에 모아서 1번에 `write()`메서드를 호출하면 되므로

상당히 효율적이라고 할 수 있다.

<br>

BufferdOutputStream을 통하여 원하는 자료를 1바이트 단위로 읽는 `read()` 메서드를 수행하면 시스템 내부적으로

버퍼를 준비하고 이 버퍼를 이용하여 지정된 파일로부터 버퍼의 크기만큼 한꺼번에 많은 데이터를 가져온다.

이렇게 채워진 버퍼로부터 1byte씩 읽어들여 프로그램으로 전달하게 된다.

이때, 1byte씩 읽어들이는 작업은 파일로부터 읽어오는 것이 아닌 준비된 시스템 버퍼에서 읽어오게 되므로,

파일 입력으로 인한 성능 저하를 최소화 할 수 있다.

<br>

결론적으로 사용자가 BufferedInputStream과 BufferedOutputStream을 이용하여 프로그램을 작성하면 1byte씩 

읽고 쓰는 모든 작업이 하드 디스크 파일이 아닌 내부적인 버퍼를 대상으로 발생하며, 필요에 따다 버퍼와 

하드 디스크 파일간에 입출력이 간헐적으로 발생하므로 전체적인 입출력 성능이 동적으로 향상될 수 있다.

---

## <span style="color:gray">예제 코드</span>

```java

int size = 1024;
int len;
byte[] buffer = new byte[size];

FileInputStream fis = null;
BufferedInputStream bis = null;
FileOutputStream fos = null;
BufferedOutputStream bos = null;

try {

    fis = new FileInputStream("/Users/giljun/gilbert/test.txt");
    bis = new BufferedInputStream(fis);

    fos = new FileOutputStream("/Users/giljun/gilbert/copy.txt");
    bos = new BufferedOutputStream(fos,size);

    // 1byte씩 읽지 않고 한 번에 데이터를 미리 버퍼에 읽어놓게 된다.
    // 따라서 효율이 좋으며, stream과 같은 메소드를 갖는다.
    while ((len=bis.read(buffer)) != -1) {
        bos.write(buffer, 0, len);
    }
    bos.flush();
} catch(Exception e){
    e.printStackTrace();
}finally{
    
    if(bis != null) try{bis.close();}catch(IOException e){}
    if(fis != null) try{fis.close();}catch(IOException e){}

    // BufferedOutputStream 이 close() 되면서 버퍼의 내용을 출력한다.
    if(bos != null) try{bos.close();}catch(IOException e){}
    if(fos != null) try{fos.close();}catch(IOException e){}
}
```

`flush()` 와 `close()` 차이에 대해서 구글링을 해봤는데 의견이 분분했다.

어떤 사람은 `close()` 메서드를 호출하면 내부적으로 `flush()` 메서드를 호출한다고 하고, 

또 어떤 사람은 스트림의 `close()` 메서드가 반드시 `flush()` 메서드를 호출하는 것은 아니라고 한다.

그래서 일단은 혹시 모를 버글르 대비해서 두 가지 메서드를 모두 쓸 생각이다.

📚 [stackoverflow flush & close](https://stackoverflow.com/questions/9858495/using-flush-before-close)

---

<br>

## <span style="color:gray">참고 블로그</span>

📚 [BufferedStream 관련 블로그](https://passionha.tistory.com/229)

---