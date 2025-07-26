---
title: Testcontainers 쉽게 적용하기
tags:
  - test
  - testcontainers
description: Spring boot 에서 testcontainers 쉽게 적용하는 방법에 대하여 알아본다.
date: 2025-02-14
---

최근 사내에서 테스트 문화를 정착시키기 위해 **Testcontainers** 사용 방법에 대해 다시 조사하게 되었다. 이전에 사용할 때에는 Spring의 도움 없이 수동으로 설정했던 기억이 있다. 그러나 Spring Boot `3.1` 이후 버전부터는 더욱 간편하게 사용할 수 있게 변경되었기에, 이에 대한 내용을 정리하고자 한다

## 1. Testcontainers란?
[Testcontainers](https://www.testcontainers.org/)는 통합 테스트를 위해 **Docker 컨테이너**를 사용하여 데이터베이스, 메시지 브로커, 외부 API 등을 손쉽게 실행하고 관리할 수 있는 Java 라이브러리다. 실제와 같은 인프라 서비스를 컨테이너로 띄워 테스트 환경을 구축할 수 있다.

## 2. 의존성 추가

Gradle을 사용하는 경우, `build.gradle.kts`에 다음과 같이 의존성을 추가한다.

```gradle
dependencies {
    testImplementation("org.springframework.boot:spring-boot-testcontainers")
    testImplementation("org.testcontainers:junit-jupiter")
    testImplementation("org.testcontainers:postgresql")
}
```

PostgreSQL + JPA 테스트를 위해 `postgresql` 기반 의존성을 추가했다.

## 3. 설정하기

### Testcontainers 설정 클래스 작성
```java
@TestConfiguration(proxyBeanMethods = false)
class TestcontainersConfiguration {

    @Bean
    @ServiceConnection
    PostgreSQLContainer<?> postgresContainer() {
        System.out.println("Creating container");
        return new PostgreSQLContainer<>(DockerImageName.parse("postgres:latest"))
            .withReuse(true);  
    }
}
```

### 테스트 지원 클래스 작성
```java
@Import(TestcontainersConfiguration.class)
@SpringBootTest
@ActiveProfiles("test")
public abstract class IntegrationTestSupport {
}
```

### 주요 설정 설명
- `PostgreSQLContainer`를 **Spring Bean**으로 등록한다.
- `@ServiceConnection`을 사용하면 **자동으로** JDBC URL, 데이터베이스 정보, 사용자 정보를 **Spring DataSource**에 매핑해준다.
- 기존에는 컨테이너의 정보를 직접 가져와서 테스트 환경에 주입해야 했지만, `@ServiceConnection`을 사용하면 이를 자동화할 수 있다.
- `withReuse(true)`를 설정하면 **컨테이너를 재사용**하여 테스트 속도를 향상시킬 수 있다. 이를 설정하지 않으면 매 테스트마다 컨테이너가 생성되고 삭제되므로 속도가 느려진다.

## 4. Testcontainers를 활용한 테스트 작성

```java
@Transactional
class CoffeeServiceTest extends IntegrationTestSupport {

    @Autowired
    CoffeeService coffeeService;

    @Test
    @DisplayName("유효한 요청일 때 커피를 저장한다")
    void create_savesCoffee_whenValidRequest() {
        // given
        CoffeeCreateRequest request = new CoffeeCreateRequest("Latte", 4000);

        // when
        coffeeService.create(request);

        // then
        assertThat(coffeeService.getByName("Latte"))
            .isNotNull()
            .extracting("name", "price")
            .containsExactly("Latte", 4000);
    }
}
```

### 주요 테스트 전략
- `CoffeeService`의 비즈니스 로직을 검증할 때, **실제 DB에 연결하여 테스트**한다.
- `@Transactional`을 추가하여 **테스트가 끝나면 자동으로 rollback**되도록 한다.
  - Testcontainers는 컨테이너를 **재사용**하기 때문에, rollback을 하지 않으면 데이터가 남아 다른 테스트에 영향을 줄 수 있다.
- Mocking 없이 실제 데이터베이스를 사용하여 **실제 운영 환경과 유사한 테스트**를 수행할 수 있다.

---

## 참고자료
- [Spring Boot Testcontainers 공식 문서](https://docs.spring.io/spring-boot/reference/testing/testcontainers.html).
- [Testcontainers](https://www.testcontainers.org/).
