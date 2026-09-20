---
layout: post
title: 알림 박스 스타일
subtitle: 본문에 자연스럽게 놓이는 작은 보충 설명
description: 기존 notice-box 문법으로 타입별 스타일을 확인하는 로컬 전용 샘플입니다.
toc: false
---

<div class="notice-box info" markdown="1">
**가정을 먼저 적습니다.** 숫자보다 그 숫자를 만든 조건이 중요합니다.

- 콘텐츠를 소비하는 서비스로 가정합니다.
- 로컬 측정치는 조치 전후의 상대 비교에 사용합니다.
</div>

<div class="notice-box tip" markdown="1">
같은 조건에서 여러 번 측정하고, 평균뿐 아니라 분포도 함께 기록합니다.
</div>

<div class="notice-box warning" markdown="1">
**로컬 실험은 운영 경험을 대체하지 않습니다.** 절대 처리량보다 변화의 원인을 확인하는 데 집중합니다.
</div>

<div class="notice-box chapter" markdown="1">
이번 글에서는 실험의 이유, 전제 조건, 용량 산정을 정리합니다.
</div>

<div class="notice-box info" data-title="실험 전제" markdown="1">
원하는 라벨이 필요할 때만 `data-title`을 추가합니다. [작성 가이드 대신 본문 샘플 보기](/preview/reading/).

1. 환경과 조건을 기록합니다.
   - CPU와 메모리 사용량을 함께 봅니다.
2. 측정 결과를 비교합니다.
</div>

<div class="notice-box" markdown="1">
타입을 생략한 기존 박스도 기본 참고 스타일을 사용합니다.

`very-long-configuration-key-for-testing-responsive-notice-box-without-horizontal-page-overflow`
</div>

<div class="notice-box info" data-title="코드와 표" markdown="1">

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 10
```

| 항목 | 설명 | 값 |
| --- | --- | --- |
| 커넥션 풀 | 동시에 사용할 수 있는 DB 커넥션 수 | 10 |

</div>

<details markdown="1">
<summary>펼침 영역의 코드와 표</summary>

```java
public int poolSize() {
    return 10;
}
```

| 항목 | 설명 |
| --- | --- |
| 풀 크기 | 숨긴 표도 펼치면 필요한 경우 스크롤 안내를 표시합니다. |

</details>
