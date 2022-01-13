---
layout : post
title : Docker 명령어 ADD, COPY
categories : django
tags : docker
---

### 💡 ***ADD & COPY***

오늘은 [Docker 공식문서](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#add-or-copy)에서 ADD와 COPY에 대한 내용을 정리했다.

일반적으로 ADD와 COPY는 기능적으로 비슷하다. 

하지만 DOCKER는 <span style="color:#1E90FF">**COPY를 추천**</span>한다. 왜냐면 COPY가 보다 투명?하기 때문이다. 

> COPY는 단순하게 로컬에 있는 파일을 복사 붙여넣는 기능이다.

ADD의 가장 좋은 용도는 로컬 tar파일을 이미지로 자동 추출하는 것이다. dockerfile을 만들 때,

각각 다른 파일을 사용하는 여러개의 step이 있다면, COPY를 개별적으로 사용해야 한다.

개별적으로 COPY를 진행할 경우, 각각의 파일이 수정이 되어 다시 빌드 되어질때

이전에 생성된 <span style="color:#1E90FF">**빌드 캐시가 무효화 된다.**</span> (즉, 다시 처음부터 빌드를 한다.)

<br>

어제 내가 만들었던 dockerfile의 경우 아래와 같이 작성했었다.

> 로컬의 모든 파일을 복붙

```
COPY . /srv/docker-server
RUN pip install -r requirements.txt 
```

공식문서를 읽어본 결과 저렇게 하면 하나의 파일만 수정해도 전체를 다시 빌드하는? 

그런 상황이 생길수도 있을거 같다는 생각이 들었다. 그래서 아래와 같이 코드를 수정했다.

```
COPY requirements.txt  /srv/docker-server
RUN pip install -r requirements.txt 
```

이렇게 하면 **`requirements.txt `** 만 빌드하면 되기 때문에 

docker가 지향하는 방법으로 코드를 짠거 같다. 

<br>

도커에서는 이미지의 크기가 중요하기 때문에, URL을 통해 패키지를 가져오는 것을 권장하지 

않는다고 한다. 그 대신에 **`curl`** 또는 **`wget`** 을 사용하라고 한다. 이렇게 하면 압축을 푼 후에 

더 이상 필요하지 않은 파일은 삭제할 수 있고, 이미지에 다른 층을 추가할 필요 또한 없다.

첫 번째 방법 보단, 두 번째 방법으로.


- **[ CASE 1 ]**
```txt
ADD https://example.com/big.tar.xz /usr/src/things/
RUN tar -xJf /usr/src/things/big.tar.xz -C /usr/src/things
RUN make -C /usr/src/things all
```

<br>

- **[ CASE 2 ]**
```txt
RUN mkdir -p /usr/src/things \
    && curl -SL https://example.com/big.tar.xz \
    | tar -xJC /usr/src/things \
    && make -C /usr/src/things all
```

---