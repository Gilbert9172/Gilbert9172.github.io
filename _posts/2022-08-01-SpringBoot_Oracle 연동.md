---
layout: post
title: Spring boot와 Oracle 연동
categories: spring
tags: springBoot
---

## <span style="color:gray">Dependency 설정</span>

<br>

#### ***Oracle 관련 dependency***

---

```xml
<!-- 오라클 JDBC라이브러리 관리 사이트 -->
<repositories>
    <repository>
        <id>oracle</id>
        <name>Oracle JDBC Repository</name>
        <url>http://repo.spring.io/plugins-release/</url>
    </repository>
</repositories>

<!-- oracle -->
<dependency>
    <groupId>com.oracle.database.jdbc</groupId>
    <artifactId>ojdbc8</artifactId>
    <scope>runtime</scope>
</dependency>
```

<br>

#### ***Logging 관련 dependency***

---

```xml
<!-- Log4j -->
<dependency>
    <groupId>org.bgee.log4jdbc-log4j2</groupId>
    <artifactId>log4jdbc-log4j2-jdbc4.1</artifactId>
    <version>1.16</version>
</dependency>
```

<br>

## <span style="color:gray">application.properties 설정</span>

---

```properties
#=== DataBase ===#
spring.datasource.driver-class-name = net.sf.log4jdbc.sql.jdbcapi.DriverSpy
spring.datasource.url               = jdbc:log4jdbc:oracle:thin:@{IpAddress}:1521/{SID}
spring.datasource.username          = {username}
spring.datasource.password          = {password}

#=== Logging ===#
logging.level.jdbc.sqlonly          = off
logging.level.jdbc.sqltiming        = info
logging.level.jdbc.resultsettable   = info
logging.level.jdbc.audit            = off
logging.level.jdbc.resultset        = off
logging.level.jdbc.connection       = off
```

<br>

## <span style="color:gray">log4jdbc.log4j2.properties 설정</span>

---

```properties
log4jdbc.spylogdelegator.name   = net.sf.log4jdbc.log.slf4j.Slf4jSpyLogDelegator
log4jdbc.dump.sql.maxlinelength = 0
```

<br>

## <span style="color:gray">Oracle DB 권한 설정</span>

---

오라클 DB는 사용자의 아이디를 기준으로? DB 스키마를 관리하는 것 같다.

그래서 그런지 MySql이나 MariaDB에서 사용하던 `show databases` 명령어가 안됐다.

아무튼 오늘은 Oracle DB에서 계정 생성과 권한 설정에 많은 시간을 할애 했다.

```sql
1. ALTER SESSION SET "_ORACLE_SCRIPT"=true;

2. CREATE USER [username] idenrified BY [password];

3. GRANT CONNECT, RESOURCE, DBA TO [username];
```

위 방법으로 순서대로 시행하면 사용자를 추가할 수 있으며, 권한도 부여된다.

여기서 입력한 `[username]`으로 DB 스키마가 생성됨을 확인할 수 있었다.