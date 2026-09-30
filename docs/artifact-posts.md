# 아티팩트를 블로그 글로 옮기기

외부 아티팩트의 내용과 인터랙션을 가져와 블로그 공통 UI로 다시 구성한다.
TCP 예시는 `_posts/2026/9/2026-09-20-cs-network-tcp-four-way-close.md`에 있다.

- 제목, 설명, 목록, 표, 코드는 포스트의 Markdown으로 작성한다. 기본 본문 폭과 `_sass/_reading.scss`의 글 스타일을 사용한다.
- 표는 Markdown으로 작성하면 `_sass/_reading-tables.scss`의 공통 UI와 넓게 보기가 적용된다. 상태명·명령어는 인라인 코드로 표시한다. 셀의 자동 줄바꿈으로 표를 압축하지 않고, 본문과 넓게 보기 모두에서 표 전체를 가로 스크롤한다. 첫 열은 고정하지 않는다.
- 강조할 설명은 `notice-box`, 주의 사항은 `notice-box warning`, 팁은 `notice-box tip`을 사용한다. 내부 Markdown이 필요하면 `markdown="1"`을 지정한다.
- notice-box의 칩은 오른쪽 상단에 표시된다. 박스의 첫 요소가 제목(`h1`~`h6`)이면 제목과 같은 행에 배치되고, 제목이 없으면 칩 아래에서 본문이 시작된다. 긴 제목과 칩은 문서 흐름 안에서 줄바꿈된다.
- 자가 점검은 `<details markdown="1"><summary>질문</summary>…</details>`를 사용한다.
- 시뮬레이션처럼 동작이 필요한 부분만 `_includes/interactive/`에 분리하고 해당 글에서 include한다.
- 공통 흐름 요약, 시뮬레이션 바깥 여백, 조작 버튼에는 `_sass/_learning.scss`의 `learning-flow`, `learning-simulation`, `learning-actions`를 재사용한다.
- 개별 CSS는 시뮬레이션의 고유 루트 아래로 범위를 제한하고, 배치와 애니메이션만 정의한다. 색상은 `--link-color`, `--journal-surface`, `--main-border-color` 등 블로그 테마 변수를 사용한다.
- 스크립트의 요소 탐색과 키보드 이벤트도 시뮬레이션 안으로 제한한다. 버튼, 키보드, 접기 영역, 좁은 화면에서의 표, 라이트·다크 모드를 확인한다.

기존 아티팩트의 전체 HTML, 전역 스타일, 별도 웹폰트, 중복 페이지 제목은 옮기지 않는다. 배포된 아티팩트 URL이 있으면 새 글로 리다이렉트하여 기존 링크를 유지한다.
