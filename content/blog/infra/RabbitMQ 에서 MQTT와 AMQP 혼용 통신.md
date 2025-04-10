---
title: RabbitMQ 에서 MQTT와 AMQP 혼용 통신
date: 2025-04-10
tags:
  - MQTT
  - AMQP
  - RabbitMQ
  
description: RabbitMQ 에서 MQTT와 AMQP 혼용 통신하는 방법에 대하여 알아본다.
sitemap:
 lastmod: 2025-04-10
---


## 🧐 조사하게 된 계기

기존에는 RabbitMQ를 AMQP 기반으로만 사용하고 있었으나, MQTT 지원 요구가 생기며 조사하게 되었다.
RabbitMQ가 MQTT 플러그인을 통해 AMQP와 MQTT를 혼용할 수 있다는 사실을 확인하였다.
이에 따라 Docker 환경에서 MQTT → AMQP 메시지 흐름까지 테스트하였다.

---

## ✅ MQTT와 AMQP 0.9.1 비교

| 항목          | MQTT                                  | AMQP 0.9.1                              | 설명                        |
| ----------- | ------------------------------------- | --------------------------------------- | ------------------------- |
| 목적          | IoT, 저전력 장치 통신                        | 엔터프라이즈 메시징, 시스템 간 통합                    | 경량 통신 vs 신뢰성 위주의 통신       |
| 구조          | Topic 기반 Pub/Sub                      | Exchange → Queue 기반                     | 라우팅 방식 차이                 |
| 메시지 흐름      | Publisher → Broker → Subscriber       | Publisher → Exchange → Queue → Consumer | AMQP는 중간에 Exchange가 있음    |
| 토픽 구분자      | `/` (슬래시)                             | `.` (점)                                 | 계층 구분 방식 차이               |
| 싱글 레벨 와일드카드 | `+` (플러스)                             | `*` (애스터리스크)                            | 하나의 레벨만 매칭                |
| 멀티 레벨 와일드카드 | `#` (해시)                              | `#` (해시)                                | 0개 이상의 모든 레벨 매칭           |
| 대표 사용처      | IoT 센서, 게이트웨이, 모바일                    | 금융, 백엔드 마이크로서비스                         | 적용 영역 차이                  |
| 브로커 예시      | Mosquitto, EMQX, RabbitMQ (MQTT 플러그인) | RabbitMQ, ActiveMQ                      | 공통 브로커도 존재함 (예: RabbitMQ) |

---

## ✅ RabbitMQ 실행

```yaml
version: '3.8'

services:
  rabbitmq:
    image: rabbitmq:3.12-management
    container_name: rabbitmq
    ports:
      - "5672:5672"    # AMQP
      - "15672:15672"  # 관리 콘솔
      - "1883:1883"    # MQTT
    environment:
      - RABBITMQ_DEFAULT_USER=guest
      - RABBITMQ_DEFAULT_PASS=guest
    volumes:
      - ./rabbitmq.conf:/etc/rabbitmq/rabbitmq.conf
    command: >
      sh -c "
        rabbitmq-plugins enable --offline rabbitmq_mqtt &&
        rabbitmq-server
      "
```
- MQTT 프로토콜을 사용하기 위해서는 `rabbitmq_mqtt` 플러그인을 활성화해야 한다.
- MQTT 기본 포트는 `1883`번이며, 이를 통해 메시지를 수신한다.

---

## ✅ RabbitMQ 도식화
![RabbitMQ 도식화](/blog/infra/MQTT-AMQP.png)
- MQTT 메시지는 `test/topic/A` 형태의 토픽으로 발행되며,  
  RabbitMQ에서는 이를 `test.topic.A` 라우팅 키로 변환하여 처리한다.

- Exchange는 `amq.topic`, Queue는 `test.queue`로 설정한다.

---

## ✅ 코드로 보기

```kotlin
@Configuration
class RabbitMqConfig {

    companion object {
        const val QUEUE_NAME = "test.queue"
        const val EXCHANGE_NAME = "amq.topic"
        const val ROUTING_KEY = "test.topic.A"
    }

    
    @Bean
    fun testQueue(): Queue {
        return Queue(QUEUE_NAME, true)
    }

  
    @Bean
    fun topicExchange(): TopicExchange {
        return TopicExchange(EXCHANGE_NAME)
    }


    @Bean
    fun binding(queue: Queue, exchange: TopicExchange): Binding {
        return BindingBuilder
            .bind(queue)
            .to(exchange)
            .with(ROUTING_KEY)
    }
}
```

```kotlin
@Component
class MqttAmqpConsumer {

    @RabbitListener(queues = ["test.queue"])
    fun receive(message: String) {
        println("메시지 수신: $message")
    }
}
```
- Queue와 Exchange 를 묶는 설정이다.
- Exchange 는 `topic` 타입으로 설정하고 `test.topic.A`와 `test.queue`를 바인딩한다.
- `AMQP`를 사용하는 Consumer에서 `test.queue`를 바라보고 있으면 MQTT -> AMQP 메시지 전송이 가능하다.

---

## ✅ AMQP → MQTT 메시지 흐름

이번에는 반대 방향, 즉 **AMQP에서 발행된 메시지를 MQTT 클라이언트가 수신하는 경우**를 살펴보겠다.
이 경우에는 AMQP Publisher가 메시지를 **`amq.topic` exchange**에 발행하고,  
**MQTT 클라이언트가 구독하고 있는 토픽과 일치하는 라우팅 키**로 메시지를 전달해야 한다.

**라우팅 키는 MQTT 토픽과의 호환을 위해 `.(dot)` 형식으로 작성해야 한다.**
