---
tags:
  - QueryDsl
  - jpa
  - spring
date: 2025-04-20
title: Openfeign QueryDsl JPA 설정하기
description: Openfeign QueryDsl JPA 설정하는 방법에 대하여 알아본다.
sitemap:
  lastmod: 2025-04-20
---
기존에 Querydsl 프로젝트가 **버전 업그레이드가 잘 되지 않고 있다는 점은 알고 있었지만**, 그동안은 큰 문제가 없어 그냥 사용해왔다.

그러던 중, 새로 진행하는 토이 프로젝트에서 한번 설정해 보고싶어 테스트 해봤다.
적용 과정은 의외로 간단했고, 특히 **Spring Boot 3.x + Jakarta EE + Hibernate 6 환경에서의 호환성 문제**도 자연스럽게 해결할 수 있어 만족스러웠다.

게다가 [Spring Data 공식 문서](https://docs.spring.io/spring-data/jpa/reference/repositories/core-extensions.html)에서도 해당 포크에 대해 언급하고 있다는 점에서, 앞으로의 표준처럼 느껴진다.



## 1. 환경 구성은 아래와 같다.
 - java 21
 - gradle(kotlin)
 - spring boot 3.4


## 2. Gradle(kotlin) 설정하는 방법

```kotlin
val queryDslVersion = "6.11"

implementation("io.github.openfeign.querydsl:querydsl-core:${queryDslVersion}")  
implementation("io.github.openfeign.querydsl:querydsl-jpa:$queryDslVersion")  
annotationProcessor("io.github.openfeign.querydsl:querydsl-apt:$queryDslVersion:jpa")  
```

## 3. maven 설정 방법
```xml
<dependency>  
  <groupId>io.github.openfeign.querydsl</groupId>  
  <artifactId>querydsl-core</artifactId>  
  <version>6.11</version>  
</dependency>  
  
<dependency>  
  <groupId>io.github.openfeign.querydsl</groupId>  
  <artifactId>querydsl-jpa</artifactId>  
  <version>${openfeign.querydsl.version}</version>  
</dependency>  
  
<dependency>  
  <groupId>io.github.openfeign.querydsl</groupId>  
  <artifactId>querydsl-apt</artifactId>  
  <version>${openfeign.querydsl.version}</version>  
  <classifier>jpa</classifier>  
  <scope>compile</scope>  
</dependency>
```

- 기존에 비해 정말 간단하게 설정이 가능함(플러그인 설치할 필요 없음.)


--- 
참고 자료
- [OpenFeign](https://github.com/OpenFeign/querydsl).
- [Spring Data Extensions](https://docs.spring.io/spring-data/jpa/reference/repositories/core-extensions.html).