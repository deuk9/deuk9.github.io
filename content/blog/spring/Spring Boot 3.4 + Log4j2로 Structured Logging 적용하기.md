---
date: 2025-05-17
tags:
  - spring
  - log4j2
title: Spring Boot 3.4 + Log4j2로 Structured Logging 적용하기
description: Spring Boot 3.4 + Log4j2로 Structured Logging 적용하는 방법에 대하여 알아본다
sitemap:
  lastmod: 2025-05-17
---


Spring Boot 3.4에서는 `structured logging` 기능이 정식으로 도입되었다.  
기존에는 JSON 로그를 출력하려면 Logback의 Logstash Encoder나 별도의 Layout 설정이 필요했다.  
이제는 Spring Boot에서 제공하는 `StructuredLogFormatter` 인터페이스를 통해 구조화된 로그를 간단하게 출력할 수 있다.

이 글에서는 Log4j2 환경을 기준으로, Spring Boot 3.4의 structured logging 기능을 커스터마이징하여 적용하는 방법을 정리한다.

---

## 📦 사전 준비

- Spring Boot `3.4.0` 이상
- 로깅 구현체: `spring-boot-starter-log4j2`
- Java 17 이상 사용 권장

---

## 🧱 StructuredLogFormatter란?

Spring Boot 3.4부터 도입된 `org.springframework.boot.logging.structured.StructuredLogFormatter<T>`  
인터페이스는 구조화된 로그 출력을 위한 포맷터 역할을 한다.

Spring Boot는 사용하는 로깅 구현체에 맞춰 해당 포맷터를 자동 연동하며,  
JSON 형태의 로그 생성을 쉽게 도와주는 `JsonWriter<T>` 유틸리티도 함께 제공한다.

---

## 🛠 Log4j2 기반 커스텀 포맷터 구현

다음은 `LogEvent`를 기반으로 JSON 로그를 생성하는 커스텀 포맷터 클래스 구현 예시다:

```java
package org.example.jsonloggingsmple.config.log;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import org.apache.logging.log4j.core.LogEvent;
import org.springframework.boot.json.JsonWriter;
import org.springframework.boot.logging.structured.StructuredLogFormatter;

public class MyStructuredLoggingFormatter implements StructuredLogFormatter<LogEvent> {

    private final ObjectMapper objectMapper = new JsonMapper();

    private final JsonWriter<LogEvent> writer = JsonWriter.<LogEvent>of((members) -> {
        members.add("time", event -> {
            Instant javaInstant = Instant.ofEpochMilli(event.getInstant().getEpochMillisecond());
            return LocalDateTime.ofInstant(javaInstant, ZoneId.systemDefault());
        });
        members.add("level", LogEvent::getLevel);
        members.add("marker", LogEvent::getMarker).whenNotNull();
        members.add("thread", LogEvent::getThreadName);
        members.add("message", (event) -> event.getMessage().getFormattedMessage());
    }).withNewLineAtEnd();

    @Override
    public String format(LogEvent event) {
        return this.writer.writeToString(event);
    }
}
```

- logback 으로 적용은 [spring-boot-logback-샘플](https://spring.io/blog/2024/08/23/structured-logging-in-spring-boot-3-4) 을 참고한다. (제너릭 인터페이스가 다름)

## ⚙️ 설정 방법

```yaml
logging:  
  structured:  
    format:  
      console: org.example.jsonloggingsmple.config.log.MyStructuredLoggingFormatter  
  config: classpath:log4j2-spring.xml
```

---

## 📄 로그 출력 예시

```javascript
{"time":"2025-05-21T23:54:07.368","level":"WARN","thread":"http-nio-8080-exec-1","message": "hi."}
```


---

## 📚 참고 자료

- [Spring Boot Structured Logging 공식 문서](https://docs.spring.io/spring-boot/reference/features/logging.html#features.logging.structured)
