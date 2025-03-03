---
title: 브랜딩된 타입
description: Modern Vector.js에서 사용하는 브랜딩된 타입(Branded Types)과 구현 방법
---

# 브랜딩된 타입 (Branded Types)

Modern Vector.js는 타입 안전성을 강화하기 위해 브랜딩된 타입(Branded Types)을 적극 활용합니다. 브랜딩된 타입은 기본 타입(string, number 등)에 고유한 식별자를 추가하여 타입 시스템에서 구분할 수 있게 하는 기법입니다.

## 브랜딩된 타입의 필요성

일반적인 프로그래밍에서 다양한 ID나 식별자를 사용할 때, 모두 string이나 number와 같은 기본 타입을 사용하게 됩니다. 이로 인해 다음과 같은 문제가 발생할 수 있습니다:

```typescript
// 모두 string 타입이라 혼동 가능
function getNode(nodeId: string) { /* ... */ }
function getPlugin(pluginId: string) { /* ... */ }

// 실수로 잘못된 ID 유형을 전달해도 컴파일 타임에 오류가 발생하지 않음
const pluginId = "my-plugin";
getNode(pluginId); // 컴파일 오류 없음, 런타임 오류 가능성
```

브랜딩된 타입을 사용하면 이러한 문제를 해결할 수 있습니다:

```typescript
type NodeID = string & { readonly __brand: 'NodeID' };
type PluginID = string & { readonly __brand: 'PluginID' };

function getNode(nodeId: NodeID) { /* ... */ }
function getPlugin(pluginId: PluginID) { /* ... */ }

const pluginId: PluginID = "my-plugin" as PluginID;
getNode(pluginId); // 컴파일 오류: PluginID 타입은 NodeID에 할당할 수 없음
```

## Modern Vector.js의 브랜딩된 타입

### NodeID

`NodeID`는 장면 그래프의 노드를 식별하는 브랜딩된 타입입니다.

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

`unique symbol`을 사용하면 브랜드가 전역적으로 고유하며, 다른 브랜드와 충돌하지 않음을 보장합니다.

### PluginID

`PluginID`는 플러그인 시스템에서 각 플러그인을 식별하는 브랜딩된 타입입니다.

```typescript
/**
 * 플러그인의 고유 식별자
 */
export type PluginID = string & { readonly __brand: unique symbol };

// 브랜딩된 PluginID 생성 함수
export function createPluginID(id?: string): PluginID {
  return (id ?? generateUUID()) as PluginID;
}
```

### ServiceID

`ServiceID`는 서비스를 식별하는 브랜딩된 타입입니다.

```typescript
/**
 * 서비스의 고유 식별자
 */
export type ServiceID = string & { readonly __brand: unique symbol };

// 브랜딩된 ServiceID 생성 함수
export function createServiceID(id?: string): ServiceID {
  return (id ?? generateUUID()) as ServiceID;
}
```

### EngineID

`EngineID`는 벡터 엔진 인스턴스를 식별하는 브랜딩된 타입입니다.

```typescript
/**
 * 벡터 엔진 인스턴스의 고유 식별자
 */
export type EngineID = string & { readonly __brand: unique symbol };

// 브랜딩된 EngineID 생성 함수
export function createEngineID(id?: string): EngineID {
  return (id ?? generateUUID()) as EngineID;
}
```

## 브랜딩된 타입 구현 방법

### 1. 인터섹션 타입을 사용한 브랜딩

```typescript
// 기본적인 브랜딩된 타입 정의
type BrandedType<B> = string & { readonly __brand: B };

// 구체적인 브랜딩된 타입 정의
type UserID = BrandedType<'UserID'>;
type PostID = BrandedType<'PostID'>;
```

### 2. 브랜딩된 타입 생성 함수

브랜딩된 타입의 값을 생성하기 위한 팩토리 함수를 제공합니다:

```typescript
function createUserID(id?: string): UserID {
  return (id ?? generateID()) as UserID;
}

function createPostID(id?: string): PostID {
  return (id ?? generateID()) as PostID;
}
```

### 3. 타입 가드 함수

브랜딩된 타입인지 확인하는 타입 가드 함수를 제공할 수 있습니다:

```typescript
function isNodeID(id: unknown): id is NodeID {
  // 런타임에는 브랜딩된 타입은 일반 string과 동일하므로
  // 필요에 따라 검증 로직을 구현할 수 있습니다.
  // 예: 특정 형식이나 패턴을 확인
  return typeof id === 'string' && /^node-[\w-]+$/.test(id);
}
```

## 브랜딩된 타입의 활용

### 1. API 설계

