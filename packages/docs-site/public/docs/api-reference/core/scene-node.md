---
title: SceneNode
description: Modern Vector.js의 장면 그래프를 구성하는 노드 API
---

# SceneNode

SceneNode는 Modern Vector.js의 장면 그래프를 구성하는 기본 요소입니다. 모든 시각적 요소와 그룹은 SceneNode를 확장하여 구현됩니다.

## 주요 특징

- **고유한 식별자**: 각 노드는 타입 안전한 `NodeID`를 가집니다.
- **계층적 구조**: 부모-자식 관계를 통해 장면 그래프를 구성합니다.
- **타입 안전한 이벤트**: `TypedEventEmitter`를 통해 타입 안전한 이벤트를 지원합니다.
- **속성 관리**: 위치, 회전, 스케일 등의 속성을 관리합니다.

## API 레퍼런스

### SceneNodeInterface

```typescript
/**
 * 장면 그래프의 노드를 위한 인터페이스
 */
export interface SceneNodeInterface<T extends EventMap = SceneNodeEventMap> extends TypedEventEmitter<T> {
  /** 노드의 고유 식별자 */
  readonly id: NodeID;
  
  /** 노드의 이름 */
  name: string;
  
  /** 노드의 부모 */
  parent: SceneNodeInterface | null;
  
  /** 노드의 자식 노드 배열 */
  readonly children: readonly SceneNodeInterface[];
  
  /** 노드의 활성화 상태 */
  enabled: boolean;
  
  /** 노드의 가시성 */
  visible: boolean;
  
  /**
   * 자식 노드 추가
   */
  addChild(child: SceneNodeInterface): void;
  
  /**
   * 자식 노드 제거
   */
  removeChild(child: SceneNodeInterface): void;
  
  /**
   * 모든 자식 노드 제거
   */
  clearChildren(): void;
  
  /**
   * 자식 노드 찾기
   */
  findChild(predicate: (child: SceneNodeInterface) => boolean): SceneNodeInterface | undefined;
  
  /**
   * 노드 업데이트
   * @param deltaTime 이전 프레임과의 시간 차이(ms)
   */
  update(deltaTime: number): void;
}
```

### SceneNodeEventMap

SceneNode에서 발생하는 이벤트의 타입 맵입니다:

```typescript
/**
 * SceneNode의 이벤트 맵
 */
export interface SceneNodeEventMap extends EventMap {
  'childAdded': BaseEventData & { 
    /** 추가된 자식 노드 */
    child: SceneNodeInterface 
  };
  
  'childRemoved': BaseEventData & { 
    /** 제거된 자식 노드 */
    child: SceneNodeInterface 
  };
  
  'childrenCleared': BaseEventData & { 
    /** 제거된 모든 자식 노드 */
    children: readonly SceneNodeInterface[] 
  };
  
  'enabledChanged': BaseEventData & { 
    /** 이전 활성화 상태 */
    oldValue: boolean;
    /** 새 활성화 상태 */
    newValue: boolean;
  };
  
  'visibilityChanged': BaseEventData & { 
    /** 이전 가시성 상태 */
    oldValue: boolean;
    /** 새 가시성 상태 */
    newValue: boolean;
  };
  
  'parentChanged': BaseEventData & { 
    /** 이전 부모 노드 */
    oldParent: SceneNodeInterface | null;
    /** 새 부모 노드 */
    newParent: SceneNodeInterface | null;
  };
  
  'nameChanged': BaseEventData & { 
    /** 이전 이름 */
    oldName: string;
    /** 새 이름 */
    newName: string;
  };
}
```

### SceneNode 구현

기본적인 SceneNode 구현은 다음과 같습니다:

