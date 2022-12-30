---
layout: post
title: Trade Market - 인프라 구축
categories: project
tags: tradeMarket
---

## <span style="color:gray">들어가기 앞서</span>

---

최근에 Docker, AWS, Git Action을 사용해서 CI/CD 구축을 진행했다.

이번 포스팅에서는 해당 과정에서 습득한 새로운 지식들, 그리고 과정에서 마주친

각종 에러들을 어떻게 해결했고, 왜 에러가 발생했는지 꼼꼼히 기록해보려고 한다.

<br>

목차는 다음과 같다.

- AWS EC2, RDB
- Git Submodule
- Nginx
- DockerFile
- Redis
- Git Action
- Docker-compose
- 마무리 및 정리

<br>

## <span style="color:gray">AWS</span>

---

#### <span style="background-color:black; color:white">EC2, RDB 생성</span>

• <a href="https://bcp0109.tistory.com/356" target="_blank">티스토리 블로그 - EC2 생성</a>

• <a href="https://bcp0109.tistory.com/357" target="_blank">티스토리 블로그 - RDB 생성</a>

<br>

AWS 인스턴스 생성은 위 블로그를 보고 했다. 이미지와 함께 정리가 잘되어 있었다.

가장 핵심 부부은 `탄력적 IP 설정`과 `인바운드 규칙설정` 부분이였다.

<span style="color:red">나는 인바운드 규칙 설정에서 실수를 했고</span>, 이를 해결하는 과정에서 시간을 많이 

허비했는데 에러 해결 과정은 관련된 토픽에서 정리했다.

<br>

## <span style="color:gray">Git SubModule</span>

---

#### <span style="background-color:black; color:white">왜 사용했나요?</span>

도커 이미지를 빌드하는 과정에서 각종 DB 정보, smtp 주소 등 다양한 config 정보들이 필요하다.

그런데 여기서 아래와 같은 의문이 생겼다.

> 이런 정보들은 노출이 되면 안되니깐 gitignore파일에 명시를 해줬는데...

> 그럼 도커 이미지 빌드할 때는 어디서 이 정보들을 읽어 와야하지...?

의문을 품고 구글링을 하는 도중 <a href="https://kukim.tistory.com/150" target="_blank">티스토리 블로그 - secret, config 파일관리</a> 란 글을 읽으면서 

`Git Submodule`에 대해 알게 됐다.

<br>

#### <span style="background-color:black; color:white">적용하기</span>

<a href="https://tecoble.techcourse.co.kr/post/2021-07-31-git-submodule/" target="_blank">tecoble - git submodule 적용</a> 이란 글을 읽으면서 적용을 해봤다.

<br>

⒈ 우선 Git Hub에 private repository를 하나 만들어준다.

<br>

⒉ 새로 만든 repo에 노출이 되어서는 안되는 파일들을 작성해준다.

<img src = "/assets/img/project/trademarket/gitsubmodule1.png"><br>

<br>

⒊ 메인 레포지토리에 submodule로 사용할 레포지토리를 등록해준다.

```shell
git submodule add ${submodule_repository_url}
```

<br>

⒋ 프로젝트 루트 경로에 아래의 이미지같이 파일이 생기게 된다.

<img src = "/assets/img/project/trademarket/gitsubmodule2.png"><br>

<details>
<summary>.gitmodules 세부 코드</summary>
<div markdown="1">

```txt
[submodule "***"]
	path = ***
	url = https://github.com/***/***
```

</div>
</details>

<br>

#### <span style="background-color:black; color:white">문제 발생 및 해결</span>

위의 순서대로 적용을 하고 로컬에서 서버를 돌려보았는데, DB 커넥션 문제가 발생하였다.

대부분 이 문제는 서버가 올라갈 때 DB 설정값들을 불러오지 못해서 생기는 에러이다.

이말인 즉슨, 현재 메인 프로젝트에서 submodule로 지정한 레포지토리의 yml 파일을 읽지 

못한다는 뜻이기도 하다.

<br>

그렇다면 submodule에 있는 yml 파일을 메인 프로젝트로 복사를 해줘야한다.

```java
task copyPrivate(type: Copy) {
    copy {
        from './trade-market-config'
        include "application-dev.yml"
        into 'src/main/resources'
    }
}
```

`build.gradle`에 위에 있는 코드를 작성해준다.

해당 코드의 의미는 gradle이 `copyPrivate`라는 작업을 수행할 때 <span style="color:#4169E1">from 경로</span>에 있는

