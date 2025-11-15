---
layout : post
title : IPv4와 IPv6
categories : cs
tags : network
---

## <span style="color:gray">IPv4</span>

---

#### <span style="background-color:black; color:white">IPv4란?</span>

IPv4(Internet Protocol Version4)는 네트워크에 연결된 컴퓨터를 식별하기 위해 

32비트의 IP 어드레스가 사용된다. 

<br>

#### <span style="background-color:black; color:white">IPv4헤더</span>

<img src = "/assets/img/cs/network/ip/ipv4헤더.png"><br>

**<u>▷ 생존 기간(TTL, Time To Live)</u>**

IP 패킷에도 유통기한이 있어, 헤더에 생존기간(TTL)을 설정해주면 그 기간 내에 패킷이 

전달이 되지 않고 네트워크 상에 떠돌게 되면 자동으로 소멸시킨다. 

<br>

**<u>▷ 분할</u>**

한 번에 전송할 수 있는 데이터 크기를 **MTU(Maximum Trasmission Unit)** 라고 하고,

이 값은 통신 경로의 상태에 따라 달라진다. 

<br>

라우터에는 이 MTU 값에 따라 패킷을 분할해서 전송하는 기능이 구현되어 있다.

다만, 라우터의 작업 부하가 높아지거나 분할된 패킷 중의 일부가 유실되면 복원이

어려워지는 단접이 있다. 그래서 라우터가 데이터를 송신하기 전에 통신 경로 전체의

MTU를 살벼본 후 처음부터 MTU보다 작은 크기의 패킷을 만들도록 설정하기도 한다.

<br>

IPv4는 분할 처리를 위한 다양한 필드들이 준비되어 있다.

|필드|설명|
|----|----|
|식별자|같은 데이터인지 식별하기 위한 16비트 숫자 값|
|분할 플래그|분할 허가 플래그와 이후 남은 분할 부분이 더 있는지 표시하기 위한 플래그|
|프래그먼트 옵셋|원래 데이터에서의 위치 값을 표현하는 13비트 숫자 값|

<br>

## <span style="color:gray">IPv6</span>

---

#### <span style="background-color:black; color:white">IPv6란?</span>

인터넷의 급격한 성장으로 인해 IPv4의 32비트 어드레스가 머지 않아 고갈될 상황에 이르렀다.

다행이 이런 혼란을 방지하기 위해 최근 128비트 어르게스로 만든 IPv6의 보급이 가속화되고

있는데, 이미 대부분의 OS나 인터넷 관련 통신 사업자들은 IPv6 지원을 마친 상태이다.

<br>

#### <span style="background-color:black; color:white">IPv6 헤더</span>

<img src = "/assets/img/cs/network/ip/ipv6헤더.png"><br>

<br>

#### <span style="background-color:black; color:white">IPv4에서 IPv6으로</span>

IPv4와 IPv6는 어드레스나 패킷 어느 것으로도 서로 호환되지 않는다. 

그래서 현재는 여러 다양한 기법을 사용해서 두 가지를 병행할 수 있도록 하려고 한다.

이제 그 방법들을 알아보겠다.

<br>

**<u>▷ 이중스택 (Dual Stack)</u>**

이 방법은 **<span style="background-color:#F0E68C">하나의 장비에서 IPv4와 IPv6 어드레스를 할당한 후, 둘 다 사용 가능하게 만든다.</span>**

하지만 결국 IPv4 주소가 필요하게 되어, IPv4 주소 부족 문제에 큰 도움은 안된다.

<br>

**<u>▷ 터널링 (Tunneling)</u>**

이 방법은 2개의 IPv6 호스트 사이에 IPv4 망이 있을 경우에, IPv6 패킷을 IPv4 패킷 속에 

**<span style="background-color:#F0E68C">캡슐화</span>** 하여 사용하는 기술이다. IPv6 패킷은 그 영역에 들어갈때 IPv4 패킷 내에 캡슐화되고,  

그 영역을 나올 때 역캡슐화된다.

<img src = "/assets/img/cs/network/ip/터널링.png"><br>

<br>

**<u>▷ 네트워크 어드레스 변환(NAT, Network Address Translation)</u>**

가정이나 사무실의 네트워크에서는 보통 프라이빗 IP 어드레스를 사용한다. 이 주소는 

내부에서 사용하는 가상의 주소라서 인터넷에 연결된 퍼블릭 IP 어드레스를 사용하는 

서버와의 통신은 불가능하다. 그래서 이때 **NAT** 기술이 사용되는데, 이 기술은 

`프라이빗 ↔️ 퍼블릭` 변환 뿐만 아니라, `IPv4 ↔️ IPv6` 변환에도 사용된다.

<br>

## <span style="color:gray">IPv4 고갈 문제를 해결하기 위한 노력</span>

---

#### <span style="background-color:black; color:white">IPv6 도입</span>

128비트의 어드레스 사용

<br>

#### <span style="background-color:black; color:white">퍼블릭 IP</span>

퍼블릭 IP사용 함으로써 내부적으로 중복되는 IP를 허용한다.

<br>

#### <span style="background-color:black; color:white">서브넷 마스크</span>

서브넷 마스크를 알아보기 전에 우선 **어드레스 클래스**에 대해서 알아보자.

**어드레스 클래스**란, 하나의 IP 안에서 어디까지가 네트워크 부이고, 어디까지가

호스트 부인지 미리 그 길이를 고정하여 정해둔 것이다. 

<img src = "/assets/img/cs/network/ip/어드레스클래스.png"><br>

클래스 A의 어드레스는 한 개의 네트워크당 약 1677만 대의 호스트의 어드레스를 할당할 수 

있는데 사실상 이렇게 많은 호스트를 연결하지 않는다. 이렇게 되면 할당 받지 못한 IP는 낭비가 

된다. 안그래도 부족한 IP인데 너무 많이 낭비되고 있다.

<br>

이렇게 IP의 낭비를 방지하기 위해서 **<span style="background-color:#F0E68C">서브넷 마스크</span>** 를 사용한다. 

위에서 설명했듯이 어드레스 클래스는 네트워크 부의 길이가 미리 정해져 있다. 

하지만 **서브넷 마스크**를 사용하면 이 네트워크 부 길이를 비트 단위로 유연하게 

늘려서 쓰는 것이 가능하다.

<img src = "/assets/img/cs/network/ip/서브넷마스크.png"><br>

<br>

서브넷 마스크를 사용하면 네트워크를 더 세분화하여 서브 네트워크, 즉 **서브넷**을

만들 수 있다. 한 네트워크에 연결하고 싶은 호스트들의 규모에 맞게 적절히 서브넷을

구성하면 부서나 지사 같은 작은 네트워크들을 만들어 네트워크 운영을 보다 유연하고

효과적으로 할 수 있다.

<br>

**<u>▷ 서브넷 마스크의 한계</u>**

서브넷 마스크는 어드레스 클래스에서 미리 정해진 네트워크 부의 길이를 더 늘일 수는

있지만 더 줄이지는 못한다. 그래서 이미 호스트 길이가 짧게 만들어진 클래스C인 경우,

남은 8비트 내에서 서브넷 부와 호스트 부로 나누게 되므로 실제로 할당할 수 있는 호스트

대수가 급격하게 줄어들게 된다. 그 결과, 클래스 C에서는 서브넷을 사용하는 것이 별로

도움이 되지 않는다. 그래서 서브넷을 도입하는 경우는 호스트 부가 긴 클래스A나 B의

어드레스를 세분화해야 할 때 사용하는 것이 일반적이다.