```typescript
/**
 * 장면 그래프 노드의 기본 구현
 */
export class SceneNode implements SceneNodeInterface {
  /** 노드의 고유 식별자 */
  readonly id: NodeID;
  
  /** 이벤트 핸들러 맵 */
  private handlers: Map<string, Set<EventHandler>> = new Map();
  
  /** 자식 노드 배열 */
  private _children: SceneNodeInterface[] = [];
  
  /** 부모 노드 */
  private _parent: SceneNodeInterface | null = null;
  
  /** 노드 이름 */
  private _name: string;
  
  /** 노드 활성화 상태 */
  private _enabled: boolean = true;
  
  /** 노드 가시성 */
  private _visible: boolean = true;
  
  /**
   * SceneNode 생성자
   */
  constructor(options: {
    id?: NodeID;
    name?: string;
  } = {}) {
    this.id = options.id ?? createNodeID();
    this._name = options.name ?? `Node_${this.id}`;
  }
  
  // 이벤트 관련 메서드 구현
  on<K extends keyof SceneNodeEventMap>(
    event: K, 
    handler: EventHandler<SceneNodeEventMap[K]>
  ): void {
    const eventStr = String(event);
    if (!this.handlers.has(eventStr)) {
      this.handlers.set(eventStr, new Set());
    }
    this.handlers.get(eventStr)!.add(handler as EventHandler);
  }
  
  off<K extends keyof SceneNodeEventMap>(
    event: K, 
    handler: EventHandler<SceneNodeEventMap[K]>
  ): void {
    const eventStr = String(event);
    const handlers = this.handlers.get(eventStr);
    if (handlers) {
      handlers.delete(handler as EventHandler);
      if (handlers.size === 0) {
        this.handlers.delete(eventStr);
      }
    }
  }
  
  emit<K extends keyof SceneNodeEventMap>(
    event: K, 
    data: SceneNodeEventMap[K]
  ): void {
    const eventStr = String(event);
    const handlers = this.handlers.get(eventStr);
    if (handlers) {
      handlers.forEach(handler => handler(data as BaseEventData));
    }
  }
  
  // 속성 접근자
  get name(): string {
    return this._name;
  }
  
  set name(value: string) {
    if (this._name !== value) {
      const oldName = this._name;
      this._name = value;
      this.emit('nameChanged', {
        type: 'nameChanged',
        timestamp: Date.now(),
        oldName,
        newName: value
      });
    }
  }
  
  get parent(): SceneNodeInterface | null {
    return this._parent;
  }
  
  set parent(value: SceneNodeInterface | null) {
    if (this._parent !== value) {
      const oldParent = this._parent;
      this._parent = value;
      this.emit('parentChanged', {
        type: 'parentChanged',
        timestamp: Date.now(),
        oldParent,
        newParent: value
      });
    }
  }
  
  get children(): readonly SceneNodeInterface[] {
    return Object.freeze([...this._children]);
  }
  
  get enabled(): boolean {
    return this._enabled;
  }
  
  set enabled(value: boolean) {
    if (this._enabled !== value) {
      const oldValue = this._enabled;
      this._enabled = value;
      this.emit('enabledChanged', {
        type: 'enabledChanged',
        timestamp: Date.now(),
        oldValue,
        newValue: value
      });
    }
  }
  
  get visible(): boolean {
    return this._visible;
  }
  
  set visible(value: boolean) {
    if (this._visible !== value) {
      const oldValue = this._visible;
      this._visible = value;
      this.emit('visibilityChanged', {
        type: 'visibilityChanged',
        timestamp: Date.now(),
        oldValue,
        newValue: value
      });
    }
  }
  
  // 자식 노드 관리 메서드
  addChild(child: SceneNodeInterface): void {
    if (child.parent) {
      child.parent.removeChild(child);
    }
    
    this._children.push(child);
    child.parent = this;
    
    this.emit('childAdded', {
      type: 'childAdded',
      timestamp: Date.now(),
      child
    });
  }
  
  removeChild(child: SceneNodeInterface): void {
    const index = this._children.indexOf(child);
    if (index >= 0) {
      this._children.splice(index, 1);
      child.parent = null;
      
      this.emit('childRemoved', {
        type: 'childRemoved',
        timestamp: Date.now(),
        child
      });
    }
  }
  
  clearChildren(): void {
    if (this._children.length === 0) return;
    
    const children = [...this._children];
    this._children = [];
    
    children.forEach(child => {
      child.parent = null;
    });
    
    this.emit('childrenCleared', {
      type: 'childrenCleared',
      timestamp: Date.now(),
      children
    });
  }
  
  findChild(predicate: (child: SceneNodeInterface) => boolean): SceneNodeInterface | undefined {
    return this._children.find(predicate);
  }
  
  update(deltaTime: number): void {
    // 기본 구현은 모든 자식 노드를 업데이트
    if (this._enabled) {
      this._children.forEach(child => {
        child.update(deltaTime);
      });
    }
  }
}
```

