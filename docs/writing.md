# 글 작성과 로컬 미리보기

## 실행

Ruby와 Node가 설치된 환경에서 최초 한 번 의존성을 설치합니다.

```sh
bundle install
npm ci
npm run build
```

이후에는 `npm run dev`로 실행하고 <http://127.0.0.1:4000>을 엽니다. 글과 스타일을 저장하면 자동으로 다시 빌드됩니다. `_config.yml`을 바꾼 경우 서버를 재시작합니다. 테마의 `_javascript`를 수정했을 때만 `npm run build`를 다시 실행하면 됩니다.

- 본문 샘플: <http://127.0.0.1:4000/preview/reading/>
- HTML 원본·넓은 화면 샘플: <http://127.0.0.1:4000/preview/html/>
- 넓은 글의 목차 샘플: <http://127.0.0.1:4000/preview/wide-toc/>
- `_preview/`는 개발 설정에서만 출력합니다. 일반 배포에는 포함되지 않습니다.
- 배포와 동일한 빌드 확인: `JEKYLL_ENV=production bundle exec jekyll build`

## 기본 작성

`_posts/YYYY/YYYY-MM-DD-title.md`에 작성합니다. 기존 글 주소 형식은 유지됩니다.

```yaml
---
layout: post
title: 글 제목
subtitle: 제목 아래에 표시할 부제목 # 선택 사항
description: 목록과 검색에서 사용할 짧은 소개
categories: [Development]
tags: [java]
toc: true
---
```

이 아래에 평소처럼 Markdown과 HTML을 작성합니다. 이미지나 썸네일, 별도 컴포넌트는 필수가 아닙니다. 자체 CSS/JS가 있는 글은 `description`을 지정하면 목록에 소스 코드가 요약으로 노출되는 것을 피할 수 있습니다.

`subtitle`은 포스팅 제목 아래에 일반 텍스트로 표시합니다. `description`은 목록·검색·SEO용 요약으로 유지하며, 부제목이 있을 때는 글 상단에 중복 표시하지 않습니다. `subtitle`을 생략하거나 비워 두면 기존처럼 `description`을 표시합니다. 목록·브라우저 제목에는 `title`을 사용합니다.

본문의 큰 구획은 `##`, 그 아래 소제목은 `###`로 나눕니다. `>`는 실제 인용문에만 사용하고 소제목 대신 쓰지 않습니다. 이미 소제목이 있는 구획에서 핵심 문장만 강조하려면 `**핵심 문장**`으로 작성합니다. 제목 사이의 여백과 구분은 테마가 처리하므로 장식용 `<br>`와 `---`를 반복해서 넣지 않아도 됩니다.

## 알림 박스

기존 `notice-box` 문법을 그대로 사용합니다. 라이트·다크 테마에 맞는 배경과 작은 라벨이 자동으로 적용됩니다.

```html
<div class="notice-box info" markdown="1">
- 함께 알아두면 좋은 내용을 적습니다.
- **강조**, 링크, 목록 등 Markdown을 사용할 수 있습니다.
</div>
```

- `info` 또는 타입 생략: 참고
- `tip`: 팁
- `warning`: 주의 (저채도 앰버 배경)
- `chapter`: 개요

라벨을 바꾸고 싶을 때만 `data-title="실험 전제"`처럼 추가합니다. 라벨은 시각적 보조 정보이므로 중요한 주의 사항은 본문에도 적어 주세요. 일반 소제목은 알림 박스 대신 `##`·`###`로 작성합니다.

`info`는 블루그레이, `tip`은 세이지그레이, `chapter`는 중립 회색을 사용합니다. 본문 글자색은 동일합니다. 박스나 `<details markdown="1">` 안에서도 코드 블록과 표는 공통 서식을 사용합니다.

## 표와 코드

표의 설명 문장은 셀 안에서 줄바꿈됩니다. 화면보다 넓은 표에는 가로 스크롤 안내와 ‘넓게 보기’ 버튼이 자동으로 생깁니다. 펼친 표는 Escape 또는 닫기 버튼으로 닫을 수 있습니다. 별도 문법이나 JavaScript 설정은 필요 없습니다.

## 검색·읽는 시간·시리즈

