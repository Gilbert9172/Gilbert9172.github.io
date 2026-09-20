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
- `_preview/`는 개발 설정에서만 출력합니다. 일반 배포에는 포함되지 않습니다.
- 배포와 동일한 빌드 확인: `JEKYLL_ENV=production bundle exec jekyll build`

## 기본 작성

`_posts/YYYY/YYYY-MM-DD-title.md`에 작성합니다. 기존 글 주소 형식은 유지됩니다.

```yaml
---
layout: post
title: 글 제목
description: 목록과 검색에서 사용할 짧은 소개
categories: [Development]
tags: [java]
toc: true
---
```

이 아래에 평소처럼 Markdown과 HTML을 작성합니다. 이미지나 썸네일, 별도 컴포넌트는 필수가 아닙니다. 자체 CSS/JS가 있는 글은 `description`을 지정하면 목록에 소스 코드가 요약으로 노출되는 것을 피할 수 있습니다.

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

- 색상, 여백, 본문 스타일: `_sass/_renewal.scss`
- 홈 문구: `_config.yml`의 `journal`
- 홈 구성: `_layouts/home.html`
- 글 구성: `_layouts/post.html`
- 배포: `main` push에서만 실행. PR에서는 빌드만 확인.

일상적인 글 작성에는 Node 빌드나 테마 파일 수정이 필요 없습니다.
