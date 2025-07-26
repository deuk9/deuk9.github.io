---
title: Spring 에서 kafka, REST API trace 모니터링하기(tempo + loki + grafana)
tags:
  - tempo
  - opentelemetry
  - loki
  - monitoring
  - kafka
date: 2025-06-01
description: Spring 에서 kafka, REST API trace 모니터링하기(tempo + loki + grafana)
sitemap:
  lastmod: 2025-06-01

---

최근 Spring I/O 발표에서 소개된 부분중 Kafka 데이터 흐름에 대한 trace정보를 저장하는 부분에 대하여 인상깊게 보았다.
REST API + Kafka producer/consumer + Database 에 대한 trace 정보를 기록하는 방법에 대하여 구현해 보았다.


## 1. 기본 구성

### 1.1 사용한 스택
- **Spring Boot 3.x**
- **Micrometer Tracing (OpenTelemetry Bridge)**
- **Kafka** (Producer/Consumer)
- **Tempo** (trace 저장)
- **Loki** (log 저장)
- **Grafana** (시각화)
- logbak loki appender

### 1.2 흐름
![flow-chart](/blog/monitoring/trace/flow.png)

## 2. 설정
### 2.1 gradle 설정

```kotlin
implementation("org.springframework.kafka:spring-kafka")
implementation("org.springframework.boot:spring-boot-starter-actuator")  
runtimeOnly("io.micrometer:micrometer-registry-prometheus")  
implementation("io.micrometer:micrometer-tracing-bridge-otel")  
implementation("io.opentelemetry:opentelemetry-exporter-otlp")  
implementation("com.github.loki4j:loki-logback-appender:1.6.0")
implementation("net.ttddyy.observation:datasource-micrometer-spring-boot:1.1.1")
```

- `actuator`: 메트릭 및 tracing endpoint 노출
- `micrometer-registry-prometheus`: Prometheus 메트릭 export 지원
- `micrometer-tracing-bridge-otel`: Micrometer 트레이싱 API와 OpenTelemetry SDK 연결
- `opentelemetry-exporter-otlp`: 수집된 trace 데이터를 OTLP 포맷으로 Collector/Tempo로 전송
- `loki-logback-appender`: 로그를 Loki로 전송할 수 있는 Logback용 appender
- `datasource-micrometer-spring-boot:1.1.1`:  database 까지 trace된다면 좋을 것 같아서 찾아보니, 이런 라이브러리가 있어서 추가해 보았다. (ttddyy 이분 어디서 봤나 했더니 datasource-proxy 라이브러리 만드신분이다. )


### 2.2 yaml 설정

```yaml
spring:
  application:
    name: order-service

  kafka:
    bootstrap-servers: localhost:9092
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
    consumer:
      group-id: order-consumer
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.apache.kafka.common.serialization.StringDeserializer
    template:
      observation-enabled: true
    listener:
      observation-enabled: true

management:
  tracing:
    sampling:
      probability: 1.0
    enabled: true

  otlp:
    tracing:
      endpoint: http://localhost:4317
      transport: grpc

```

- KafkaTemplate, KafkaListener에 대한 **자동 observation** 기능을 제공한다. `observation-enabled: true` 설정만으로 메시지 송신/수신 시 자동 적용.

### 2.3 logback 설정

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<configuration>  
  <include resource="org/springframework/boot/logging/logback/defaults.xml"/>  
  <include resource="org/springframework/boot/logging/logback/console-appender.xml"/>  
  <springProperty scope="context" name="application" source="spring.application.name"/>  
  
  <appender name="LOKI" class="com.github.loki4j.logback.Loki4jAppender">  
    <batchTimeoutMs>1000</batchTimeoutMs>  
    <http>  
      <url>http://${LOKI_HOST:-localhost}:${LOKI_PORT:-3100}/loki/api/v1/push</url>  
    </http>  
    <format>  
      <label>  
        <pattern>service_name=${application},host=${HOSTNAME},level=%level</pattern>  
        <structuredMetadataPattern>  
          level = %level,  
          thread = %thread,  
          class = %logger,  
          traceId = %mdc{traceId:-none},  
          spanId = %mdc{spanId:-none}  
        </structuredMetadataPattern>  
      </label>  
      <message>  
        <pattern>${FILE_LOG_PATTERN}</pattern>  
      </message>  
      <sortByTime>true</sortByTime>  
    </format>  
  </appender>  
  
  <root level="INFO">  
    <appender-ref ref="LOKI" />  
    <appender-ref ref="CONSOLE"/>  
  </root>  
</configuration>
```

### 2.4 기타 인프라 구성요소
- kafka, tempo, loki, grafana 샘플은 글이 너무 길어지니 github repository로 대체하겠다. 
- docker compose 로 간단하게 구성



## 3. 샘플 구현

```java
@RestController  
@RequiredArgsConstructor  
@Slf4j  
public class TestController {  
  
    private final KafkaTemplate<String, String> kafkaTemplate;  
    private final TeamRepository teamRepository;  
  
    @GetMapping("/test")  
    public void sendTestMessage() {  
        kafkaTemplate.send("my-topic", "Hello World!")  
            .thenAccept(o -> log.info("Sent message:{}", o.toString()));  
    }  
}
```

```java
@Component  
@Slf4j  
@RequiredArgsConstructor  
public class MyConsumer {  
  
    private final TeamService teamService;  
  
    @KafkaListener(topics = "my-topic")  
    public void listen(String message, Acknowledgment acknowledgment) {  
        log.info("Received Message: {}", message);  
        teamService.createTeam(new Team(message));  
        acknowledgment.acknowledge();  
    }  
}
```

- REST API 로 요청을 보내면 kafka producer 에서 메시지를 보냄
- kafka consumer에서 해당 메시지를 받고 비지니스 로직을 수행한다. 


## 4. 대시보드
![traceid-table](/blog/monitoring/trace/traceid-table.png)
![trace-span](/blog/monitoring/trace/trace-span.png)
![trace-log](/blog/monitoring/trace/trace-log.png)
- 위의 예제에서는 traceId `ea2cab37...` 를 기준으로 데이터가 어떻게 흘러가는지 파악 할 수 있다.
- traceId 기준으로 데이터의 흐름이 어떻게 되는지 파악할 수 있고, 해당하는 로그까지 연결하여 볼 수 있다. (로그의 대괄호의 ea2..를 참고)
- 새로 적용해본 database trace 부분도 잘 기록된다. (간단한 쿼리 결과도 볼 수 있다.)

---

## 📚 참고 자료 && 샘플 코드  
- [샘플 코드](https://github.com/deuk9/spring-trace-observation).
- [spring-io](https://www.youtube.com/watch?v=Z0Jcr5Q7FaI&t=2740s).  