- 이 블로그의 `/assets/embeds/` 아래 HTML을 iframe으로 넣으면, 정적인 본문 텍스트를 검색과 읽는 시간 계산에 함께 사용합니다. 외부 문서, 스크립트·스타일, JavaScript로만 생성되는 텍스트는 포함하지 않습니다. 파일당 2MB 이하의 `.html`을 지원합니다.
- `read_time: false`는 읽는 시간을 숨기고, `read_time: 8`은 약 8분으로 지정합니다. 기본은 본문을 기준으로 계산합니다.
- `_data/series.yml`에 시리즈 이름과 기존 카테고리를 등록하면 해당 글에 목차와 같은 시리즈 이전·다음 편이 자동으로 표시됩니다. 발행일 순으로 정렬되며 아직 작성하지 않은 편의 링크는 만들지 않습니다. `series: false`로 제외하거나, `series: load-test`처럼 등록한 키로 참여할 수 있습니다.
- 홈의 대표 주제는 `_data/journal-topics.yml`에서 표시 이름·카테고리를 조정합니다. 글 목록 필터와 페이지는 URL에 저장되어 공유하거나 새로고침해도 유지됩니다.
- `_plugins/`를 변경한 경우 로컬 서버를 재시작합니다.

## 이미지와 GIF

파일을 `assets/img/글-이름/` 아래에 두고 같은 문법으로 넣습니다. GIF는 변환하지 않고 원본 그대로 표시됩니다.

```markdown
![그림 설명](/assets/img/글-이름/diagram.png)
![움직임 설명](/assets/img/글-이름/demo.gif)
```

일반 `<img>`도 사용할 수 있습니다. 긴 움직임에는 재생을 멈출 수 있는 영상을 권장합니다.

```html
<video controls playsinline preload="metadata" poster="/assets/img/글-이름/poster.png">
  <source src="/assets/video/demo.mp4" type="video/mp4">
  브라우저가 영상을 지원하지 않습니다.
</video>
```

## HTML 넣기

### 본문에 직접 작성

`<details>`, `<figure>`, `<table>`, `<video>`, `<iframe>` 등을 그대로 사용할 수 있습니다. `.html` 확장자의 글도 지원하며, 기존 HTML 글을 변환할 필요가 없습니다. HTML 블록 안에서도 Markdown 처리가 필요하면 `<div markdown="1">`을 사용합니다.

HTML 안의 자체 스타일은 `.my-demo`처럼 고유한 클래스 안에 한정하면 블로그와의 충돌을 줄일 수 있습니다. Liquid의 `{{ ... }}` 또는 `{% ... %}`를 원문으로 보존하려면 `{% raw %}`와 `{% endraw %}`로 감쌉니다.

### 완성된 HTML 파일 그대로 삽입

`<!doctype html>`, `<head>`, `<style>`, `<script>`가 있는 문서는 `assets/embeds/`에 저장하고 다음 한 줄로 넣습니다. 파일 안의 상대 경로는 해당 HTML 파일 위치를 기준으로 합니다.

```liquid
{% include embed/html.html src="/assets/embeds/my-demo.html" title="예제 설명" height="520" %}
```

자체 CSS와 JavaScript가 iframe 안에서 실행되어 블로그의 레이아웃과 분리됩니다. 가로 폭은 본문에 맞추고 세로 높이는 `height`로 정합니다. 내용이 더 길면 프레임 안에서 스크롤하거나 ‘새 창에서 보기’를 사용할 수 있습니다. 직접 관리하는 HTML을 위한 기능이며, iframe은 코드의 권한을 제한하는 보안 격리 기능으로 설정되어 있지 않습니다.

외부 사이트의 공식 iframe 코드도 직접 붙여 넣을 수 있습니다. 단, 해당 서비스가 임베드를 허용해야 합니다.

### 긴 학습 아티팩트 넣기

이 블로그에 함께 저장한 HTML은 `resize=true`를 지정하면 내용 높이에 맞춰 프레임이 늘어나고, 질문을 펼치거나 화면 폭을 바꿔도 다시 맞춰집니다. 원본 HTML을 수정할 필요는 없습니다.

```liquid
{% include embed/html.html src="/assets/embeds/tcp-four-way-close.html" title="TCP 연결 종료 학습 노트" height="1000" resize=true sync_theme=true %}
```

