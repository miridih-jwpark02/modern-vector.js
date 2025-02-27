---
title: Group 플러그인
description: Modern Vector.js의 Group 플러그인 기능 및 사용법
---

# Group 플러그인

Group 플러그인은 Modern Vector.js에서 여러 도형이나 요소들을 그룹화하여 하나의 단위로 관리할 수 있게 해주는 플러그인입니다. 그룹화를 통해 복잡한 도형 구조를 구성하고, 그룹 단위로 변환이나 스타일 적용을 할 수 있습니다.

## 주요 기능

Group 플러그인은 다음과 같은 주요 기능을 제공합니다:

1. **요소 그룹화**: 여러 요소(도형, 텍스트 등)를 하나의 그룹으로 결합
2. **계층 구조 관리**: 그룹 내에 그룹을 중첩하여 복잡한 계층 구조 생성
3. **일괄 변환**: 그룹 전체에 변환(이동, 회전, 크기 조절 등) 적용
4. **자식 요소 관리**: 그룹에 요소 추가/제거 및 특정 요소 검색

## 설치 및 사용

### 플러그인 등록

Group 플러그인을 사용하려면 `VectorEngine`에 등록해야 합니다:

```typescript
import { VectorEngine } from '@modern-vector/core';
import { GroupPlugin } from '@modern-vector/core/plugins';

// 엔진 초기화
const engine = new VectorEngine();

// Group 플러그인 등록 
// (참고: Group 플러그인은 Shape 플러그인에 의존성이 있어 자동으로 로드됩니다)
engine.use(new GroupPlugin());
```

### 그룹 생성

그룹을 생성하는 방법은 다음과 같습니다:

```typescript
// GroupPlugin 인스턴스 가져오기
const groupPlugin = engine.getPlugin<GroupPlugin>('group-plugin');

// 빈 그룹 생성
const emptyGroup = groupPlugin.createGroup();

// 요소를 포함한 그룹 생성
const rect = shapePlugin.createRect({ x: 0, y: 0, width: 100, height: 100 });
const circle = shapePlugin.createCircle({ x: 150, y: 150, radius: 50 });

const group = groupPlugin.createGroup([rect, circle]);
```

### 그룹 조작

그룹에 요소를 추가하거나 제거하는 방법:

```typescript
// 요소 추가
const text = textPlugin.createText({ x: 50, y: 50, content: 'Hello' });
group.add(text);

// 요소 제거
group.remove(circle);

// 모든 요소 제거
group.clear();
```

### 요소 검색

ID로 그룹 내 요소를 검색하는 방법:

```typescript
// ID로 요소 검색
const foundElement = group.findById('element-id');

if (foundElement) {
  // 요소 작업 수행
}
```

### 변환 적용

그룹 전체에 변환을 적용하는 방법:

```typescript
// 변환 행렬 생성
const matrix = Matrix3x3.createTranslation(100, 100);

// 그룹에 변환 적용
const transformedGroup = group.applyTransform(matrix);

// 회전 적용 (45도)
const rotationMatrix = Matrix3x3.createRotation(Math.PI / 4);
const rotatedGroup = group.applyTransform(rotationMatrix);
```

## Group 인터페이스

Group 플러그인은 다음과 같은 인터페이스를 제공합니다:

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
}
```

## GroupPlugin 인터페이스

GroupPlugin 클래스는 다음과 같은 인터페이스를 제공합니다:

```typescript
interface GroupPlugin extends Plugin {
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
}
```

## 활용 예시

### 복잡한 도형 구성하기

여러 기본 도형을 조합하여 더 복잡한 형태 만들기:

```typescript
// 얼굴 구성 요소 만들기
const face = shapePlugin.createCircle({ x: 100, y: 100, radius: 50 });
const leftEye = shapePlugin.createCircle({ x: 80, y: 80, radius: 10 });
const rightEye = shapePlugin.createCircle({ x: 120, y: 80, radius: 10 });
const mouth = shapePlugin.createArc({ 
  x: 100, 
  y: 120, 
  radius: 20, 
  startAngle: 0, 
  endAngle: Math.PI 
});

// 얼굴 그룹 만들기
const faceGroup = groupPlugin.createGroup([face, leftEye, rightEye, mouth]);

// 전체 얼굴을 이동하거나 회전할 수 있음
const movedFace = faceGroup.applyTransform(Matrix3x3.createTranslation(50, 50));
```

### 그룹 중첩하기

그룹 안에 다른 그룹을 포함하여 계층 구조 만들기:

```typescript
// 자동차 바퀴 만들기
const wheel1 = shapePlugin.createCircle({ x: 50, y: 150, radius: 20 });
const wheel2 = shapePlugin.createCircle({ x: 150, y: 150, radius: 20 });
const wheelGroup = groupPlugin.createGroup([wheel1, wheel2]);

// 자동차 본체 만들기
const body = shapePlugin.createRect({ x: 30, y: 100, width: 140, height: 40 });
const window = shapePlugin.createRect({ x: 60, y: 70, width: 80, height: 30 });
const bodyGroup = groupPlugin.createGroup([body, window]);

// 전체 자동차 그룹 만들기
const car = groupPlugin.createGroup([bodyGroup, wheelGroup]);

// 전체 자동차를 한 번에 변형할 수 있음
const scaledCar = car.applyTransform(Matrix3x3.createScale(1.5, 1.5));
```

## 성능 고려사항

그룹을 사용할 때 다음 사항을 고려하세요:

1. **그룹 깊이**: 너무 깊은 중첩은 성능에 영향을 줄 수 있으므로 적절한 깊이로 유지하세요.
2. **요소 수**: 하나의 그룹에 너무 많은 요소를 포함하면 렌더링 성능이 저하될 수 있습니다.
3. **변환 연산**: 그룹에 변환을 적용할 때마다 모든 자식 요소에 변환이 적용되므로 필요한 경우에만 사용하세요.

## 요약

Group 플러그인은 Modern Vector.js에서 복잡한 그래픽 구조를 만들고 관리하는 데 필수적인 도구입니다. 여러 요소를 그룹화하여 단일 단위로 취급함으로써 복잡한 도형 생성과 조작을 간소화합니다. 