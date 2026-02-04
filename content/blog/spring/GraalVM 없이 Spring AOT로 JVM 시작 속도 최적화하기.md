---
tags:
  - spring
  - aot
date: 2026-02-04
title: GraalVM 없이 Spring AOT로 JVM 시작 속도 최적화하기
description: GraalVM 없이 Spring AOT로 JVM 시작 속도 최적화하기
---


 
`Spring AOT = GraalVM Native Image?`

Spring AOT라고 하면 GraalVM Native Image(exe 만들기)를 떠올리기 쉽다. 하지만 **Native Image를 만들지 않고, 일반 JVM 위에서 AOT의 장점만 가져올 수 있다.**  
  
이 글에서는 Spring Boot 4.0.2 + Gradle 환경에서 Spring Data AOT Repositories를 적용하고, 실제 벤치마크를 통해 성능 차이를 확인한다.  
  
## 핵심 원리  
  
### 기존 방식 (Runtime)  
  
```  
애플리케이션 시작  
  -> 컴포넌트 스캔 (리플렉션)  
  -> Repository 인터페이스 발견  
  -> 동적 Proxy 생성  
  -> 빈 등록  
```  
  
### AOT 방식 (Build-time)  
  
```  
빌드 시점  
  -> 실제 구현체 클래스 생성 (XXXRepositoryImpl__AotRepository.java)  -> BeanDefinition 클래스 생성 (XXX__BeanDefinitions.java)  
애플리케이션 시작  
  -> 미리 만들어진 클래스를 바로 사용  
  -> 리플렉션, Proxy 생성 과정 생략  
```  
  
빌드할 때 **실제 구현체와 빈 정의 클래스를 미리 생성**해두고, 런타임에는 이것을 바로 사용한다. 리플렉션과 동적 Proxy 생성이 사라지므로 구동 속도가 빨라지고 메모리를 적게 먹는다.  
  
## 적용 방법 (Gradle Kotlin DSL)  
  
### 1. 플러그인 추가  
  
`build.gradle.kts`에 `org.springframework.boot.aot` 플러그인을 추가한다.  
  
```kotlin  
plugins {  
    java    
    id("org.springframework.boot") version "4.0.2"    
    id("io.spring.dependency-management") version "1.1.7"    
    id("org.springframework.boot.aot") version "4.0.2"  // 추가  
}  
```  
  
이 플러그인이 `processAot` 태스크를 등록한다. `org.graalvm.buildtools.native` 플러그인을 쓸 수도 있지만, Native Image 관련 설정이 함께 들어온다. JVM에서만 쓸 거라면 `org.springframework.boot.aot`만 적용하는 것이 깔끔하다.  
  
### 2. 빌드  
  
`./gradlew clean bootJar`
  
빌드 로그에서 `processAot` 태스크가 실행되는 것을 확인할 수 있다.  
  
### 3. 실행  
  
```bash  
java -Dspring.aot.enabled=true -jar build/libs/my-app.jar  
```  
  
`-Dspring.aot.enabled=true` 플래그가 있어야 Spring Boot가 AOT 생성 코드를 사용한다. 없으면 AOT 클래스가 JAR에 포함되어 있어도 기존 방식으로 동작한다.  
  
### 4. 적용 확인  
  
AOT가 활성화되면 시작 로그에서 여러 차이를 확인할 수 있다.  
  
**시작 메시지**  
  
```  
# 일반 모드  
Starting SpringAotApplication using Java 17...  
  
# AOT 모드  
Starting AOT-processed SpringAotApplication using Java 17...  
```  
  
`AOT-processed` 문구가 뜨면 적용된 것이다.  
  
**Repository 스캔 로그**  
  
```  
# 일반 모드 - 런타임에 Repository를 스캔하고 Proxy를 생성한다  
Bootstrapping Spring Data JPA repositories in DEFAULT mode.  
Finished Spring Data repository scanning in 19 ms. Found 21 JPA repository interfaces.  
  
# AOT 모드 - 이 로그가 아예 없다. 빌드 시 이미 구현체가 만들어져 있기 때문이다.  
```  
  
**Context 초기화 시간**  
  
```  
# 일반 모드  
Root WebApplicationContext: initialization completed in 489 ms  
  
# AOT 모드  
Root WebApplicationContext: initialization completed in 266 ms  
```  
  
## AOT가 생성하는 파일들  
  
빌드 후 `build/generated/aotSources` 디렉토리를 보면 도메인마다 아래 파일들이 생성된다.  
  
| 파일 | 역할 |  
|------|------|  
| `*Controller__BeanDefinitions.java` | Controller 빈 정의를 미리 생성 |  
| `*Service__BeanDefinitions.java` | Service 빈 정의를 미리 생성 |  
| `*Repository__BeanDefinitions.java` | Repository 빈 정의를 미리 생성 |  
| `*RepositoryImpl__AotRepository.java` | Repository 실제 구현체를 미리 생성 |  
  