- `resize=true`: 같은 출처의 HTML 문서에서 사용합니다. 일반적인 문서 흐름에 맞춘 기능이며, 화면 높이(`vh`)에 의존하는 앱은 고정 `height`가 더 적합합니다. JavaScript가 실행되지 않거나 외부 문서인 경우 지정한 높이를 유지합니다.
- `sync_theme=true`: HTML이 루트의 `data-theme="light"` / `"dark"`를 지원할 때만 사용합니다. 블로그의 테마 선택을 전달할 뿐, 아티팩트의 색상이나 스타일을 덮어쓰지 않습니다.
- 두 옵션을 생략하면 기존처럼 고정 높이와 원본 테마를 사용합니다. 원본을 새 창에서 열면 블로그와 독립적으로 실행됩니다.
- 아티팩트 내부의 제목은 블로그 목차·검색에 자동으로 수집되지 않습니다. 글의 `description`과 짧은 Markdown 소개에 핵심 내용을 적고, 아티팩트 중심 글에는 `toc: false`를 권장합니다.

## 글별 선택 옵션

기본 글에는 아래 옵션이 필요 없습니다. 자체 HTML 화면을 넣는 글에만 선택해서 사용합니다.

```yaml
wide: true       # 오른쪽 패널 없이 넓은 본문
toc: false       # 자체 화면에서 블로그 목차가 필요 없을 때
prose: false     # 리뉴얼 본문 서식 비활성화 (기존 테마 기본 스타일은 적용)
refactor: false  # 이미지 팝업·표 래핑·제목 앵커 등 테마의 HTML 재작성 생략
```

완전한 스타일 독립성이 필요하면 iframe 방식을 사용합니다. 원본 HTML을 재작성하지 않는 `refactor: false`에서는 Markdown 표 스크롤이나 이미지 확대 같은 자동 기능도 생략됩니다.

## 테마 관리

- 공통 색상·홈·사이드바·임베드 스타일: `_sass/_renewal.scss`
- 사이드바 열기·닫기: `_sass/layout/_sidebar.scss`, `_javascript/modules/layouts/sidebar.js`
- 상단 탐색·검색: `_includes/topbar.html`, `_sass/layout/_topbar.scss`, `_sass/pages/_search.scss`, `_javascript/modules/components/search-display.js`
- 포스팅 전용 UI(제목·본문·코드·표·목차·하단): `_sass/_reading.scss`
- 알림 박스: `_sass/components/_notice.scss`
- 글 목록·분류·탐색 화면: `_sass/_browsing.scss`
- 홈 문구: `_config.yml`의 `journal`
- 홈 구성: `_layouts/home.html`
- 글 구성: `_layouts/post.html`, 제목·부제목·작성 정보: `_includes/post-header.html`
- 배포: `main` push에서만 실행. PR에서는 빌드만 확인.

일상적인 글 작성에는 Node 빌드나 테마 파일 수정이 필요 없습니다.

사이드바는 데스크톱에서 접은 상태를 브라우저에 기억하며, 왼쪽 상단 버튼으로 다시 열 수 있습니다. 850px 미만에서는 본문 위에 메뉴를 펼치고 닫기 버튼·바깥 영역·Esc로 닫습니다. 모바일 메뉴 상태는 데스크톱의 접기 설정을 바꾸지 않습니다. 사이드바 JavaScript를 수정했다면 `npm run build:js`로 배포용 파일도 갱신하세요.

상단 검색은 `⌘K` 또는 `Ctrl+K`로 바로 입력할 수 있고, `Esc`로 검색을 닫아 본문으로 돌아갑니다. 모바일에서는 돋보기 버튼으로 열고 닫기 버튼을 사용합니다.

일반 Markdown과 HTML의 문단·제목·표·코드는 공통 포스팅 UI를 따릅니다. 새 본문 서식은 본문 바로 아래의 요소를 중심으로 적용하므로, 자체 디자인이 있는 위젯은 고유한 래퍼로 감싸세요. 완성형 아티팩트는 iframe을 사용하고, 새 본문 서식 자체가 필요 없는 글은 `prose: false`로 제외할 수 있습니다. 기존 글의 내용과 URL을 바꿀 필요는 없습니다.
