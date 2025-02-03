---
tags:
  - monitoring
  - prometheus
title: HTTP Service Discovery를 활용한 Prometheus 동적 타겟 관리
date: 2025-01-03
description: Prometheus HTTP Service Discovery를 활용해 정적 설정 없이 동적 모니터링 타겟을 관리하는 방법을 소개합니다.
---
모니터링해야 할 대상이 많지만, Kubernetes나 Eureka와 같은 서비스 디스커버리(Service Discovery)를 사용할 수 없는 환경도 존재할 수 있다. 이런 경우, 정적인 설정(static config)으로 모든 타겟을 등록해야 하는 불편함이 있다. 그러나 HTTP 기반 서비스 디스커버리(HTTP Service Discovery, HTTP SD)를 활용하면 이 문제를 효과적으로 해결할 수 있다.

---

## Prometheus 설정

```yaml
- job_name: 'http-sd'                                                   
  scheme: http                                                          
  http_sd_configs:                                                       
   - url: http://localhost:8080/api/targets
     refresh_interval: "15s"         
```

위 설정에서 `scheme`을 `http`로 설정하고, `url`을 지정하면 Prometheus가 주기적으로 해당 URL을 호출하여 모니터링 대상을 갱신한다. `refresh_interval`을 통해 갱신 주기를 설정할 수 있다. 위 설정에서는 15초마다 `http://localhost:8080/api/targets`를 호출하여 최신 모니터링 타겟을 가져오도록 구성했다.

## HTTP Service Discovery 응답 구조

HTTP SD는 아래와 같은 JSON 응답을 통해 동적으로 모니터링 대상을 설정할 수 있다.

```json
[
  {
    "targets": [
      "localhost:9100"
    ],
    "labels": {
      "job": "node-exporter",
      "ip": "localhost",
      "application": "my-application"
    }
  }
]
```

- `targets`: 모니터링할 대상의 목록을 정의한다.
- `labels`: 각 타겟에 대한 추가 정보를 제공하며, Prometheus의 검색 조건이나 대상 식별값으로 활용할 수 있다.

## 마무리

HTTP Service Discovery는 Kubernetes와 같은 별도 서비스 디스커버리 없이도 Prometheus에서 동적인 모니터링 구성을 가능하게 해준다. 특히, 정적인 설정으로 인해 발생하는 유지보수 부담을 줄이고, 모니터링 대상을 실시간으로 유연하게 관리할 수 있도록 돕는다.
단점으로는 이를 위한 서버 구현과 유지보수가 필요하다.

--- 
### 참고자료
- [프로메테우스 홈페이지](https://prometheus.io/docs/prometheus/latest/configuration/configuration/)