Repository뿐 아니라 **Controller, Service 등 모든 Spring 빈**에 대해 BeanDefinition 클래스가 생성된다.  
  
## 벤치마크  
  
### 테스트 환경  
  
- Spring Boot 4.0.2  
- Java 25.0.2  
- H2 인메모리 DB  
- 21개 도메인 (Entity + Repository + Service + Controller)  
  
### Repository 1개 (소규모)  
  
| 모드 | 시작 시간 | Context 초기화 |  
|------|-----------|---------------|  
| **AOT** | **1.712s** | 266ms |  
| 일반 | 1.777s | 489ms |  
  
전체 시간 차이는 0.065초지만, **Context 초기화 시간은 266ms vs 489ms로 AOT가 약 45% 빠르다.**  
  
### Repository 21개 (중규모)  
  
| 회차 | AOT 모드 | 일반 모드 |  
|------|----------|-----------|  
| 1 | 1.939s | 2.412s |  
| 2 | 1.994s | 2.208s |  
| 3 | 1.913s | 2.253s |  
| **평균** | **1.949s** | **2.291s** |  
  
Repository 21개로 늘리자 **평균 0.34초, 약 15% 차이**가 발생했다. Repository 1개일 때의 0.065초 대비 5배 이상 차이가 커졌다.  
  
### JAR 크기 영향  
  
| 항목 | 크기 |  
|------|------|  
| AOT 생성 소스 (197개) | 1.1MB |  
| AOT 생성 클래스 (63개) | 504KB |  
| JAR 전체 | 54MB |  
  
AOT가 추가하는 용량은 JAR 대비 약 1% 수준이다. 파일 수가 많아 보이지만 각 클래스가 빈 등록 코드 몇 줄 수준이라 실질적 영향은 없다.  
  
## 주의사항  
  
### @Profile, @Conditional은 빌드 시점에 결정된다  
  
AOT에서 가장 주의할 점이다. `@Profile`로 분기하는 빈이 있을 때, **빌드 시점의 프로파일에 해당하는 빈만 BeanDefinition이 생성**된다.  
  
예를 들어 아래 두 서비스가 있다고 하자.  
  
```java  
@Service  
@Profile("prod")  
public class ProdGreetingService implements GreetingService {  
    public String greet() { return "PROD 환경입니다"; }  
}  
  
@Service  
@Profile("dev")  
public class DevGreetingService implements GreetingService {  
    public String greet() { return "DEV 환경입니다"; }  
}  
```  
  
**prod 프로파일로 빌드**하면 AOT는 `ProdGreetingService__BeanDefinitions.java`만 생성한다. `DevGreetingService`는 빈 등록 코드 자체가 존재하지 않는다.  
  
```bash  
# prod로 빌드  
./gradlew clean bootJar -Dspring.profiles.active=prod  
```  
  
이 JAR를 **dev 프로파일로 실행**해도 결과는 `PROD 환경입니다`다.  
  
```bash  
# dev로 실행해도 prod 빈이 사용된다  
$ java -Dspring.aot.enabled=true -Dspring.profiles.active=dev -jar app.jar  
$ curl http://localhost:8080/greeting  
PROD 환경입니다  
```  
  
AOT 모드에서 프로파일을 바꾸려면 해당 프로파일로 **다시 빌드**해야 한다. Gradle에서 프로파일을 `processAot` 태스크에 전달하려면 아래 설정이 필요하다.  
  
```kotlin  
tasks.named<org.springframework.boot.gradle.tasks.aot.ProcessAot>("processAot") {  
    val profile = providers.systemProperty("spring.profiles.active").orElse("default")    jvmArgs("-Dspring.profiles.active=${profile.get()}")}  
```  
  
### 기타 제약사항  
  
- Lambda로 정의된 빈은 아직 AOT를 지원하지 않는다  
- AOT 모드로 빌드한 후 빈 구성을 변경하면 반드시 다시 빌드해야 한다  
  
## 정리  
  
| 항목 | 일반 모드 | AOT 모드 |  
|------|-----------|----------|  
| 빈 등록 | 런타임 리플렉션 | 빌드 시 생성된 BeanDefinition |  
| Repository | 런타임 동적 Proxy | 빌드 시 생성된 구현체 |  
| GraalVM 필요 여부 | - | 불필요 |  
| 실행 방식 | `java -jar` | `java -Dspring.aot.enabled=true -jar` |  
| 추가 설정 | 없음 | `org.springframework.boot.aot` 플러그인 |  
  
GraalVM Native Image의 호환성 제약 없이, 플러그인 하나와 실행 플래그 하나로 시작 속도를 개선할 수 있다. Repository가 많은 프로젝트일수록 효과가 크다.