파일(include "파일명")을 <span style="color:#228B22">into 경로</span>로 복사해달라는 것이다.

<br>

마지막으로 gradle 탭의 copyPrivate를 1회 실행해주어야 정상적으로 동작한다.

<img src = "/assets/img/project/trademarket/gitsubmodule3.png"><br>

<br>

## <span style="color:gray">Nginx</span>

---

#### <span style="background-color:black; color:white">Nginx를 사용하는 이유</span>

Nginx는 대표적인 웹서버이다. 물론 Web Application이 웹서버 역할을 하기는 하지만 

이미 Web Application은 많은 일을 하기 때문에 웹서버의 역할까지 하면 너무 부하가 크기 때문이다.

<br>

그리고 Nginx는 프록시 서버의 역할을 하는데 이로써 얻을 수 있는 장점들이 많다.

- 로드 벨런싱 : 요청을 분산해주어 WAS
- 사용자 공격의로 부터 보호
- 캐싱 : 콘텐츠 캐싱을 통해 응답성 증가.

<br>

#### <span style="background-color:black; color:white">Nginx 파일 작성하기</span>

```shell
server {
    listen 80;
    listen [::]:80;

    location / {
        proxy_pass http://trade-market-app:8080;
        proxy_set_header Host $host:$server_port;
        proxy_set_header X-Forwarded-Host $server_name;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
<br>

## <span style="color:gray">Docker</span>

---

추후에 있을 Git Action을 위해 DockerFile을 만들어준다.

<br>

#### <span style="background-color:black; color:white">Application DockerFile</span>

여기서 한 가지 주의해야 할 부분이 있는데 서버를 실행할 때 프로파일을 지정해줘야 한다.

`-Dspring.profiles.active` 속성에 원하는 프로파일의 이름을 지정해주면 된다.

• <a href="https://www.baeldung.com/spring-boot-docker-start-with-profile" target="_blank">baeldung - spring boot docker start with profile</a>

```docker
FROM openjdk:11
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java", "-Dspring.profiles.active=dev", "-jar", "/app.jar"]
```

<br>

#### <span style="background-color:black; color:white">Nignx DockerFile</span>

```docker
FROM nginx:latest
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY ./nginx/conf.d/app.conf  /etc/nginx/conf.d/app.conf
```

`./nginx/conf.d/` 경로의 app.conf 파일을  `/etc/nginx/conf.d/` 경로로 복사해준다.

<br>

## <span style="color:gray">Redis</span>

---

#### <span style="background-color:black; color:white">왜 사용했나?</span>

API 중에 인증코드를 통해 이메일을 인증하는 것이 있다. 매번 RDB에 인증코드를 저장하고 지우는 것이 

불필요하다고 생각했고, key-value 형태의 캐시형 DB인 Redis를 사용하기로 결정했다.

<br>

#### <span style="background-color:black; color:white">적용하기</span>

우선 EC2 인스턴스의 인바운드 규칙에서 Redis 포트 번호인 `6379`에 대한 접근을 열어줘야 한다.

<img src = "/assets/img/project/trademarket/redis1.png"><br>

<br>

Redis 설치 관련된 방법은 <a href="https://wookgu.tistory.com/26" target="_blank">이 블로그</a>를 참고했다.

<br>

마지막으로 `application-dev.yml` 파일을 아래와 같이 수정해준다.

```yml
spring:
    redis:
        host: 탄력적 IP
        port: 6379
        password: redis cli 비밀번호
