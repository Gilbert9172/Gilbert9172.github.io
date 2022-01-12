---
layout : post
title : docker with [ Nginx + uWSGI + django ]
categories : django
tags: server
--- 

### 💡 ***project의 dockerfile***

> dockerfile

```python
#1
FROM python:3.9.7

#2
ENV PYTHONUNBUFFERED 1 

#3
RUN apt-get -y update 
RUN apt-get -y install vim 

#4
RUN mkdir /srv/docker-server 
ADD . /srv/docker-server

#5
WORKDIR /srv/docker-server 

#6
RUN pip install --upgrade pip
RUN pip install -r requirements.txt 
```

⒈ python 3.9.7 버전 다운

⒉ PYTHONBUFFERDED =1 

어떤 설정인지 몰라 stackoverflow를 검색했다. log 메세지를 바로 보여준다고 한다.

⒊ update, vim 설치

⒋ **`/srv/docker-server`** 경로 생성 후 현재 경로(.)의 모든 파일을 

도커 내부 경로(/srv/docker-server)로 추가.

⒌ /srv/docker-server로 컨테이너 내부 경로 변경

⒍ 명령어 실행.

---

<br>


> uwsgi.ini

몇 가지 설정을 바꿔줘야 했다. chdir 경로 설정으로 시간을 많이 허비함.

처음에는 **`chdir = /srv/docker-server/drf_todo`** 라고 설정했는데, 

<span style="color:#DC143C">**drf_todo라는 모듈을 못찾음**</span>이라는 에러가 발생했었다.

```txt
[uwsgi]

socket = /srv/docker-server/drf_todo.sock
chdir = /srv/docker-server
module = drf_todo.wsgi
env=DJANGO_SETTINGS_MODULE=drf_todo.settings
master = True
enable-threads = True
max-requests=5000
buffer-size=32768
chmod-socket = 666
logger = file:/tmp/uwsgi.log
vacuum = true
```
---

<br>

### 💡 ***nginx***

> nginx/dockerfile

```txt
#1 
FROM nginx:latest

#2
COPY nginx.conf /etc/nginx/nginx.conf
COPY drf_todo.conf /etc/nginx/sites-available/

#3
RUN mkdir -p /etc/nginx/sites-enabled/\
    && ln -s /etc/nginx/sites-available/drf_todo.conf /etc/nginx/sites-enabled/\
    && mkdir -p /var/log/drf_todo


#4 
CMD ["nginx", "-g", "daemon off;"]
```

⒈ nginx 설치

⒉ 현재 경로에 있는 nginx.conf 파일은 /etc/nginx/nginx.conf 파일에 덮어씌우고,

drf_todo.conf파일은 /etc/nginx/sites-available/ 경로에 복사하기

⒊ /etc/nginx/sites-enabled/ 경로 생성하고, 심볼링크 설정.

⒋ 커맨드 실행.

<br>

> nginx/nginx.conf

```python

user  root;
worker_processes  1;
pid /run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    *** 서버 추가 ***
    include       /etc/nginx/sites-enabled/*;
}
```

<br>

> nginx/drf_todo.conf

```python
# upstream(proxy) 설정
upstream django {
    server unix:///srv/docker-server/drf_todo.sock;
}

# configuration of the server
server {
    # client가 들어오는 port
    listen      80;
    
    # client가 실행하는 서버의 IP주소 or Domain
    server_name localhost;

    charset     utf-8;

    # log settings.
    access_log  /var/log/drf_todo/access.log;
    error_log   /var/log/drf_todo/error.log;

    # max upload size
    client_max_body_size 75M;

    # Django media 디렉토리 경로 (alias를 사용할 경우 마지막에 / 넣기.)
    location media/  {
        alias /svr/docker-server/drf_todo/media/;
    }

    # Django static 디렉토리 경로
    location static/ {
        alias /svr/docker-server/drf_todo/static/;
    }

    # media와 static을 제외한 모든 요청을 upstream으로 보냅니다.
    location / {
        # uwsgi_pass [upstream name] (위에 upstream으로 설정한 block의 이름)
        uwsgi_pass  django;

        # uwsgi_params의 경로
        include uwsgi_params;
    }
}
```

---

<br>

### 💡 ***docker-compose***

```txt
version: "3"

services: 
  db:
    platform: linux/x86_64
    container_name: main.mysql
    image: mysql
    restart: always
    command: mysqld --character-set-server=utf8 --collation-server=utf8_general_ci --default-authentication-plugin=mysql_native_password
    environment: 
      MYSQL_ROOT_PASSWORD: "wjdrlfwns1!"
      MYSQL_DATABASE: "drf_todo"
      MYSQL_USER: "gilbert"
      MYSQL_PASSWORD: "wjdrlfwns1!"
    ports:
        - "7001:3306"
  web:
    build: ./drf_todo
    image: docker-server/drf_todo
    container_name: main.django
    command: uwsgi --ini uwsgi.ini
    volumes:
      - ./drf_todo:/srv/docker-server
      - ./log:/var/log/uwsgi
    depends_on: 
      - db
  nginx:
    build: ./nginx
    container_name: nginx
    image: docker-server/nginx
    restart: always
    volumes:
      - ./drf_todo:/srv/docker-server
    ports:
        - '80:80'
    depends_on:
      - web
```

#### **ports**

여기서 80:80이라고 설정해 준 것은 **`port forwarding`** 이라고 한다고 한다.

도커 컨테이너는 80번 포트로 listening을 한다.

요청이 들어오면 요청은 '도커의 80번'포트로 들어가고, 

이제 nginx의 80번 포트로 요청을 보내준다. 그리고 uWSGI와 소켓통신을 한다.

<br>

#### **volumes**

내 하드드라이브의 경로와 컨테이너 내부의 경로를 매핑해주는것.

해당 설정을 할 경우, vscode에서 코드 편집을 하면, 컨테이너 내부의 코드도 변동된다.

---



