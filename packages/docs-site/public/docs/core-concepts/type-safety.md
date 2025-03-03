---
title: 타입 안전성
description: Modern Vector.js의 타입 안전성 개선 및 모범 사례
---

# 타입 안전성

Modern Vector.js는 TypeScript를 활용하여 높은 수준의 타입 안전성을 제공합니다. 이 문서에서는 프레임워크에서 사용하는 주요 타입 안전성 기법과 모범 사례를 설명합니다.

## 브랜딩된 타입 (Branded Types)

브랜딩된 타입은 기본 타입(예: string, number)에 구체적인 의미론적 타입 정보를 추가하여 타입 안전성을 크게 향상시킵니다.

### NodeID

`NodeID`는 장면 그래프의 노드를 식별하는 브랜딩된 문자열 타입입니다.

```typescript
/**
 * 장면 그래프 노드의 고유 식별자
 */
export type NodeID = string & { readonly __brand: unique symbol };

// 브랜딩된 NodeID 생성 함수
export function createNodeID(id?: string): NodeID {
  return (id ?? generateUUID()) as NodeID;
}
```

브랜딩된 타입을 사용하면 일반 문자열과 `NodeID`를 구분할 수 있어, 다음과 같은 오류를 방지할 수 있습니다:

```typescript
function getNodeById(id: NodeID): SceneNode | undefined {
  // 구현...
}

// 오류: string 타입은 NodeID에 할당할 수 없습니다
getNodeById("some-string"); 

// 올바른 사용
const id = createNodeID();
getNodeById(id); // 정상
```

### 기타 브랜딩된 타입

브랜딩된 타입 패턴은 다양한 식별자에 적용할 수 있습니다:

```typescript
// 플러그인 식별자
export type PluginID = string & { readonly __brand: unique symbol };

// 서비스 식별자
export type ServiceID = string & { readonly __brand: unique symbol };

// 벡터 엔진 인스턴스 식별자
export type EngineID = string & { readonly __brand: unique symbol };
```

## 타입 안전한 이벤트 시스템

Modern Vector.js의 이벤트 시스템은 제네릭을 사용하여 이벤트 이름과 해당 이벤트 데이터 간의 관계를 명확하게 정의합니다.

### TypedEventEmitter

`TypedEventEmitter` 인터페이스는 이벤트 이름과 데이터 타입을 연결하는 제네릭 인터페이스입니다:

```typescript
export interface TypedEventEmitter<T extends EventMap = EventMap> {
  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void;
  off<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void;
  emit<K extends keyof T>(event: K, data: T[K]): void;
}

export interface EventMap {
  [eventType: string]: BaseEventData;
  
  // 기본 이벤트 타입
  'childAdded': BaseEventData & { child: unknown };
  'childRemoved': BaseEventData & { child: unknown };
}
```

이 접근 방식의 이점:

1. **컴파일 시간 검사**: 이벤트 이름과 해당 데이터 타입이 일치하지 않으면 컴파일 오류가 발생합니다.
2. **자동 완성**: IDE에서 이벤트 이름 및 데이터 구조에 대한 자동 완성을 제공합니다.
3. **리팩토링 안전성**: 이벤트 데이터 구조가 변경되면 해당 이벤트를 사용하는 모든 위치에서 컴파일 오류가 발생합니다.

### 타입 안전한 이벤트 사용 예

```typescript
// Shape 컴포넌트용 타입 안전한 이벤트 맵
interface ShapeEventMap extends EventMap {
  'move': BaseEventData & { 
    oldPosition: { x: number; y: number }; 
    newPosition: { x: number; y: number }; 
  };
}

class Shape implements TypedEventEmitter<ShapeEventMap> {
  // TypedEventEmitter 메서드 구현...
  
  move(x: number, y: number): void {
    const oldPosition = { x: this.x, y: this.y };
    this.x = x;
    this.y = y;
    
    // 타입 안전한 이벤트 발생
    this.emit('move', {
      type: 'move',
      timestamp: Date.now(),
      oldPosition,
      newPosition: { x, y }
    });
  }
}

// 이벤트 핸들러 등록
const shape = new Shape();
shape.on('move', (data) => {
  // data.oldPosition과 data.newPosition에 타입 자동 완성 제공
  console.log(`Moved from (${data.oldPosition.x}, ${data.oldPosition.y}) to (${data.newPosition.x}, ${data.newPosition.y})`);
});
```

