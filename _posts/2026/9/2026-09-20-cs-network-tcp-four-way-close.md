---
layout: post
title: "TCP 4-Way Handshake"
subtitle: "연결 종료를 눈으로 따라가기"
description: "단계별 시뮬레이션으로 TCP 연결 종료를 복습하는 학습 노트. FIN과 ACK, Half-close, TIME_WAIT, 종료 관련 상태와 자가 점검 질문을 정리했다."
date: 2026-09-20 09:00:00 +0900
categories: [cs, network]
tags: [TCP, Network, 4-Way Handshake, TIME_WAIT]
toc: false
---

TCP 연결 종료를 다시 공부할 때, 상태 이름을 외우기보다 **양쪽의 상태가 어떻게 달라지는지 직접 따라가며** 복습할 수 있도록 만든 학습 노트다.

아래의 **시작하기 → 다음 단계** 버튼으로 흐름을 진행하고, 마지막의 **스스로 확인** 질문으로 이해한 내용을 점검해 보자. 시뮬레이션을 클릭하거나 Tab 키로 선택한 상태에서는 방향키 ← / →로도 단계를 이동할 수 있다.

## 연결을 끊는 데 왜 네 번이 필요한가

TCP는 양방향이 독립된 두 개의 통로다. 그래서 종료도 방향마다 따로 한다. FIN 하나와 그에 대한 ACK 하나가 한 쌍, 그 쌍이 두 번 반복되어 네 개의 세그먼트가 오간다.

<div class="learning-flow" aria-label="TCP 종료 흐름">ESTABLISHED → <b>FIN</b> → <b>ACK</b> → <span>(half-close 구간)</span> → <b>FIN</b> → <b>ACK</b> → TIME_WAIT(2MSL) → CLOSED</div>

## 단계별로 따라가기

먼저 `close()`를 호출한 쪽을 능동 종료자, 받는 쪽을 수동 종료자라고 부른다. 양쪽 상태가 어떻게 갈라지는지가 핵심이다.

{% include interactive/tcp-four-way-close.html %}

## 왜 3-way로 합칠 수 없나

연결 수립 때는 서버가 SYN과 ACK를 한 세그먼트로 합쳐 3번에 끝낸다. 종료에서 2번째 ACK와 3번째 FIN을 합치지 못하는 이유는 하나다.

2번째 ACK는 커널(TCP 스택)이 FIN을 받자마자 즉시 보낸다. 반면 3번째 FIN은 **애플리케이션이 직접 `close()`를 호출해야** 나간다. 수동 종료자 입장에서는 상대가 "더 보낼 게 없다"고 알려 왔을 뿐, 자기가 보낼 데이터는 아직 남아 있을 수 있다. 그 사이에 응답을 마저 보낼 수 있어야 하므로 두 세그먼트를 묶을 수 없다.

다만 보낼 데이터가 없고 애플리케이션이 곧바로 close를 호출하면, 커널의 지연 ACK(delayed ACK)와 FIN이 실제로 한 세그먼트에 실려 **패킷 캡처에는 3개만 보이기도 한다.** 상태 전이는 여전히 4단계 그대로다.

| 구분 | 연결 수립 | 연결 종료 |
| --- | --- | --- |
| 세그먼트 수 | 3 (SYN, SYN+ACK, ACK) | 4 (FIN, ACK, FIN, ACK) |
| 합칠 수 있나 | 가능 — 둘 다 커널이 처리 | 불가 — FIN은 앱의 close() 시점에 의존 |
| 비대칭 종료 | 해당 없음 | half-close로 한 방향만 닫기 가능 |
| 마지막에 남는 상태 | ESTABLISHED | TIME_WAIT (능동 종료자) |

## 종료 관련 상태 정리

TCP 상태 11개 중 종료에 관여하는 것들. `netstat`이나 `ss`에서 실제로 보게 되는 이름들이다.

| 상태 | 누가 | 의미 | 여기 머무르는 이유 |
| --- | --- | --- | --- |
| `FIN_WAIT_1` | 능동 | FIN을 보냈고 ACK를 기다림 | 상대가 살아 있으면 금방 벗어남 |
| `FIN_WAIT_2` | 능동 | ACK는 받았고 상대의 FIN을 기다림 | 상대 앱이 close()를 안 부르는 중 |
| `CLOSE_WAIT` | 수동 | 상대 FIN을 받았고 내 close()를 기다림 | **내 애플리케이션이 close를 안 함** |
| `LAST_ACK` | 수동 | 내 FIN을 보냈고 마지막 ACK를 기다림 | 정상이면 순식간 |
| `TIME_WAIT` | 능동 | 2MSL 동안 소켓을 붙잡고 대기 | 규격상 의도된 대기 |
| `CLOSING` | 양쪽 | 동시 종료 시 거쳐 가는 상태 | 양쪽이 동시에 FIN을 보낸 경우 |
| `CLOSED` | — | 소켓 소멸 | — |

