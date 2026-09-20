---
layout: post
title: "TCP 4-Way Handshake"
subtitle: "연결 종료를 눈으로 따라가기"
description: "단계별 시뮬레이션으로 TCP 연결 종료를 복습하는 학습 노트. FIN과 ACK, Half-close, TIME_WAIT, 종료 관련 상태와 자가 점검 질문을 정리했다."
date: 2026-09-20 09:00:00 +0900
categories: [cs, network]
tags: [TCP, Network, 4-Way Handshake, TIME_WAIT]
toc: false
wide: true
---

TCP 연결 종료를 다시 공부할 때, 상태 이름을 외우기보다 **양쪽의 상태가 어떻게 달라지는지 직접 따라가며** 복습할 수 있도록 만든 학습 노트다.

아래의 **시작하기 → 다음 단계** 버튼으로 흐름을 진행하고, 마지막의 **스스로 확인** 질문으로 이해한 내용을 점검해 보자. 아티팩트 안에 포커스를 둔 상태에서는 방향키 ← / →로도 단계를 이동할 수 있다.

[학습 노트만 새 창에서 넓게 보기]({{ '/assets/embeds/tcp-four-way-close.html' | relative_url }}){:target="_blank" rel="noopener"}

{% include embed/html.html
  src="/assets/embeds/tcp-four-way-close.html"
  title="TCP 연결 종료 — 단계별 시뮬레이션과 복습 노트"
  height="1000"
  resize=true
  sync_theme=true
%}
