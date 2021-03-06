---
layout : post
title : Dango + uWSGI + Nginx
categories : django
tags : server
---

### ๐ก ***uWSGI***

Web์๋ฒ๊ฐ ๋ฐ์ ํธ์ถ์ Python ์ดํ๋ฆฌ์ผ์ด์์๊ฒ ์ ๋ฌํ๊ณ  ์๋ต๋ฐ๊ธฐ ์ํ ํธ์ถ์กฐ์ฝ(Calling Convention)

> uWSGI <-> Django

- **uWSGI.ini (์ค์ ํ์ผ)**

```txt
[uwsgi]

# ์ฅ๊ณ  ํ๋ก์ ํธ ๊ฒฝ๋ก
chdir = /Users/giljun/gilbert/drf_todo

# wsgi ๋ชจ๋ ๊ฒฝ๋ก
module = drf_todo.wsgi:application

# ๊ฐ์ํ๊ฒฝ ๊ฒฝ๋ก
home = /Users/giljun/opt/anaconda3/envs/django

# 
env = DJANGO_SETTINGS_MODULE=drf_todo.settings

# pid๋ฅผ ์ฃฝ์ฌ๋ worker๋ฅผ ์ด๋ ค์ค๋ค.
master = True

# 
enable-threads = True

# ์ต๋ ์์ฒญ
max-requests=5000

# ๋ฒํผ ํฌ๊ธฐ 
buffer-size=32768


chmod-socket = 666

# ์์ผ
socket = /tmp/drf_todo.sock

# ๋ก๊ทธ 
logger = file:/tmp/uwsgi.log

# ํ๋ก์ธ์ค ์์ด๋ ๋ฒํธ๊ฐ ์ ํ
pidfile = /tmp/drf_todo.pid

# ์๋ฒ๊ฐ ์ข๋ฃ๋๋ฉด ์์ผ, ๋ก๊ทธ, pid๋ฅผ ์ญ์ ํด์ค๋ค.
vacuum=True
```

๋ ๋ง์ ์ค์ ๋ค์ด ์๋๋ฐ ํ์ํ ์ค์ ์ด ์์ ๋ ์ฐพ์๋ณด๋ฉด์ ํด์ผํ  ๊ฒ ๊ฐ๋ค.

์คํ ๋ช๋ น์ด๋ **`uwsgi --ini uwsgi.ini`** ์ด๋ค. 

์ถ๊ฐ์ ์ผ๋ก --http :<port๋ฒํธ> ๋ฅผ ์๋ ฅํ๋ฉด ํด๋น ํฌํธ์์ ํ๋ฉด์ด ์ถ๋ ฅ๋๋ค.

๋ก๊ทธ๋ฅผ ํ์ธํ๊ณ  ์ถ๋ค๋ฉด /tmp ๊ฒฝ๋ก๋ก ๋ค์ด๊ฐ์ **`tail -f uwsgi.log`** ๋ผ๊ณ  ์๋ ฅํ๋ ๋๋ค.

---

<br>

### ๐ก ***Nginx***

์ด ๋ถ๋ถ ์ค์ ์ด ๊ต์ฅํ ํ๋ค์๋ค. ์๊ณ  ์ค์ ํ๊ณ  ์ถ์๋๋ฐ ๋ญ๊ฐ ๋ผ์ ๋ง์ถ ๋๋..?

> Nginx <-socket-> [ uWSGI <-> Django ]

<br>

- **drf_todo.conf**

๋ด๊ฐ ๋ง๋  django ํ๋ก์ ํธ์ nginx ์ค์  ํ์ผ์ด๋ค.

sites-available, sites-enabled ํด๋๋ ์์ด์ ์ง์  ๋ง๋ค์๊ณ , ๊ฐ๊ฐ์ ํด๋์ drf_todo.conf๋ฅผ 

์์ฑํด์ ์ ์ฅํด๋๋ค. ์ฌ๋ณผ๋ฆญ๋งํฌ๋ฅผ ํด์ค๋ค๋๋ฐ ์ด๋ถ๋ถ์ ๊ณต๋ถ๋ฅผ ๋ ํ๋ฉด์ ์ด์ ๋ฅผ ์์๋ด์ผ๊ฒ ๋ค.

> ์์น : /opt/homebrew/etc/nginx/sites-enabled

