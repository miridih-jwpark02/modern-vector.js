# Modern Vector.js Core

Modern Vector.js의 코어 패키지입니다. 이 패키지는 벡터 그래픽 라이브러리의 핵심 기능을 제공합니다.

## 소개

Modern Vector.js Core는 플러그인 기반 아키텍처를 통해 확장 가능한 벡터 그래픽 시스템을 구현합니다. 최소한의 코어 시스템과 플러그인을 통한 기능 확장을 지원하여 필요한 기능만 선택적으로 사용할 수 있습니다.

## 설치

```bash
# npm 사용
npm install @modern-vector/core

# yarn 사용
yarn add @modern-vector/core

# pnpm 사용
pnpm add @modern-vector/core
```

## 기본 사용법

```typescript
import { VectorEngine } from '@modern-vector/core';

// 엔진 초기화
const engine = new VectorEngine();

// 플러그인 등록
engine.use(myPlugin);

// 서비스 접근
const scene = engine.scene.create();
engine.scene.setActive(scene);
```

## 핵심 개념

### VectorEngine

VectorEngine은 Modern Vector.js의 핵심 클래스로, 플러그인 관리와 핵심 서비스에 대한 접근을 제공합니다.

```typescript
interface VectorEngine {
  // Plugin Management
  use(plugin: Plugin): void;
  remove(pluginId: string): void;
  getPlugin<T extends Plugin>(id: string): T | null;
  
  // Essential Services
  renderer: RendererService;
  events: EventService;
  scene: SceneService;
}
```

### Plugin System

플러그인 시스템은 Modern Vector.js의 핵심 아키텍처입니다. 모든 기능은 플러그인을 통해 확장됩니다.

```typescript
interface Plugin {
  readonly id: string;
  readonly version: string;
  readonly dependencies?: string[];
  
  install(engine: VectorEngine): void;
  uninstall(engine: VectorEngine): void;
}
```

### Core Services

#### RendererService

렌더링을 담당하는 서비스입니다. 다양한 렌더러(Canvas, SVG, WebGL 등)를 등록하고 관리합니다.

```typescript
interface RendererService {
  register(renderer: Renderer): void;
  setActive(rendererId: string): void;
  render(scene: Scene): void;
}
```

#### EventService

이벤트 관리를 담당하는 서비스입니다. 이벤트 발행과 구독을 지원합니다.

```typescript
interface EventService extends EventEmitter {
  createNamespace(name: string): EventEmitter;
}
```

#### SceneService

씬(Scene) 관리를 담당하는 서비스입니다. 씬 생성, 활성화, 관리 기능을 제공합니다.

```typescript
interface SceneService {
  create(): Scene;
  getActive(): Scene;
  setActive(scene: Scene): void;
}
```

## 플러그인 개발

### 플러그인 생명주기

1. **등록**: `engine.use(plugin)` 메서드를 통해 플러그인 등록
2. **설치**: 플러그인의 `install` 메서드 호출
3. **사용**: 플러그인이 제공하는 기능 사용
4. **제거**: `engine.remove(pluginId)` 메서드를 통해 플러그인 제거
5. **제거 후 정리**: 플러그인의 `uninstall` 메서드 호출

### 플러그인 의존성 관리

플러그인은 다른 플러그인에 의존할 수 있습니다. 의존성은 `dependencies` 속성을 통해 선언됩니다.

```typescript
class ShapePlugin implements Plugin {
  readonly id = 'shape';
  readonly version = '1.0.0';
  readonly dependencies = ['math', 'transform'];
  
  install(engine: VectorEngine) {
    const math = engine.getPlugin<MathPlugin>('math');
    const transform = engine.getPlugin<TransformPlugin>('transform');
    // 플러그인 초기화
  }
  
  uninstall(engine: VectorEngine) {
    // 정리 작업
  }
}
```

## 빌드 및 개발

### 개발 환경 설정

```bash
# 의존성 설치
pnpm install

# 개발 모드 실행
pnpm dev

# 테스트 실행
pnpm test

# 빌드
pnpm build

# 린트
pnpm lint
```

### 디렉토리 구조

```
core/
├── src/
│   ├── core/           # 코어 시스템
│   │   ├── engine.ts   # VectorEngine 구현
│   │   ├── services/   # 코어 서비스
│   │   └── types/      # 타입 정의
│   ├── plugins/        # 기본 제공 플러그인
│   │   ├── core/       # 코어 플러그인
│   │   └── renderers/  # 렌더러 플러그인
│   ├── performance/    # 성능 최적화 관련 코드
│   └── index.ts        # 진입점
├── tests/              # 테스트 코드
├── package.json        # 패키지 정보
└── tsconfig.json       # TypeScript 설정
```

## API 문서

자세한 API 문서는 [Modern Vector.js 문서 사이트](https://github.com/username/modern-vector.js)에서 확인할 수 있습니다.

## 라이센스

MIT 