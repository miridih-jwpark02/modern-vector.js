---
title: Shapes API
description: Modern Vector.js의 Shape API에 대한 자세한 설명
---

# Shapes API

Modern Vector.js에서 Shapes API는 다양한 도형을 생성하고 관리하는 기능을 제공합니다.

## 개요

Shapes API는 다음과 같은 주요 기능을 제공합니다:

- 다양한 기본 도형(사각형, 원, 선, 경로 등) 생성 및 관리
- 도형의 변환(이동, 회전, 크기 조절) 적용
- 도형의 스타일 설정 및 변경
- 도형 간 충돌 감지 및 점 포함 여부 확인

## 주요 인터페이스 및 타입

### Shape

`Shape` 인터페이스는 모든 도형의 기본이 되는 인터페이스입니다.

```typescript
interface Shape extends SceneNode {
  readonly id: string;
  readonly type: string;
  readonly transform: Matrix3x3;
  readonly bounds: Bounds;
  readonly style: ShapeStyle;
  
  // 도형 복제
  clone(): Shape;
  
  // 변환 적용
  applyTransform(matrix: Matrix3x3): Shape;
  
  // 점 포함 여부 확인
  containsPoint(point: Vector2D): boolean;
  
  // 도형 간 충돌 감지
  intersects(other: Shape): boolean;
  
  // Scale 기준점 설정
  setScaleOrigin(origin: 'center' | 'topLeft' | 'custom', point?: { x: number; y: number }): void;
  
  // 도형을 Path로 변환
  toPath(): PathPoint[];
}
```

### Bounds

`Bounds` 인터페이스는 도형의 경계 상자를 나타냅니다.

```typescript
interface Bounds {
  x: number;      // 좌상단 x 좌표
  y: number;      // 좌상단 y 좌표
  width: number;  // 너비
  height: number; // 높이
}
```

### ShapeStyle

`ShapeStyle` 인터페이스는 도형의 시각적 스타일을 정의합니다.

```typescript
interface ShapeStyle {
  fillColor?: string;                        // 채우기 색상
  strokeColor?: string;                      // 테두리 색상
  strokeWidth?: number;                      // 테두리 두께
  fillOpacity?: number;                      // 채우기 투명도 (0-1)
  strokeOpacity?: number;                    // 테두리 투명도 (0-1)
  strokeDashArray?: number[];                // 테두리 점선 패턴
  strokeDashOffset?: number;                 // 테두리 점선 시작 위치
  strokeLineCap?: 'butt' | 'round' | 'square'; // 테두리 선 끝 모양
  strokeLineJoin?: 'miter' | 'round' | 'bevel'; // 테두리 선 연결 모양
  strokeMiterLimit?: number;                 // 테두리 선 연결 제한
}
```

### ShapePlugin

`ShapePlugin`은 도형 관리를 위한 플러그인 인터페이스입니다.

```typescript
interface ShapePlugin {
  // 도형 타입 등록
  registerShape<T extends Shape>(type: string, factory: ShapeFactory<T>): void;
  
  // 도형 생성
  createShape<T extends Shape>(type: string, options: ShapeOptions): T;
  
  // 도형 타입 등록 여부 확인
  hasShape(type: string): boolean;
}
```

## 기본 도형 타입

Modern Vector.js는 다음과 같은 기본 도형 타입을 제공합니다:

### Rectangle (사각형)

사각형 도형은 x, y 좌표와 너비, 높이로 정의됩니다.

```typescript
interface RectangleOptions extends ShapeOptions {
  x?: number;      // 사각형 좌상단 x 좌표
  y?: number;      // 사각형 좌상단 y 좌표
  width?: number;  // 사각형 너비
  height?: number; // 사각형 높이
}
```

### Circle (원)

원 도형은 중심 좌표와 반지름으로 정의됩니다.

```typescript
interface CircleOptions extends ShapeOptions {
  centerX?: number; // 원 중심 x 좌표
  centerY?: number; // 원 중심 y 좌표
  radius?: number;  // 원 반지름
}
```

### Line (선)

선 도형은 시작점과 끝점으로 정의됩니다.

```typescript
interface LineOptions extends ShapeOptions {
  x1?: number; // 시작점 x 좌표
  y1?: number; // 시작점 y 좌표
  x2?: number; // 끝점 x 좌표
  y2?: number; // 끝점 y 좌표
}
```

