# Shape API

Modern Vector.js의 Shape API는 다양한 벡터 도형을 생성하고 조작할 수 있는 기능을 제공합니다. 이 API를 통해 사각형, 원, 선, 텍스트, 경로 등의 기본 도형을 쉽게 만들고 스타일을 적용할 수 있습니다.

## 주요 기능

- **다양한 기본 도형 지원**: 사각형(Rectangle), 원(Circle), 선(Line), 텍스트(Text), 경로(Path) 등 다양한 기본 도형을 제공합니다.
- **변환(Transform) 지원**: 모든 도형은 이동, 회전, 크기 조절 등의 변환을 적용할 수 있습니다.
- **스타일 속성**: 채우기 색상, 테두리 색상, 테두리 두께 등 다양한 스타일 속성을 설정할 수 있습니다.
- **경로 변환**: 모든 도형은 경로(Path)로 변환할 수 있어 복잡한 도형 조작이 가능합니다.
- **이벤트 처리**: 도형에 이벤트 리스너를 추가하여 사용자 상호작용을 처리할 수 있습니다.

## 주요 클래스 및 인터페이스

### Shape 인터페이스

`Shape` 인터페이스는 모든 도형의 기본 속성과 메서드를 정의합니다.

```typescript
interface Shape extends SceneNode {
  id: string;
  type: string;
  transform: Matrix3x3;
  bounds: Bounds;
  style: ShapeStyle;
  
  clone(): Shape;
  translate(x: number, y: number): void;
  rotate(angle: number, centerX?: number, centerY?: number): void;
  scale(scaleX: number, scaleY: number, centerX?: number, centerY?: number): void;
  containsPoint(x: number, y: number): boolean;
  toPath(): Path;
}
```

### ShapeStyle 인터페이스

`ShapeStyle` 인터페이스는 도형의 시각적 스타일을 정의합니다.

```typescript
interface ShapeStyle {
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  fillOpacity?: number;
  strokeOpacity?: number;
  lineDash?: number[];
  lineCap?: 'butt' | 'round' | 'square';
  lineJoin?: 'miter' | 'round' | 'bevel';
}
```

### Bounds 인터페이스

`Bounds` 인터페이스는 도형의 경계 상자를 정의합니다.

```typescript
interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}
```

### ShapePlugin 클래스

`ShapePlugin` 클래스는 도형 생성 및 관리를 담당하는 플러그인입니다.

```typescript
class ShapePlugin implements Plugin {
  readonly id = 'shape';
  readonly version = '1.0.0';
  
  // 도형 생성 메서드
  createShape(type: string, options: ShapeOptions): Shape;
  
  // 도형 등록 메서드
  registerShape(type: string, factory: ShapeFactory): void;
  
  // 도형 존재 여부 확인
  hasShape(type: string): boolean;
}
```

## 기본 도형 종류

### Rectangle (사각형)

사각형은 x, y 좌표와 너비, 높이로 정의됩니다.

```typescript
// 사각형 생성 예제
const rectangle = shapePlugin.createShape('rectangle', {
  x: 50,
  y: 50,
  width: 100,
  height: 80,
  fillColor: 'blue',
  strokeColor: 'black',
  strokeWidth: 2
});
```

### Circle (원)

원은 중심점 좌표와 반지름으로 정의됩니다.

```typescript
// 원 생성 예제
const circle = shapePlugin.createShape('circle', {
  centerX: 150,
  centerY: 150,
  radius: 50,
  fillColor: 'red',
  strokeColor: 'black',
  strokeWidth: 2
});
```

### Line (선)

선은 시작점과 끝점 좌표로 정의됩니다.

```typescript
// 선 생성 예제
const line = shapePlugin.createShape('line', {
  x1: 50,
  y1: 50,
  x2: 200,
  y2: 200,
  strokeColor: 'black',
  strokeWidth: 2
});
```

### Text (텍스트)

텍스트는 위치, 내용, 글꼴 등의 속성으로 정의됩니다.

```typescript
// 텍스트 생성 예제
const text = shapePlugin.createShape('text', {
  x: 50,
  y: 50,
  text: 'Hello, World!',
  font: 'Arial',
  fontSize: 24,
  fillColor: 'black'
});
```

### Path (경로)

경로는 일련의 점과 명령으로 정의되는 복잡한 도형입니다.

```typescript
// 경로 생성 예제
const path = shapePlugin.createShape('path', {
  commands: [
    { type: 'M', x: 50, y: 50 },
    { type: 'L', x: 150, y: 50 },
    { type: 'L', x: 150, y: 150 },
    { type: 'L', x: 50, y: 150 },
    { type: 'Z' }
  ],
  fillColor: 'green',
  strokeColor: 'black',
  strokeWidth: 2
});
```

## 도형 변환 예제

### 이동 (Translation)

```typescript
// 도형을 x축으로 100, y축으로 50 이동
shape.translate(100, 50);
```

### 회전 (Rotation)

```typescript
// 도형을 원점 기준으로 45도 회전
shape.rotate(45);

// 도형을 특정 점(100, 100) 기준으로 45도 회전
shape.rotate(45, 100, 100);
```

### 크기 조절 (Scaling)

```typescript
// 도형의 크기를 x축으로 2배, y축으로 1.5배 확대
shape.scale(2, 1.5);

// 도형을 특정 점(100, 100) 기준으로 크기 조절
shape.scale(2, 1.5, 100, 100);
```

## 이벤트 처리 예제

```typescript
// 클릭 이벤트 리스너 추가
shape.on('click', (event) => {
  console.log('Shape clicked!', event);
});

// 마우스 오버 이벤트 리스너 추가
shape.on('mouseover', (event) => {
  shape.style.fillColor = 'yellow'; // 마우스 오버 시 색상 변경
});

// 마우스 아웃 이벤트 리스너 추가
shape.on('mouseout', (event) => {
  shape.style.fillColor = 'blue'; // 원래 색상으로 복원
});
```

## 도형 경로 변환 예제

모든 도형은 `toPath()` 메서드를 통해 Path 객체로 변환할 수 있습니다.

```typescript
// 원을 경로로 변환
const circle = shapePlugin.createShape('circle', {
  centerX: 150,
  centerY: 150,
  radius: 50,
  fillColor: 'red'
});

const circlePath = circle.toPath();
console.log(circlePath.commands); // 원을 구성하는 경로 명령 출력
```

## 주의사항

- 도형의 ID는 자동으로 생성되지만, 필요한 경우 옵션을 통해 직접 지정할 수 있습니다.
- 변환 메서드(translate, rotate, scale)는 도형의 상태를 직접 변경합니다.
- 모든 도형은 SceneNode 인터페이스를 구현하므로, 장면 그래프에 추가할 수 있습니다.
- 도형의 스타일 속성은 렌더러에 따라 지원 여부가 달라질 수 있습니다. 