## 사용 예시

### 기본 사용법

```typescript
// 노드 생성
const root = new SceneNode({ name: 'Root' });
const child1 = new SceneNode({ name: 'Child1' });
const child2 = new SceneNode({ name: 'Child2' });

// 계층 구조 설정
root.addChild(child1);
root.addChild(child2);

// 노드 속성 변경
child1.visible = false;

// 특정 조건에 맞는 자식 찾기
const foundNode = root.findChild(node => node.name === 'Child1');
```

### 이벤트 처리

```typescript
// 이벤트 핸들러 등록
root.on('childAdded', (data) => {
  console.log(`Child added: ${data.child.name}`);
});

root.on('visibilityChanged', (data) => {
  console.log(`Visibility changed from ${data.oldValue} to ${data.newValue}`);
});

// 자식 노드 추가 시 이벤트 발생
const child3 = new SceneNode({ name: 'Child3' });
root.addChild(child3); // 'Child added: Child3' 출력

// 속성 변경 시 이벤트 발생
child3.visible = false; // 'Visibility changed from true to false' 출력
```

### SceneNode 확장

```typescript
/**
 * Transform 기능을 가진 SceneNode 확장
 */
class TransformNode extends SceneNode {
  private _position: Vector2 = { x: 0, y: 0 };
  private _rotation: number = 0;
  private _scale: Vector2 = { x: 1, y: 1 };
  
  // 확장된 이벤트 맵 타입
  interface TransformNodeEventMap extends SceneNodeEventMap {
    'positionChanged': BaseEventData & {
      oldPosition: Vector2;
      newPosition: Vector2;
    };
    'rotationChanged': BaseEventData & {
      oldRotation: number;
      newRotation: number;
    };
    'scaleChanged': BaseEventData & {
      oldScale: Vector2;
      newScale: Vector2;
    };
  }
  
  get position(): Vector2 {
    return { ...this._position };
  }
  
  set position(value: Vector2) {
    if (this._position.x !== value.x || this._position.y !== value.y) {
      const oldPosition = { ...this._position };
      this._position = { ...value };
      this.emit('positionChanged', {
        type: 'positionChanged',
        timestamp: Date.now(),
        oldPosition,
        newPosition: { ...value }
      });
    }
  }
  
  // rotation, scale 속성도 유사하게 구현...
}
```

## 성능 최적화

### 1. 불필요한 이벤트 최소화

```typescript
// 여러 속성을 한 번에 변경할 때 이벤트 최소화
function updateTransform(node: TransformNode, position: Vector2, rotation: number, scale: Vector2) {
  // 임시로 이벤트 비활성화
  const disableEvents = node.disableEvents();
  
  // 속성 변경
  node.position = position;
  node.rotation = rotation;
  node.scale = scale;
  
  // 이벤트 다시 활성화
  disableEvents();
  
  // 한 번의 통합된 이벤트 발생
  node.emit('transformChanged', {
    type: 'transformChanged',
    timestamp: Date.now(),
    position,
    rotation,
    scale
  });
}
```

### 2. 자식 노드 관리 최적화

```typescript
/**
 * 자식 노드에게 일괄 작업을 효율적으로 수행
 */
function batchProcessChildren(node: SceneNodeInterface, process: (child: SceneNodeInterface) => void) {
  // 자식 배열의 복사본을 만들어 변경 사항에 영향을 받지 않도록 함
  const children = [...node.children];
  children.forEach(process);
}
```

## 관련 API

- [이벤트 시스템](/docs/api-reference/core/events) - 타입 안전한 이벤트 시스템
- [브랜딩된 타입](/docs/core-concepts/branded-types) - NodeID와 같은 브랜딩된 타입
- [Scene](/docs/api-reference/core/scene) - 장면 노드의 컨테이너 