### Path (경로)

경로 도형은 일련의 점과 커맨드로 정의됩니다.

```typescript
interface PathOptions extends ShapeOptions {
  points?: PathPoint[]; // 경로 점들
  closed?: boolean;     // 경로 닫힘 여부
}

// 경로 점 타입
interface PathPoint {
  x: number;                             // x 좌표
  y: number;                             // y 좌표
  type: 'move' | 'line' | 'curve' | 'close'; // 점 타입
  controlPoint1?: { x: number; y: number }; // 컨트롤 포인트 1 (curve 타입일 때)
  controlPoint2?: { x: number; y: number }; // 컨트롤 포인트 2 (curve 타입일 때)
}
```

### Text (텍스트)

텍스트 도형은 텍스트 내용과 관련 스타일로 정의됩니다.

```typescript
interface TextOptions extends ShapeOptions {
  x?: number;               // 텍스트 x 좌표
  y?: number;               // 텍스트 y 좌표
  text?: string;            // 텍스트 내용
  font?: string;            // 폰트
  fontSize?: number;        // 폰트 크기
  textAlign?: CanvasTextAlign;       // 텍스트 정렬
  textBaseline?: CanvasTextBaseline; // 텍스트 기준선
}
```

### Hexagon (육각형)

육각형 도형은 중심 좌표, 반지름, 회전 각도로 정의됩니다.

```typescript
interface HexagonOptions extends ShapeOptions {
  centerX?: number;  // 육각형 중심 x 좌표
  centerY?: number;  // 육각형 중심 y 좌표
  radius?: number;   // 육각형 반지름
  rotation?: number; // 육각형 회전 각도 (라디안)
}
```

## 사용 예시

### 도형 생성 및 스타일 설정

```typescript
// VectorEngine 인스턴스 생성
const engine = new VectorEngine();

// ShapePlugin 등록 (보통 기본 플러그인으로 포함되어 있음)
engine.use(new ShapePlugin());

// ShapePlugin 인스턴스 가져오기
const shapePlugin = engine.getPlugin<ShapePlugin>('shape');

// 사각형 생성
const rect = shapePlugin.createShape('rectangle', {
  x: 50,
  y: 50,
  width: 100,
  height: 80,
  style: {
    fillColor: 'blue',
    strokeColor: 'black',
    strokeWidth: 2
  }
});

// 원 생성
const circle = shapePlugin.createShape('circle', {
  centerX: 200,
  centerY: 100,
  radius: 40,
  style: {
    fillColor: 'red',
    fillOpacity: 0.7
  }
});

// 선 생성
const line = shapePlugin.createShape('line', {
  x1: 300,
  y1: 50,
  x2: 400,
  y2: 150,
  style: {
    strokeColor: 'green',
    strokeWidth: 3,
    strokeDashArray: [5, 3]
  }
});

// 도형을 화면에 추가
engine.scene.addChild(rect);
engine.scene.addChild(circle);
engine.scene.addChild(line);
```

### 도형 변환 적용

```typescript
// 이동 변환
const translated = rect.applyTransform(Matrix3x3.translation(20, 30));
engine.scene.addChild(translated);

// 회전 변환 (원 중심에서 45도 회전)
const rotated = circle.applyTransform(Matrix3x3.rotation(Math.PI / 4));
engine.scene.addChild(rotated);

// 크기 변환 (2배 확대)
const scaled = line.applyTransform(Matrix3x3.scale(2, 2));
engine.scene.addChild(scaled);

// 복합 변환 (이동 후 회전)
const combined = rect.applyTransform(
  Matrix3x3.translation(50, 50).multiply(Matrix3x3.rotation(Math.PI / 6))
);
engine.scene.addChild(combined);
```

### 도형 간 상호작용 확인

```typescript
// 점이 도형 내부에 있는지 확인
const isPointInside = circle.containsPoint(Vector2D.create(190, 100));
console.log('점이 원 안에 있는가:', isPointInside);

// 도형 간 충돌 여부 확인
const doShapesCollide = rect.intersects(circle);
console.log('사각형과 원이 충돌하는가:', doShapesCollide);
```

### 사용자 정의 도형 생성

