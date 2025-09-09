---
tags:
  - spring
  - aop
date: 2025-09-09
title: AOP 로깅에서 실수하기 쉬운 실행 순서 문제
description: AOP 로깅에서 실수하기 쉬운 실행 순서 문제
---


최근에 로직 수행에 걸린 시간에 관련해서 로그를 보고있었는데, 생각과 다르게 로그가 찍히고 있는걸 발견했다.
이상함을 느껴 조사해본 결과, **@Transactional과의 실행 순서 문제**로 인해 실제 데이터베이스 커밋 시간이 측정에서 제외되고 있었다는 것을 발견했다.

이 글에서는 해당 문제의 원인과 해결 방법을 공유한다.

---

## 문제 상황

### 기존 AOP 성능 측정 코드

java

```java
@Aspect
@Component
@Slf4j
public class PerformanceAspect {

    @Around("@annotation(Monitored)")
    public Object measureExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        
        try {
            Object result = joinPoint.proceed();
            return result;
        } finally {
            long endTime = System.currentTimeMillis();
            long elapsedTime = endTime - startTime;
            
            log.info("Method: {}, Elapsed Time: {}ms", 
                joinPoint.getSignature().getName(), elapsedTime);
        }
    }
}
```

### 서비스 메서드

java

```java
@Service
public class UserService {

    @Monitored
    @Transactional
    public void createUser(UserCreateRequest request) {
        List<User> users = new ArrayList<>();
        for (int i = 0; i < 10000; i++) {
            users.add(new User("user" + i, "user" + i + "@example.com"));
        }
        userRepository.saveAll(users);
    }
}
```

### 예상 vs 실제 측정 결과

- HTTP response 시간은 5초 정도 소요되었다. 특별한 로직이 없기 때문에 DB 작업도 5초와 비슷하게 나와야 한다.
- 그런데 로그상에서는 0.5초로 기록되어 있다.

---

## 원인 분석

### Spring AOP 프록시 실행 순서

`@Order` 어노테이션이나 명시적인 우선순위 설정이 없다면, 프록시 생성 순서에 따라 실행 순서가 결정된다.

**@Order 미설정 시 실제 동작:**

- `@Transactional`의 기본 Order: `Ordered.LOWEST_PRECEDENCE` (Integer.MAX_VALUE)
- 커스텀 AOP의 기본 Order: `Ordered.LOWEST_PRECEDENCE` (동일한 값)
- 같은 Order 값일 때는 프록시 생성 순서에 따라 실행 순서가 결정됨

**문제가 된 실행 순서:**

1. **@Transactional** (트랜잭션 시작)
2. **@Around AOP** (성능 측정 시작)
3. **실제 메서드 실행**
4. **@Around AOP** (성능 측정 종료) ← 여기서 측정 완료
5. **@Transactional** (트랜잭션 커밋) ← 이 시간이 누락됨


---

## 해결 방법

### @Order 어노테이션 활용

`@Transactional`의 기본 Order 값은 `Ordered.LOWEST_PRECEDENCE`(최대값)로 설정되어 있다. 따라서 커스텀 AOP가 트랜잭션보다 먼저 시작하고 나중에 끝나도록 하려면 더 낮은 값을 설정해야 한다.

java

```java
@Aspect
@Component
@Order(100) // 확실하게 order 를 설정
@Slf4j
public class PerformanceAspect {

    @Around("@annotation(Monitored)")
    public Object measureExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        
        try {
            Object result = joinPoint.proceed();
            return result;
        } finally {
            long endTime = System.currentTimeMillis();
            long elapsedTime = endTime - startTime;
            
            log.info("Method: {}, Elapsed Time: {}ms", 
                joinPoint.getSignature().getName(), elapsedTime);
        }
    }
}
```

**실행 순서 변경 후:**

1. **@Around AOP** (성능 측정 시작) ← Order 100
2. **@Transactional** (트랜잭션 시작) ← Order 최대값
3. **실제 메서드 실행**
4. **@Transactional** (트랜잭션 커밋) ← 먼저 끝남
5. **@Around AOP** (성능 측정 종료) ← 나중에 끝남

**Order 값 이해하기:**

- Order 값이 **낮을수록 높은 우선순위** (먼저 시작하고 나중에 끝남)
- Order 값이 **높을수록 낮은 우선순위** (나중에 시작하고 먼저 끝남)
- `@Transactional`의 기본값: `Ordered.LOWEST_PRECEDENCE` (Integer.MAX_VALUE)

---

## 검증 결과

### 수정 후 측정 결과

java

```java
@Aspect
@Component
@Order(100) 
@Slf4j
public class PerformanceAspect {
    // ... 성능 측정 로직
}
```

@Order(100) 설정으로 트랜잭션 커밋 시간까지 포함된 정확한 성능 측정이 가능해졌다.

이제 HTTP response 시간과 유사한 측정값을 얻을 수 있어, 대용량 배치 처리 시 실제 소요 시간을 정확히 파악할 수 있게 되었다.

---

## 결론

AOP를 활용한 성능 측정 시 프록시 순서를 반드시 고려해야 한다.

특히 **대용량 데이터 처리나 배치 작업**의 경우, 트랜잭션 커밋 시간이 전체 실행 시간에서 상당한 비중을 차지할 수 있다. 이 시간을 놓치면 실제 성능과 크게 다른 잘못된 측정값을 얻게 된다.

