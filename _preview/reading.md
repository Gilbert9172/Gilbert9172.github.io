---
layout: post
title: 다시 읽고 싶은 기록을 위한 작은 실험
subtitle: 문장과 시각 자료가 함께하는 개발 노트
description: 문장과 코드, 이미지와 직접 움직여 보는 예제가 함께 놓이는 읽기 화면입니다.
date: 2026-09-20 09:00:00 +0900
categories: [Theme Preview]
toc: true
---

좋은 기록은 시간이 지나 다시 읽어도 생각의 흐름을 따라갈 수 있어야 합니다. 충분한 여백과 편안한 문장 간격, 그리고 필요한 곳에 놓인 그림이 이해를 돕습니다.

이 페이지는 **로컬에서만 표시되는 테마 샘플**입니다. 실제 글 목록이나 배포 결과에는 포함되지 않습니다.

## 먼저, 읽기 편안한 문장

처음에는 익숙하지 않았던 개념도 직접 만들어 보고 설명하다 보면 조금씩 선명해집니다. 그 과정에서 만난 질문을 남겨두면, 다음에 같은 문제를 마주했을 때 어디서부터 생각해야 할지 알 수 있습니다.

글의 모양을 맞추려고 특별한 컴포넌트를 외울 필요는 없습니다. 평소처럼 Markdown으로 쓰고, 필요할 때 이미지나 HTML을 함께 넣으면 됩니다.

> 기록은 정답만 보관하는 곳이 아니라, 그 답에 도착한 이유를 다시 찾는 곳입니다.

## 코드는 흐름과 함께

짧은 설명 다음에 코드를 놓으면, 무엇을 살펴봐야 하는지 먼저 알 수 있습니다. 긴 코드는 블록 안에서 스크롤할 수 있고, 복사 버튼도 그대로 사용할 수 있습니다.

```java
public Product findProduct(Long id) {
    return cache.get(id)
        .orElseGet(() -> {
            Product product = repository.findById(id);
            cache.put(id, product);
            return product;
        });
}
```

| 표현하고 싶은 것 | 어울리는 방식 |
| --- | --- |
| 구성 요소의 관계 | 이미지, SVG 다이어그램 |
| 짧은 동작과 변화 | GIF, 재생 가능한 영상 |
| 직접 확인할 수 있는 결과 | HTML, JavaScript 예제 |

## 그림으로 연결하기

기존 글에서 사용하던 이미지 경로도 그대로 사용할 수 있습니다. 이미지를 누르면 확대해서 볼 수 있습니다.

![Spring의 BeanFactory 구조](/assets/img/spring/container/BeanFactory.png)
_기존 블로그의 이미지를 새 본문 안에 배치한 예시입니다._

## HTML을 그대로 담기

아래 예제는 CSS와 JavaScript를 포함한 독립된 HTML 문서입니다. 버튼을 누르면 요청이 이동하는 단계를 확인할 수 있습니다. 파일을 그대로 넣었기 때문에 예제의 디자인과 블로그의 디자인이 서로 섞이지 않습니다.

{% include embed/html.html src="/assets/embeds/request-flow.html" title="요청이 전달되는 과정 — 직접 단계 넘겨보기" height="380" %}

## 필요한 설명은 펼쳐보기

본문의 `inline code`와 **강조**, [링크](/posts/)도 같은 색감으로 정리합니다.

- 중요한 개념을 먼저 정리합니다.
- 코드를 실행하며 결과를 확인합니다.
  - 중첩 목록은 생각의 단계를 구분합니다.
- 시간이 지나 다시 읽을 질문을 남깁니다.

<details>
<summary>작성 방식과 설정 살펴보기</summary>
<p>일반 HTML은 Markdown 본문에 바로 넣을 수 있습니다. 완성된 HTML 문서는 iframe으로 삽입하고, 넓은 화면이 필요한 글에는 <code>wide: true</code>를 지정하면 됩니다.</p>
</details>

복잡한 예제가 있어도 본문은 차분하게 이어집니다. [전체 글 목록](/archives/)으로 돌아가 기존 글과 비교해 보세요.

자체 HTML과 넓은 본문은 [HTML 원본 샘플](/preview/html/)에서 확인할 수 있습니다.
