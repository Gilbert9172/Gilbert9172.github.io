---
layout: post
title: 스프링과 파일 업로드.
categories: spring
tags: springBoot
---

## <span style="color:gray">파일 업로드 소개</span>

일반적으로 사용하는 HTML Form을 통한 파일 업로드를 이해하려면 먼저 폼을 

전송하는 다음 두 가지 방식을 이해해야 한다.

<br>

#### application/x-www-form-urlencoded

HTML 폼 데이터를 서버로 전송하는 가장 기본적인 방버이다.

Form태그에 별도의 enctype옵션이 없으면 웹 브라우저는 요청 HTTP 메시지의 

헤더에 다음 내용을 추가한다.

> Content-Type: application/x-www-form-urlencoded

그리고 폼에 입력한 전송할 항목을 HTTP Body에 문자로 `&` 로 구분해서 전송한다.

그러나 파일을 업로드 하려면 파일은 문자가 아니라 바이너리 데이터를 전송해야 한다.

문자를 전송하는 이 방식으로 파일을 전송하기는 어렵다. 그리고 또 한 가지 문제가 더

있는데, 보통 폼을 전송할 때 파일만 전송하는 것이 아니라는 점이다.

그렇다면 **문자와 바이너리를 동시에 전송하는 방법**은 없는걸까?

<br>

#### multipart/form-data

이 방식을 사용하려면 Form 태그에 별도의 `enctype="multipart/form-data"` 를 지정해야 한다.

`multipart/form-data`방식은 다른 종류의 여러 파일과 폼의 내용을 함께 전송할 수 있다.

폼의 입력 결과로 생성된 HTTP 메시지를 보면 각각의 전송 항목이 구분이 되어있다. 

`Content-Disposition`이라는 항목별 헤더가 추가되어 있고 여기에 부가 정보가 있다.

<img src="/assets/img/spring/multipart.png">

위의 예시를 보면 username, age, file1이 각각 분리되어 있고, 폼의 일반 데이터는

각 항목별로 문자가 전송되고, 파일의 경우 파일의 이름과 Content-Type이 추가되고

바이너리 데이터가 전송된다. `multipart/form-data`는 이렇게 각각의 항목을 구분해서,

한 번에 전송하는 것이다.


---

<br>

## <span style="color:gray">로그로 확인해 보기</span>

<img src="/assets/img/spring/partlog.png">

두 개의 part로 나뉘어진걸 확인할 수 있다. 

Content-Type 또한 `multipart/form-data`로 확인할 수 있다.

---

<br>

## <span style="color:gray">Part</span>

멀티파트 형식은 전송 데이터를 하나하나 각각 부분(part)으로 나누어 전송한다.

parts에는 이렇게 나누어진 데이터가 각각 담긴다. 서블릿이 제공하는 Part는

멀티파트 형식을 편리하게 읽을 수 있는 다양한 메서드를 제공한다.

|메서드|설명|
|------|----|
|part.getSubmittedFileName()|클라이언트가 전달한 파일명|
|part.getInputStream()|Part의 전송 데이터를 읽을 수 있다.|
|part.write()|Part를 통해 전송된 데이터를 저장할 수 있다.|

서블릿이 제공하는 `Part`는 편하기는 하지만, `HttpServletRequest`를 사용해야 하고,

추가로 파일 부분만 구분하려면 여러가지 코드를 넣어야 한다. 이제는 스프링이 이 부분을

얼마나 편하게 제공하는지 확인해보자.

---

<br>

## <span style="color:gray">스프링과 파일업로드</span>

스프링은 `MultipartFile`이라는 인터페이스로 멀티파트 파일을 매우 편리하게 지원한다.

✓ **`file.getOriginalFilename()`** : 업로드 파일 명 

✓ **`file.transferTo(...)`** : 파일 저장

<br>

```java
@Controller
@RequestMapping("/spring")
public class SpringUploadController {

    @Value("${file.dir}")
    private String fileDir;

    @GetMapping("/upload")
    public String newFile() {
        return "upload-form";
    }

    @PostMapping("/upload")
    public String saveFile(@RequestParam String itemName,
                           @RequestParam MultipartFile file, HttpServletRequest request) throws IOException {

        log.info("request={}", request);
        log.info("itemName={}", itemName);
        log.info("multipartFile={}", file);

        if (!file.isEmpty()) {
            String fullPath = fileDir + file.getOriginalFilename();
            log.info("파일 저장 fullPath={}", fullPath);
            file.transferTo(new File(fullPath));
        }
        return "upload-form";
    }
}
```

