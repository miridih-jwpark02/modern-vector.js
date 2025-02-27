---
title: Group API
description: Modern Vector.js의 Group API에 대한 자세한 설명
---

# Group API

Group 관련 API는 여러 도형이나 요소를 그룹화하여 하나의 단위로 관리하는 기능을 제공합니다.

## Group 인터페이스

```typescript
interface Group extends SceneNode {
  /**
   * 그룹 내 자식 노드들
   */
  readonly children: SceneNode[];
  
  /**
   * 자식 노드 추가
   * @param node - 추가할 노드
   * @returns 추가된 노드
   */
  add(node: SceneNode): SceneNode;
  
  /**
   * 자식 노드 제거
   * @param node - 제거할 노드
   * @returns 제거 성공 시 true, 실패 시 false
   */
  remove(node: SceneNode): boolean;
  
  /**
   * 모든 자식 노드 제거
   */
  clear(): void;
  
  /**
   * ID로 자식 노드 검색
   * @param id - 검색할 노드 ID
   * @returns 찾은 노드 또는 null
   */
  findById(id: string): SceneNode | null;
  
  /**
   * 그룹에 변환 적용
   * @param matrix - 적용할 변환 행렬
   * @returns 변환이 적용된 새 그룹
   */
  applyTransform(matrix: Matrix3x3): Group;
  
  /**
   * 점이 그룹 내에 있는지 확인
   * @param point - 확인할 점
   * @returns 점이 그룹 내에 있으면 true, 아니면 false
   */
  containsPoint(point: Vector2D): boolean;
  
  /**
   * 그룹이 다른 노드와 겹치는지 확인
   * @param node - 확인할 노드
   * @returns 겹치면 true, 아니면 false
   */
  intersects(node: SceneNode): boolean;
  
  /**
   * 그룹을 경로로 변환
   * @returns 경로 배열
   */
  toPath(): Array<{ x: number; y: number; type: string }>;
  
  /**
   * 그룹 복제
   * @returns 복제된 그룹
   */
  clone(): Group;
}
```

## GroupOptions 인터페이스

```typescript
interface GroupOptions {
  /**
   * 사용자 정의 속성
   */
  [key: string]: any;
}
```

## GroupPlugin 인터페이스

```typescript
interface GroupPlugin extends Plugin {
  /**
   * 플러그인 ID
   */
  readonly id: string; // 'group-plugin'
  
  /**
   * 플러그인 버전
   */
  readonly version: string;
  
  /**
   * 플러그인 의존성
   */
  readonly dependencies: string[]; // ['shape-plugin']
  
  /**
   * 빈 그룹 생성
   * @returns 새 그룹 인스턴스
   */
  createGroup(): Group;
  
  /**
   * 요소를 포함한 그룹 생성
   * @param nodes - 그룹에 포함할 노드 배열
   * @returns 요소가 포함된 새 그룹 인스턴스
   */
  createGroup(nodes: SceneNode[]): Group;
  
  /**
   * ID와 옵션으로 그룹 생성
   * @param id - 새 그룹의 ID
   * @param options - 그룹 옵션
   * @returns 새 그룹 인스턴스
   */
  createGroup(id: string, options?: GroupOptions): Group;
  
  /**
   * ID, 옵션, 자식 노드로 그룹 생성
   * @param id - 새 그룹의 ID
   * @param options - 그룹 옵션
   * @param nodes - 그룹에 포함할 노드 배열
   * @returns 요소가 포함된 새 그룹 인스턴스
   */
  createGroup(id: string, options: GroupOptions, nodes: SceneNode[]): Group;
  
  /**
   * 플러그인 설치
   * @param engine - VectorEngine 인스턴스
   */
  install(engine: VectorEngine): void;
  
  /**
   * 플러그인 제거
   * @param engine - VectorEngine 인스턴스
   */
  uninstall(engine: VectorEngine): void;
}
```

## DefaultGroup 클래스

`DefaultGroup` 클래스는 `Group` 인터페이스의 기본 구현을 제공합니다.

### 생성자

```typescript
constructor(id: string, options?: GroupOptions, eventEmitter?: EventEmitter);
```

### Properties

| 속성 | 타입 | 설명 |
|------|------|------|
| `id` | `string` | 그룹의 고유 식별자 |
| `type` | `string` | 항상 'group'으로 설정됨 |
| `children` | `SceneNode[]` | 그룹에 포함된 자식 노드 배열 |
| `parent` | `SceneNode \| null` | 부모 노드(있는 경우) |
| `data` | `Record<string, any>` | 사용자 정의 데이터 |
| `transform` | `Matrix3x3` | 그룹에 적용된 변환 행렬 |

