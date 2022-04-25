---
layout: post
title: 스프링과 파일 업로드.
categories: spring
tags: springBoot
---

## <span style="color:gray">스프링과 파일업로드</span>

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
---

<br>

## <span style="color:gray">여러개의 파일 업로드</span>

