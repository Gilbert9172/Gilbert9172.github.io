---
layout : post
title : Docker Compose
categories : docker
---

### 💡 ***docker compose***


도커 컨테이너를 실행할 때 필요한 복잡한 명령어를 매번 기억하는건 쉽지않다.

그러나 docker compose를 사용한다면 하나의 파일로 모든걸 해결할 수 있다.

우선 docker command에서는 네트워크를 정의해야 한다.

```txt
docker network create <만들 네트워크 이름>

docker run --network <만들 네트워크 이름>
```

그러나 docker compose파일에서는 따로 설정을 해주지 않아도, 자동적으로 

네트워크에 연결이 된다고 한다.


<img src="/assets/img/docker/docker-compose.png">

⒈ host의 8080포트로 요청이 들어온다.

⒉ 웹서버 컨테이너의 80번 포트로 요청이 전달 된다.(포트 포워딩)

⒊ 만약 post요청이 들어오면 요청은 네트워크에 연결된 3306포트로 간다.

---

- [생활코딩 docker compse 강의](https://www.youtube.com/watch?v=EK6iYRCIjYs)
