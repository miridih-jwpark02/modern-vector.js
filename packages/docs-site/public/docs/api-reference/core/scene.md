---
title: Scene
description: Modern Vector.js의 장면 그래프 컨테이너
---

# Scene

Scene은 Modern Vector.js의 장면 그래프를 관리하는 컨테이너입니다. 모든 시각적 요소는 Scene 내에서 계층적으로 구성됩니다.

## 주요 특징

- **장면 그래프 관리**: 계층적인 노드 구조를 관리합니다.
- **타입 안전한 노드 접근**: `NodeID`를 통한 타입 안전한 노드 접근을 제공합니다.
- **타입 안전한 이벤트**: `TypedEventEmitter`를 통해 타입 안전한 이벤트를 지원합니다.
- **효율적인 트래버설**: 장면 그래프 순회를 위한 메서드를 제공합니다.

## API 레퍼런스

### SceneInterface

```typescript
/**
 * 장면을 위한 인터페이스
 */
export interface SceneInterface<T extends EventMap = SceneEventMap> extends TypedEventEmitter<T> {
  /** 장면의 고유 식별자 */
  readonly id: string;
  
  /** 장면의 루트 노드 */
  readonly root: SceneNodeInterface;
  
  /**
   * 노드 ID로 노드 검색
   */
  getNodeById(id: NodeID): SceneNodeInterface | undefined;
  
  /**
   * 이름으로 노드 검색
   */
  getNodeByName(name: string): SceneNodeInterface | undefined;
  
  /**
   * 조건에 맞는 모든 노드 검색
   */
  findNodes(predicate: (node: SceneNodeInterface) => boolean): SceneNodeInterface[];
  
  /**
   * 장면 업데이트
   * @param deltaTime 이전 프레임과의 시간 차이(ms)
   */
  update(deltaTime: number): void;
}
```

### SceneEventMap

Scene에서 발생하는 이벤트의 타입 맵입니다:

```typescript
/**
 * Scene 이벤트 맵
 */
export interface SceneEventMap extends EventMap {
  'nodeAdded': BaseEventData & { 
    /** 추가된 노드 */
    node: SceneNodeInterface 
  };
  
  'nodeRemoved': BaseEventData & { 
    /** 제거된 노드 */
    node: SceneNodeInterface 
  };
  
  'nodeUpdated': BaseEventData & { 
    /** 업데이트된 노드 */
    node: SceneNodeInterface 
  };
  
  'sceneCleared': BaseEventData;
  
  'sceneUpdated': BaseEventData & { 
    /** 업데이트 시간 */
    deltaTime: number 
  };
}
```

### Scene 구현

기본적인 Scene 구현은 다음과 같습니다:

```typescript
/**
 * 장면 구현
 */
export class Scene implements SceneInterface {
  /** 장면의 고유 식별자 */
  readonly id: string;
  
  /** 장면의 루트 노드 */
  readonly root: SceneNodeInterface;
  
  /** 이벤트 핸들러 맵 */
  private handlers: Map<string, Set<EventHandler>> = new Map();
  
  /** 노드 ID 맵 */
  private nodeMap: Map<NodeID, SceneNodeInterface> = new Map();
  
  /**
   * Scene 생성자
   */
  constructor(id?: string) {
    this.id = id ?? generateUUID();
    this.root = new SceneNode({ name: 'Root' });
    
    // 루트 노드 맵에 추가
    this.nodeMap.set(this.root.id, this.root);
    
    // 루트 노드의 이벤트 리스너 설정
    this.setupNodeListeners(this.root);
  }
  
  // 이벤트 메서드 구현
  on<K extends keyof SceneEventMap>(
    event: K, 
    handler: EventHandler<SceneEventMap[K]>
  ): void {
    const eventStr = String(event);
    if (!this.handlers.has(eventStr)) {
      this.handlers.set(eventStr, new Set());
    }
    this.handlers.get(eventStr)!.add(handler as EventHandler);
  }
  
  off<K extends keyof SceneEventMap>(
    event: K, 
    handler: EventHandler<SceneEventMap[K]>
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
  
  emit<K extends keyof SceneEventMap>(
    event: K, 
    data: SceneEventMap[K]
  ): void {
    const eventStr = String(event);
    const handlers = this.handlers.get(eventStr);
    if (handlers) {
      handlers.forEach(handler => handler(data as BaseEventData));
    }
  }
  
  // 노드 관리 메서드
  getNodeById(id: NodeID): SceneNodeInterface | undefined {
    return this.nodeMap.get(id);
  }
  
  getNodeByName(name: string): SceneNodeInterface | undefined {
    for (const node of this.nodeMap.values()) {
      if (node.name === name) {
        return node;
      }
    }
    return undefined;
  }
  
  findNodes(predicate: (node: SceneNodeInterface) => boolean): SceneNodeInterface[] {
    const result: SceneNodeInterface[] = [];
    
    const traverse = (node: SceneNodeInterface) => {
      if (predicate(node)) {
        result.push(node);
      }
      
      node.children.forEach(traverse);
    };
    
    traverse(this.root);
    return result;
  }
  
  update(deltaTime: number): void {
    // 루트 노드부터 시작하여 전체 장면 그래프 업데이트
    this.root.update(deltaTime);
    
    this.emit('sceneUpdated', {
      type: 'sceneUpdated',
      timestamp: Date.now(),
      deltaTime
    });
  }
  
  // 노드 이벤트 리스너 설정
  private setupNodeListeners(node: SceneNodeInterface): void {
    // 노드 맵에 추가
    this.nodeMap.set(node.id, node);
    
    // 자식 추가 이벤트 리스너
    node.on('childAdded', (data) => {
      const child = data.child;
      
      // 새 자식 노드의 리스너 설정
      this.setupNodeListeners(child);
      
      // 장면 이벤트 발생
      this.emit('nodeAdded', {
        type: 'nodeAdded',
        timestamp: Date.now(),
        node: child
      });
    });
    
    // 자식 제거 이벤트 리스너
    node.on('childRemoved', (data) => {
      const child = data.child;
      
      // 노드 맵에서 제거
      this.cleanupNode(child);
      
      // 장면 이벤트 발생
      this.emit('nodeRemoved', {
        type: 'nodeRemoved',
        timestamp: Date.now(),
        node: child
      });
    });
    
    // 기존 자식 노드들의 리스너 설정
    node.children.forEach(child => {
      this.setupNodeListeners(child);
    });
  }
  
  // 노드 정리
  private cleanupNode(node: SceneNodeInterface): void {
    // 노드 맵에서 제거
    this.nodeMap.delete(node.id);
    
    // 모든 자식 노드도 재귀적으로 정리
    node.children.forEach(child => {
      this.cleanupNode(child);
    });
  }
}
```

