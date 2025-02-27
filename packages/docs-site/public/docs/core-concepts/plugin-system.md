---
title: 플러그인 시스템
description: Modern Vector.js의 플러그인 시스템 아키텍처와 사용법
---

# 플러그인 시스템

Modern Vector.js는 플러그인 기반 아키텍처를 채택하여 확장성과 유연성을 제공합니다. 이 문서에서는 플러그인 시스템의 구조, 작동 방식, 그리고 사용자 정의 플러그인 개발 방법에 대해 설명합니다.

## 플러그인 아키텍처

Modern Vector.js의 플러그인 아키텍처는 다음과 같은 구성 요소로 이루어져 있습니다:

1. **Core Engine**: 최소한의 기능을 제공하는 핵심 엔진
2. **Plugin Interface**: 모든 플러그인이 구현해야 하는 인터페이스
3. **Plugin Registry**: 플러그인을 등록하고 관리하는 레지스트리
4. **Service System**: 플러그인 간 통신을 위한 서비스 시스템

### Plugin 인터페이스

모든 플러그인은 `Plugin` 인터페이스를 구현해야 합니다:

```typescript
interface Plugin {
  /**
   * 플러그인의 고유 식별자
   */
  readonly id: string;
  
  /**
   * 플러그인의 버전
   */
  readonly version: string;
  
  /**
   * 플러그인의 의존성 목록
   */
  readonly dependencies?: string[];
  
  /**
   * 플러그인을 엔진에 설치합니다.
   * 
   * @param engine - 벡터 엔진 인스턴스
   */
  install(engine: VectorEngine): void;
  
  /**
   * 플러그인을 엔진에서 제거합니다.
   * 
   * @param engine - 벡터 엔진 인스턴스
   */
  uninstall(engine: VectorEngine): void;
}
```

## 플러그인 카테고리

Modern Vector.js의 플러그인은 다음과 같은 카테고리로 나뉩니다:

### 1. Core Plugins (기본 제공)

코어 플러그인은 기본적인 벡터 그래픽 기능을 제공합니다:

- **MathPlugin**: 벡터, 행렬, 기하학 연산 제공
- **ShapePlugin**: 사각형, 원, 선, 경로, 텍스트, 육각형 등 다양한 기본 도형 생성 및 관리
- **TransformPlugin**: 변환(이동, 회전, 크기 조절 등) 기능 제공
- **GroupPlugin**: 여러 요소를 그룹화하여 하나의 단위로 관리

### 2. Renderer Plugins

렌더러 플러그인은 다양한 렌더링 백엔드를 지원합니다:

- **CanvasRendererPlugin**: HTML Canvas 렌더링
- **SVGRendererPlugin**: SVG 렌더링
- **WebGLRendererPlugin**: WebGL 렌더링

### 3. Effect Plugins

효과 플러그인은 시각적 효과를 제공합니다:

- **FilterPlugin**: 필터 효과 (블러, 그림자 등)
- **AnimationPlugin**: 애니메이션 효과

### 4. Tool Plugins

도구 플러그인은 사용자 상호작용 기능을 제공합니다:

- **SelectionToolPlugin**: 객체 선택 도구
- **TransformToolPlugin**: 객체 변환 도구

## 플러그인 사용하기

### 플러그인 등록

플러그인을 사용하려면 `VectorEngine`의 `use` 메서드를 사용하여 등록합니다:

```typescript
import { VectorEngine } from '@modern-vector/core';
import { CanvasRenderer, ShapePlugin, MathPlugin } from '@modern-vector/plugins';

// 엔진 초기화
const engine = new VectorEngine();

// 플러그인 등록
engine.use(new MathPlugin());
engine.use(new CanvasRenderer());
engine.use(new ShapePlugin());
```

### 플러그인 접근

등록된 플러그인은 `getPlugin` 메서드를 사용하여 접근할 수 있습니다:

```typescript
// 플러그인 접근
const shapePlugin = engine.getPlugin<ShapePlugin>('shape');
const mathPlugin = engine.getPlugin<MathPlugin>('math');

// 플러그인 사용
const rect = shapePlugin.createRect({
  x: 100,
  y: 100,
  width: 200,
  height: 150
});

const vector = mathPlugin.vector.create(10, 20);
```

### 플러그인 제거

플러그인을 제거하려면 `remove` 메서드를 사용합니다:

```typescript
// 플러그인 제거
engine.remove('shape');
```

## 플러그인 개발하기

### 기본 플러그인 구현

사용자 정의 플러그인을 개발하려면 `Plugin` 인터페이스를 구현하는 클래스를 작성합니다:

```typescript
import { Plugin, VectorEngine } from '@modern-vector/core';

export class MyCustomPlugin implements Plugin {
  readonly id = 'my-custom-plugin';
  readonly version = '1.0.0';
  readonly dependencies = ['math', 'shape'];
  
  install(engine: VectorEngine): void {
    // 플러그인 초기화 코드
    console.log('MyCustomPlugin installed');
    
    // 의존성 플러그인 접근
    const mathPlugin = engine.getPlugin('math');
    const shapePlugin = engine.getPlugin('shape');
    
    // 플러그인 기능 구현
    // ...
  }
  
  uninstall(engine: VectorEngine): void {
    // 정리 코드
    console.log('MyCustomPlugin uninstalled');
  }
  
  // 플러그인 메서드
  doSomething(): void {
    // ...
  }
}
```

### 플러그인 의존성 관리

플러그인은 다른 플러그인에 의존할 수 있습니다. 의존성은 `dependencies` 속성에 정의합니다:

```typescript
readonly dependencies = ['math', 'shape'];
```

의존성 플러그인은 `install` 메서드에서 접근할 수 있습니다:

```typescript
install(engine: VectorEngine): void {
  const mathPlugin = engine.getPlugin<MathPlugin>('math');
  const shapePlugin = engine.getPlugin<ShapePlugin>('shape');
  
  // 의존성 플러그인 사용
  // ...
}
```

### 플러그인 통신

플러그인 간 통신은 다음과 같은 방법으로 이루어집니다:

#### 1. 직접 접근

다른 플러그인에 직접 접근하여 메서드를 호출합니다:

```typescript
const otherPlugin = engine.getPlugin<OtherPlugin>('other-plugin');
otherPlugin.someMethod();
```

#### 2. 이벤트 기반 통신

이벤트 서비스를 사용하여 이벤트 기반 통신을 구현합니다:

```typescript
// 이벤트 발행
install(engine: VectorEngine): void {
  this.events = engine.events.createNamespace('my-plugin');
  
  // 이벤트 발행
  this.events.emit('something-happened', { data: 'value' });
}

// 이벤트 구독
install(engine: VectorEngine): void {
  const myPluginEvents = engine.events.createNamespace('my-plugin');
  
  // 이벤트 구독
  myPluginEvents.on('something-happened', (data) => {
    console.log('Event received:', data);
  });
}
```

#### 3. 서비스 기반 통신

코어 서비스를 통한 통신:

```typescript
// 씬 서비스 사용
install(engine: VectorEngine): void {
  const scene = engine.scene.getActive();
  scene.add(someObject);
}
```

## 플러그인 모범 사례

### 1. 최소한의 의존성

플러그인은 필요한 최소한의 의존성만 가져야 합니다:

```typescript
// 좋음: 필요한 의존성만 선언
readonly dependencies = ['math'];

// 나쁨: 불필요한 의존성 포함
readonly dependencies = ['math', 'shape', 'transform', 'renderer'];
```

### 2. 명확한 인터페이스

플러그인은 명확한 공개 인터페이스를 제공해야 합니다:

```typescript
// 좋음: 명확한 인터페이스
export interface MyPlugin extends Plugin {
  doSomething(param: string): void;
  getValue(): number;
}

// 나쁨: 불명확한 인터페이스
export class MyPlugin implements Plugin {
  // 공개 메서드와 내부 메서드가 혼합됨
  doSomething(param: string): void { /* ... */ }
  _internalMethod(): void { /* ... */ }
}
```

### 3. 적절한 정리

플러그인이 제거될 때 모든 리소스를 정리해야 합니다:

```typescript
install(engine: VectorEngine): void {
  this.eventHandler = engine.events.on('some-event', this.handleEvent);
}

uninstall(engine: VectorEngine): void {
  // 이벤트 리스너 제거
  engine.events.off('some-event', this.eventHandler);
  
  // 다른 리소스 정리
  // ...
}
```

### 4. 버전 관리

플러그인은 명확한 버전 관리를 해야 합니다:

```typescript
readonly version = '1.2.3'; // 메이저.마이너.패치
```

### 5. 문서화

플러그인은 잘 문서화되어야 합니다:

```typescript
/**
 * 사용자 정의 플러그인
 * 
 * 이 플러그인은 특정 기능을 제공합니다.
 * 
 * @example
 * ```typescript
 * const engine = new VectorEngine();
 * engine.use(new MyCustomPlugin());
 * const plugin = engine.getPlugin<MyCustomPlugin>('my-custom-plugin');
 * plugin.doSomething('hello');
 * ```
 */
export class MyCustomPlugin implements Plugin {
  // ...
}
```

## 예제: 커스텀 플러그인 개발

### 그리드 플러그인 예제

다음은 그리드를 그리는 커스텀 플러그인의 예제입니다:

```typescript
import { Plugin, VectorEngine, Scene } from '@modern-vector/core';

export interface GridOptions {
  size: number;
  color: string;
  thickness: number;
}

export class GridPlugin implements Plugin {
  readonly id = 'grid';
  readonly version = '1.0.0';
  readonly dependencies = ['renderer'];
  
  private options: GridOptions = {
    size: 20,
    color: '#cccccc',
    thickness: 1
  };
  
  private engine: VectorEngine | null = null;
  private renderHandler: any = null;
  
  install(engine: VectorEngine): void {
    this.engine = engine;
    
    // 렌더링 이벤트 구독
    this.renderHandler = engine.events.on('before-render', this.renderGrid.bind(this));
  }
  
  uninstall(engine: VectorEngine): void {
    // 이벤트 리스너 제거
    if (this.renderHandler) {
      engine.events.off('before-render', this.renderHandler);
      this.renderHandler = null;
    }
    
    this.engine = null;
  }
  
  // 그리드 옵션 설정
  setOptions(options: Partial<GridOptions>): void {
    this.options = { ...this.options, ...options };
  }
  
  // 그리드 렌더링
  private renderGrid(scene: Scene): void {
    if (!this.engine) return;
    
    const renderer = this.engine.renderer;
    const context = renderer.getContext();
    
    if (!context || !('canvas' in context)) return;
    
    const canvas = context.canvas;
    const width = canvas.width;
    const height = canvas.height;
    
    const { size, color, thickness } = this.options;
    
    context.save();
    context.strokeStyle = color;
    context.lineWidth = thickness;
    
    // 수직선 그리기
    for (let x = 0; x <= width; x += size) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }
    
    // 수평선 그리기
    for (let y = 0; y <= height; y += size) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
    
    context.restore();
  }
}
```

### 사용 예제

```typescript
import { VectorEngine } from '@modern-vector/core';
import { CanvasRenderer } from '@modern-vector/renderers';
import { GridPlugin } from './grid-plugin';

// 엔진 초기화
const engine = new VectorEngine();

// 렌더러 등록
engine.use(new CanvasRenderer({
  canvas: document.getElementById('canvas') as HTMLCanvasElement
}));

// 그리드 플러그인 등록
engine.use(new GridPlugin());

// 그리드 옵션 설정
const gridPlugin = engine.getPlugin<GridPlugin>('grid');
gridPlugin.setOptions({
  size: 30,
  color: '#dddddd',
  thickness: 0.5
});

// 렌더링
engine.renderer.render();
```

## 코어 플러그인 상세 설명

### ShapePlugin

ShapePlugin은 다양한 벡터 도형을 생성하고 관리하는 데 사용됩니다. 이 플러그인은 기본적으로 다음과 같은 도형 타입을 제공합니다:

- **Rectangle**: 사각형 도형
- **Circle**: 원형 도형
- **Line**: 선 도형
- **Path**: 복잡한 경로 도형
- **Text**: 텍스트 도형
- **Hexagon**: 육각형 도형

#### 주요 기능:

1. **도형 등록**: 새로운 도형 타입을 시스템에 등록
   ```typescript
   shapePlugin.registerShape('custom-shape', new CustomShapeFactory());
   ```

2. **도형 생성**: 등록된 도형 타입으로 새 도형 인스턴스 생성
   ```typescript
   const rectangle = shapePlugin.createShape('rectangle', {
     x: 10,
     y: 20,
     width: 100,
     height: 50,
     style: {
       fillColor: 'blue',
       strokeColor: 'black',
       strokeWidth: 2
     }
   });
   ```

3. **도형 타입 검증**: 특정 도형 타입이 등록되었는지 확인
   ```typescript
   if (shapePlugin.hasShape('circle')) {
     // 원형 도형 생성 로직
   }
   ```

모든 도형은 `Shape` 인터페이스를 구현하며, 다음과 같은 공통 기능을 제공합니다:

- 변환 적용 (이동, 회전, 크기 조절)
- 경계 상자(bounds) 계산
- 점 포함 여부 확인
- 도형 간 충돌 감지
- 스타일 설정 및 변경

ShapePlugin은 'math' 플러그인에 의존성을 가지며, 벡터 및 행렬 연산을 위해 MathPlugin을 활용합니다.

### MathPlugin

// ... existing code ...

## 결론

Modern Vector.js의 플러그인 시스템은 확장성과 유연성을 제공하여 다양한 기능을 모듈화된 방식으로 구현할 수 있게 합니다. 플러그인 인터페이스를 구현하여 사용자 정의 기능을 쉽게 추가할 수 있으며, 의존성 관리와 플러그인 간 통신을 통해 복잡한 기능도 구현할 수 있습니다. 