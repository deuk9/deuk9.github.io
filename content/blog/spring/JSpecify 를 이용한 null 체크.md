---
tags:
  - jspecify
  - spring
date: 2025-07-28
title: JSpecify를 이용한 null 체크
description: JSpecify를 이용한 null 체크
sitemap:
  lastmod: 2025-07-28
---
11월쯤 Spring boot 4버전이 나온다고 한다. 업데이트 내용을 보니 **JSpecify** 관련 내용이 있었다.
기존에 spring framework, lombok등 null 관련 annotation 이 산재되어 있었는데 JSpecify를 표준으로 삼으려는 것 같다.

**JSpecify**와 **NullAway**를 조합하면 null safety 검증을 구축할 수 있다. 이번 글에서는 두 도구의 개념과 실제 적용 방법에 대해 알아본다.

---
##  ✅ 환경
- java 21
- Spring boot4-M1 

## ✅ 잠깐 살펴본 Spring boot 4 
![spring-boot-3](/blog/spring/specify/boot3-nullable.png)
![spring-boot-4](/blog/spring/specify/boot4-nullable.png)

- 기존 springframework 어노테이션에서 JSpecify 로 변경된 모습이다.

## ✅ JSpecify 주요 어노테이션

**JSpecify**는 Java 코드에서 null safety를 표현하기 위한 표준화된 어노테이션 라이브러리다.

### 핵심 어노테이션들

- **`@Nullable`**: null이 될 수 있는 값임을 명시
- **`@NonNull`**: null이 될 수 없는 값임을 명시 (보통 기본값)
- **`@NullMarked`**: 클래스나 패키지 단위로 null safety 규칙 적용
- **`@NullUnmarked`**: null safety 검사에서 제외

### @NullMarked 적용

```java
@NullMarked  // 이 어노테이션 하나로 클래스 전체에 null safety 적용
public class MemberService {
    
    // 모든 매개변수와 반환값이 기본적으로 @NonNull
    public String process(String input) {
        return input.toUpperCase();  // input은 null이 될 수 없음이 보장
    }
    
    // 명시적으로 @Nullable을 선언해야 null 허용
    public String processNullable(@Nullable String input) {
        return input != null ? input.toUpperCase() : "";
    }
}
```


---

##  ✅ Gradle 설정

### build.gradle.kts 예시

kotlin

```kotlin
import net.ltgt.gradle.errorprone.CheckSeverity  
import net.ltgt.gradle.errorprone.errorprone  
  
plugins {  
    java  
    id("org.springframework.boot") version "4.0.0-M1"  
    id("io.spring.dependency-management") version "1.1.7"  
    id("net.ltgt.errorprone") version "4.2.0"  
}  
  
group = "org.example"  
version = "0.0.1-SNAPSHOT"  
  
java {  
    toolchain {  
        languageVersion = JavaLanguageVersion.of(21)  
    }  
}  
  
configurations {  
    compileOnly {  
        extendsFrom(configurations.annotationProcessor.get())  
    }  
}  
  
repositories {  
    mavenCentral()  
    // Spring 마일스톤 버전을 위한 리포지토리  
    maven { url = uri("https://repo.spring.io/milestone") }  
}  
  
dependencies {  
    implementation("org.springframework.boot:spring-boot-starter-web")  
    compileOnly("org.projectlombok:lombok")  
    annotationProcessor("org.projectlombok:lombok")  
    testImplementation("org.springframework.boot:spring-boot-starter-test")  
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")  
  
    errorprone("com.uber.nullaway:nullaway:0.12.7")  
    errorprone("com.google.errorprone:error_prone_core:2.38.0")  
}  
  
tasks.withType<Test> {  
    useJUnitPlatform()  
}  
  
tasks.withType<JavaCompile>().configureEach {  
    options.errorprone {  
        disableAllChecks.set(true)  
  
        check("NullAway", CheckSeverity.ERROR)  
  
        option("NullAway:AnnotatedPackages", "org.example")  
    }  
}
```

---
##  ✅ IDE 도움 받기

![controller](/blog/spring/specify/jspecify-conroller.png)
![service](/blog/spring/specify/jspecify-service.png)

## ✅ 빌드 시 
```
sample/src/main/java/org/example/nullablesample/member/MemberController.java:22: error: [NullAway] passing @Nullable parameter 'null' where @NonNull is required
        memberService.createMember(null);
                                   ^
    (see http://t.uber.com/nullaway )
```
- 빌드 시 애러 발생.


## ✅ 정리
- Kotlin으로의 전환이 어렵거나 점진적으로 진행해야 하는 레거시 자바 프로젝트에서, **JSpecify**와 **NullAway**는 괜찮은 대안이다.
- 이 생태계를 사용하지 않는 외부 클라이언트로부터의 호출을 막을 수는 없습니다. 따라서 **라이브러리나 외부에 노출되는 Public API 경계에서는, 여전히 `Objects.requireNonNull()` 등을 사용한 명시적인 런타임 Null 체크를 통해 방어적으로 코드를 작성해야 한다.**

---
참고 자료 && 샘플 코드
- [spring-참고자료](https://spring.io/blog/2025/03/10/null-safety-in-spring-apps-with-jspecify-and-null-away).
- https://github.com/sdeleuze/jspecify-nullway-demo.
- [샘플코드](https://github.com/deuk9/jspecify-nullaway).