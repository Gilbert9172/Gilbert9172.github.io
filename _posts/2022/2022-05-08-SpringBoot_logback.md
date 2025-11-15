---
layout: post
title: LogBack
categories: spring
tags: springBoot
---

## <span style="color:gray">로그 남기기</span>

오늘은 스프링 부트 서버를 돌릴때 로그를 남기는 방법에 대해서 공부한 뒤 프로젝트에 적용해 봤다.

사실 왜 로그를 쌓아야 하고, 쌓은 로그를 통해 어떤 아웃풋을 얻을 수 있는지 이해가 가지 않았다.

그래서 우선 로그를 기록해야 하는 이유에 대해서 알아봤다.

<br>

> 왜 로그를 기록하고 분석해야 할까?

1) 외부로부터의 침입 감지와 추적

2) 시스템 성능 관리와 시스템의 장애 원인 분석

3) 시스템 취약점 분석

4) 침해 사고 시 '근거 자료'로 활용

5) 각종 법규나 지침에서 관리 의무화(개인정보보호법의 안전성 확보 조치 기준)

6) 기타 등등...

<br>

아마 지금하는 프로젝트에서는 2번이 가장 큰 이유가 아닐까 싶다. 

---

<br>

## <span style="color:gray">Spring Boot 로그 남기기</span>

우선 `logback-spring.xml` 이라는 파일을 하나 생성해준다. 

> 에러 발생

처음에는 `logback.xml`이라는 명으로 파일을 생성하였는데, LOG_PATH_IS_UNDEFINED 라는 

폴더가 생성되었다. stackoverflow에서 검색해 본 결과, springboot를 실행할 때 파일을 

읽어오는 순서가 있는데 `application.properties`를 먼저 읽고 xml 파일을 읽어야 하는데, 

그 순서가 반대로 되어서 LOG_PATH_IS_UNDEFINED 폴더가 생성되는 이슈가 있었다.

> 해당 문제에 대한 공식문서 팁

<img src="/assets/img/spring/log/logback1.png">

---

<br>

## <span style="color:gray">로그 파일 작성</span>

코드가 너무 길어서 태그 별로 뜯어서 정리...

<br>

### [ configuration 설정 ] 

우선 제일 상단에 있는 **`<configuration>`** 태그 안에 모든 태그가 들어간다.



***<span style="background-color:yellow">→ 10초마다 설정 파일의 변경을 확인하여 변경시 갱신</span>***

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration scan="true" scanPeriod="10 seconds">
    <!-- 모든 설정들이 이 자리에 들어간다. -->
</configuration>
```

---

<br>

### [ springProfile 설정 ]

***<span style="background-color:yellow">→ spring.profiles에 따른 설정파일 분기</span>***

```xml
<springProfile name = "dev">
    <property resource = "application-dev.properties"/>
</springProfile>

<springProfile name = "prod">
    <property resource = "application-prod.properties"/>
</springProfile>
```

참고로 application-dev.properties와 application-prod.properties 파일에 각각

아래와 같이 설정을 추개해줘야 한다.

```java
// application-dev.properties
log.config.level=debug
log.config.path=./application_log/dev
log.config.filename=dev_log
log.config.filename.error=dev_error

// application-prod.properties
log.config.level=info
log.config.path=./application_log/prod
log.config.filename=prod_log
log.config.filename.error=prod_error
```

---

<br>

### [ property 설정 ]

***<span style="background-color:yellow">→ "logback-spring.xml"에서 사용할 상수들을 설정한다.</span>***

${} 안에 있는 변수들은 application.properties에서 설정해준 값들이다.

```xml
<!-- 루트 로그 레벨 -->
<property name ="LOG_LEVEL" value = "${log.config.level}"/>

<!-- 로그 파일 경로 -->
<property name ="LOG_PATH" value = "${log.config.path}"/>

<!-- 로그 파일 명 -->
<property name ="LOG_FILE_NAME" value = "${log.config.filename}"/>
<property name ="ERR_LOG_FILE_NAME" value = "${log.config.filename.error}"/>

