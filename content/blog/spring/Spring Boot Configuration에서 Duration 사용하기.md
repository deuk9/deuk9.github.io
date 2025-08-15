---
date: 2025-08-15
tags:
  - spring
title: Spring Boot Configuration에서 Duration 사용하기
description: Spring Boot에서 Duration을 활용해 시간 설정을 보다 명확하고 유연하게 관리하는 방법을 알아본다
sitemap:
  lastmod: 2025-08-15
---
개발을 하다보면 **타임아웃, 지연 시간, 캐시 만료 시간** 등 다양한 시간 관련 설정을 다뤄야 할 때가 많다. 

기존에는 `int`나 `long` 타입으로 밀리초나 초 단위로 설정했지만, 이는 **가독성과 유지보수성** 측면에서 여러 문제점을 가지고 있었다.

Spring Boot에서 제공하는 `Duration` 타입을 활용하면 이러한 문제를 깔끔하게 해결할 수 있다.

---

## 기존 방식의 문제점

### 단위가 불명확한 설정

```yaml
# 이 값이 초인지 밀리초인지 명확하지 않음
my-app:
  request:
    timeout: 5000
```

```java
// 코드에서도 단위를 추측해야 함
@Value("${my-app.request.timeout}")
private long timeout; // 5000이 5초인지 5000초인지?
```

### 단위 변환의 번거로움

```java
// 설정값이 초 단위일 때 밀리초로 변환
long timeoutInMillis = timeoutInSeconds * 1000;

// 다양한 단위로 변환할 때마다 계산 필요
long timeoutInMinutes = timeoutInSeconds / 60;
```

---

## Duration을 사용한 해결책

### 명확한 단위 표기

```yaml
my-app:
  request:
    timeout: 10s      # 10초
    # timeout: 5000ms # 5000밀리초
    # timeout: 2m     # 2분
    # timeout: 1h     # 1시간
```

`Duration`은 다음과 같은 단위를 지원한다:
- `ns` - 나노초
- `us` - 마이크로초  
- `ms` - 밀리초
- `s` - 초
- `m` - 분
- `h` - 시간
- `d` - 일

---

## Configuration Properties 구현

```java
package com.example.demo.config;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("my-app.request")
public record TimeoutConfiguration(
    Duration timeout
) {
    
    public TimeoutConfiguration {
        if(timeout == null) {
            timeout = Duration.ofSeconds(10);
        }
        
        if (timeout.isNegative()) {
            throw new IllegalArgumentException("Timeout must be positive");
        }
    }
}
```

### 주요 특징

**기본값 설정**: `null` 체크를 통해 기본값을 10초로 설정

**유효성 검증**: 음수 값에 대한 검증 로직 포함

**Record 활용**: 불변 객체로 설정값을 안전하게 관리

---

## Service에서 활용하기

```java
package com.example.demo.service;

import com.example.demo.config.TimeoutConfiguration;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MyService {
    
    private final TimeoutConfiguration timeoutConfiguration;
    
    public void doSomething() {
        Duration timeout = timeoutConfiguration.timeout();
        
        log.info("Doing something with timeout. {}ms, {}s, {}h", 
            timeout.toMillis(),
            timeout.getSeconds(), 
            timeout.toHours());
    }
}
```

### 다양한 단위로 변환

`Duration` 객체는 편리한 변환 메서드들을 제공한다:

```java
Duration timeout = Duration.ofSeconds(30);

long millis = timeout.toMillis();     // 30000
long seconds = timeout.getSeconds();  // 30
long minutes = timeout.toMinutes();   // 0
long hours = timeout.toHours();       // 0
```

---
## Duration 사용의 장점

**가독성 향상**: 설정값만 보고도 의미를 명확히 파악 가능

**유연성**: 다양한 시간 단위를 자유롭게 사용

**타입 안전성**: 컴파일 타임에 타입 체크

**편리한 변환**: 다양한 단위로 쉽게 변환 가능