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

## 스킬 소개

### p2j-discovery · 도메인 분석

- **단위:** 도메인 하나
- `run-scans.sh`로 필수 스캔 6개를 만들고, 스캔 결과를 PHP 원본으로 검증해 `{domain}-discovery.md`를 작성합니다.
- `{domain}-map.md`에 진입점별 PHP 파일, 유형, 프로젝트, 테이블, `_lib` 호출을 채우고, 다른 도메인을 부르는 경계 표도 함께 남깁니다.
- 이 map이 없으면 뒤 단계가 모두 멈추므로, 도메인마다 가장 먼저 실행합니다.

### p2j-scaffold · 뼈대 생성

- **단위:** 도메인 × 대상 프로젝트
- 로직 없이 뼈대만 만듭니다. Entity, Enum과 Converter, Repository, Controller 또는 Job stub, DTO, Service stub입니다.
- stub 메서드마다 PHP 소스 경로와 호출하는 `_lib` 함수를 주석으로 남깁니다. 이 주석이 port의 입력이 됩니다.
- 컴파일이 통과하면 map의 Java 진입과 Java service 칸을 채웁니다.

### p2j-port · 초벌 이관

- **단위:** PHP 파일 하나 (map의 한 행)
- map의 Java 칸이 가리키는 stub에 PHP 흐름을 그대로 옮깁니다.
- 막힌 지점은 `TODO(p2j)`, 원본 버그는 `TODO(p2j-bug)`, 옮겨 둔 안티패턴은 `TODO(p2j-refactor)`로 표시합니다.
- 다른 도메인 호출은 map 경계 표대로 처리합니다. 이 프로젝트에 구현이 있으면 직접 호출하고, 없으면 Port로 끊은 뒤 경계 표의 처리 칸에 기록합니다.

### p2j-migrate · TDD 검증·개선

- **단위:** endpoint 하나
- PHP 원본에서 기대값을 도출해 happy · error · edge 테스트를 설계하고, 사람에게 확인받습니다.
- 바로 통과하는 characterization 테스트는 묶어서 돌리고, 실패하거나 TODO가 있는 케이스만 RED → GREEN → REFACTOR를 거칩니다.
- 모두 통과하면 work 목록에 완료표시(✓2차)를 남깁니다. 남은 TODO와 원본과 다르게 고칠 지점은 사람이 판단합니다.

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