## 사용 예시

### 기본 사용법

```typescript
// 장면 생성
const scene = new Scene();

// 노드 생성 및 추가
const group = new SceneNode({ name: 'Group1' });
const shape1 = new Shape({ name: 'Shape1' });
const shape2 = new Shape({ name: 'Shape2' });

// 계층 구조 설정
scene.root.addChild(group);
group.addChild(shape1);
group.addChild(shape2);

// 노드 검색
const foundNode = scene.getNodeById(shape1.id); // 타입 안전한 NodeID 사용
const groupNode = scene.getNodeByName('Group1');
```

### 이벤트 처리

```typescript
// 이벤트 핸들러 등록
scene.on('nodeAdded', (data) => {
  console.log(`Node added: ${data.node.name}`);
});

scene.on('sceneUpdated', (data) => {
  console.log(`Scene updated, delta time: ${data.deltaTime}ms`);
});

// 새 노드 추가 시 이벤트 발생
const newShape = new Shape({ name: 'NewShape' });
scene.root.addChild(newShape); // 'Node added: NewShape' 출력

// 장면 업데이트 시 이벤트 발생
scene.update(16.67); // 'Scene updated, delta time: 16.67ms' 출력
```

### 장면 트래버설

```typescript
// 특정 타입의 모든 노드 찾기
const allShapes = scene.findNodes(node => node instanceof Shape);

// 특정 조건을 만족하는 노드 찾기
const visibleNodes = scene.findNodes(node => node.visible);
const redShapes = scene.findNodes(node => 
  node instanceof Shape && (node as Shape).fill === 'red'
);
```

## 장면 그래프 시각화

장면 그래프의 구조를 시각화하는 유틸리티 함수:

```typescript
/**
 * 장면 그래프 구조를 시각화
 */
function visualizeSceneGraph(scene: SceneInterface): string {
  let result = '';
  
  const printNode = (node: SceneNodeInterface, depth: number = 0) => {
    const indent = '  '.repeat(depth);
    result += `${indent}- ${node.name} (${node.id})\n`;
    
    node.children.forEach(child => {
      printNode(child, depth + 1);
    });
  };
  
  result += `Scene: ${scene.id}\n`;
  printNode(scene.root);
  
  return result;
}
```

## 성능 최적화

### 1. 효율적인 노드 검색

```typescript
/**
 * 많은 노드가 있는 장면에서 효율적인 노드 검색을 위해
 * 인덱스를 구축하는 방법
 */
class OptimizedScene extends Scene {
  private nameIndex: Map<string, Set<SceneNodeInterface>> = new Map();
  
  // 노드 이름 인덱스 추가
  private addToNameIndex(node: SceneNodeInterface): void {
    if (!this.nameIndex.has(node.name)) {
      this.nameIndex.set(node.name, new Set());
    }
    this.nameIndex.get(node.name)!.add(node);
  }
  
  // 노드 이름 인덱스에서 제거
  private removeFromNameIndex(node: SceneNodeInterface): void {
    const nodes = this.nameIndex.get(node.name);
    if (nodes) {
      nodes.delete(node);
      if (nodes.size === 0) {
        this.nameIndex.delete(node.name);
      }
    }
  }
  
  // 이름으로 여러 노드 검색
  getNodesByName(name: string): SceneNodeInterface[] {
    const nodes = this.nameIndex.get(name);
    return nodes ? Array.from(nodes) : [];
  }
}
```

### 2. 지연 업데이트

```typescript
/**
 * 불필요한 업데이트를 최소화하는 지연 업데이트 기법
 */
class DeferredUpdateScene extends Scene {
  private dirtyNodes: Set<NodeID> = new Set();
  
  // 노드를 더티로 표시
  markNodeDirty(id: NodeID): void {
    this.dirtyNodes.add(id);
  }
  
  // 더티 노드만 업데이트
  updateDirtyNodes(): void {
    for (const id of this.dirtyNodes) {
      const node = this.getNodeById(id);
      if (node) {
        // 노드 업데이트 로직
        this.emit('nodeUpdated', {
          type: 'nodeUpdated',
          timestamp: Date.now(),
          node
        });
      }
    }
    this.dirtyNodes.clear();
  }
}
```

## 관련 API

- [SceneNode](/docs/api-reference/core/scene-node) - 장면 그래프의 기본 노드
- [Shape](/docs/api-reference/core/shape) - 시각적 요소를 위한 노드
- [이벤트 시스템](/docs/api-reference/core/events) - 타입 안전한 이벤트 시스템
- [브랜딩된 타입](/docs/core-concepts/branded-types) - NodeID와 같은 브랜딩된 타입 