브랜딩된 타입을 API 설계에 활용하여 타입 안전성을 높입니다:

```typescript
interface SceneGraph {
  // NodeID 타입만 허용하므로 타입 안전성 보장
  getNode(id: NodeID): SceneNode | undefined;
  
  // 일반 문자열이 아닌 브랜딩된 타입을 반환
  createNode(): [NodeID, SceneNode];
}
```

### 2. 패턴 매칭과 함께 사용

```typescript
type ID = UserID | PostID | CommentID;

function processID(id: ID) {
  if (isUserID(id)) {
    // UserID로 처리
  } else if (isPostID(id)) {
    // PostID로 처리
  } else {
    // CommentID로 처리
  }
}
```

### 3. 맵과 레지스트리

브랜딩된 타입을 맵이나 레지스트리의 키로 사용할 수 있습니다:

```typescript
// NodeID만 키로 사용할 수 있도록 타입 제한
const nodeRegistry = new Map<NodeID, SceneNode>();

function registerNode(node: SceneNode): NodeID {
  const id = createNodeID();
  nodeRegistry.set(id, node);
  return id;
}

function getNode(id: NodeID): SceneNode | undefined {
  return nodeRegistry.get(id);
}
```

## 번호 기반 브랜딩된 타입

string 뿐만 아니라 number 타입에도 브랜딩을 적용할 수 있습니다:

```typescript
/**
 * 타임스탬프를 위한 브랜딩된 number 타입
 */
export type Timestamp = number & { readonly __brand: unique symbol };

// 브랜딩된 Timestamp 생성 함수
export function createTimestamp(): Timestamp {
  return Date.now() as Timestamp;
}

/**
 * 픽셀 단위를 위한 브랜딩된 number 타입
 */
export type Pixels = number & { readonly __brand: unique symbol };

// 브랜딩된 Pixels 생성 함수
export function px(value: number): Pixels {
  return value as Pixels;
}
```

이를 활용하여 단위 오류를 방지할 수 있습니다:

```typescript
function setWidth(width: Pixels) { /* ... */ }

// 오류: number 타입을 Pixels에 할당할 수 없음
setWidth(100); 

// 정상: 브랜딩된 Pixels 타입 사용
setWidth(px(100));
```

## 제네릭 브랜딩된 타입

제네릭을 활용하여 더 유연한 브랜딩된 타입을 만들 수 있습니다:

```typescript
/**
 * 제네릭 브랜딩된 타입 유틸리티
 */
export type Branded<T, B> = T & { readonly __brand: B };

// ID 브랜딩을 위한 기본 타입
export type ID<Domain extends string> = Branded<string, Domain>;

// 구체적인 도메인별 ID 타입
export type UserID = ID<'User'>;
export type ArticleID = ID<'Article'>;
export type CommentID = ID<'Comment'>;

// 브랜딩된 ID 생성 함수
export function createID<Domain extends string>(domain: Domain, value?: string): ID<Domain> {
  return (value ?? `${domain.toLowerCase()}-${generateUUID()}`) as ID<Domain>;
}

// 사용 예시
const userId = createID('User');
const articleId = createID('Article');
```

## 모범 사례

### 1. as 사용 최소화

브랜딩된 타입을 생성할 때 `as` 타입 어서션을 사용해야 하지만, 이를 팩토리 함수 내부로 한정하여 사용합니다:

```typescript
// 좋은 예: 팩토리 함수를 통해 브랜딩된 타입 생성
const nodeId = createNodeID();

// 나쁜 예: 직접 타입 어서션 사용
const nodeId = "some-id" as NodeID; // 안전하지 않음
```

### 2. 타입 가드 활용

필요한 경우 브랜딩된 타입을 검증하는 타입 가드를 활용합니다:

```typescript
function processNode(id: unknown) {
  if (isNodeID(id)) {
    // id는 NodeID 타입으로 처리됨
    const node = getNode(id);
    // ...
  } else {
    throw new Error('Invalid node ID');
  }
}
```

### 3. 의미있는 기본값 제공

브랜딩된 타입 생성 시 의미있는 기본값을 제공합니다:

```typescript
export function createNodeID(id?: string): NodeID {
  return (id ?? `node-${generateUUID()}`) as NodeID;
}
```

## 관련 API

- [타입 안전성](/docs/core-concepts/type-safety) - Modern Vector.js의 타입 안전성 개요
- [SceneNode](/docs/api-reference/core/scene-node) - NodeID를 사용하는 장면 노드
- [Plugin System](/docs/core-concepts/plugin-system) - PluginID를 사용하는 플러그인 시스템 