읽는 요령: **CLOSE_WAIT가 쌓여 있으면 그 서버의 코드 문제**, **FIN_WAIT_2가 쌓여 있으면 상대편 코드 문제**, **TIME_WAIT가 쌓여 있으면 대개 정상이지만 양이 많으면 설계 문제**다.

## TIME_WAIT은 왜 존재하나

네 번째 ACK를 보낸 쪽은 바로 사라지지 않고 2MSL(Maximum Segment Lifetime의 두 배, 리눅스는 보통 60초 고정)만큼 기다린다. 이유는 두 가지다.

- **마지막 ACK가 유실될 수 있다.** 그러면 수동 종료자는 `LAST_ACK`에서 FIN을 재전송한다. 능동 종료자가 이미 사라졌다면 이 FIN에 `RST`로 응답하게 되고, 상대는 정상 종료가 아닌 오류로 연결을 마감한다. TIME_WAIT에 머물러 있어야 재전송된 FIN에 ACK를 다시 보내 줄 수 있다.

- **망을 떠도는 지연 세그먼트를 소멸시킨다.** 같은 4-tuple(출발지 IP·포트, 목적지 IP·포트)로 새 연결이 즉시 생기면, 이전 연결의 늦게 도착한 세그먼트가 새 연결의 데이터로 잘못 받아들여질 수 있다. 2MSL은 그런 세그먼트가 네트워크에서 확실히 사라질 만큼의 시간이다.

<div class="notice-box warning" markdown="1">

### TIME_WAIT 폭증과 포트 고갈

짧은 연결을 초당 수천 개씩 맺고 끊는 구조에서, 먼저 close하는 쪽에 TIME_WAIT 소켓이 60초씩 쌓인다. 클라이언트 쪽이면 로컬 포트 범위(기본 32768~60999)가 고갈되어 새 연결이 실패하고, 서버 쪽이면 메모리와 커넥션 테이블을 잠식한다.

**먼저 볼 것** 누가 먼저 close하는지 바꾸는 게 근본 해결이다. HTTP keep-alive나 커넥션 풀로 연결을 재사용하면 종료 횟수 자체가 줄어든다. 그다음이 `SO_REUSEADDR`(재바인딩 허용), `net.ipv4.tcp_tw_reuse`(타임스탬프 기반 안전 재사용), 로컬 포트 범위 확대다. `tcp_tw_recycle`은 NAT 환경에서 연결이 깨지는 부작용으로 커널에서 제거됐으니 쓰지 않는다.
</div>

## 실무에서 마주치는 고장들

<div class="notice-box warning" markdown="1">

### `CLOSE_WAIT`이 계속 쌓인다

가장 흔하고, 가장 확실한 애플리케이션 버그 신호다. 상대가 FIN을 보냈는데 내 코드가 소켓을 닫지 않았다는 뜻이다. read()가 0을 반환(EOF)했는데 그 분기에서 close를 빠뜨렸거나, 예외 경로에서 자원 해제가 누락됐거나, 커넥션 풀이 죽은 커넥션을 회수하지 않는 경우다. 파일 디스크립터가 고갈되면서 "Too many open files"로 터진다.

**해결** try-with-resources / defer / with 문으로 close를 강제하고, 커넥션 풀에 idle timeout과 validation을 설정한다. 커널 설정으로는 절대 못 고친다.

```shell
ss -tan state close-wait | wc -l
lsof -p <pid> | grep CLOSE_WAIT
```
</div>

<div class="notice-box warning" markdown="1">

### `FIN_WAIT_2`에서 안 빠져나온다

내 FIN은 ACK를 받았는데 상대가 자기 FIN을 안 보내는 상태. 즉 상대쪽이 CLOSE_WAIT에 걸려 있다. 리눅스는 `net.ipv4.tcp_fin_timeout`(기본 60초) 뒤에 고아 소켓을 정리하지만, 근본 원인은 상대 서버에 있다.

**해결** 상대편 애플리케이션 수정이 정답. 임시로는 타임아웃을 줄이고, 애플리케이션 레벨 idle timeout을 둔다.
</div>

<div class="notice-box warning" markdown="1">

### `RST`로 끊기는 경우

4-way는 정상 종료다. 반면 RST는 즉시 단절이며, 버퍼에 남은 데이터가 버려지고 TIME_WAIT도 생기지 않는다. 발생 상황은 이렇다. 닫힌 포트로 접속을 시도했을 때, 이미 닫힌 소켓에 데이터가 도착했을 때, `SO_LINGER`를 타임아웃 0으로 설정하고 close했을 때, 수신 버퍼에 읽지 않은 데이터가 남은 채 close했을 때. 애플리케이션에서는 "Connection reset by peer"로 보인다.

**구분법** 패킷 캡처에서 `tcp.flags.reset == 1`로 필터링. 정상 종료 흐름에 RST가 섞여 있다면 어느 쪽이 먼저 보냈는지부터 확인한다.
</div>

## 알아 두면 좋은 변형