코드를 보면 스프링 답게 딱 필요한 부분의 코드만 작성하면 된다.

업로드하는 HTML Form의 name에 맞추어 `@RequestParam`을 적용하면 된다. 

추가로 @ModelAttribute 에서도 MultipartFile 을 동일하게 사용할 수 있다.

---

<br>

## <span style="color:gray">여러개의 파일 업로드</span>

```java
public List<UploadFile> storeFiles(List<MultipartFile> multipartFiles) throws IOException {

    List<UploadFile> storeFileResult = new ArrayList<>();

    for (MultipartFile multipartFile : multipartFiles) {
        if (!multipartFile.isEmpty()) {
            storeFileResult.add(storeFile(multipartFile));
        }
    }
    return storeFileResult;
}
```

---

<br>

## <span style="color:gray">다운로드</span>

다운로드를 하려면 Header에 Cotent-Disposition을 추가해줘야 한다. 꼭!!!

```java
String contentDisposition = "attachment; filename=\"" + encodedUploadFileName + "\"";
return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                .body(resource);
```

추가적으로 업로드할 때 한글이 꺠질수 있기 때문에 아래의 코드를 추가한다.

참고로 `UriUtils`는 수 많은 인코딩 메서드를 제공해준다.

```java
String encodedUploadFileName = UriUtils.encode(uploadFileName, StandardCharsets.UTF_8);
```

---

<br>

## <span style="color:gray">@RequestPart</span>

오늘(2022-07-28) 회사 프로젝트에서 REST API로 파일 업로드를 구현해야 했다.

요구조건은 아래와 같다.

- 게시글 생성(POST)
- 세부 정보 + 썸네일 이미지 + 첨부 파일

그래서 컨트롤러에서 @RequestBody와 @RequestParam 어노테이션을 아래와 같이 작성하니

```java
public void Test(@RequestBody Dto dto, @RequestParam MultipartFile multipartfile) {}
```

정상 작동을하지 않았다. 구글링을 해본 결과 `@RequestPart` 어노테이션을 알게 됐다.

<br>

#### @RequestPart란?

[공식문서](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/RequestPart.html)에서는 다음과 같이 서술되어 있다.

> Annotation that can be used to associate the part of a "multipart/form-data" request with a method argument.

한국말로 번역을 하면 "해당 어노테이션은 'multipart/form-data' 요청의 일부를 메서드 인수와 

연결하는 데 사용할 수 있다" 정도가 된다. (도대체 이게 무슨말..?🧐)

요약하자면 RequestParam은 multipart/form-data을 받는데 사용할 수 있고 등록된 Converter 또는 

PropertyEditor를 통한 형식 변환에 의존한다고 한다. 반면에 RequestPart는 요청 부분의 'Content-Type' 

헤더를 고려하는 HttpMessage Converters에 의존한다는 것이다.

<br>

솔직히 지금 수준에서 정확하게 이해가 되지는 않지만 정리해보자면,

|어노테이션|설명|
|----------|----|
|@RequestParam|파일과 함께 키/값 쌍으로 전송되는 간단한 데이터에 사용|
|@RequestPart|JSON과 XML과 같은 페이로드에 다중 속성 데이터(multi-attribute data)를 보낼 때 사용한다.|

오늘 하던 작업의 경우 단순히 key:value 값을 넘기는 것이 아닌, JSON객체와 MultiPart를 컨트롤러로

넘겨주는 것이였기 때문에 ***`@RequestPart`*** 가 적절한 방법이였던 것이다.

***<span style="background-color:yellow">즉, JSON객체와 MultiPartFile을 컨트롤러에서 동시에 받기 위해서는 @RequestPart를 사용해야 한다.</span>***

<br>

이제 PostMan을 보면 아래 그림처럼 요청을 보내주면 된다.

<img src="/assets/img/spring/RequestPartPostman.png">

오른쪽 쯤에 `•••` 버튼이 있는데 이걸 누르면 Content-Type을 지정해줄 수 있다.

---