```

<br>

## <span style="color:gray">Docker-Compose</span>

---

#### <span style="background-color:black; color:white">어디에 파일을 만들어야 할까?</span>

위에서 application과 nginx 각각 도커 이미지로 만들고 Docker-Hub에 push를 해줬다.

그렇다면 docker-compose를 하기 위해서 해당 파일을 어디에 만들어야 할까?

<br>

생각해보면 docker-compose는 컨테이너로 올릴 이미지를 pull 받아서 컨테이너를 올려주는 것이다.

그럼 결국에 ec2 인스턴스 서버에서 이미지를 pull을 받고 docker-compose 명령어를 ec2 인스턴스에서 

실행해줘야 한다. **<span style="background-color:#F0E68C">즉, ec2 서버내에 docker-compose 파일을 만들어 주면 된다.</span>**

<img src = "/assets/img/project/trademarket/compose1.png"><br>

<br>

#### <span style="background-color:black; color:white">파일 작성하기</span>

아래 커맨드로 파일을 작성해주면 된다.

```shell
vi  /home/ubuntu/compose/docker-compose.yml
```

<br>

파일 내용은 아래와 같다.

<span style="color:#4169E1">expose 속성</span>은 호스트OS에 포트를 공개하지 않고, 컨테이너만 포트를 공개한다.

따라서 application 컨테이너의 경우에는 컨테이너 내부에서 연결해줄 `8080 포트`로 지정해준다.

그리고 <span style="color:red">ports 속성</span>은 호스트OS와 컨테이너의 포트를 바인딩 시켜준다.

따라서 nginx는 호스트가 접근할 수 있는 포트인 `80:80`으로 작성해준다.

<img src = "/assets/img/project/trademarket/compose2.png"><br>

<br>

## <span style="color:gray">Git Action</span>

---

#### <span style="background-color:black; color:white">들어가기 앞서.</span>

처음 해보는 도전이라 막막하기도 했고... 수 많은 실패에 진짜 너무 답답했다...

그래도 엄청난 구글링과 포기하지 말자는 정신력으로 결국 성공을 했다.

남들은 쉽게 하는건데 뭘 이라고 할지 몰라도 나에게 있어서는 새로운 시도이자 도전이였다.

<br>

<a href="https://github.com/marketplace" target="_blank">깃허브 마켓플레이스</a>에서 git action 파일을 작성할 때 사용되는 라이브러리들을 검색하고

사용법을 익힐수 있었다. 가장 도움이 많이 된 사이트다.

<br>

#### <span style="background-color:black; color:white">파일 작성하기</span>

우선 프로젝트 루트 경로에 `.github/workflows` 폴더를 만들어주고 `cicd.yml` 파일을 만들어준다.

<img src = "/assets/img/project/trademarket/gitaction1.png"><br>

<br>

**[ on ]**

레포지토리에 어떤 이벤트가 발생했을 때 스크립트를 실행 시킬지 정해준다.

아래의 경우에는 master 브랜치에 push 또는 pull request가 이뤄질 때 실행된다.

```yml
name: CI/CD
on:
  push:
    branches: [master]
  pull_request:
    branches : [master]
```

<br>

**[ jobs ]**

jobs 부분에는 어떤 일을 수행하는지 작성하면 된다.

워크플로 실행은 기본적으로 병렬로 실행되는 하나 이상의 jobs로 구성된다. 

각 작업은 runs-on으로 지정된 실행기 환경에서 실행됩니다.

```yml
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
```

<br>

**[ steps ]**

• <a href="https://github.com/marketplace/actions/checkout" target="_blank">marketplace - checkout</a>

token : 리포지토리를 가져오는 데 사용되는 개인 액세스 토큰(PAT).

submodules : 하위 모듈을 체크아웃할지 여부 `(true/recursive)`

```yml
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          token: ${{ secrets.CHECKOUT_TOKEN }}
          submodules: true
```

<br>

• <a href="https://github.com/marketplace/actions/gradle-wrapper-validation" target="_blank">marketplace - Gradle Wrapper Validation</a>

```yml
- name: Validate Gradle Wrapper
  uses: gradle/wrapper-validation-action@v1
```

<br>

• <a href="https://github.com/marketplace/actions/setup-java" target="_blank">marketplace - setup-java</a>

```yml
- name: Set up JDK11
  uses: actions/setup-java@v3
  with:
    distribution: 'temurin'
    java-version: '11'
    cache: 'gradle'
```

<br>

• gradle build

```yml
- name: Execute Gradle build
  run: ./gradlew clean build -x test -Pprofile=dev
```

<br>

• <a href="https://github.com/marketplace/actions/docker-setup-buildx" target="_blank">marketplace - docker-setup-buildx</a>

```yml
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v2
```

<br>

• <a href="https://github.com/marketplace/actions/docker-login" target="_blank">marketplace - docker login</a>

```yml
- name: Docker Login
  uses: docker/login-action@v2
  with:
    username: ${{secrets.DOCKER_USER}}
    password: ${{secrets.DOCKER_PASSWORD}}
```

<br>

• Docker Image build & push to Docker-Hub

```yml
- name: build and release to DockerHub
  env:
    NAME: ${{secrets.DOCKER_USER}}
    APP: trade_market
    NGINX: nginx
  run: |
    docker build --platform linux/amd64 -t $NAME/$APP -f ./DockerFile .
    docker build --platform linux/amd64 -t $NAME/$NGINX -f ./nginx/DockerFile .
    docker push $NAME/$APP:latest
    docker push $NAME/$NGINX:latest
