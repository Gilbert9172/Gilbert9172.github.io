---
layout: post
title: Redirect
categories: spring
tags: springBoot
---

## <span style="color:gray">Redirect</span>

---

> GET 요청시 URL에 쿼리스트링을 남기지 마시오.

오늘 프로젝트 진행 도중 위와 같은 요구사항이 있었다. 그런데 GET 요청을 

했을 때는 URL뒤에 쿼리스트링이 꼭 붙는데 어떻게 제거할 수 있을까?

이에 대한 해답은 바로 RedirectAttributes 인터페이스에 정의되어 있는 

***<span style="background-color:yellow">addFlashAtrributes</span>*** 를 사용하면 가능하다. 

<br>

## <span style="color:gray">addFlashAttributes</span>

---

#### ***Object 넘길경우***

```java
@PostMapping("/admin")
public String getNoticeListByDate(RedirectAttributes model, DateQueryVo dateQueryVo) {

    model.addFlashAttribute("dateQueryVo", dateQueryVo);
    return "redirect:/admin/notice";

}
```

<br>

```java
@GetMapping("/admin")
public String getNoticeList(HttpServletRequest request, Model model) {

    Map<String, ?> flashMap = RequestContextUtils.getInputFlashMap(request);
    if (flashMap != null) {
        DateQueryVo searchDate = (DateQueryVo) flashMap.get("dateQueryVo");
        bindingAttributes(model, searchDate);
    } else {
        bindingAttributes(model, new DateQueryVo());
    }
    return "notice/A_notice_001";
}

private void bindingAttributes(Model model, DateQueryVo dateQueryVo) {
    List<NoticeVo> noticeList = noticeService.getNoticeList(dateQueryVo);
    model.addAttribute("date", dateQueryVo);
    model.addAttribute("noticeList", noticeList);
}
```

여기서 핵심은 ***<span style="color:red">redirect로 넘어온 객체(DateQueryVo)를 꺼내줘야 한다는 점이다.</span>***

이때 사용되는 메서드는 `getInputFlashMap(HttpServlet request)` 인데 내부적인 

코드는 아래와 같다.

<br>

**RequestContextUtils 일부**
```java
@Nullable
    public static Map<String, ?> getInputFlashMap(HttpServletRequest request) {
        return (Map)request.getAttribute(DispatcherServlet.INPUT_FLASH_MAP_ATTRIBUTE);
    }
```
내부적으로 서블릿이 요청(request)이 가지고 있는 FlashMap 정보를 가져온다.

<br>

## <span style="color:gray">정리</span>

---

RedirectAttributes 인터페이스 내에는 다양한 메서드들이 있다.

이번 기회에 안써본 메서드를 써보고 학습하게 되어서 너무 기쁘고, 요구사항을 

제대로 구현한 부분에서 개발자로서 뿌듯함을 느낀다.

앞으로 addFlashAttributes... 애용하지 않을까 싶다.