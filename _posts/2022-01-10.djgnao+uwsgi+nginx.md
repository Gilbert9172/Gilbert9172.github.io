---
layout : post
title : Dango + uWSGI + Nginx
categories : django
tags : django
---

### 💡 ***uWSGI***

Web서버가 받은 호출을 Python 어플리케이션에게 전달하고 응답받기 위한 호출조약(Calling Convention)

> uWSGI <-> Django

- **uWSGI.ini (설정파일)**

```txt
[uwsgi]

# 장고 프로젝트 경로
chdir = /Users/giljun/gilbert/drf_todo

# wsgi 모듈 경로
module = drf_todo.wsgi:application

# 가상환경 경로
home = /Users/giljun/opt/anaconda3/envs/django

# 
env = DJANGO_SETTINGS_MODULE=drf_todo.settings

# pid를 죽여도 worker를 살려준다.
master = True

# 
enable-threads = True

# 최대 요청
max-requests=5000

# 버퍼 크기 
buffer-size=32768


chmod-socket = 666

# 소켓
socket = /tmp/drf_todo.sock

# 로그 
logger = file:/tmp/uwsgi.log

# 프로세스 아이디 번호가 적힘
pidfile = /tmp/drf_todo.pid

# 서버가 종료되면 소켓, 로그, pid를 삭제해준다.
vacuum=True
```

더 많은 설정들이 있는데 필요한 설정이 있을 때 찾아보면서 해야할 것 같다.

실행 명령어는 **`uwsgi --ini uwsgi.ini`** 이다. 

추가적으로 --http :<port번호> 를 입력하면 해당 포트에서 화면이 출력됐다.

로그를 확인하고 싶다면 /tmp 경로로 들어가서 **`tail -f uwsgi.log`** 라고 입력하니 됐다.

---

<br>

### 💡 ***Nginx***

이 부분 설정이 굉장히 힘들었다. 알고 설정하고 싶었는데 뭔가 끼워 맞춘 느낌..?

> Nginx <-socket-> [ uWSGI <-> Django ]

<br>

- **drf_todo.conf**

내가 만든 django 프로젝트의 nginx 설정 파일이다.

sites-available, sites-enabled 폴더는 없어서 직접 만들었고, 각각의 폴더에 drf_todo.conf를 

작성해서 저장해뒀다. 심볼릭링크를 해준다는데 이부분은 공부를 더 하면서 이유를 알아봐야겠다.

> 위치 : /opt/homebrew/etc/nginx/sites-enabled

```txt
# upstream(proxy) 설정
upstream django {

    # Nginx와 uWSGI를 이어주는 소켓.
    server unix:///tmp/drf_todo.sock;

}

# configuration of the server
server {

    # client가 들어오는 port
    listen      8001;
    
    # client가 실행하는 서버의 IP주소 or Domain
    server_name localhost;

    charset     utf-8;

    # log settings.
    access_log  /opt/homebrew/Cellar/nginx/1.21.4/log/access.log;
    error_log   /opt/homebrew/Cellar/nginx/1.21.4/log/error.log;

    # max upload size
    client_max_body_size 75M;

    # Django media 디렉토리 경로 (alias를 사용할 경우 마지막에 / 넣기.)
    location media/  {
        alias /Users/giljun/gilbet/drf_todo/media/;
    }

    # Django static 디렉토리 경로
    location static/ {
        alias /Users/giljun/gilbet/drf_todo/static/;
    }

    # media와 static을 제외한 모든 요청을 upstream으로 보낸다.
    location / {

        # uwsgi_pass (위에 upstream으로 설정한 block의 이름)
        uwsgi_pass  django;

        # uwsgi_params의 경로
        include uwsgi_params;
    }
}
```

위에 정의한 파일은 내 프로젝트의 nginx 서버에 대한 설정을 해준 파일이다.

그리고 이제 이 설정 파일 (drf_todo.conf)을 nginx를 실행할 때 읽을 수 있게

마저 설정을 해주어야한다. (이 부분에서 시간을 많이 허비했다.)

<br>

- **niginx.conf**

nginx를 다운받으면 생기는 default 파일.

> 위치 : /opt/homebrew/etc/nginx/nginx.conf

```
worker_processes  1;

events {
    worker_connections  1024;
}

http {

    ❋❋❋❋❋❋❋❋❋❋❋❋❋ 프로젝트의 nginx설정을 추가해줘야한다. ❋❋❋❋❋❋❋❋❋❋❋❋❋
    include       /opt/homebrew/etc/nginx/sites-enabled/drf_todo.conf;
    ❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋❋
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;

    keepalive_timeout  65;

    server {

        listen       8080;
        server_name  localhost;

        location / {
            root   html;
            index  index.html index.htm;
        }

    }
}
```

이렇게 설정을 다하고 itersm에다가 nginx를 시작해주고, uwsgi도 시작해줬다.

> nginx

> uwsgi --ini uwsgi.ini

그리고 localhos:8001 로 들어가니 연동이 잘된듯 보였다.

<br>

+ ) 처음에 static 파일 위치 설정으로 시간이 쫌 걸렸는데 

예를 들어 location /static/ { root /var/www/app/static; }의 경우

경로는 var/www/app/static/static이 된다.

반면, location /static/ { alias /var/www/app/static/;}의 경우

경로는 var/www/app/static/이 된다.

---