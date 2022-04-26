---
layout: post
title: File Upload
categories: spring
tags: springBoot
---

## <span style="color:gray">File Upload</span>

<img src="/assets/img/spring/상품등록form.png">

위 등록 폼에 파일을 등록하고 제출 버튼을 눌렀다.

---

<img src="/assets/img/spring/fileupload.png">

그림을 보면 두개의 part가 생성됐는데, 하나는 파일을 올릴때 이름,

그리고 나머지 하나는 파일의 바이너리 데이터였다.

<br>

그리고 콘솔에 찍은 로그를 확인해 보니 아래와 같았다.

```txt
request=org.springframework.web.multipart.support.StandardMultipartHttpServletRequest@46348740

itemName=test

parts=[org.apache.catalina.core.ApplicationPart@5c417256, org.apache.catalina.core.ApplicationPart@55d16015]

```