---
tags:
  - spring
  - hibernate
date: 2025-04-02
title: Hibernate에서 Slow Query 로그 남기기
description: Hibernate에서 Slow Query 로그를 남기는 방법에 대하여 알아본다.
---
  
## 🐌 Hibernate에서 느린 쿼리(Slow Query) 로그 남기기

운영 중인 시스템에서 쿼리 하나하나의 성능을 일일이 확인하기는 어렵다. 
하지만 일정 시간 이상 소요되는 **느린 쿼리(Slow Query)**를 자동으로 로그에 기록하면, 성능 병목 지점을 빠르게 파악할 수 있다.
Spring Boot + Hibernate 환경이라면 Hibernate 자체 기능을 활용해 쉽게 설정 가능하다.

## ⚙️ 설정 방법 (Spring Boot3.x + Hibernate 6.x)

```yaml
spring:
  jpa:
    properties:
      hibernate:
        session:
          events:
            log:
              LOG_QUERIES_SLOWER_THAN_MS: 1
    hibernate:
      ddl-auto: update

logging:
  level:
    org:
      hibernate:
        SQL: debug
        SQL_SLOW: info
```


## 🖌️ 로그 결과
일부러 1ms 를 설정하여 로그를 남겼다.

org.hibernate.SQL_SLOW  : `Slow query took 3 milliseconds` [select m1_0.id,m1_0.name from member m1_0 where m1_0.id=?]