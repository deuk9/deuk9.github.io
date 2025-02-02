---
tags:
  - test
  - jacoco
date: 2023-12-03
title: Jacoco 를 이용한 코드 커버리지 테스트
description: 코드 커버러지 테스트를 위한 Jacoco 에 대하여 알아본다.
---

코드 커버리지는 테스트가 얼마나 많은 코드 라인을 실행하는지를 나타내는 중요한 지표이다. Jacoco는 코드 커버리지를 측정하고 일정 수준에 도달하는지 검증하는 도구이다.

## 1. 설정
```gradle
plugins {  
 
    id 'jacoco'  
}  
  
jacoco {  
    toolVersion ="0.8.8"  
}  
  
tasks.named('test') {  
    useJUnitPlatform()  
  
    jacoco{}  
    finalizedBy(tasks.jacocoTestReport)  
}  
tasks.jacocoTestReport{  
    reports {  
        xml.required = true  
        html.required = true  
        csv.required = false  
  
        xml.destination(file("build/jacoco/jacoco.xml"))  
        html.destination(file("build/jacoco/jacoco.html"))  
    }
    finalizedBy(tasks.jacocoTestCoverageVerification)  
}  
tasks.jacocoTestCoverageVerification {  
    violationRules {  
        rule {  
            enabled = true  
            element = "CLASS"  
  
            limit {  
                counter = "LINE"  
                value = "COVEREDRATIO"  
                minimum = BigDecimal.valueOf(0.5)  
            }  
            limit {  
                counter = "LINT"  
                value = "TOTALCOUNT"  
                maximum = BigDecimal.valueOf(100)  
            }
            excludes = List.of(  
		        "*.controller.*",  
		        "com.example.deuktest"  
			)  
		}   
	 }
}
```

* `tasks.jacocoTestReport` 는 테스트 후 결과값을 파일로 저장한다. 위의 샘플에선 xml , html 파일을 생성함.
![jacoco 테스트 결과](/blog/test/jacoco-test-result.png)
- `tasks.jacocoTestCoverageVerification` 는 검증에 대한 설정을 할 수 있다.
  1. Line 의 50% 를 커버하지 못하면 검증 실패
  2. 각 클래스의 라인수가 100줄이 넘으면 실패


---

### 참고 자료

- [쥬쥬와 하루만에 끝내는 스프링 테스트](https://www.inflearn.com/course/%EC%A5%AC%EC%A5%AC%EC%99%80-%ED%95%98%EB%A3%A8%EB%A7%8C%EC%97%90-%EB%81%9D%EB%82%B4%EB%8A%94-%EC%8A%A4%ED%94%84%EB%A7%81%ED%85%8C%EC%8A%A4%ED%8A%B8/dashboard)