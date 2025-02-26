---
title: Shape
description: 기본 도형 인터페이스에 대한 API 문서
---

# Shape

`Shape` 인터페이스는 Modern Vector.js에서 모든 벡터 도형의 기본 인터페이스입니다. 이 인터페이스는 도형의 공통 속성과 메서드를 정의하며, 라이브러리의 모든 도형 클래스는 이 인터페이스를 구현합니다.

## 구문

```typescript
interface Shape {
  // 식별 및 메타데이터
  readonly id: string;
  name: string;
  type: ShapeType;
  
  // 위치 및 변환
  position: Vector;
  rotation: number;
  scale: Vector;
  origin: Vector;
  transform: Matrix;
  
  // 스타일 속성
  fill: FillStyle;
  stroke: StrokeStyle;
  opacity: number;
  visible: boolean;
  
  // 계층 구조
  parent: Shape | null;
  children: Shape[];
  
  // 바운딩 박스
  getBounds(): Bounds;
  getTransformedBounds(): Bounds;
  
  // 변환 메서드
  setPosition(x: number, y: number): this;
  setRotation(angle: number): this;
  setScale(x: number, y: number): this;
  setOrigin(x: number, y: number): this;
  
  // 계층 구조 메서드
  addChild(shape: Shape): this;
  removeChild(shape: Shape): boolean;
  
  // 렌더링 관련
  render(context: RenderContext): void;
  
  // 이벤트 관련
  on(event: ShapeEventType, listener: ShapeEventListener): this;
  off(event: ShapeEventType, listener: ShapeEventListener): this;
  
  // 유틸리티
  clone(): Shape;
  toJSON(): ShapeJSON;
  fromJSON(json: ShapeJSON): this;
}
```

## 관련 타입

### ShapeType

```typescript
enum ShapeType {
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  ELLIPSE = 'ellipse',
  LINE = 'line',
  POLYLINE = 'polyline',
  POLYGON = 'polygon',
  PATH = 'path',
  TEXT = 'text',
  GROUP = 'group',
  CUSTOM = 'custom'
}
```

### FillStyle

```typescript
interface FillStyle {
  color?: string;
  gradient?: Gradient;
  pattern?: Pattern;
  opacity?: number;
  enabled?: boolean;
}
```

### StrokeStyle

```typescript
interface StrokeStyle {
  color?: string;
  width?: number;
  cap?: 'butt' | 'round' | 'square';
  join?: 'miter' | 'round' | 'bevel';
  miterLimit?: number;
  dash?: number[];
  dashOffset?: number;
  opacity?: number;
  enabled?: boolean;
}
```

### Bounds

```typescript
interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}
```

## 속성

### 식별 및 메타데이터

#### `id: string` (읽기 전용)

도형의 고유 식별자입니다. 생성 시 자동으로 할당됩니다.

#### `name: string`

도형의 이름입니다. 사용자가 지정할 수 있습니다.

#### `type: ShapeType`

도형의 유형입니다. `ShapeType` 열거형의 값 중 하나입니다.

### 위치 및 변환

#### `position: Vector`

도형의 위치(x, y 좌표)입니다.

#### `rotation: number`

도형의 회전 각도(라디안)입니다.

#### `scale: Vector`

도형의 x축 및 y축 크기 조정 비율입니다.

#### `origin: Vector`

도형의 원점(회전 및 크기 조정의 중심점)입니다.

#### `transform: Matrix`

도형의 변환 행렬입니다. 위치, 회전, 크기 조정 및 원점을 결합한 결과입니다.

### 스타일 속성

#### `fill: FillStyle`

도형의 채우기 스타일입니다.

#### `stroke: StrokeStyle`

도형의 외곽선 스타일입니다.

#### `opacity: number`

도형의 전체 불투명도입니다. 0(완전 투명)에서 1(완전 불투명) 사이의 값입니다.

#### `visible: boolean`

도형의 가시성입니다. `false`인 경우 도형이 렌더링되지 않습니다.

### 계층 구조

#### `parent: Shape | null`

도형의 부모 도형입니다. 최상위 도형인 경우 `null`입니다.

#### `children: Shape[]`

도형의 자식 도형 배열입니다.

## 메서드

### 바운딩 박스

#### `getBounds(): Bounds`

도형의 로컬 좌표계에서의 바운딩 박스를 반환합니다.

- **반환값**: 바운딩 박스 객체

#### `getTransformedBounds(): Bounds`

도형의 변환(위치, 회전, 크기 조정)이 적용된 바운딩 박스를 반환합니다.

- **반환값**: 변환된 바운딩 박스 객체

### 변환 메서드

#### `setPosition(x: number, y: number): this`

도형의 위치를 설정합니다.

- **매개변수**:
  - `x`: x 좌표
  - `y`: y 좌표
- **반환값**: 메서드 체이닝을 위한 현재 인스턴스

## 예제

### 기본 도형 생성 및 조작

```typescript
import { VectorEngine, RectangleShape } from 'modern-vector';

// 엔진 인스턴스 생성
const engine = new VectorEngine();

// 사각형 생성
const rect = new RectangleShape({
  position: { x: 100, y: 100 },
  width: 200,
  height: 150,
  fill: { color: 'blue', opacity: 0.8 },
  stroke: { color: 'black', width: 2 }
});

// 도형 변환
rect.setPosition(150, 150)
    .setRotation(Math.PI / 4) // 45도 회전
    .setScale(1.5, 1.5);      // 1.5배 확대

// 장면에 도형 추가
engine.scene.add(rect);

// 렌더링
engine.render();
```

### 도형 계층 구조

```typescript
import { VectorEngine, GroupShape, CircleShape, RectangleShape } from 'modern-vector';

// 엔진 인스턴스 생성
const engine = new VectorEngine();

// 그룹 생성
const group = new GroupShape({
  position: { x: 200, y: 200 }
});

// 자식 도형 생성
const circle = new CircleShape({
  position: { x: 0, y: 0 }, // 그룹 내 상대 위치
  radius: 50,
  fill: { color: 'red' }
});

const rect = new RectangleShape({
  position: { x: 100, y: 0 }, // 그룹 내 상대 위치
  width: 80,
  height: 80,
  fill: { color: 'blue' }
});

// 그룹에 도형 추가
group.addChild(circle)
     .addChild(rect);

// 그룹 회전 - 모든 자식 도형에 영향
group.setRotation(Math.PI / 6); // 30도 회전

// 장면에 그룹 추가
engine.scene.add(group);

// 렌더링
engine.render();
```

## 관련 API

- [Rectangle](/docs/api-reference/shapes/rectangle) - 사각형 도형
- [Circle](/docs/api-reference/shapes/circle) - 원형 도형
- [Path](/docs/api-reference/shapes/path) - 경로 도형
- [Group](/docs/api-reference/shapes/group) - 도형 그룹 