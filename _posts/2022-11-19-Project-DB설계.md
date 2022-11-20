---
layout: post
title: Trade Market - DB 설계
categories: project
tags: tradeMarket
---

## <span style="color:gray">요구사항 명세</span>

---

#### <span style="background-color:black; color:white">회원가입</span>

• 회원 가입 정보는 AGENT 테이블에 등록한다.

• 회원 가입시 필요한 정보는 아래와 같다.

    - 프로필 이미지
    - 이름
    - 소속 에이전시
    - 경력기술
    - 이메일
    - 연락처
    - 비밀번호
    - 등록일자
    - 수정일자

• 이메일 중복은 허용하지 않는다.

<br>

#### <span style="background-color:black; color:white">프로필 이미지(PROFILE_IMG)</span>

• 이미지 파일은 `PROFILE_IMG` 테이블에 저장하다.

• `PROFILE_IMG` 테이블 정보는 아래와 같다.

    - 원본 파일명
    - 원본 파일 확장자명
    - 저장된 파일명
    - 저장된 파일 경로
    - 등록일자
    - 수정일자

<br>

#### <span style="background-color:black; color:white">에이전시(AGENCY)</span>

• `AGENCY` 등록시 필요한 정보는 아래와 같다.

    - 회사명
    - 대표자명
    - 기업형태(대기업/중견기업/중소기업)
    - 업력
    - 위치
    - 홈페이지
    - 활성 여부
    - 등록일자
    - 수정일자

• 에이전시는 여러 명의 에이전트를 가질수 있다.

• 에이전시 탈퇴 시 모든 정보는 삭제하지 않고, 비활성 상태로 만든다.

<br>

#### <span style="background-color:black; color:white">에이전트(AGENT)</span>

• `AGENT` 테이블 정보는 아래와 같다.

    - 이름
    - 소속 에이전시 ID
    - 경력기술
    - 이메일
    - 연락처
    - 비밀번호
    - 활성 여부
    - 등록일자
    - 수정일자

• 에이전트는 하나의 에이전시에만 소속될 수 있다.

• 에이전트는 여러 명의 플레이어를 이적시장에 등록할 수 있다.

• 에이전트는 여러 명의 플레이어에게 제안서를 넣을 수 있다.

• 에이전트 탈퇴 시 모든 정보는 삭제하지 않고, 비활성 상태로 만든다.

<br>

#### <span style="background-color:black; color:white">플레이어(PLAYER)</span>

• `PLAYER` 등록시 필요한 정보는 아래와 같다. (종목별로 별도의 정보가 추가된다.)

**<u>▷ 공통</u>**

    - 이름
    - 나이 
    - 스포츠 종목(축구, 야구, 농구)
    - 현재 소속팀 ID
    - 활성 여부
    - 등록일
    - 수정일

<br>

**<u>▷ 축구(SOCCER)</u>**

    - 주발(왼발/오른발/양발)
    - 개인기(상/중/하)
    - 이전 시즌 골
    - 이전 시즌 어시스트
    - 이전 시즌 클리어
    - 이전 시즌 클린시트

    - 포지션
    - 현재 연봉
    - 희망 연봉
    - 계약 형태
    - 남은 계약 년수

<br>

**<u>▷ 야구(BASEBALL)</u>**

    - 주력(빠름/보통/느림)
    - 주수(주소 사용하는 손 - 왼손/오른손/양손)
    - 타율
    
    - 포지션
    - 현재 연봉
    - 희망 연봉
    - 계약 형태
    - 남은 계약 년수

<br>

• 플레이어는 하나의 팀에만 소속된다.

• 플레이어는 한 명의 에이전트에게만 의뢰를 할 수 있다.

• 본인을 등록한 에이전트를 제외한 여러 명의 에이전트로 부터 받을 수 있다.


<br>

#### <span style="background-color:black; color:white">팀(TEAM)</span>

• `TEAM` 등록시 필요한 정보는 아래와 같다.

    - 이름
    - 연력
    - 연고지
    - 구단주
    - 감독
    - 감독 이메일
    - 활성 여부
    - 등록일
    - 수정일

• 팀은 여러 명의 선수를 보유할 수 있다.

• 팀 탈퇴 시 모든 정보는 삭제하지 않고, 비활성 상태로 만든다.

<br>

#### <span style="background-color:black; color:white">제안(OFFER)</span>

• `OFFER` 등록시 필요한 정보는 아래와 같다.

    - 에이전트 ID
    - 플레이어 ID
    - 협상 상태(진행중, 결렬, 성사)
    - 등록일
    - 수정일

• 에이전트는 1개 이상의 제안을 할 수 있다. (단, 본인이 등록한 플레이어 제외)

• 플레이어는 1개 이상의 제안을 받을 수 있다. (단, 플레이어를 등록한 에이전트 제외)

<br>

#### <span style="background-color:black; color:white">계약서(CONTRACT)</span>

• 계약서 등록시 필요한 정보는 아래와 같다.

    - 제안 ID
    - 연봉
    - 계약 형태
    - 계약 기간
    - 옵션

• 제안을 할 경우 계약서가 생성된다.

• 하나의 계약서는 하나의 제안만 가질수 있다.


<br>

## <span style="color:gray">요구사항 스키마</span>

---

<img src = "/assets/img/project/trademarket/trade-market-db.png">