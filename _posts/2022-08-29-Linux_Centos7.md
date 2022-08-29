---
layout: post
title: CentOS7에 Spring Boot 배포 환경 셋팅하기
categories: linux
---

## <span style="color:gray">JDK 설치하기</span>

---

✔︎ 만약 자동으로 설치된 java가 있을 경우에는 삭제를 해주고 다시 다운 받으면 된다.

```
yum remove -y [자바 버전]
```

<br>

✔︎ yum 최신버전 유지

```
yum update
```

<br>

✔︎ 현재 centos에 설치 가능한 jdk 번전확인.

```
yum list java*jdk-devel
```

<br>

✔︎ 필요한 버전의 JDK 설치

```
yum install ~~~
```

<br>

## <span style="color:gray">환경변수 설정</span>

---

```
which javac
→ /usr/bin/javac

readlink -f /usr/bin/javac
→ /usr/lib/jvm/~~
```

/usr/bin/javac 는 심볼릭 링크 이므로 원본 파일의 위치를 찾기 위해 `readlink -f /usr/bin/javac`를 

사용하였다. 위 명령어는 심볼릭 링크에서 원본 파일을 추출하는 명령어 이다.

<br>

자바 경로로를 아래의 파일에 설정해주어야 한다.ㄴ

```
vi /etc/profile
```

자바 경로는 위에서 `readlink -f /usr/bin/javac`로 확이했던 경로를 넣어주면 된다.

```
export JAVA_HOME=/usr/lib/jvm~~
```

설정을 완료한 뒤 아래의 명령어로 저장을 해주면 된다.

```
source /etc/profile
```

<br>

마지막으로 설정이 잘 됐는지 확인을 해봐야한다.

```
echo $JAVA_HOME
```

위 명령어를 입력했을 때 등록한 경로가 잘 나오면 설정이 잘 된 것이다.

<br>

## <span style="color:gray">Spring Boot jar파일 서비스 등록하기</span>

---

기존에는 nohup을 사용하여 스프링 서버를 백그라운드에서 실행시켰다.

그런데 만약에 최근에 비가 많이 내려서 서버가 침수 당하면 어떻게 될까?

컴퓨터를 다시 시작할테고 서버도 다시 재기동을 해주어야 하는 번거로움이 생긴다.

이런 번거로움을 해소하기 위해서 CentOs7에서는 jar 파일을 서비스로 등록하면 된다.

그래서 오늘은 systemd를 이용해서 등록하는 방법을 알아 보았다.

<br>

#### ***서비스 등록을 위한 설정 파일 작성하기***

우선 자동 실행을 위해서는 jar파일을 리눅스로 되어 있는 서버에 서비스로 등록해야 한다.

이 서비스 등록은 우선 서비스 설정 파일을 만들어야 가능하다.

아래 명령어를 통해 서비스 드등록 파일을 해당 위치에 작성해준다.

```
vim /etc/systemd/system/name.service
```

<br>

파일을 생성해 줬으면 이제 아래와 같은 내용들로 설정파일을 작성하면된다.

```
[Unit]
Description=해당 서비스 이름 및 설명
After=syslog.target network.target

[Service]
ExecStart=/bin/bash -c "exec java -jar /jar파일 경로/파일명.jar

[Install]
WantedBy=multi-user.target
```

<br>

#### ***파일 설정 설명***

<br>

#### ***서비스 조작 방법***

서비스 파일을 저장한 이후에는 해당 파일을 systemd에 등록해주어야 한다.

이 때 경로를 주의해야 한다.

```
# 서비스 등록
systemctl enable test.service

# 서비스 상태 확인
systemctl status test

# 서비스 (재)시작
systemctl (re)start test

# 서비스 종료
systemctl stop application
```