```

<br>

• <a href="https://github.com/marketplace/actions/ssh-remote-commands" target="_blank">marketplace - ssh-remote-commands</a>

host : 퍼블릭 IPv4 DNS를 넣어줘야한다.

key : ec2 pem 파일에 있는 모든 내용을 넣어줘야한다.

```yml
- name: EC2 Docker Run
  uses: appleboy/ssh-action@master
  env:
    APP: "trade_market"
    NGINX: "nginx"
    COMPOSE: "/home/ubuntu/compose/docker-compose.yml"
  with:
    username: ubuntu
    host: ${{secrets.EC2_HOST}}
    key: ${{secrets.EC2_KEY}}
    envs: APP, NGINX, COMPOSE
    script_stop: true
    script: |
    sudo docker-compose -f $COMPOSE down --rmi all 
    sudo docker pull ${{secrets.DOCKER_USER}}/$APP:latest
    sudo docker pull ${{secrets.DOCKER_USER}}/$NGINX:latest
    sudo docker-compose -f $COMPOSE up -d
```

<br>

#### <span style="background-color:black; color:white">문제 발생 및 해결</span>

<span style="color:red">dial tcp [ec2의 IP]: ***: i/0 timeout</span> 라는 에러를 마주쳤다. 

Yml 파일에는 문제는 없었는데 계속해서 timeout이 나는 것이었다. 어쨋듯 ec2 서버에 접근을 못한거 

같다는 생각이 들었고, 처음에는 환경변수 셋팅을 잘못했나 싶었지만 그런 문제는 아니였다.

<br>

일단 네트워크 문제이고 접근이 안되니깐 ec2 인바운드 규칙을 확인해봤는데...

<img src = "/assets/img/project/trademarket/actionerror1.png">

나만 접근할 수 있게 되어있었다. 그래서 도커 컨테이너에서 ec2 인스턴스로 접근할 때 

계속 해서 timeout 에러가 발생했던 것이다. 

결국 모든 접근을 허용하도록 인바운드 규칙을 수정하니깐 정상적으로 작업이 마무리 됐다.

<img src = "/assets/img/project/trademarket/actionsolve.png"><br>

<br>

#### <span style="background-color:black; color:white">실행해보기</span>

포팅도 기대했던 대로 잘 됐고, URL 접속도 정상적으로 되는 것이 확인이 됐다. 

• <a href="http://52.78.159.127/api/swagger-ui/index.html" target="_blank">Trade-Market Swagger</a>

<img src = "/assets/img/project/trademarket/actionresult.png"><br>

<br>

## <span style="color:gray">마무리 및 요약하기</span>

---

#### <span style="background-color:black; color:white">흐름 요약정리</span>

지금까지 구축한 인프라의 workflow의 흐름을 요약하자면 아래와 같다.

<img src = "/assets/img/project/trademarket/workflow.jpg">

⒈ Local IDE에서 Remote Repo의 master 브랜치로 `push 또는 pull request` 를 보낸다.

⒉ git action에 정의한 yml파일 내용을 바탕으로 작업을 시작한다.

  - build gradle (gradle validation, test code ...)
  - build docker images
  - push docker images to Docker-Hub
  - Docker Compose up

⒊ EC2 인스턴스에 ningx, application 컨테이너가 올라간다. (redis는 로커서버)

<br>

전체적인 프로젝트의 구상도는 아래의 이미지와 같다.

<img src = "/assets/img/project/trademarket/aws구조.jpg"><br>


<br>

#### <span style="background-color:black; color:white">마무리 하며</span>

처음으로 devops영역?에 도전을 한 것 같다. 

대략 3일이라는 시간이 걸렸지만, 전체적인 흐름을 이해하는데 아주 좋은 시간투자였다고 생각한다. 

그리고 <span style="color:#4169E1">나도 할 수 있다라는 자신감</span>을 얻을 수 있었던 좋은 기회였다. 

<br>

작업하는 과정에서 CI/CD 툴도 정말 다양하고 개개인의 wokrflow도 정말 다양함을 느꼈다. 

그리고 그 어떤 것도 틀리지 않다고 생각한다. **<span style="background-color:#F0E68C">보다 나은 방향이 있다면 그 방향으로 가고 싶을 뿐이다. </span>**

지금까지 한 CI/CD 구축은 이제 시작 단계라고 생각한다. 분명 더 복잡하고 세밀한 설계가 있을 것이다.

언젠가 그 설계를 내가 주도적으로 하는 날이 왔으면 좋겠고, 그러기 위해 <span style="color:red">끊임없는 도전</span>을 할 것이다.