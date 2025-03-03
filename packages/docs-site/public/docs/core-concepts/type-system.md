---
title: 타입 시스템
description: Modern Vector.js의 타입 시스템과 타입 안전성 기능에 대한 설명
---

# 타입 시스템

Modern Vector.js는 TypeScript의 강력한 타입 시스템을 활용하여 최대한의 타입 안전성을 보장합니다. 이를 통해 개발자는 더 안전하고 확장 가능한 코드를 작성할 수 있습니다.

## 개요

Modern Vector.js의 타입 시스템은 다음과 같은 핵심 기능을 제공합니다:

1. **타입 안전한 이벤트 시스템**: 이벤트 이름과 데이터의 타입 안전성을 보장합니다.
2. **브랜딩된 타입**: 문자열 ID에 타입 안전성을 제공합니다.
3. **제네릭 인터페이스**: 다양한 사용 사례에 맞게 확장 가능한 타입 정의를 제공합니다.
4. **유틸리티 타입**: 복잡한 타입 변환을 위한 유틸리티 타입을 제공합니다.
5. **any 타입 회피**: 가능한 모든 곳에서 `any` 타입 대신 구체적인 타입이나 `unknown` 타입을 사용합니다.

## 타입 안전한 이벤트 시스템

Modern Vector.js는 이벤트 이름과 데이터 모두에 타입 안전성을 제공하는 이벤트 시스템을 구현했습니다.

### TypedEventEmitter

`TypedEventEmitter` 인터페이스는 이벤트 이름과 데이터 타입을 연결하여 타입 안전성을 보장합니다:

```typescript
// 이벤트 맵 정의
interface MyEventMap extends EventMap {
  'click': BaseEventData & { x: number; y: number };
  'resize': BaseEventData & { width: number; height: number };
}

// TypedEventEmitter 사용
class MyComponent implements TypedEventEmitter<MyEventMap> {
  // 이벤트 핸들러 등록 - 이벤트 이름과 핸들러 타입이 자동으로 체크됨
  on<K extends keyof MyEventMap>(event: K, handler: EventHandler<MyEventMap[K]>): void {
    // 구현...
  }

  // 이벤트 발생 - 이벤트 이름과 데이터 타입이 자동으로 체크됨
  emit<K extends keyof MyEventMap>(event: K, data: MyEventMap[K]): void {
    // 구현...
  }

  // 이벤트 핸들러 제거
  off<K extends keyof MyEventMap>(event: K, handler: EventHandler<MyEventMap[K]>): void {
    // 구현...
  }
}

// 사용 예시
const component = new MyComponent();

// ✅ 올바른 사용
component.on('click', (data) => {
  console.log(`Clicked at (${data.x}, ${data.y})`);
});

// ❌ 타입 오류 - 'drag' 이벤트는 MyEventMap에 정의되지 않음
component.on('drag', (data) => { ... });

// ❌ 타입 오류 - 'resize' 이벤트의 데이터는 x, y 속성이 없음
component.on('resize', (data) => {
  console.log(`Clicked at (${data.x}, ${data.y})`);
});
```

### 이벤트 데이터 타입 안전성

모든 이벤트 데이터는 기본적으로 `BaseEventData`를 확장해야 합니다:

```typescript
// 기본 이벤트 데이터 인터페이스
interface BaseEventData {
  readonly type: string;     // 이벤트 타입
  readonly timestamp: number; // 이벤트 발생 시간
}

// 커스텀 이벤트 데이터
interface ClickEventData extends BaseEventData {
  readonly x: number;
  readonly y: number;
}
```

## 브랜딩된 타입

문자열 기반 ID에 타입 안전성을 제공하기 위해 브랜딩된 타입을 사용합니다:

```typescript
// ID 브랜딩을 위한 유틸리티 타입
type ID<T extends string> = string & { __brand: T };

// 특정 엔티티에 대한 ID 타입 정의
type NodeID = ID<'Node'>;
type GroupID = ID<'Group'>;

// 함수 매개변수로 사용
function findNode(id: NodeID): Node | null {
  // 구현...
}

// 사용 예시
const nodeId = "node-1" as NodeID;
const groupId = "group-1" as GroupID;

findNode(nodeId);  // ✅ 올바른 사용
findNode(groupId); // ❌ 타입 오류 - GroupID는 NodeID에 할당할 수 없음
findNode("random-string"); // ❌ 타입 오류 - 문자열은 NodeID에 할당할 수 없음
```

## 제네릭 인터페이스

Modern Vector.js는 확장성을 위해 다양한 제네릭 인터페이스를 제공합니다:

### 플러그인 확장

