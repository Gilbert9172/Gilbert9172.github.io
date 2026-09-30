---
layout: post
title: P2J 이관 워크플로
description: 프레임워크 없는 PHP 레거시를 Java 21 · Spring Boot 3.5로 옮기는 Claude Code 워크플로. 도메인 분석, 뼈대 생성, 초벌 이관, TDD 검증의 네 단계와 이를 강제하는 훅 구성.
categories: [project]
tags: [claude-code, migration, php, java, spring-boot]
toc: false
wide: true
---

프레임워크 없는 PHP 레거시를 Java 21 · Spring Boot 3.5 기반의 네 개 프로젝트로 옮기는 Claude Code 워크플로입니다.

## 네 단계

| 단계 | 스킬 |
|------|------|
| 1. 도메인 분석 | `p2j-discovery` |
| 2. 뼈대 생성 | `p2j-scaffold` |
| 3. 초벌 이관 | `p2j-port` |
| 4. TDD 검증·개선 | `p2j-migrate` |

각 단계는 독립된 스킬입니다. 스킬을 순서대로 실행하고, 결과를 확인해 다음 단계로 넘기는 **오케스트레이션은 사람이 맡습니다.**

## 단계를 잇는 map 문서

단계 사이의 입력은 `discovery/{domain}-map.md` 하나입니다. 이 문서에는 다음 내용이 들어갑니다.

- 도메인의 PHP 진입점 (한 줄에 하나)
- 각 진입점이 옮겨질 Java 클래스·메서드
- 다른 도메인을 호출하는 경계

칸마다 채우는 단계가 정해져 있습니다. 그래서 각 스킬은 자기 입력 칸이 비어 있으면 "X 먼저" 한 줄을 남기고 멈춥니다.

## 도메인 경계 끊기

한 진입점이 여러 도메인에 걸쳐 있으면, 지금 작업 중인 도메인이 아닌 쪽의 호출은 `{X}Port` + `Unsupported{X}Port`로 끊습니다. 끊은 자리는 map의 경계 표에 남깁니다.

## 훅

훅 레인은 **경로 주입, 규칙 차단, 컨벤션 린트, 컴파일 게이트**를 맡습니다. 모든 이벤트는 모니터링 도구(`p2j-monitor`)로 들어옵니다.

## 흐름

위쪽 탭에서 단계를 고르면 흐름이 재생됩니다. 다이어그램에는 실제 워크플로의 흐름을, 오른쪽 모니터에는 실행할 때 `p2j-monitor`에 찍히는 출력을 담았습니다.

{% include embed/html.html src="/assets/embeds/p2j-migration-workflow.html" title="P2J 이관 워크플로" height="1400" resize=true sync_theme=true %}
