---
tags:
  - monitoring
  - prometheus
date: 2025-01-10
title: Prometheus에서 Docker Swarm Service Discovery 활용하기
description: Prometheus Docker Swarm Service Discovery를 사용해 노드, 태스크, 서비스를 자동 감지해 모니터링하는 방법을 소개합니다.
---
Docker Swarm 환경에서 Prometheus를 활용해 노드, 태스크, 서비스의 메트릭을 동적으로 수집하는 방법을 소개합니다. 기존의 정적 설정 방식과 달리, `dockerswarm_sd_configs`를 사용하면 Swarm 내부의 변화에 따라 자동으로 타겟을 갱신할 수 있습니다.

## Prometheus 설정 (`prometheus.yml`)

아래 설정을 적용하면 Docker Swarm의 노드, 태스크, 서비스를 자동으로 검색하고 메트릭을 수집할 수 있습니다.

```yaml
scrape_configs:
  - job_name: "swarm-nodes"
    dockerswarm_sd_configs:
      - host: tcp://localhost:2375
        role: nodes
        port: 9100
  - job_name: "swarm-tasks"
    dockerswarm_sd_configs:
      - host: tcp://localhost:2375
        role: tasks
    metrics_path: "/actuator/prometheus"
  - job_name: "swarm-services"
    dockerswarm_sd_configs:
      - host: tcp://localhost:2375
        role: services
```

### `dockerswarm_sd_configs`에서 `role` 설명

- `nodes`: Swarm 클러스터의 각 노드에서 실행되는 Exporter (예: Node Exporter)를 대상으로 메트릭 수집
    
- `services`: Swarm 서비스 단위로 메트릭을 수집하지만, 로드 밸런싱 문제로 인해 특정 컨테이너의 데이터를 지속적으로 수집하는 것이 어렵습니다.
- `tasks`: 개별 컨테이너 단위로 모니터링 (예: Spring Actuator 활용)
    

## 역할별 활용 방안

### 1.`nodes`
- 각 Swarm 노드에서 실행 중인 `Node Exporter`와 같은 모니터링 컨테이너를 감지하여 메트릭을 수집합니다.
- 노드 레벨의 시스템 리소스 사용량을 확인할 때 유용합니다.
    

### 2.`services`

- 특정 서비스에 대한 메트릭을 수집할 수 있지만, Swarm의 로드 밸런싱으로 인해 특정 컨테이너의 데이터를 지속적으로 수집하는 것이 어렵습니다.
- 따라서, 개별 컨테이너 단위의 모니터링이 필요할 경우 `tasks`를 활용하는 것이 더 적합합니다.

### 3.`tasks`

- `tasks`는 개별 컨테이너의 메트릭을 수집하는 방식으로, Spring Boot Actuator 등과 연계하여 효과적으로 활용할 수 있습니다.
- 제가 설정방법을 찾지 못했을 수도 있으나 아래와 같은 문제가 있었습니다.
- **주의 사항**:
    
    - `tasks`의 포트 설정을 별도로 지정할 수 없습니다.
    - 테스트 결과 내부 네트워크 IP + publish port 로 접근하려고 합니다.
    - 내부 네트워크 IP (`10.x.x.x`)와`publish port`로 접근하지만, 내부 네트워크에서는 target port로 접근해야 정상적으로 데이터를 수집할 수 있습니다.
    - `docker run -p 8080:8080`처럼`publish port`와 `inner port`를 동일하게 설정해야 정상적인 모니터링이 가능합니다.
        

---

### 참고자료

- [Prometheus 공식 문서](https://prometheus.io/docs/prometheus/latest/configuration/configuration/)