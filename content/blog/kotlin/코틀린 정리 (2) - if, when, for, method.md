---
tags:
  - kotlin
title: 코틀린 정리 (2) - if, when, for, method
date: 2024-01-29
description: 코틀린 기본문법에 대하여 정리해본다. (if, when, for, method)
---


이번 포스팅에서는 **Kotlin의 핵심 문법** 중에서도 자주 사용하는
`if`, `when`, 반복문(`for`), 예외 처리, 함수의 정의와 특징을 알아본다.

---

## 1. if문을 Expression으로 활용하기

코틀린에서는 `if`가 표현식(Expression)으로 사용될 수 있다. Java의 삼항 연산자(`?:`)는 존재하지 않는다.

```kotlin
fun validateScore(score: Int): String = if (score >= 90) "a" else "b"
```

---

## 2. 범위 연산자(`in`, `!in`)

범위를 명확하게 나타낼 때 사용한다.

```kotlin
fun validateScore(score: Int) {
    if (score in 0..100) {
        println("0과 100 사이입니다.")
    }

    if (score !in 0..100) {
        println("0과 100 사이가 아닙니다.")
    }
}
```

---

## 3. when 표현식 활용

코틀린의 `when` 표현식은 Java의 `switch-case`를 더 확장한 형태이다.

### 타입 체크(`is`)

```kotlin
fun whenSample(obj: Any): Boolean = when (obj) {
    is String -> obj.isEmpty()
    else -> false
}
```

### or 조건
```kotlin
fun judgeNumber(number: Int): Boolean = when(number) {
    0, 1, 2 -> true
    else -> false
}
```

### 조건식 사용
```kotlin
fun judgeNumber(number: Int): Boolean = when {
    number < 0 -> false
    number == 0 -> true
    else -> false
}
```

---

## 4. 반복문(`for`)

```kotlin
fun forTest() {
    for (i in 1..10) println(i)
    for (i in 10 downTo 1) println(i)
    for (i in 1..5 step 2) println(i)
}
```

---

## 5. 예외 처리

코틀린에서는 모든 예외가 unchecked 예외로 처리된다.

```kotlin
// 일반적인 try-catch
fun parseIntOrThrow(str: String): Int = try {
    str.toInt()
} catch (e: NumberFormatException) {
    throw IllegalArgumentException("숫자가 아닙니다.")
}

// null 반환 형태로 처리
fun parseIntOrNull(str: String): Int? = try {
    str.toInt()
} catch (e: NumberFormatException) {
    null
}
```

### try-with-resources(`use`)

```kotlin
fun readFile(path: String) {
    BufferedReader(FileReader(path)).use { reader ->
        println(reader.readLine())
    }
}
```

---

## 6. 다양한 함수 표현 방식

함수를 간단히 표현할 수 있다.

```kotlin
// 기본형
fun max(a: Int, b: Int): Int {
    return if (a > b) a else b
}

// 표현식 스타일
fun max2(a: Int, b: Int) = if (a > b) a else b
```

### 기본값(Default Parameters)과 명명된 인자(Named Arguments)

```kotlin
fun namedParameter(str: String, num: Int, flag: Boolean = false) {
    println("$str + $num")
}

fun main() {
    namedParameter(str = "test", num = 1)
}
```
### 참고자료
- [자바 개발자를 위한 코틀린 입문](https://www.inflearn.com/course/java-to-kotlin/dashboard)
- ChatGPT