<!-- 로그 파일 패턴 -->
<property name ="LOG_PATTERN" value ="%-5level %d{yyyy-MM-dd HH:mm:ss}[%thread] [%C] [%logger{0}:%line] - %msg%n"/>
```

추가적으로 마지막에 있는 ***[로그 파일 패턴](https://livenow14.tistory.com/64)*** 을 정리해둔 블로그를 참고했다.

|로그 패턴|설명|
|---------|----|
|%-5level|로그 레벨|
|%d{yyyy-mm-dd HH:mm:ss}| %d는 date를 의미하며, 중괄호에 들어간 문자열은 dataformat을 의미.|
|%c|로깅이 발생한 카테고리|
|%logger{0}|패키지를 제외한 클래스 이름만 출력|
|%line|로깅이 발생한 호출지의 라인|

---

<br>

### [ appender 설정 ]

***<span style="background-color:yellow">→ log의 형태를 결정, 로그 메세지가 출력될 대상을 결정하는 요소</span>***

|appender의 class의 종류|설명|
|----|----|
|ch.qos.logback.core.ConsoleAppender|콘솔에 로그를 찍음, 로그를 OutputStream에 작성하여 콘솔에 출력되도록 한다.|
|ch.qos.logback.core.FileAppender|파일에 로그를 찍음, 최대 보관 일 수 등를 지정할 수 있다.|
|ch.qos.logback.core.rolling.RollingFileAppender|여러개의 파일을 롤링, 순회하면서 로그를 찍는다.(FileAppender를 상속 받는다.지정 용량이 넘어간 Log File을 넘버링 하여 나누어 저장할 수 있다.)|
|ch.qos.logback.classic.net.SMTPAppender|로그를 메일에 찍어 보낸다.|
|ch.qos.logback.classic.db.DBAppender|DB(데이터베이스)에 로그를 찍는다. |

<br>

> ***콘솔 Appender 설정***

```xml
<appender name ="CONSOLE" class ="ch.qos.logback.core.ConsoleAppender">
    <encoder class ="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
        <pattern>${LOG_PATTERN}</pattern>
    </encoder>
</appender>
```

<br>

> ***파일 Appender 설정***

```xml
<appender name="FILE" class ="ch.qos.logback.core.rolling.RollingFileAppender">
    <!-- 파일 경로 설정 -->
    <file>${LOG_PATH}/${LOG_FILE_NAME}.log</file>

    <!-- 로그 패턴 설정 -->
    <encoder class = "ch.qos.logback.classic.encoder.PatternLayoutEncoder">
        <pattern>${LOG_PATTERN}</pattern>
    </encoder>

    <!-- 롤링 정책 -->
    <rollingPolicy class = "ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
        <!-- gz, zip 등을 넣을 경우 자동 로그파일 압축 -->
        <fileNamePattern>${LOG_PATH}/%d{yyyy-MM-dd}/${LOG_FILE_NAME}_%i.log</fileNamePattern>

        <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
            <!-- 파일당 최고 용량 -->
            <maxFileSize>10MB</maxFileSize>
        </timeBasedFileNamingAndTriggeringPolicy>

        <!-- 로그파일 최대 보관주기 -->
        <maxHistory>30</maxHistory>
    </rollingPolicy>
</appender>
```

<br>

> ***파일 Appender 설정(Only Error)***

```xml
<appender name = "ERROR" class ="ch.qos.logback.core.rolling.RollingFileAppender">
    <!-- 로그 레벨 : ERROR만 설정) -->
    <filter class ="ch.qos.logback.classic.filter.LevelFilter">
        <level>error</level>
        <onMatch>ACCEPT</onMatch>
        <onMismatch>DENY</onMismatch>
    </filter>
    <file>${LOG_PATH}/${ERR_LOG_FILE_NAME}.log</file>

    <!-- 로그 패턴 설정 -->
    <encoder class = "ch.qos.logback.classic.encoder.PatternLayoutEncoder">
        <pattern>${LOG_PATTERN}</pattern>
    </encoder>

    <!-- 롤링 정책 -->
    <rollingPolicy class = "ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
        <!-- gz, zip 등을 넣을 경우 자동 로그파일 압축 -->
        <fileNamePattern>${LOG_PATH}/%d{yyyy-MM-dd}/${ERR_LOG_FILE_NAME}_%i.log</fileNamePattern>

        <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
            <!-- 파일당 최고 용량 -->
            <maxFileSize>10MB</maxFileSize>
        </timeBasedFileNamingAndTriggeringPolicy>

        <!-- 로그파일 최대 보관주기 -->
        <!-- totalSizeCap을 사용하려면 maxHistory를 필수로 정의해줘야 한다. -->
        <maxHistory>30</maxHistory>
        <totalSizeCap>1GB</totalSizeCap>
    </rollingPolicy>
