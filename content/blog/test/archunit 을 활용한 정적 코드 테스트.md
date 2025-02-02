---
tags:
  - test
  - archunit
date: 2023-12-03
title: archunit 을 활용한 코드 컨벤션 검증
description: 정적 코드 테스트 라이브러리인 ArchUnit에 대하여 알아본다
---
코드를 개발할 때, 로직의 정확성을 검증하는 단위 테스트(Unit Test)나 통합 테스트(Integration Test) 외에도**코드 자체에 대한 검증(Code Verification)** 이 필요할 때가 있다. 이는 코드 컨벤션, 안티 패턴, 클래스 간의 의존성 등을 사전에 점검하여 유지보수성을 높이고, 프로젝트의 아키텍처를 일관되게 유지하는 데 유용하다.

이러한 코드 검증을 위해 **ArchUnit** 라이브러리를 활용할 수 있다. ArchUnit은 런타임 전에 코드를 분석하여 패키지 구조, 클래스 네이밍 규칙, 의존성 등을 체크할 수 있도록 도와주는 강력한 도구이다. 이 글에서는 ArchUnit을 이용해 코드 검증 테스트를 작성하는 방법을 살펴본다.

---

## 1. ArchUnit 의존성 추가

Gradle 프로젝트에서 ArchUnit을 사용하려면,`build.gradle.kts`또는`build.gradle` 파일에 다음과 같이 의존성을 추가한다.

```gradle
testImplementation 'com.tngtech.archunit:archunit:1.1.0'
```

---

## 2. 코드 검증 테스트 작성

### 2.1 코드 컨벤션 체크

아래 테스트는 `controller` 패키지의 클래스들이 반드시 `Controller`로 끝나는 이름을 가져야 하며, `@RestController` 어노테이션이 포함되어 있어야 한다는 규칙을 검증한다.

```java
public class ArchitectureTest {  
    
    JavaClasses javaClasses;  
    
    @BeforeEach  
    void setup() {  
        javaClasses = new ClassFileImporter()  
                .withImportOption(new ImportOption.DoNotIncludeTests())  
                .importPackages("com.example.deuktest");  
    }  
    
    @Test  
    @DisplayName("Controller 패키지의 클래스는 Controller로 끝나야 한다.")  
    void controllerTest() {  
        ArchRule rule = classes()  
                .that().resideInAnyPackage("..controller")  
                .should().haveSimpleNameEndingWith("Controller");  
    
        ArchRule annotationRule = classes()  
                .that().resideInAnyPackage("..controller")  
                .should().beAnnotatedWith(RestController.class);  
    
        rule.check(javaClasses);  
        annotationRule.check(javaClasses);  
    }  
}
```

이 테스트가 통과하려면 `controller` 패키지 내의 모든 클래스가 `Controller`로 끝나야 하며, `@RestController`어노테이션이 있어야 한다. 이를 통해 일관된 네이밍 규칙을 유지할 수 있다.

---

### 2.2 의존성 체크

#### 2.2.1 `Controller`는 `Service`, `Request`, `Response` 패키지의 클래스만 의존할 수 있다.

일반적으로 `Controller`는 비즈니스 로직을 처리하는 `Service` 계층과 사용자 요청을 받는 `Request`, 응답을 반환하는 `Response` 계층과만 의존하는 것이 좋다. 이를 ArchUnit으로 검증하는 코드를 작성하면 다음과 같다.

```java
@Test  
@DisplayName("Controller는 Service와 Request/Response를 사용할 수 있다.")  
void controllerDependencyTest() {  
    ArchRule rule = classes()  
            .that().resideInAnyPackage("..controller")  
            .should().dependOnClassesThat()  
            .resideInAnyPackage("..service..", "..request..", "..response..");  
    
    rule.check(javaClasses);  
}
```

이 검증을 통해 `controller` 패키지의 클래스가 불필요한 의존성을 가지지 않도록 제한할 수 있다.

#### 2.2.2 `Controller`는 `Model`을 직접 의존할 수 없다.

일반적으로 `Model` 객체(Entity)는 `Service` 계층에서 관리되어야 하며, `Controller`가 직접 `Model`을 참조하는 것은 바람직하지 않다. 이를 검증하는 테스트는 다음과 같다.

```java
@Test  
@DisplayName("Controller는 Model을 사용할 수 없다.")  
void controllerCantHaveModelTest() {  
    ArchRule rule = noClasses()  
            .that().resideInAnyPackage("..controller")  
            .should().dependOnClassesThat().resideInAnyPackage("..model..");  
    
    rule.check(javaClasses);  
}
```

이 검증을 통해 `Controller`가 직접 `Model`을 참조하는 실수를 방지할 수 있다.

---

## 3. 마무리

이처럼 **ArchUnit을 활용하면 코드의 동작을 테스트하는 것이 아니라 코드 자체의 구조와 규칙을 검증할 수 있다.**

✅ **주요 활용 사례**

- 코드 컨벤션 체크 (클래스명, 어노테이션 사용 규칙 등)
- 계층 간의 의존성 관리 (`Controller -> Service -> Repository` 등의 의존성 흐름 유지)
- 특정 패키지나 클래스의 사용 제한 (예: `Repository` 패키지는 `Controller`에서 직접 호출 금지)
- 안티 패턴 감지 및 코드 품질 향상
    

---

### 참고 자료

- [쥬쥬와 하루만에 끝내는 스프링 테스트](https://www.inflearn.com/course/%EC%A5%AC%EC%A5%AC%EC%99%80-%ED%95%98%EB%A3%A8%EB%A7%8C%EC%97%90-%EB%81%9D%EB%82%B4%EB%8A%94-%EC%8A%A4%ED%94%84%EB%A7%81%ED%85%8C%EC%8A%A4%ED%8A%B8/dashboard)