## DeepReadonly를 통한 불변성 보장

이벤트 데이터나 API 응답과 같은 데이터 구조의 불변성을 보장하기 위해 `DeepReadonly` 타입을 사용합니다.

```typescript
/**
 * 객체의 모든 속성과 중첩 속성을 readonly로 만드는 타입
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// 이벤트 핸들러에서 DeepReadonly 사용
export type EventHandler<T extends BaseEventData = BaseEventData> = (data: DeepReadonly<T>) => void;
```

이 접근 방식은 이벤트 핸들러가 이벤트 데이터를 실수로 변경하는 것을 방지합니다.

## any 타입 제거

`any` 타입은 TypeScript의 타입 검사를 무효화하므로 가능한 한 사용을 피합니다. Modern Vector.js에서는 다음과 같은 대안을 사용합니다:

### unknown 타입 사용

`any` 대신 `unknown` 타입을 사용하여 타입 안전성을 유지하면서 동적 데이터를 처리합니다:

```typescript
// 안전하지 않은 방식
function processData(data: any) {
  return data.value; // 런타임 오류 가능성
}

// 타입 안전한 방식
function processData(data: unknown) {
  if (isDataWithValue(data)) {
    return data.value; // 타입 가드 후 안전한 접근
  }
  throw new Error('Invalid data format');
}

// 타입 가드 함수
function isDataWithValue(data: unknown): data is { value: unknown } {
  return typeof data === 'object' && data !== null && 'value' in data;
}
```

### 제네릭 타입 사용

`any` 대신 제네릭 타입을 사용하여 타입 안전성을 유지하면서 유연성을 제공합니다:

```typescript
// any 사용 (피해야 함)
function getProperty(obj: any, key: string): any {
  return obj[key];
}

// 제네릭 사용 (권장)
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

## 고급 타입 기법

### 조건부 타입

조건부 타입을 사용하여 입력 타입에 따라 다른 타입을 반환합니다:

```typescript
type IsString<T> = T extends string ? true : false;

// 사용 예
type CheckString = IsString<'hello'>; // true
type CheckNumber = IsString<123>; // false
```

### 매핑된 타입

매핑된 타입을 사용하여 기존 타입에서 새로운 타입을 생성합니다:

```typescript
// 모든 속성을 선택적으로 만드는 타입
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// 모든 속성을 필수로 만드는 타입
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// 읽기 전용 타입
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

## 모범 사례

### 1. 인덱스 시그니처 제한

인덱스 시그니처(`{ [key: string]: any }`)는 타입 안전성을 약화시킬 수 있으므로 가능한 한 구체적인 타입을 사용합니다:

```typescript
// 피해야 할 방식
interface Config {
  [key: string]: any;
}

// 권장하는 방식
interface Config {
  apiKey?: string;
  endpoint?: string;
  timeout?: number;
  // 필요한 속성만 명시적으로 정의
}
```

### 2. 타입 가드 사용

타입 가드를 사용하여 런타임에 타입을 확인합니다:

```typescript
function isShape(node: unknown): node is Shape {
  return (
    typeof node === 'object' &&
    node !== null &&
    'width' in node &&
    'height' in node
  );
}

function processNode(node: unknown) {
  if (isShape(node)) {
    // 여기서 node는 Shape 타입으로 처리됨
    console.log(node.width, node.height);
  }
}
```

### 3. 타입 어서션 최소화

타입 어서션(`as` 연산자)은 타입 안전성을 우회하므로 최소한으로 사용합니다:

```typescript
// 피해야 할 방식
const node = someValue as Shape;

// 권장하는 방식
if (isShape(someValue)) {
  const node = someValue; // 자동으로 Shape 타입으로 추론됨
  // node 사용...
}
```

### 4. 엄격한 null 검사 사용

`strictNullChecks` 컴파일러 옵션을 활성화하고, null/undefined 값을 명시적으로 처리합니다:

```typescript
function getNodeName(node: SceneNode | null): string {
  if (node === null) {
    return 'No node selected';
  }
  return node.name;
}
```

## 관련 API

- [이벤트 시스템](/docs/api-reference/core/events) - 타입 안전한 이벤트 시스템
- [SceneNode](/docs/api-reference/core/scene-node) - 브랜딩된 타입을 사용하는 장면 노드
- [Plugin System](/docs/core-concepts/plugin-system) - 타입 안전한 플러그인 시스템 