</appender>
```

|rollingPolicy Class |설명|
|---|---|
|ch.qos.logback.core.rolling.TimeBasedRollingPolicy|일자별 적용|
|ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP|일자별 + 크기별 적용|

---

<br>

### [ root, logger 설정 ]


***<span style="background-color:yellow">→ 설정한 appender를 참조하여 package와 level을 설정한다.</span>***

<br>

> ***root(전역 설정)***

```xml
<root level = "${LOG_LEVEL}">
    <appender-ref ref="CONSOLE"/>
    <appender-ref ref="FILE"/>
    <appender-ref ref="ERROR"/>
</root>
```

<br>

> ***logger(지역 설정)***

***🔎  설명 추가 예정***

```xml
<logger name="org.springframework" level = "INFO" additivity = "false">
    <appender-ref ref="CONSOLE"/>
    <appender-ref ref="FILE"/>
    <appender-ref ref="ERROR"/>
</logger>

<logger name="org.hibernate.validator" level = "INFO" additivity = "false">
    <appender-ref ref="CONSOLE"/>
    <appender-ref ref="FILE"/>
    <appender-ref ref="ERROR"/>
</logger>

<logger name="com.zaxxer.hikari" level = "INFO" additivity = "false">
    <appender-ref ref="CONSOLE"/>
    <appender-ref ref="FILE"/>
    <appender-ref ref="ERROR"/>
</logger>
```

---

<br>

### [ logback-spring.xml 완성본]

```xml
<configuration scan="true" scanPeriod="10 seconds">

    <springProfile name = "dev">
        <property resource = "application-dev.properties"/>
    </springProfile>

    <springProfile name = "prod">
        <property resource = "application-prod.properties"/>
    </springProfile>


    <property name ="LOG_LEVEL" value = "${log.config.level}"/>
    <property name ="LOG_PATH" value = "${log.config.path}"/>
    <property name ="LOG_FILE_NAME" value = "${log.config.filename}"/>
    <property name ="ERR_LOG_FILE_NAME" value = "${log.config.filename.error}"/>
    <property name ="LOG_PATTERN" value ="%-5level %d{yyyy-MM-dd HH:mm:ss}[%thread] [%C] [%logger{0}:%line] - %msg%n"/>

    <appender name ="CONSOLE" class ="ch.qos.logback.core.ConsoleAppender">
        <encoder class ="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <pattern>${LOG_PATTERN}</pattern>
        </encoder>
    </appender>

    <appender name="FILE" class ="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_PATH}/${LOG_FILE_NAME}.log</file>

        <encoder class = "ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <pattern>${LOG_PATTERN}</pattern>
        </encoder>

        <rollingPolicy class = "ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>${LOG_PATH}/%d{yyyy-MM-dd}/${LOG_FILE_NAME}_%i.log</fileNamePattern>
            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>10MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
    </appender>

    <appender name = "ERROR" class ="ch.qos.logback.core.rolling.RollingFileAppender">
        <filter class ="ch.qos.logback.classic.filter.LevelFilter">
            <level>error</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
        <file>${LOG_PATH}/${ERR_LOG_FILE_NAME}.log</file>

        <encoder class = "ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <pattern>${LOG_PATTERN}</pattern>
        </encoder>

        <rollingPolicy class = "ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>${LOG_PATH}/%d{yyyy-MM-dd}/${ERR_LOG_FILE_NAME}_%i.log</fileNamePattern>

            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>10MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
    </appender>

    <root level = "${LOG_LEVEL}">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
        <appender-ref ref="ERROR"/>
    </root>

    <logger name="org.springframework" level = "INFO" additivity = "false">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
        <appender-ref ref="ERROR"/>
    </logger>

    <logger name="org.hibernate.validator" level = "INFO" additivity = "false">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
        <appender-ref ref="ERROR"/>
    </logger>

    <logger name="com.zaxxer.hikari" level = "INFO" additivity = "false">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
        <appender-ref ref="ERROR"/>
    </logger>
</configuration>
```

---

<br>

## <span style="color:gray">참고 블로그</span>

📚 [관련 블로그 1](https://goddaehee.tistory.com/206)

📚 [관련 블로그 2](https://livenow14.tistory.com/64)

📚 [관련 블로그 3](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.logging)

📚 [관련 블로그 4](https://logback.qos.ch/manual/index.html)

---