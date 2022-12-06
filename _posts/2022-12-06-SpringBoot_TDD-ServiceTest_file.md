---
layout: post
title: Service 계층 - File 테스트
categories: tdd
tags: jpa
---

## <span style="color:gray">File mocking하기</span>

---

#### <span style="background-color:black; color:white">MockMultipartFile</span>

> <em><a href="" target="_blank"></a></em>

MockMultipartFile은 MultipartFile 인터페이스를 상속받는다.

```java
package org.springframework.mock.web;


public class MockMultipartFile implements MultipartFile {

	private final String name;

	private final String originalFilename;

	@Nullable
	private final String contentType;

	private final byte[] content;

    //...
}
```

<br>

#### <span style="background-color:black; color:white">테스트 코드 작성하기</span>

```java
@Test
@DisplayName("player 중복 X")
void NotDuplicatedPlayer() throws Exception {

    //given
    PlayerRegisterDto regDto = testRegDto();
    MockMultipartFile file = testImgFile();
    ReflectionTestUtils.setField(playerService, "savePath", "/Users/giljun/trade-market/player");

    given(agentRepository.findById(1L)).willReturn(Optional.of(agent));
    given(teamRepository.findById(1L)).willReturn(Optional.of(team));
    given(positionRepository.findById(1L)).willReturn(Optional.of(position));
    given(soccerRepository.findByFifaRegNum(anyString())).willReturn(Optional.empty());

    // when
    playerService.registerPlayer(regDto, file);

    // then
    then(soccerRepository).should().findByFifaRegNum(anyString());
}

private MockMultipartFile testImgFile() throws IOException {

    Path path = Paths.get("src/test/resources/test.png");       // 해당 경로에 테스트 이미지 넣기.
    String name = "testImg.png";
    String originalFileName = "testImg.png";
    String contentType = "img/png";
    byte[] content = Files.readAllBytes(path);
    return  new MockMultipartFile(name, originalFileName, contentType, content);
}
```