```typescript
// 사용자 정의 도형 팩토리 생성
class CustomShapeFactory implements ShapeFactory {
  create(options: ShapeOptions): Shape {
    // 사용자 정의 도형 생성 로직
    const customShape = new CustomShape(options);
    return customShape;
  }
}

// 사용자 정의 도형 등록
shapePlugin.registerShape('custom', new CustomShapeFactory());

// 사용자 정의 도형 생성
const custom = shapePlugin.createShape('custom', {
  // 사용자 정의 옵션
});

engine.scene.addChild(custom);
```

## 고급 사용 예시

### 복합 도형 생성

여러 기본 도형을 조합하여 복잡한 도형을 만들 수 있습니다:

```typescript
// VectorEngine 및 플러그인 설정
const engine = new VectorEngine();
engine.use(new ShapePlugin());
engine.use(new GroupPlugin());

const shapePlugin = engine.getPlugin<ShapePlugin>('shape');
const groupPlugin = engine.getPlugin<GroupPlugin>('group');

// 얼굴 도형 생성
const face = groupPlugin.createGroup();

// 얼굴 윤곽선 (원)
const headCircle = shapePlugin.createShape('circle', {
  centerX: 100,
  centerY: 100,
  radius: 50,
  style: {
    fillColor: '#FFCC99',
    strokeColor: '#000000',
    strokeWidth: 2
  }
});

// 왼쪽 눈
const leftEye = shapePlugin.createShape('circle', {
  centerX: 80,
  centerY: 80,
  radius: 8,
  style: {
    fillColor: '#FFFFFF',
    strokeColor: '#000000',
    strokeWidth: 1
  }
});

// 오른쪽 눈
const rightEye = shapePlugin.createShape('circle', {
  centerX: 120,
  centerY: 80,
  radius: 8,
  style: {
    fillColor: '#FFFFFF',
    strokeColor: '#000000',
    strokeWidth: 1
  }
});

// 눈동자
const leftPupil = shapePlugin.createShape('circle', {
  centerX: 80,
  centerY: 80,
  radius: 3,
  style: {
    fillColor: '#000000'
  }
});

const rightPupil = shapePlugin.createShape('circle', {
  centerX: 120,
  centerY: 80,
  radius: 3,
  style: {
    fillColor: '#000000'
  }
});

// 입 (선으로 간단히 표현)
const mouth = shapePlugin.createShape('path', {
  points: [
    { x: 80, y: 120, type: 'move' },
    { x: 100, y: 130, type: 'curve', controlPoint1: { x: 90, y: 125 } },
    { x: 120, y: 120, type: 'curve', controlPoint1: { x: 110, y: 125 } }
  ],
  style: {
    strokeColor: '#000000',
    strokeWidth: 2,
    fillOpacity: 0
  }
});

// 그룹에 모든 도형 추가
face.addChild(headCircle);
face.addChild(leftEye);
face.addChild(rightEye);
face.addChild(leftPupil);
face.addChild(rightPupil);
face.addChild(mouth);

// 장면에 얼굴 추가
engine.scene.addChild(face);

// 얼굴 전체를 한 번에 변환
face.applyTransform(Matrix3x3.translation(50, 0));
```

### 도형 애니메이션

Transform을 활용한 간단한 애니메이션을 구현할 수 있습니다:

```typescript
// 회전하는 사각형 생성
const rect = shapePlugin.createShape('rectangle', {
  x: 100,
  y: 100,
  width: 80,
  height: 60,
  style: {
    fillColor: 'purple',
    strokeColor: 'black',
    strokeWidth: 2
  }
});

engine.scene.addChild(rect);

// 애니메이션 프레임 함수
let angle = 0;
function animate() {
  // 회전 각도 증가
  angle += 0.02;
  
  // 기존 사각형 제거
  engine.scene.removeChild(rect);
  
  // 회전 변환 적용
  const rotatedRect = rect.applyTransform(Matrix3x3.rotation(angle));
  
  // 변환된 사각형 추가
  engine.scene.addChild(rotatedRect);
  
  // 렌더링
  engine.renderer.render();
  
  // 다음 프레임 요청
  requestAnimationFrame(animate);
}

// 애니메이션 시작
animate();
```

### 도형 이벤트 처리

