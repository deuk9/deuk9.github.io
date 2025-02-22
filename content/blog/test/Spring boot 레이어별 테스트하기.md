---
title: Spring boot 에서 레이어별 테스트 적용하기
date: 2024-02-15
tags:
  - spring
  - test
description: Spring boot에서 controller, service, repository 레이어에 대한 테스트 작성하는 방법에 대하여 알아본다.
sitemap:
  lastmod: 2024-01-28
---


# Spring Boot에서 각 레이어별 테스트 작성하기

Spring Boot 애플리케이션을 개발할 때, 각 레이어(controller, service, repository)에 대한 단위 테스트와 통합 테스트를 작성하는 것은 매우 중요하다. 테스트 작성에 대한 정답은 없지만 앞으로 이런식으로 작성해보겠다는 취지로 고민하여 작성하였다.

---


## 1. Controller 레이어 테스트

Controller 레이어의 테스트에서는 `@WebMvcTest`를 활용하여 Spring MVC 동작을 검증한다.

### 📌 테스트 코드 작성

```java
@WebMvcTest(controllers = {CoffeeController.class})  
public abstract class ControllerTestSupport {  

    @Autowired  
    protected MockMvc mockMvc;  
    protected ObjectMapper objectMapper = new ObjectMapper();  

    @MockitoBean  // MockBean으로 Service 레이어를 Mocking
    protected CoffeeService coffeeService;  
}
```

```java
class CoffeeControllerTest extends ControllerTestSupport {  

    @Test  
    @DisplayName("유효한 요청으로 커피를 생성한다")  
    void create_createsCoffee_whenValidRequest() throws Exception {  
        //given  
        CoffeeCreateRequest request = new CoffeeCreateRequest("Latte", 4000);  

        //then  
        mockMvc.perform(post("/coffees")  
                .contentType("application/json")  
                .content(objectMapper.writeValueAsString(request)))  
            .andExpect(status().isOk())  
            .andDo(document("coffees/create",  
                requestFields(  
                    fieldWithPath("name")  
                        .type(STRING)  
                        .description("The name of the coffee"),  
                    fieldWithPath("price")  
                        .type(NUMBER)  
                        .description("The price of the coffee")  
                )));  
    }
}
```

### ✅ Controller 테스트 시 고려할 사항

- `@WebMvcTest`는 Controller 계층만 로드하기 때문에, **Service 레이어는 @MockitoBean을 이용하여 Mocking**해야 한다. (@MockBean 은 deprecated 됨)
- 각각의 Controller마다 `@WebMvcTest`를 붙이면 Spring Context가 매번 재생성되므로, **Support 클래스를 상속하여 성능을 최적화**한다.


---

## 2. Service 레이어 테스트

Service 레이어는 실제 데이터베이스와 상호작용하므로 **Mocking 없이 테스트를 진행**한다. 이를 위해 **Testcontainers**를 활용하여 **PostgreSQL 환경을 직접 실행**한다.

### 📌 Testcontainers 설정

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

```java
@Import(TestcontainersConfiguration.class)  
@SpringBootTest  
@ActiveProfiles("test")  
public abstract class IntegrationTestSupport {  
}
```

### 📌 Service 레이어 테스트 코드

```java
@Transactional
class CoffeeServiceTest extends IntegrationTestSupport {

    @Autowired
    CoffeeService coffeeService;

    @Test
    @DisplayName("유효한 요청일 때 커피를 저장한다")
    void create_savesCoffee_whenValidRequest() {
        //given  
        CoffeeCreateRequest request = new CoffeeCreateRequest("Latte", 4000);

        //when  
        coffeeService.create(request);

        assertThat(coffeeService.getByName("Latte"))
            .isNotNull()
            .extracting("name", "price")
            .containsExactly("Latte", 4000);
    }
}    
```

### ✅ Service 테스트 시 고려할 사항

- **Mocking 없이 실제 DB와 연결된 환경에서 테스트**를 수행한다.
- **Testcontainers를 사용하여 실제 PostgreSQL이 테스트 시 실행된다.**
- Spring context 재생성을 방지하기 위해 부모 클래스에 `@SpringBootTest`를 명시하고, 해당 클래스를 상속받아 테스트를 작성한다.


---

## 3. Repository 레이어 테스트

Repository 테스트는 **Spring Data JPA에서 직접 작성한 메서드나 QueryDSL을 검증하는 용도**로 작성한다.

### 📌 Repository 테스트 코드

```java
@Transactional
class CoffeeRepositoryTest extends IntegrationTestSupport {

    @Autowired
    CoffeeRepository coffeeRepository;

    @Test
    @DisplayName("이름으로 커피를 조회할 때 커피가 존재하면 반환한다")
    void findByName_returnsCoffee_whenCoffeeExists() {
        //given  
        Coffee coffee = Coffee.create(new CoffeeCreateRequest("Latte", 4000));
        coffeeRepository.save(coffee);

        //when  
        Optional<Coffee> foundCoffee = coffeeRepository.findByName("Latte");

        //then  
        assertThat(foundCoffee)
            .isPresent()
            .get()
            .extracting("name", "price")
            .containsExactly("Latte", 4000);
    }
}    
```

### ✅ Repository 테스트 시 고려할 사항

- `JpaRepository`에서 **직접 추가한 메서드나 QueryDSL을 검증**하는 용도로 활용한다.
- `@Transactional`을 사용하여 각 테스트가 끝난 후 자동으로 데이터가 롤백되도록 한다.
