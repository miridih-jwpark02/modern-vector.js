---
title: CanvasRenderer
description: Canvas API를 사용한 렌더링을 위한 플러그인 문서
---

# CanvasRenderer

`CanvasRendererPlugin`은 HTML5 Canvas API를 사용하여 벡터 그래픽을 렌더링하는 플러그인입니다. 이 플러그인은 2D 컨텍스트를 사용하여 벡터 도형, 경로, 텍스트 등을 렌더링합니다.

## 구문

```typescript
class CanvasRendererPlugin implements Plugin {
  readonly id = 'canvas-renderer';
  readonly version = '1.0.0';
  
  constructor(options?: CanvasRendererOptions);
  
  install(engine: VectorEngine): void;
  uninstall(engine: VectorEngine): void;
  
  // 렌더링 메서드
  render(scene: Scene): void;
  clear(): void;
  resize(width: number, height: number): void;
  
  // 유틸리티 메서드
  getCanvas(): HTMLCanvasElement;
  getContext(): CanvasRenderingContext2D;
}
```

## 옵션

```typescript
interface CanvasRendererOptions {
  canvas?: HTMLCanvasElement;
  width?: number;
  height?: number;
  pixelRatio?: number;
  alpha?: boolean;
  antialias?: boolean;
  clearColor?: string;
  autoResize?: boolean;
}
```

### 옵션 설명

- `canvas`: 사용할 Canvas 요소. 제공되지 않으면 새로운 Canvas 요소가 생성됩니다.
- `width`: Canvas의 너비 (픽셀). 기본값: 800
- `height`: Canvas의 높이 (픽셀). 기본값: 600
- `pixelRatio`: 장치 픽셀 비율. 기본값: `window.devicePixelRatio` 또는 1
- `alpha`: Canvas 컨텍스트의 알파 채널 활성화 여부. 기본값: true
- `antialias`: 안티앨리어싱 활성화 여부. 기본값: true
- `clearColor`: 화면 지우기에 사용되는 색상. 기본값: 'transparent'
- `autoResize`: 창 크기 변경 시 자동 리사이징 활성화 여부. 기본값: false

## 메서드

### 렌더링 메서드

#### `render(scene: Scene): void`

장면을 Canvas에 렌더링합니다.

- **매개변수**: `scene` - 렌더링할 장면 객체

#### `clear(): void`

Canvas를 지정된 `clearColor`로 지웁니다.

#### `resize(width: number, height: number): void`

Canvas 크기를 조정합니다.

- **매개변수**:
  - `width` - 새 너비 (픽셀)
  - `height` - 새 높이 (픽셀)

### 유틸리티 메서드

#### `getCanvas(): HTMLCanvasElement`

현재 사용 중인 Canvas 요소를 반환합니다.

- **반환값**: Canvas 요소

#### `getContext(): CanvasRenderingContext2D`

Canvas의 2D 렌더링 컨텍스트를 반환합니다.

- **반환값**: 2D 렌더링 컨텍스트

## 서비스

CanvasRendererPlugin은 다음 서비스를 등록합니다:

### CanvasRendererService

```typescript
interface CanvasRendererService {
  render(scene: Scene): void;
  clear(): void;
  resize(width: number, height: number): void;
  getCanvas(): HTMLCanvasElement;
  getContext(): CanvasRenderingContext2D;
  setTransform(transform: Matrix): void;
  resetTransform(): void;
  drawShape(shape: Shape): void;
  drawPath(path: Path): void;
  drawImage(image: HTMLImageElement, x: number, y: number, width?: number, height?: number): void;
  measureText(text: string, font?: string): TextMetrics;
}
```

## 예제

### 기본 사용법

```typescript
import { VectorEngine } from 'modern-vector';
import { CanvasRendererPlugin } from 'modern-vector/plugins/canvas-renderer';
import { ShapePlugin } from 'modern-vector/plugins/shape';

// Canvas 요소 가져오기
const canvas = document.getElementById('canvas') as HTMLCanvasElement;

// 엔진 인스턴스 생성
const engine = new VectorEngine();

// Canvas 렌더러 플러그인 등록
engine.use(new CanvasRendererPlugin({
  canvas,
  width: 800,
  height: 600,
  pixelRatio: window.devicePixelRatio,
  clearColor: '#ffffff',
  autoResize: true
}));

// 도형 플러그인 등록
engine.use(new ShapePlugin());

// 렌더러 서비스 가져오기
const rendererService = engine.getService<CanvasRendererService>('canvas-renderer');

// 장면 생성 및 렌더링
const scene = {
  shapes: [
    // 도형 정의
  ]
};

// 렌더링
rendererService.clear();
rendererService.render(scene);

// 창 크기 변경 이벤트 처리
window.addEventListener('resize', () => {
  rendererService.resize(window.innerWidth, window.innerHeight);
  rendererService.render(scene);
});
```

### 고급 사용법

```typescript
import { VectorEngine } from 'modern-vector';
import { CanvasRendererPlugin } from 'modern-vector/plugins/canvas-renderer';

const engine = new VectorEngine();
const renderer = new CanvasRendererPlugin();

engine.use(renderer);

// 렌더러 서비스 가져오기
const rendererService = engine.getService<CanvasRendererService>('canvas-renderer');

// Canvas 컨텍스트 직접 사용
const ctx = rendererService.getContext();

// 사용자 정의 그리기 작업
function customDraw() {
  const ctx = rendererService.getContext();
  
  // 상태 저장
  ctx.save();
  
  // 그리기 설정
  ctx.fillStyle = 'red';
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 2;
  
  // 도형 그리기
  ctx.beginPath();
  ctx.moveTo(100, 100);
  ctx.lineTo(200, 100);
  ctx.lineTo(200, 200);
  ctx.lineTo(100, 200);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // 상태 복원
  ctx.restore();
}

// 애니메이션 루프
let lastTime = 0;
function animate(time: number) {
  const deltaTime = time - lastTime;
  lastTime = time;
  
  // 화면 지우기
  rendererService.clear();
  
  // 사용자 정의 그리기
  customDraw();
  
  // 다음 프레임 요청
  requestAnimationFrame(animate);
}

// 애니메이션 시작
requestAnimationFrame(animate);
```

## 성능 최적화 팁

1. **불필요한 상태 변경 최소화**: Canvas 컨텍스트의 상태 변경(fillStyle, strokeStyle 등)은 비용이 많이 들 수 있습니다. 유사한 스타일의 도형을 함께 그리세요.

2. **오프스크린 렌더링 사용**: 자주 변경되지 않는 복잡한 도형은 오프스크린 Canvas에 미리 렌더링한 다음 메인 Canvas에 복사하세요.

3. **적절한 Canvas 크기 사용**: Canvas가 너무 크면 렌더링 성능이 저하될 수 있습니다. 필요한 크기만 사용하세요.

4. **requestAnimationFrame 사용**: 애니메이션에는 항상 `setTimeout` 대신 `requestAnimationFrame`을 사용하세요.

5. **Canvas 상태 저장/복원 최소화**: `save()`와 `restore()` 호출은 비용이 많이 들 수 있습니다. 필요한 경우에만 사용하세요.

## 브라우저 호환성

CanvasRendererPlugin은 Canvas API를 지원하는 모든 최신 브라우저에서 작동합니다:

- Chrome 4+
- Firefox 2+
- Safari 3.1+
- Edge 12+
- Opera 9+
- iOS Safari 3.2+ 