### Half-close — 한 방향만 닫기

`close()`는 양방향을 다 닫지만, `shutdown(fd, SHUT_WR)`는 **쓰기 방향만 닫고 읽기는 열어 둔다.** 상대에게 FIN을 보내 "요청은 여기까지"라고 알린 뒤, 응답은 끝까지 받아 읽는 패턴이다. 고전적으로 `rsh`나 파이프 기반 프로토콜이 이 방식을 쓰고, HTTP/1.0의 `Connection: close` 응답 수신도 비슷한 그림이다.

### 동시 종료 — simultaneous close

양쪽이 거의 동시에 close를 호출하면 FIN이 서로 엇갈린다. 이때는 두 쪽 모두 `FIN_WAIT_1` → `CLOSING` → `TIME_WAIT`를 거친다. CLOSE_WAIT과 LAST_ACK은 나타나지 않는다. 드물지만 상태 다이어그램에 CLOSING이 왜 있는지 설명해 주는 경로다.

### TCP Keepalive는 종료가 아니다

케이블이 뽑히거나 상대 장비가 꺼지면 FIN이 아예 오지 않고, 내 소켓은 ESTABLISHED인 채 영원히 남는다. keepalive는 이런 **죽은 연결을 탐지**하는 별개의 장치다. 리눅스 기본값은 2시간 뒤 첫 프로브라 너무 느려서, 실무에서는 애플리케이션 레벨 heartbeat나 소켓 옵션 튜닝(`TCP_KEEPIDLE`, `TCP_KEEPINTVL`, `TCP_KEEPCNT`)을 쓴다.

## 스스로 확인

<details markdown="1">
<summary>왜 수립은 3번인데 종료는 4번인가?</summary>

수립 시 SYN과 ACK는 둘 다 커널이 즉시 처리하므로 한 세그먼트에 합칠 수 있다. 종료 시 2번째 ACK는 커널이 즉시 보내지만 3번째 FIN은 **애플리케이션의 close() 호출 시점**에 달려 있다. 그 사이에 남은 데이터를 마저 보낼 수 있어야 하므로 합칠 수 없다.

</details>

<details markdown="1">
<summary>TIME_WAIT은 왜 하필 능동 종료자 쪽에만 생기나?</summary>

마지막 ACK를 보내는 쪽이 능동 종료자이기 때문이다. 그 ACK가 유실되면 상대는 FIN을 재전송하는데, 그때 응답해 줄 주체가 남아 있어야 한다. 그래서 **먼저 close를 호출한 쪽이 뒷정리 비용을 떠안는다.** 서버가 먼저 끊는 설계라면 TIME_WAIT 부담도 서버가 진다.

</details>

<details markdown="1">
<summary>CLOSE_WAIT이 1000개 쌓였다. 커널 파라미터로 줄일 수 있나?</summary>

없다. CLOSE_WAIT에는 타임아웃이 없다. 이 상태는 **커널이 애플리케이션의 close()를 기다리는 중**이므로, 앱이 부르지 않으면 프로세스가 죽을 때까지 남는다. 코드에서 소켓 해제 누락을 찾는 것 외에 방법이 없다.

</details>

<details markdown="1">
<summary>half-close 구간에서 데이터를 보내면 어떻게 되나?</summary>

방향에 따라 다르다. **수동 종료자 → 능동 종료자 방향은 정상 전송된다.** 그 통로는 아직 닫히지 않았기 때문이다. 반대로 능동 종료자가 FIN을 보낸 뒤 또 데이터를 보내려 하면 에러가 나고, 만약 도착하더라도 상대는 RST로 응답한다.

</details>

<details markdown="1">
<summary>FIN에도 시퀀스 번호가 소비되나?</summary>

그렇다. FIN은 1바이트를 소비한다. 그래서 상대의 ACK 번호가 `FIN의 seq + 1`이 된다. SYN도 마찬가지다. 데이터가 하나도 없어도 ACK 번호가 1씩 올라가는 이유가 이것이다.

</details>

<details markdown="1">
<summary>"Connection reset by peer"와 정상 종료의 차이는?</summary>

전자는 **RST**, 후자는 **FIN**이다. FIN은 "보낼 데이터를 다 보냈다"는 예고라서 이미 보낸 데이터의 전달이 보장되지만, RST는 즉시 폐기라 송수신 버퍼에 남은 데이터가 유실된다. 로그에 reset이 보인다면 정상 종료 경로가 아니라 강제 단절 원인(타임아웃, LB 유휴 연결 정리, SO_LINGER 0 등)을 찾아야 한다.

</details>

<div class="notice-box tip" data-title="직접 확인" markdown="1">
직접 확인하려면 Wireshark에서 `tcp.flags.fin == 1 || tcp.flags.reset == 1` 필터를 걸고, 동시에 `watch -n1 'ss -tan | sort | uniq -c'`로 상태 분포 변화를 보면 세그먼트와 상태 전이가 짝지어 보인다.
</div>