```txt
# upstream(proxy) ์ค์ 
upstream django {

    # Nginx์ uWSGI๋ฅผ ์ด์ด์ฃผ๋ ์์ผ.
    server unix:///tmp/drf_todo.sock;

}

# configuration of the server
server {

    # client๊ฐ ๋ค์ด์ค๋ port
    listen      8001;
    
    # client๊ฐ ์คํํ๋ ์๋ฒ์ IP์ฃผ์ or Domain
    server_name localhost;

    charset     utf-8;

    # log settings.
    access_log  /opt/homebrew/Cellar/nginx/1.21.4/log/access.log;
    error_log   /opt/homebrew/Cellar/nginx/1.21.4/log/error.log;

    # max upload size
    client_max_body_size 75M;

    # Django media ๋๋ ํ ๋ฆฌ ๊ฒฝ๋ก (alias๋ฅผ ์ฌ์ฉํ  ๊ฒฝ์ฐ ๋ง์ง๋ง์ / ๋ฃ๊ธฐ.)
    location media/  {
        alias /Users/giljun/gilbet/drf_todo/media/;
    }

    # Django static ๋๋ ํ ๋ฆฌ ๊ฒฝ๋ก
    location static/ {
        alias /Users/giljun/gilbet/drf_todo/static/;
    }

    # media์ static์ ์ ์ธํ ๋ชจ๋  ์์ฒญ์ upstream์ผ๋ก ๋ณด๋ธ๋ค.
    location / {

        # uwsgi_pass (์์ upstream์ผ๋ก ์ค์ ํ block์ ์ด๋ฆ)
        uwsgi_pass  django;

        # uwsgi_params์ ๊ฒฝ๋ก
        include uwsgi_params;
    }
}
```

์์ ์ ์ํ ํ์ผ์ ๋ด ํ๋ก์ ํธ์ nginx ์๋ฒ์ ๋ํ ์ค์ ์ ํด์ค ํ์ผ์ด๋ค.

๊ทธ๋ฆฌ๊ณ  ์ด์  ์ด ์ค์  ํ์ผ (drf_todo.conf)์ nginx๋ฅผ ์คํํ  ๋ ์ฝ์ ์ ์๊ฒ

๋ง์  ์ค์ ์ ํด์ฃผ์ด์ผํ๋ค. (์ด ๋ถ๋ถ์์ ์๊ฐ์ ๋ง์ด ํ๋นํ๋ค.)

<br>

- **niginx.conf**

nginx๋ฅผ ๋ค์ด๋ฐ์ผ๋ฉด ์๊ธฐ๋ default ํ์ผ.

> ์์น : /opt/homebrew/etc/nginx/nginx.conf

```
worker_processes  1;

events {
    worker_connections  1024;
}

http {

    โโโโโโโโโโโโโ ํ๋ก์ ํธ์ nginx์ค์ ์ ์ถ๊ฐํด์ค์ผํ๋ค. โโโโโโโโโโโโโ
    include       /opt/homebrew/etc/nginx/sites-enabled/drf_todo.conf;
    โโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโโ
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

์ด๋ ๊ฒ ์ค์ ์ ๋คํ๊ณ  itersm์๋ค๊ฐ nginx๋ฅผ ์์ํด์ฃผ๊ณ , uwsgi๋ ์์ํด์คฌ๋ค.

> nginx

> uwsgi --ini uwsgi.ini

๊ทธ๋ฆฌ๊ณ  localhos:8001 ๋ก ๋ค์ด๊ฐ๋ ์ฐ๋์ด ์๋๋ฏ ๋ณด์๋ค.

<br>

+ ) ์ฒ์์ static ํ์ผ ์์น ์ค์ ์ผ๋ก ์๊ฐ์ด ์ซ ๊ฑธ๋ ธ๋๋ฐ 

์๋ฅผ ๋ค์ด location /static/ { root /var/www/app/static; }์ ๊ฒฝ์ฐ

๊ฒฝ๋ก๋ var/www/app/static/static์ด ๋๋ค.

๋ฐ๋ฉด, location /static/ { alias /var/www/app/static/;}์ ๊ฒฝ์ฐ

๊ฒฝ๋ก๋ var/www/app/static/์ด ๋๋ค.

---

<br>

### ๐ ***Reference***

- [์ฐธ๊ณ  ๋ธ๋ก๊ทธ](https://knot.tistory.com/97)