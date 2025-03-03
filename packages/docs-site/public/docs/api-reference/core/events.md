---
title: 이벤트 시스템
description: Modern Vector.js의 타입 안전한 이벤트 시스템에 관한 API 문서
---

# 이벤트 시스템

Modern Vector.js는 타입 안전성을 보장하는 강력한 이벤트 시스템을 제공합니다. 이 문서에서는 이벤트 시스템의 주요 인터페이스와 구현 방법을 설명합니다.

## 주요 인터페이스

### TypedEventEmitter

`TypedEventEmitter`는 타입 안전한 이벤트 처리를 위한 기본 인터페이스입니다. 제네릭을 통해 이벤트 이름과 데이터 타입을 연결합니다.

```typescript
export interface TypedEventEmitter<T extends EventMap = EventMap> {
  /**
   * 이벤트 리스너 등록
   */
  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void;

  /**
   * 이벤트 리스너 제거
   */
  off<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void;

  /**
   * 이벤트 발생
   */
  emit<K extends keyof T>(event: K, data: T[K]): void;
}
```

### EventMap

`EventMap` 인터페이스는 이벤트 이름과 데이터 타입을 연결하는 매핑을 정의합니다.

```typescript
export interface EventMap {
  [eventType: string]: BaseEventData;
  
  // 노드 관련 이벤트 데이터 타입
  'childAdded': BaseEventData & { child: unknown };
  'childRemoved': BaseEventData & { child: unknown };
  'childrenCleared': BaseEventData & { children: unknown[] };
}
```

### BaseEventData

모든 이벤트 데이터는 `BaseEventData` 인터페이스를 확장해야 합니다.

```typescript
export interface BaseEventData {
  /** 이벤트 타입 */
  readonly type: string;
  /** 이벤트 발생 시간 */
  readonly timestamp: number;
}
```

### EventHandler

이벤트 핸들러는 특정 이벤트 데이터 타입을 처리하는 함수 타입입니다.

```typescript
export type EventHandler<T extends BaseEventData = BaseEventData> = (data: DeepReadonly<T>) => void;
```

## 구현

### BaseEventEmitter

`BaseEventEmitter`는 `TypedEventEmitter` 인터페이스의 기본 구현입니다.

```typescript
class BaseEventEmitter implements TypedEventEmitter {
  private handlers: Map<string, Set<EventHandler>> = new Map();

  on<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    const eventStr = String(event);
    if (!this.handlers.has(eventStr)) {
      this.handlers.set(eventStr, new Set());
    }
    this.handlers.get(eventStr)!.add(handler as EventHandler);
  }

  off<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    const eventStr = String(event);
    const handlers = this.handlers.get(eventStr);
    if (handlers) {
      handlers.delete(handler as EventHandler);
      if (handlers.size === 0) {
        this.handlers.delete(eventStr);
      }
    }
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    const eventStr = String(event);
    const handlers = this.handlers.get(eventStr);
    if (handlers) {
      handlers.forEach(handler => handler(data as BaseEventData));
    }
  }
}
```

### DefaultEventService

`DefaultEventService`는 이벤트 네임스페이스를 지원하는 `EventService` 인터페이스의 구현입니다.

```typescript
export class DefaultEventService extends BaseEventEmitter implements EventService {
  private namespaces: Map<string, TypedEventEmitter> = new Map();

  createNamespace(name: string): TypedEventEmitter {
    if (!this.namespaces.has(name)) {
      this.namespaces.set(name, new BaseEventEmitter());
    }
    return this.namespaces.get(name)!;
  }
}
```

## 이벤트 시스템 확장

### 커스텀 이벤트 맵 정의

특정 컴포넌트나 모듈에 맞는 이벤트 맵을 정의할 수 있습니다.

```typescript
// Shape 컴포넌트용 이벤트 맵 정의
interface ShapeEventMap extends EventMap {
  'move': BaseEventData & { 
    oldPosition: { x: number; y: number }; 
    newPosition: { x: number; y: number }; 
  };
  'resize': BaseEventData & { 
    oldSize: { width: number; height: number }; 
    newSize: { width: number; height: number }; 
  };
  'rotate': BaseEventData & { 
    oldAngle: number; 
    newAngle: number; 
  };
}

// Shape 클래스에서 ShapeEventMap 사용
class Shape implements TypedEventEmitter<ShapeEventMap> {
  // TypedEventEmitter 메서드 구현
  on<K extends keyof ShapeEventMap>(event: K, handler: EventHandler<ShapeEventMap[K]>): void {
    // 구현...
  }

  off<K extends keyof ShapeEventMap>(event: K, handler: EventHandler<ShapeEventMap[K]>): void {
    // 구현...
  }

  emit<K extends keyof ShapeEventMap>(event: K, data: ShapeEventMap[K]): void {
    // 구현...
  }
  
  // Shape 메서드
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
```

### 이벤트 버블링 구현

이벤트 버블링을 구현하여 DOM과 유사한 이벤트 전파를 구현할 수 있습니다.

```typescript
class BubblingEventEmitter implements TypedEventEmitter {
  private handlers: Map<string, Set<EventHandler>> = new Map();
  private parent: BubblingEventEmitter | null = null;
  
  constructor(parent?: BubblingEventEmitter) {
    this.parent = parent || null;
  }

  on<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    // 구현...
  }

  off<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    // 구현...
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    const eventStr = String(event);
    const handlers = this.handlers.get(eventStr);
    if (handlers) {
      handlers.forEach(handler => handler(data as BaseEventData));
    }
    
    // 부모 이미터에 이벤트 버블링
    if (this.parent) {
      this.parent.emit(event, data);
    }
  }
}
```

## 모범 사례

### 1. 타입 안전한 이벤트 맵 정의

컴포넌트나 모듈마다 명확한 이벤트 맵을 정의하세요.

```typescript
interface ButtonEventMap extends EventMap {
  'click': BaseEventData & { x: number; y: number };
  'focus': BaseEventData;
  'blur': BaseEventData;
}
```

### 2. DeepReadonly로 이벤트 데이터 보호

이벤트 핸들러가 이벤트 데이터를 변경하는 것을 방지하기 위해 `DeepReadonly`를 사용하세요.

```typescript
export type EventHandler<T extends BaseEventData = BaseEventData> = (data: DeepReadonly<T>) => void;
```

### 3. 명시적인 이벤트 타입 정의

이벤트 발생 시 타입과 타임스탬프를 명시적으로 포함하세요.

```typescript
button.emit('click', {
  type: 'click',
  timestamp: Date.now(),
  x: 100,
  y: 200
});
```

### 4. 동적 이벤트 이름 처리

동적 이벤트 이름이 필요한 경우에도 타입 안전성을 유지하세요.

```typescript
type DynamicEventName<Prefix extends string> = `${Prefix}:${string}`;

interface DynamicEventMap extends EventMap {
  [key: DynamicEventName<'user'>]: BaseEventData & { userId: string };
  [key: DynamicEventName<'item'>]: BaseEventData & { itemId: string };
}
```

## 관련 API

- [EventService](/docs/api-reference/core/service#eventservice) - 이벤트 서비스 인터페이스
- [SceneNode](/docs/api-reference/core/scene-node) - 이벤트를 발생시키고 처리하는 장면 노드
- [타입 시스템](/docs/core-concepts/type-system) - Modern Vector.js의 타입 시스템 개요 