```typescript
// 플러그인 확장 인터페이스
export type PluginWithManipulators<T extends Plugin> = T & {
  readonly plugin: T;
};

// 플러그인 설치 옵션
export interface PluginInstallOptions<
  T extends TypedRecord<string, unknown> = TypedRecord<string, unknown>,
> {
  readonly config?: DeepPartial<T>;
  readonly options?: PluginOptions;
}
```

### 예제 기능

```typescript
// 예제 실행 옵션 인터페이스
export interface ExampleOptions<
  T extends TypedRecord<string, unknown> = TypedRecord<string, unknown>,
> {
  readonly id: string;
  readonly name: string;
  readonly params?: T;
}

// 예제 실행 결과 인터페이스
export interface ExampleResult<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
}

// 사용 예시
interface CircleParams {
  radius: number;
  color: string;
}

const result = engine.executeExample<SVGElement>({
  id: 'create-circle',
  name: 'Create Circle Example',
  params: {
    radius: 50,
    color: 'red'
  } as CircleParams
});

if (result.success && result.data) {
  document.body.appendChild(result.data);
}
```

## 유틸리티 타입

복잡한 타입 변환을 위한 다양한 유틸리티 타입을 제공합니다:

```typescript
// 깊이 재귀적인 Readonly 타입
type DeepReadonly<T> = /* 구현 생략 */;

// 모든 속성을 옵셔널로 만드는 깊은 버전의 Partial
type DeepPartial<T> = /* 구현 생략 */;

// 객체의 모든 값에 접근하기 위한 유틸리티 타입
type ValueOf<T> = T[keyof T];

// 타입 안전한 Record
type TypedRecord<K extends string | number | symbol, T> = Record<K, T>;
```

## 서비스 구현에서의 타입 안전성

서비스 구현에서도 타입 안전성을 보장합니다:

```typescript
// 이벤트 서비스 구현
class DefaultEventService extends BaseEventEmitter implements EventService {
  private namespaces: Map<string, TypedEventEmitter> = new Map();

  createNamespace(name: string): TypedEventEmitter {
    if (!this.namespaces.has(name)) {
      this.namespaces.set(name, new BaseEventEmitter());
    }
    return this.namespaces.get(name)!;
  }
}

// 장면 노드 구현
class DefaultSceneNode implements SceneNode {
  readonly id: NodeID;
  parent: SceneNode | null = null;
  private _children: SceneNode[] = [];
  data: Record<string, unknown> = {};
  private eventEmitter: TypedEventEmitter;

  // 생성자에서 문자열 ID를 NodeID로 변환
  constructor(
    idStr: string = `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    eventEmitter: TypedEventEmitter
  ) {
    this.id = idStr as NodeID;
    this.eventEmitter = eventEmitter;
  }

  // 타입 안전한 이벤트 메서드
  on<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    this.eventEmitter.on(event, handler);
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    this.eventEmitter.emit(event, data);
  }
}
```

## any 타입 대신 unknown 사용

가능한 모든 곳에서 `any` 타입 대신 `unknown` 타입을 사용하여 타입 안전성을 높였습니다:

```typescript
// ❌ any 사용 - 타입 안전성 없음
export type ExtensionMethod<T extends (...args: any[]) => any> = T;

// ✅ unknown 사용 - 타입 안전성 확보
export type ExtensionMethod<T extends (...args: unknown[]) => unknown> = T;

// 플러그인 확장 타입
export type PluginExtension = {
  [key: string]: ExtensionMethod<(...args: unknown[]) => unknown>;
};
```

## 모범 사례

1. **명시적 타입 선언**: 가능하면 `any` 타입을 피하고 명시적인 타입을 선언하세요.

2. **브랜딩된 타입 활용**: 문자열 ID나 다른 기본 타입에 의미를 부여하기 위해 브랜딩된 타입을 활용하세요.

3. **제네릭 인터페이스 설계**: 재사용 가능하고 확장 가능한 타입을 위해 제네릭 인터페이스를 설계하세요.

4. **이벤트 타입 안전성**: 이벤트 이름과 데이터 타입을 연결하여 타입 안전성을 확보하세요.

5. **DeepReadonly 활용**: 불변성이 필요한 데이터 구조에 `DeepReadonly`를 활용하세요.

## 관련 API

- [TypedEventEmitter](/docs/api-reference/core/events) - 타입 안전한 이벤트 이미터 인터페이스
- [VectorEngine](/docs/api-reference/core/vector-engine) - 핵심 엔진 인터페이스
- [SceneNode](/docs/api-reference/core/scene-node) - 장면 노드 인터페이스 