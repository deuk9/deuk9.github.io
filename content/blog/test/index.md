---
date: 2023-12-03
title: archunit 을 활용한 코드 컨벤션 검증
tags: 
    - test
    - archunit
---

## 1. archunit 을 활용한 테스트
- 테스트
- 테스트 

![이것도 테스트](/blog/test/profile.jpeg)
![테스트](/blog/test/sample.png)

런타임전에 코드를 분석한다.  
코드 컨벤션, 안티 패턴등을 체크하는데 유용하다.  
클래스의 postfix, 의존성, 어노테이션 체크등 여러가지 기능을 제공한다.   
클래스의 postfix, 의존성, 어노테이션 체크등 여러가지 기능을 제공한다.

<!--more-->

## 2. 의존성
```gradle
testImplementation 'com.tngtech.archunit:archunit:1.1.0'
```

## 3. 테스트 작성

### 3.1 코드 컨벤션 체크
아래의 예제는 controller 패키지의 클래스명은 Controller 로 끝나야하고, @RestController 어노테이션을 포함해야 한다는 것을 검증하는 코드이다. 

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
    @DisplayName("Contoller 패키지의 클래스는 Contoller 로 끝나야한다.")  
    void controllerTest(){  
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

### 3.2 의존성 체크

#### 3.2.1 Controller 는 service, request, response 패키지의 클래스만 의존할 수 있다.

```java
@Test  
@DisplayName("Controller는 Service와 Request/Response 를 사용할 수 있음.")  
void controllerDependencyTest() {  
    ArchRule rule = classes()  
            .that().resideInAnyPackage("..controller")  
            .should().dependOnClassesThat()  
            .resideInAnyPackage("..service..", "..request..","..response..");  
  
    rule.check(javaClasses);  
}
```

#### 3.2.2 Controller 는 model 을 의존할 수 없다.
```java
@Test  
@DisplayName("Controller 는 모델을 사용할 수 없다.")  
void controllerCantHaveModelTest() {  
    ArchRule rule = noClasses()  
            .that().resideInAnyPackage("..controller")  
            .should().dependOnClassesThat().resideInAnyPackage("..model..");  
  
    rule.check(javaClasses);  
}
```


[//]: # (<img src="https://url/image.png" width="50" height="50"/>)



---
Reference
- hi
- [쥬쥬와-하루만에-끝내는-스프링테스트](https://www.inflearn.com/course/%EC%A5%AC%EC%A5%AC%EC%99%80-%ED%95%98%EB%A3%A8%EB%A7%8C%EC%97%90-%EB%81%9D%EB%82%B4%EB%8A%94-%EC%8A%A4%ED%94%84%EB%A7%81%ED%85%8C%EC%8A%A4%ED%8A%B8/dashboard)


- 테스트
- ㅇㅇ

1. 테스트