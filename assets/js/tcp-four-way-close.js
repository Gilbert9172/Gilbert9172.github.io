(function(){
  var note = document.getElementById("tcp-close-note");
  if (!note) return;
  var find = function(id) { return note.querySelector("#" + id); };
  var PKTS = [
    { n:"1", dir:"a2p", seg:'FIN, ACK &nbsp;<span class="packet-meta">seq=u</span>',
      exp:"능동 종료자가 close()를 호출했다. 더 보낼 데이터가 없다는 예고를 FIN으로 보낸다." },
    { n:"2", dir:"p2a", seg:'ACK &nbsp;<span class="packet-meta">ack=u+1</span>',
      exp:"수동 종료자의 커널이 즉시 응답한다. 애플리케이션은 아직 아무것도 하지 않았다." },
    { n:"3", dir:"p2a", seg:'FIN, ACK &nbsp;<span class="packet-meta">seq=v</span>',
      exp:"수동 종료자의 애플리케이션이 드디어 close()를 호출했다. 이제야 반대 방향도 닫힌다." },
    { n:"4", dir:"a2p", seg:'ACK &nbsp;<span class="packet-meta">ack=v+1</span>',
      exp:"마지막 확인. 이 ACK가 상대에게 닿으면 수동 종료자의 소켓은 사라진다." }
  ];

  var STEPS = [
    { a:"ESTABLISHED", b:"ESTABLISHED", sa:"", sb:"",
      lane:"양방향 모두 데이터 송수신 가능. 아직 아무도 종료를 요청하지 않았다.",
      ins:"<b>시작 상태.</b> 양쪽 다 <code class='highlighter-rouge'>ESTABLISHED</code>. TCP의 두 통로(A→B, B→A)는 서로 독립적이어서, 한쪽을 닫아도 반대쪽은 살아 있을 수 있다. 이 성질을 <b>half-close</b>라고 하며, 종료가 3번이 아니라 4번인 이유가 전부 여기서 나온다." },
    { a:"FIN_WAIT_1", b:"CLOSE_WAIT", sa:"FIN 보냄, ACK 대기", sb:"앱의 close() 대기",
      lane:"A→B 방향 쓰기 닫힘. B→A 방향은 그대로 열려 있음.",
      ins:"<b>1번 세그먼트 이후.</b> 수동 종료자는 곧바로 <code class='highlighter-rouge'>CLOSE_WAIT</code>으로 간다. 이름 그대로 <b>자기 애플리케이션이 close()를 불러 주기를 기다리는</b> 상태다. 여기서 앱이 close를 영영 부르지 않는 것이 실무에서 가장 흔한 소켓 누수다." },
    { a:"FIN_WAIT_2", b:"CLOSE_WAIT", sa:"상대 FIN 대기", sb:"앱의 close() 대기",
      lane:"half-close 구간 — B는 아직 A에게 데이터를 보낼 수 있다. 응답을 마저 전송하는 시간.",
      ins:"<b>2번 세그먼트 이후.</b> 여기가 <b>half-close 구간</b>이다. B는 남은 응답을 계속 보낼 수 있고 A는 받아 읽을 수 있다. 이 구간이 존재해야 하므로 2번 ACK와 3번 FIN을 하나로 합칠 수 없다. B가 오래 머물면 A는 <code class='highlighter-rouge'>FIN_WAIT_2</code>에 갇힌다." },
    { a:"TIME_WAIT", b:"LAST_ACK", sa:"2MSL 타이머 시작", sb:"마지막 ACK 대기",
      lane:"양방향 모두 쓰기 닫힘. 남은 일은 확인 응답뿐.",
      ins:"<b>3번 세그먼트 이후.</b> 수동 종료자의 앱이 close()를 호출해 FIN이 나갔다. A는 이 FIN을 받는 순간 <code class='highlighter-rouge'>TIME_WAIT</code>으로 전이하며 2MSL 타이머를 건다. B는 <code class='highlighter-rouge'>LAST_ACK</code>에서 마지막 확인만 기다린다." },
    { a:"TIME_WAIT", b:"CLOSED", sa:"2MSL 대기 중 (보통 60초)", sb:"소켓 소멸",
      lane:"수동 종료자는 해제 완료. 능동 종료자만 소켓과 포트를 붙잡고 남아 있다.",
      ins:"<b>4번 세그먼트 이후.</b> B는 즉시 사라지지만 A는 남는다. 이 ACK가 도중에 유실되면 B가 FIN을 재전송할 텐데, 그때 응답해 줄 주체가 필요하기 때문이다. <b>먼저 close를 호출한 쪽이 뒷정리 비용을 부담한다</b>는 것이 TCP 종료의 핵심 비대칭이다." },
    { a:"CLOSED", b:"CLOSED", sa:"2MSL 경과, 포트 반환", sb:"",
      lane:"연결 종료. 같은 4-tuple을 이제 안전하게 재사용할 수 있다.",
      ins:"<b>2MSL 경과.</b> 늦게 도착할 수 있는 이전 연결의 세그먼트가 네트워크에서 모두 소멸했다고 볼 수 있는 시점이다. 이제 같은 IP·포트 조합으로 새 연결을 맺어도 옛 데이터가 섞여 들어올 위험이 없다. 짧은 연결을 대량으로 맺고 끊는 서비스라면 이 60초가 포트 고갈로 이어진다." }
  ];

  var step = 0;
  var tape = find("tape");
  var stA = find("stA"), stB = find("stB");
  var subA = find("subA"), subB = find("subB");
  var laneText = find("laneText");
  var insight = find("insight");
  var cnt = find("cnt");
  var prev = find("prev"), next = find("next"), reset = find("reset");

  PKTS.forEach(function(p,i){
    var el = document.createElement("div");
    el.className = "pkt " + p.dir;
    el.id = "p" + i;
    var dirLabel = p.dir === "a2p" ? "능동 → 수동" : "수동 → 능동";
    el.innerHTML = '<div class="num">' + p.n + '</div><div>' +
      '<div class="seg">' + p.seg + '<span class="packet-meta">' + dirLabel + '</span></div>' +
      '<div class="track"></div>' +
      '<div class="exp">' + p.exp + '</div></div>';
    tape.appendChild(el);
  });

  function render(prevStep){
    var s = STEPS[step], ps = prevStep === null ? null : STEPS[prevStep];
    for (var i=0;i<PKTS.length;i++){
      var el = find("p"+i);
      el.className = "pkt " + PKTS[i].dir + (i+1===step ? " active" : (i+1<step ? " done" : ""));
    }
    setState(stA, s.a, ps && ps.a !== s.a);
    setState(stB, s.b, ps && ps.b !== s.b);
    subA.textContent = s.sa; subB.textContent = s.sb;
    laneText.textContent = s.lane;
    insight.innerHTML = s.ins;
    cnt.textContent = step + " / 5";
    prev.disabled = step === 0;
    next.disabled = step === 5;
    next.textContent = step === 0 ? "시작하기" : (step === 4 ? "2MSL 경과" : (step === 5 ? "종료됨" : "다음 단계"));
  }
  function setState(el, val, changed){
    el.textContent = val;
    el.classList.toggle("closed", val === "CLOSED");
    if (changed){ el.classList.remove("changed"); void el.offsetWidth; el.classList.add("changed"); }
  }
  function go(n){ var p = step; step = Math.max(0, Math.min(5, n)); render(p); }

  next.addEventListener("click", function(){ go(step+1); });
  prev.addEventListener("click", function(){ go(step-1); });
  reset.addEventListener("click", function(){ go(0); });
  note.querySelector(".player").addEventListener("keydown", function(e){
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") e.preventDefault();
    if (e.key === "ArrowRight") go(step+1);
    if (e.key === "ArrowLeft") go(step-1);
  });
  render(null);
})();
