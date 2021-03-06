---
layout : post
title : docker with [ Nginx + uWSGI + django ]
categories : docker
--- 

### ๐ก ***project์ dockerfile***

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

โ python 3.9.7 ๋ฒ์  ๋ค์ด

โ PYTHONBUFFERDED =1 

์ด๋ค ์ค์ ์ธ์ง ๋ชฐ๋ผ stackoverflow๋ฅผ ๊ฒ์ํ๋ค. log ๋ฉ์ธ์ง๋ฅผ ๋ฐ๋ก ๋ณด์ฌ์ค๋ค๊ณ  ํ๋ค.

โ update, vim ์ค์น

โ **`/srv/docker-server`** ๊ฒฝ๋ก ์์ฑ ํ ํ์ฌ ๊ฒฝ๋ก(.)์ ๋ชจ๋  ํ์ผ์ 

๋์ปค ๋ด๋ถ ๊ฒฝ๋ก(/srv/docker-server)๋ก ์ถ๊ฐ.

โ /srv/docker-server๋ก ์ปจํ์ด๋ ๋ด๋ถ ๊ฒฝ๋ก ๋ณ๊ฒฝ

โ ๋ช๋ น์ด ์คํ.

---

<br>


> uwsgi.ini

๋ช ๊ฐ์ง ์ค์ ์ ๋ฐ๊ฟ์ค์ผ ํ๋ค. chdir ๊ฒฝ๋ก ์ค์ ์ผ๋ก ์๊ฐ์ ๋ง์ด ํ๋นํจ.

์ฒ์์๋ **`chdir = /srv/docker-server/drf_todo`** ๋ผ๊ณ  ์ค์ ํ๋๋ฐ, 

<span style="color:#DC143C">**drf_todo๋ผ๋ ๋ชจ๋์ ๋ชป์ฐพ์**</span>์ด๋ผ๋ ์๋ฌ๊ฐ ๋ฐ์ํ์๋ค.

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

### ๐ก ***nginx***

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

โ nginx ์ค์น

โ ํ์ฌ ๊ฒฝ๋ก์ ์๋ nginx.conf ํ์ผ์ /etc/nginx/nginx.conf ํ์ผ์ ๋ฎ์ด์์ฐ๊ณ ,

drf_todo.confํ์ผ์ /etc/nginx/sites-available/ ๊ฒฝ๋ก์ ๋ณต์ฌํ๊ธฐ

โ /etc/nginx/sites-enabled/ ๊ฒฝ๋ก ์์ฑํ๊ณ , ์ฌ๋ณผ๋งํฌ ์ค์ .

โ ์ปค๋งจ๋ ์คํ.

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

    *** ์๋ฒ ์ถ๊ฐ ***
    include       /etc/nginx/sites-enabled/*;
}
```

<br>

> nginx/drf_todo.conf

```python
# upstream(proxy) ์ค์ 
upstream django {
    server unix:///srv/docker-server/drf_todo.sock;
}

# configuration of the server
server {
    # client๊ฐ ๋ค์ด์ค๋ port
    listen      80;
    
    # client๊ฐ ์คํํ๋ ์๋ฒ์ IP์ฃผ์ or Domain
    server_name localhost;

    charset     utf-8;

    # log settings.
    access_log  /var/log/drf_todo/access.log;
    error_log   /var/log/drf_todo/error.log;

    # max upload size
    client_max_body_size 75M;

    # Django media ๋๋ ํ ๋ฆฌ ๊ฒฝ๋ก (alias๋ฅผ ์ฌ์ฉํ  ๊ฒฝ์ฐ ๋ง์ง๋ง์ / ๋ฃ๊ธฐ.)
    location media/  {
        alias /svr/docker-server/drf_todo/media/;
    }

    # Django static ๋๋ ํ ๋ฆฌ ๊ฒฝ๋ก
    location static/ {
        alias /svr/docker-server/drf_todo/static/;
    }

    # media์ static์ ์ ์ธํ ๋ชจ๋  ์์ฒญ์ upstream์ผ๋ก ๋ณด๋๋๋ค.
    location / {
        # uwsgi_pass [upstream name] (์์ upstream์ผ๋ก ์ค์ ํ block์ ์ด๋ฆ)
        uwsgi_pass  django;

        # uwsgi_params์ ๊ฒฝ๋ก
        include uwsgi_params;
    }
}
```

---

<br>

### ๐ก ***docker-compose***

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

<img src="/assets/img/django/docker_network.png">

์ฌ๊ธฐ์ 80:80์ด๋ผ๊ณ  ์ค์ ํด ์ค ๊ฒ์ **`port forwarding`** ์ด๋ผ๊ณ  ํ๋ค๊ณ  ํ๋ค.

๋์ปค ์ปจํ์ด๋๋ 80๋ฒ ํฌํธ๋ก listening์ ํ๋ค. (nginx ์๋ฒ์ ํฌํธ๋ฅผ 80๋ฒ์ผ๋ก ์ค์ ํ๊ธฐ ๋๋ฌธ.)

client์ ์์ฒญ์ '๋์ปค์ 80๋ฒ'ํฌํธ๋ก ๋ค์ด๊ฐ๊ณ , nginx์์ ์ค์ ํด์ค socket ๊ฒฝ๋ก๋ฅผ ๋ฐ๋ผ 

uWSGI์ ์์ฒญ์ ์ ๋ฌํ๋ค.

<br>

#### **volumes**

๋ด ํ๋๋๋ผ์ด๋ธ์ ๊ฒฝ๋ก์ ์ปจํ์ด๋ ๋ด๋ถ์ ๊ฒฝ๋ก๋ฅผ ๋งคํํด์ฃผ๋๊ฒ.

ํด๋น ์ค์ ์ ํ  ๊ฒฝ์ฐ, vscode์์ ์ฝ๋ ํธ์ง์ ํ๋ฉด, ์ปจํ์ด๋ ๋ด๋ถ์ ์ฝ๋๋ ๋ณ๋๋๋ค.

<br>

- **๋ด์ฉ์ถ๊ฐ(22.01.13)**

dockerfile์ ์์ฑํด ์ค๋, requirements.txt๋ง1 COPYํด์ฃผ๊ณ  ๋๋จธ์ง๋ docker-compose.yml์์

volumes์์ ๊ฒฝ๋ก๋ฅผ ๋งตํํด์ฃผ๋ฉด ๋๋ค. (๊ตณ์ด ์ด๋ฏธ์ง ๋น๋์์ ๋ชจ๋  ํ์ผ์ COPYํ  ํ์ ์๋ค.) 

---