### 메서드

| 메서드 | 설명 |
|-------|------|
| `add(node: SceneNode): SceneNode` | 자식 노드를 그룹에 추가 |
| `remove(node: SceneNode): boolean` | 자식 노드를 그룹에서 제거 |
| `clear(): void` | 모든 자식 노드 제거 |
| `findById(id: string): SceneNode \| null` | ID로 자식 노드 검색 |
| `applyTransform(matrix: Matrix3x3): Group` | 그룹에 변환 적용 |
| `containsPoint(point: Vector2D): boolean` | 점이 그룹 경계 내에 있는지 확인 |
| `intersects(node: SceneNode): boolean` | 그룹이 다른 노드와 겹치는지 확인 |
| `toPath(): Array<{ x: number; y: number; type: string }>` | 그룹을 경로로 변환 |
| `clone(): Group` | 그룹의 깊은 복사본 생성 |

## DefaultGroupPlugin 클래스

`DefaultGroupPlugin` 클래스는 `GroupPlugin` 인터페이스의 기본 구현을 제공합니다.

### 생성자

```typescript
constructor();
```

### Properties

| 속성 | 타입 | 설명 |
|------|------|------|
| `id` | `string` | 항상 'group-plugin'으로 설정됨 |
| `version` | `string` | 플러그인 버전 (예: '1.0.0') |
| `dependencies` | `string[]` | 플러그인 의존성 배열 (예: ['shape-plugin']) |

### 메서드

| 메서드 | 설명 |
|-------|------|
| `createGroup(): Group` | 빈 그룹 생성 |
| `createGroup(nodes: SceneNode[]): Group` | 요소를 포함한 그룹 생성 |
| `createGroup(id: string, options?: GroupOptions): Group` | ID와 옵션으로 그룹 생성 |
| `createGroup(id: string, options: GroupOptions, nodes: SceneNode[]): Group` | ID, 옵션, 자식 노드로 그룹 생성 |
| `install(engine: VectorEngine): void` | 플러그인을 엔진에 설치 |
| `uninstall(engine: VectorEngine): void` | 플러그인을 엔진에서 제거 |

## 사용 예시

### 그룹 생성 및 요소 추가

```typescript
// 플러그인 가져오기
const groupPlugin = engine.getPlugin<GroupPlugin>('group-plugin');
const shapePlugin = engine.getPlugin<ShapePlugin>('shape-plugin');

// 도형 생성
const rect = shapePlugin.createRect({ x: 0, y: 0, width: 100, height: 100 });
const circle = shapePlugin.createCircle({ x: 150, y: 150, radius: 50 });

// 빈 그룹 생성 후 요소 추가
const group = groupPlugin.createGroup('my-group', {});
group.add(rect);
group.add(circle);

// 또는 요소를 포함한 그룹 직접 생성
const group2 = groupPlugin.createGroup([rect, circle]);
```

### 그룹 변환

```typescript
// 변환 행렬 생성
const translationMatrix = Matrix3x3.createTranslation(100, 100);
const rotationMatrix = Matrix3x3.createRotation(Math.PI / 4); // 45도 회전
const scaleMatrix = Matrix3x3.createScale(2, 2); // 2배 확대

// 개별 변환 적용
let transformedGroup = group.applyTransform(translationMatrix);
transformedGroup = transformedGroup.applyTransform(rotationMatrix);

// 복합 변환 적용 (행렬 곱)
const combinedMatrix = translationMatrix.multiply(rotationMatrix).multiply(scaleMatrix);
const allTransformedGroup = group.applyTransform(combinedMatrix);
```

### 그룹 내 요소 찾기

```typescript
// ID로 요소 찾기
const foundNode = group.findById('my-rect-id');

if (foundNode) {
  // 찾은 요소 사용
  console.log(`Found node: ${foundNode.id}, Type: ${foundNode.type}`);
}
```

### 그룹 이벤트 처리

```typescript
// 그룹 이벤트 리스너 등록
group.on('childAdded', (node) => {
  console.log(`Child node ${node.id} added to group ${group.id}`);
});

group.on('childRemoved', (node) => {
  console.log(`Child node ${node.id} removed from group ${group.id}`);
});

// 이벤트 발생
const newRect = shapePlugin.createRect({ x: 50, y: 50, width: 75, height: 75 });
group.add(newRect); // 'childAdded' 이벤트 발생
group.remove(newRect); // 'childRemoved' 이벤트 발생
``` 