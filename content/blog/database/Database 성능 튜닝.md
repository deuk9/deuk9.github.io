---
title: MySQL 인덱스 및 실행계획(EXPLAIN) 정리 총정리
tags:
  - database
  - mysql
date: 2025-04-05
description: MySQL 인덱스 및 실행계획(EXPLAIN) 정리 총정리
sitemap:
  lastmod: 2025-04-10
---
박재성님의  데이터베이스 튜닝 인프런 강의를 듣고 간단히 정리해 보았다.


## 🧠 인덱스란?

> 데이터를 빠르게 찾기 위한 자료구조. 특정 컬럼을 기준으로 정렬된 별도 자료구조(B-Tree 등)를 유지하여 성능을 향상시킴.

```sql

-- 인덱스 생성
CREATE INDEX idx_age ON users(age);

-- 인덱스 조회
SHOW INDEX FROM users;
```

---

## 🔐 기본키(Primary Key)와 인덱스

- PK는 테이블의 각 행을 **고유하게 식별**
- 자동으로 **클러스터링 인덱스**가 생성됨 (데이터 자체가 PK 기준으로 정렬됨)
- 테이블당 **하나만 존재 가능**

---

## 🧷 Unique 제약조건

- 중복 ❌
- 인덱스 자동 생성 → **조회 성능 향상**

---

## 🧩 멀티 컬럼 인덱스

```sql
CREATE INDEX idx_name_age ON users(name, age);
```

- 여러 컬럼으로 인덱스 생성 가능
- **중복도 낮은 컬럼을 앞에 배치**

---

## 🎯 커버링 인덱스

-  쿼리에 필요한 모든 컬럼이 인덱스에 포함되어 있으면 테이블 접근 없이 인덱스만으로 조회 가능 (빠름)

---

## ⚠️ 인덱스가 동작하지 않는 경우

- 인덱스 컬럼에 **함수나 연산 가공** (`SUBSTRING`, `+`, `DATE()` 등)
- `LIKE '%abc'` (접두사 없음)
- 너무 넓은 범위 조회 시 옵티마이저가 **풀 테이블 스캔**을 선택

---

## 🔍 EXPLAIN 실행계획

```sql

EXPLAIN SELECT * FROM users WHERE age = 30;
EXPLAIN ANALYZE SELECT * FROM users WHERE age = 30; #좀 더 자세함
```

### 주요 항목

| 항목              | 설명                             |
| --------------- | ------------------------------ |
| `id`            | 실행 순서                          |
| `select_type`   | 쿼리 유형                          |
| `table`         | 대상 테이블                         |
| `type`          | ✅ 데이터 접근 방식 (성능 핵심)            |
| `possible_keys` | 사용할 수 있는 인덱스                   |
| `key`           | 실제 사용된 인덱스                     |
| `rows`          | ✅ 예측 row 수 (낮을수록 좋음)           |
| `Extra`         | `Using where`, `Using index` 등 |

---

### `type` 성능 순서

|type|설명|성능|
|---|---|---|
|`const`|고유 인덱스 또는 PK로 1건 조회|🟢 매우 좋음|
|`ref`|비고유 인덱스 사용|🟢 좋음|
|`range`|범위 조건 사용 (IN, BETWEEN 등)|🟡 중간|
|`index`|인덱스 전체 스캔|🟠 느림|
|`ALL`|전체 테이블 스캔|🔴 매우 느림|

---

## 🚀 성능 튜닝 핵심 요약

- ✅ `WHERE`, `IN`, `BETWEEN`, `LIKE 'abc%'` 등 조건절 컬럼에는 인덱스를 설정하자
- ❌ `LIKE '%abc'` 또는 **가공된 컬럼**(함수, 연산)은 인덱스를 사용할 수 없다
- ⚠️ `ORDER BY`는 **정렬 비용이 크므로**, 가능하면 인덱스를 활용한 정렬을 유도하자
- ✅ `LIMIT`을 함께 사용하면 옵티마이저가 인덱스를 더 적극적으로 활용한다
- ✅ `HAVING`보다 가능한 경우 `WHERE`를 우선 사용하자 (집계 전에 필터링)
- ⚠️ 멀티 컬럼 인덱스는 **순서가 중요**하며, 불필요하게 남발하지 않는다
- ✅ **커버링 인덱스**를 활용하면 테이블 접근 없이 인덱스만으로 조회가 가능하다 → 가장 빠른 방식
- ✅ **EXPLAIN 실행계획**으로 `type`, `key`, `rows`를 체크하는 습관을 들이자
- ⚠️ `LIMIT 없이 대량 조회` 시 옵티마이저가 인덱스를 무시하고 **풀 테이블 스캔**할 수 있다

---


### 참고자료
- [비전공자도 이해할 수 있는 MySQL 성능 최적화 입문/실전 (SQL 튜닝편)](https://www.inflearn.com/course/%EB%B9%84%EC%A0%84%EA%B3%B5%EC%9E%90-mysql-%EC%84%B1%EB%8A%A5%EC%B5%9C%EC%A0%95%ED%99%95-sql%ED%8A%9C%EB%8B%9D/dashboard)

