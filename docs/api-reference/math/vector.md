---
title: Vector
description: 벡터 연산을 위한 클래스 및 함수에 대한 API 문서
---

# Vector

`Vector` 클래스는 2D 및 3D 벡터 연산을 위한 유틸리티를 제공합니다. 이 클래스는 점, 방향, 속도 등을 표현하는 데 사용되며, 벡터 수학 연산을 위한 다양한 메서드를 제공합니다.

## 구문

```typescript
class Vector {
  constructor(x?: number, y?: number, z?: number);
  
  // 속성
  x: number;
  y: number;
  z: number;
  
  // 기본 연산
  set(x: number, y: number, z?: number): this;
  copy(v: Vector): this;
  clone(): Vector;
  
  // 벡터 연산
  add(v: Vector): this;
  addScalar(s: number): this;
  subtract(v: Vector): this;
  subtractScalar(s: number): this;
  multiply(v: Vector): this;
  multiplyScalar(s: number): this;
  divide(v: Vector): this;
  divideScalar(s: number): this;
  
  // 벡터 속성
  length(): number;
  lengthSquared(): number;
  distance(v: Vector): number;
  distanceSquared(v: Vector): number;
  normalize(): this;
  
  // 벡터 변환
  negate(): this;
  inverse(): this;
  
  // 벡터 연산
  dot(v: Vector): number;
  cross(v: Vector): Vector;
  
  // 벡터 변환
  applyMatrix(m: Matrix): this;
  applyQuaternion(q: Quaternion): this;
  
  // 유틸리티
  equals(v: Vector, epsilon?: number): boolean;
  toString(): string;
  toArray(): [number, number, number];
  
  // 정적 메서드
  static add(a: Vector, b: Vector): Vector;
  static subtract(a: Vector, b: Vector): Vector;
  static multiply(a: Vector, b: Vector): Vector;
  static divide(a: Vector, b: Vector): Vector;
  static dot(a: Vector, b: Vector): number;
  static cross(a: Vector, b: Vector): Vector;
}
```

## 생성자

### `constructor(x?: number, y?: number, z?: number)`

새로운 Vector 인스턴스를 생성합니다.

#### 매개변수

- `x` (선택사항): x 좌표. 기본값: 0
- `y` (선택사항): y 좌표. 기본값: 0
- `z` (선택사항): z 좌표. 기본값: 0

## 속성

### `x: number`

벡터의 x 좌표

### `y: number`

벡터의 y 좌표

### `z: number`

벡터의 z 좌표

## 메서드

### 기본 연산

#### `set(x: number, y: number, z?: number): this`

벡터의 좌표를 설정합니다.

- **매개변수**:
  - `x`: 새 x 좌표
  - `y`: 새 y 좌표
  - `z` (선택사항): 새 z 좌표. 기본값: 0
- **반환값**: 메서드 체이닝을 위한 현재 인스턴스

#### `copy(v: Vector): this`

다른 벡터의 좌표를 현재 벡터로 복사합니다.

- **매개변수**: `v` - 복사할 벡터
- **반환값**: 메서드 체이닝을 위한 현재 인스턴스

#### `clone(): Vector`

현재 벡터의 복제본을 생성합니다.

- **반환값**: 새로운 Vector 인스턴스

### 벡터 연산

#### `add(v: Vector): this`

현재 벡터에 다른 벡터를 더합니다.

- **매개변수**: `v` - 더할 벡터
- **반환값**: 메서드 체이닝을 위한 현재 인스턴스

#### `addScalar(s: number): this`

현재 벡터의 모든 좌표에 스칼라 값을 더합니다.

- **매개변수**: `s` - 더할 스칼라 값
- **반환값**: 메서드 체이닝을 위한 현재 인스턴스

#### `subtract(v: Vector): this`

현재 벡터에서 다른 벡터를 뺍니다.

- **매개변수**: `v` - 뺄 벡터
- **반환값**: 메서드 체이닝을 위한 현재 인스턴스

#### `subtractScalar(s: number): this`

현재 벡터의 모든 좌표에서 스칼라 값을 뺍니다.

- **매개변수**: `s` - 뺄 스칼라 값
- **반환값**: 메서드 체이닝을 위한 현재 인스턴스

## 예제

### 기본 사용법

```typescript
import { Vector } from 'modern-vector';

// 벡터 생성
const v1 = new Vector(1, 2, 3);
const v2 = new Vector(4, 5, 6);

// 벡터 연산
const v3 = v1.clone().add(v2);
console.log(v3.toString()); // "Vector(5, 7, 9)"

// 벡터 정규화
const direction = new Vector(3, 4, 0).normalize();
console.log(direction.length()); // 1
console.log(direction.toString()); // "Vector(0.6, 0.8, 0)"

// 벡터 내적
const dotProduct = v1.dot(v2);
console.log(dotProduct); // 32

// 벡터 외적
const crossProduct = v1.clone().cross(v2);
console.log(crossProduct.toString()); // "Vector(-3, 6, -3)"
```

### 벡터 변환

```typescript
import { Vector, Matrix } from 'modern-vector';

// 벡터 생성
const position = new Vector(10, 20, 30);

// 행렬 변환
const transformMatrix = Matrix.createRotationZ(Math.PI / 4); // 45도 회전
position.applyMatrix(transformMatrix);

console.log(position.toString()); // 회전된 위치
```

## 관련 API

- [Matrix](/docs/api-reference/math/matrix) - 행렬 연산
- [Quaternion](/docs/api-reference/math/quaternion) - 쿼터니언 연산
- [Transform](/docs/api-reference/math/transform) - 변환 유틸리티 