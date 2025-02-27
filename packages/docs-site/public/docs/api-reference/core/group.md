---
title: Group API
description: Modern Vector.js의 Group API에 대한 자세한 설명
---

# Group API

Modern Vector.js에서 Group API는 여러 요소를 하나의 단위로 그룹화하여 관리할 수 있는 기능을 제공합니다.

## 개요

Group API는 다음과 같은 주요 기능을 제공합니다:

- 여러 SceneNode를 하나의 그룹으로 관리
- 그룹 단위의 변환(이동, 회전, 크기 조절) 적용
- 그룹 내 요소 검색 및 조작

## 주요 클래스

### DefaultGroup

`DefaultGroup` 클래스는 Group API의 핵심 구현체로, 여러 SceneNode를 포함하고 관리할 수 있습니다.

```typescript
class DefaultGroup implements SceneNode {
  readonly id: string;
  readonly type: string;
  readonly transform: Matrix3x3;
  parent: SceneNode | null;
  children: SceneNode[];
  data: Record<string, any>;
  
  constructor(id?: string);
  
  // 자식 노드 관리
  addChild(child: SceneNode): SceneNode;
  removeChild(child: SceneNode): boolean;
  clearChildren(): void;
  findChildById(id: string): SceneNode | null;
  
  // 변환 적용
  applyTransform(matrix: Matrix3x3): void;
  
  // 복제
  clone(): DefaultGroup;
  
  // 이벤트 처리
  on(event: string, handler: (data: any) => void): void;
  off(event: string, handler: (data: any) => void): void;
  emit(event: string, data: any): void;
  
  // 기타 유틸리티
  containsPoint(point: Vector2D): boolean;
  toPath(): PathPoint[];
}
```

### GroupPlugin

`GroupPlugin` 클래스는 Modern Vector.js 엔진에 Group 기능을 추가하는 플러그인입니다.

```typescript
class GroupPlugin implements Plugin {
  readonly id: string;
  readonly version: string;
  readonly dependencies: string[];
  
  constructor();
  
  // 플러그인 라이프사이클
  install(engine: VectorEngine): void;
  uninstall(engine: VectorEngine): void;
  
  // 그룹 생성
  createGroup(id?: string): DefaultGroup;
}
```

## 사용 예시

### 그룹 생성 및 요소 추가

```typescript
// VectorEngine 인스턴스 생성
const engine = new VectorEngine();

// GroupPlugin 등록
engine.use(new GroupPlugin());

// 그룹 생성
const group = engine.createGroup('myGroup');

// 도형 생성 및 그룹에 추가
const shapePlugin = engine.getPlugin<ShapePlugin>('shape');
const rect = shapePlugin.createShape('rectangle', { x: 10, y: 10, width: 100, height: 50 });
const circle = shapePlugin.createShape('circle', { centerX: 150, centerY: 50, radius: 30 });

group.addChild(rect);
group.addChild(circle);

// 그룹 전체에 변환 적용
group.applyTransform(Matrix3x3.translation(50, 50));
```

### 그룹 내 요소 검색

```typescript
// ID로 그룹 내 요소 찾기
const foundShape = group.findChildById('shapeId');
if (foundShape) {
  // 찾은 요소 조작
  foundShape.data.selected = true;
}
```

### 그룹 복제

```typescript
// 그룹 복제
const clonedGroup = group.clone();

// 복제된 그룹 위치 변경
clonedGroup.applyTransform(Matrix3x3.translation(200, 0));

// 장면에 추가
engine.scene.addChild(clonedGroup);
```

## 주의사항

- 그룹에 요소를 추가하면 해당 요소의 `parent` 속성이 그룹으로 설정됩니다.
- 그룹에서 요소를 제거하면 해당 요소의 `parent` 속성이 `null`로 설정됩니다.
- 그룹에 변환을 적용하면 모든 자식 요소에 해당 변환이 적용됩니다.
- 그룹을 복제하면 모든 자식 요소도 함께 복제됩니다. 