도형에 이벤트 리스너를 추가하여 상호작용할 수 있습니다:

```typescript
// 클릭 가능한 버튼 생성
const button = shapePlugin.createShape('rectangle', {
  x: 50,
  y: 50,
  width: 100,
  height: 40,
  style: {
    fillColor: '#3498db',
    strokeColor: '#2980b9',
    strokeWidth: 2
  }
});

// 버튼 텍스트 생성
const buttonText = shapePlugin.createShape('text', {
  x: 100,
  y: 75,
  text: '클릭하세요',
  font: 'Arial',
  fontSize: 16,
  textAlign: 'center',
  textBaseline: 'middle',
  style: {
    fillColor: 'white'
  }
});

// 버튼 그룹 생성
const buttonGroup = groupPlugin.createGroup();
buttonGroup.addChild(button);
buttonGroup.addChild(buttonText);

// 장면에 버튼 추가
engine.scene.addChild(buttonGroup);

// 클릭 이벤트 처리
buttonGroup.on('click', () => {
  console.log('버튼이 클릭되었습니다!');
  // 클릭 시 버튼 색상 변경
  const newButton = button.clone();
  newButton.style.fillColor = '#e74c3c';
  
  // 기존 버튼 교체
  buttonGroup.removeChild(button);
  buttonGroup.addChild(newButton);
  
  // 렌더링 업데이트
  engine.renderer.render();
});
```

## 성능 최적화 팁

### 1. 도형 캐싱

자주 사용되는 도형은 캐싱하여 성능을 향상시킬 수 있습니다:

```typescript
// 자주 사용되는 도형 미리 생성 및 캐싱
const cachedShapes = new Map();

function getCachedShape(type, options) {
  const key = `${type}-${JSON.stringify(options)}`;
  
  if (!cachedShapes.has(key)) {
    cachedShapes.set(key, shapePlugin.createShape(type, options));
  }
  
  return cachedShapes.get(key).clone(); // 복제본 반환
}

// 캐시된 도형 사용
const star = getCachedShape('path', starOptions);
```

### 2. 그룹화를 통한 최적화

여러 도형을 그룹화하여 한 번에 변환함으로써 연산을 줄일 수 있습니다:

```typescript
// 여러 도형을 포함하는 복잡한 객체
const complexObject = groupPlugin.createGroup();

// 여러 도형 추가
for (let i = 0; i < 20; i++) {
  const shape = shapePlugin.createShape('circle', {
    centerX: Math.random() * 200,
    centerY: Math.random() * 200,
    radius: 5 + Math.random() * 10,
    style: {
      fillColor: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
    }
  });
  
  complexObject.addChild(shape);
}

// 그룹 전체를 한 번에 변환
complexObject.applyTransform(Matrix3x3.scale(1.5, 1.5));

// 장면에 추가
engine.scene.addChild(complexObject);
```

### 3. 적절한 도형 선택

목적에 맞는 적절한 도형 타입을 선택하면 성능을 향상시킬 수 있습니다:

- 간단한 사각형은 `Path` 대신 `Rectangle`을 사용
- 복잡한 곡선은 여러 개의 선분 대신 `Path`와 베지어 곡선 사용
- 텍스트는 `Path`로 변환하지 않고 `Text` 도형 사용

```typescript
// 나쁜 예: 사각형을 Path로 구현
const badRectangle = shapePlugin.createShape('path', {
  points: [
    { x: 0, y: 0, type: 'move' },
    { x: 100, y: 0, type: 'line' },
    { x: 100, y: 100, type: 'line' },
    { x: 0, y: 100, type: 'line' },
    { x: 0, y: 0, type: 'line' }
  ],
  closed: true
});

// 좋은 예: Rectangle 사용
const goodRectangle = shapePlugin.createShape('rectangle', {
  x: 0,
  y: 0,
  width: 100,
  height: 100
});
```

## 주의사항

- 도형의 스타일은 렌더러마다 다르게 표현될 수 있습니다.
- 도형의 변환은 불변성을 유지하므로, 변환 적용 결과는 항상 새로운 도형 인스턴스입니다.
- 복잡한 도형을 생성하려면 Path 도형을 사용하는 것이 좋습니다.
- 도형의 기준점(origin)을 설정하여 변환 동작을 세밀하게 제어할 수 있습니다. 