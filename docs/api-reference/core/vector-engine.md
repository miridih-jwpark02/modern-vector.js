---
title: VectorEngine
description: Modern Vector.js의 핵심 엔진 클래스에 대한 API 문서
---

# VectorEngine

`VectorEngine`은 Modern Vector.js의 핵심 클래스로, 벡터 그래픽 시스템의 중앙 제어 지점 역할을 합니다. 이 클래스는 플러그인 관리, 서비스 제공, 렌더링 조정 등 라이브러리의 모든 주요 기능을 관리합니다.

## 구문

```typescript
class VectorEngine {
  constructor(options?: VectorEngineOptions);
  
  // 플러그인 관리
  use<T extends Plugin>(plugin: T): this;
  remove(pluginId: string): boolean;
  getPlugin<T extends Plugin>(id: string): T | undefined;
  hasPlugin(id: string): boolean;
  
  // 서비스 관리
  registerService<T>(serviceId: string, service: T): this;
  getService<T>(serviceId: string): T | undefined;
  
  // 렌더링 및 업데이트
  render(): void;
  update(deltaTime: number): void;
  
  // 이벤트 관리
  on<K extends keyof EngineEvents>(event: K, listener: EngineEventListener<K>): this;
  off<K extends keyof EngineEvents>(event: K, listener: EngineEventListener<K>): this;
  emit<K extends keyof EngineEvents>(event: K, ...args: Parameters<EngineEventListener<K>>): boolean;
  
  // 리소스 관리
  dispose(): void;
}
```

## 생성자

### `constructor(options?: VectorEngineOptions)`

VectorEngine 인스턴스를 생성합니다.

#### 매개변수

- `options` (선택사항): 엔진 초기화 옵션
  - `autoRender` (boolean): 자동 렌더링 활성화 여부 (기본값: `true`)
  - `plugins` (Plugin[]): 초기화 시 등록할 플러그인 배열
  - `services` (Record&lt;string, any&gt;): 초기화 시 등록할 서비스 객체

## 메서드

### 플러그인 관리

#### `use<T extends Plugin>(plugin: T): this`

플러그인을 엔진에 등록합니다.

- **매개변수**: `plugin` - 등록할 플러그인 인스턴스
- **반환값**: 메서드 체이닝을 위한 현재 인스턴스

#### `remove(pluginId: string): boolean`

ID로 플러그인을 제거합니다.

- **매개변수**: `pluginId` - 제거할 플러그인의 ID
- **반환값**: 제거 성공 여부

#### `getPlugin<T extends Plugin>(id: string): T | undefined`

ID로 플러그인을 조회합니다.

- **매개변수**: `id` - 조회할 플러그인의 ID
- **반환값**: 플러그인 인스턴스 또는 undefined

#### `hasPlugin(id: string): boolean`

특정 ID의 플러그인이 등록되어 있는지 확인합니다.

- **매개변수**: `id` - 확인할 플러그인의 ID
- **반환값**: 플러그인 존재 여부

### 서비스 관리

#### `registerService<T>(serviceId: string, service: T): this`

서비스를 엔진에 등록합니다.

- **매개변수**: 
  - `serviceId` - 서비스 식별자
  - `service` - 서비스 인스턴스
- **반환값**: 메서드 체이닝을 위한 현재 인스턴스

#### `getService<T>(serviceId: string): T | undefined`

ID로 서비스를 조회합니다.

- **매개변수**: `serviceId` - 조회할 서비스의 ID
- **반환값**: 서비스 인스턴스 또는 undefined

### 렌더링 및 업데이트

#### `render(): void`

현재 장면을 렌더링합니다. 등록된 렌더러 플러그인을 통해 실행됩니다.

#### `update(deltaTime: number): void`

엔진 상태를 업데이트합니다.

- **매개변수**: `deltaTime` - 이전 프레임과의 시간 차이(밀리초)

### 이벤트 관리

#### `on<K extends keyof EngineEvents>(event: K, listener: EngineEventListener<K>): this`

이벤트 리스너를 등록합니다.

- **매개변수**: 
  - `event` - 이벤트 이름
  - `listener` - 이벤트 핸들러 함수
- **반환값**: 메서드 체이닝을 위한 현재 인스턴스

#### `off<K extends keyof EngineEvents>(event: K, listener: EngineEventListener<K>): this`

이벤트 리스너를 제거합니다.

- **매개변수**: 
  - `event` - 이벤트 이름
  - `listener` - 제거할 이벤트 핸들러 함수
- **반환값**: 메서드 체이닝을 위한 현재 인스턴스

#### `emit<K extends keyof EngineEvents>(event: K, ...args: Parameters<EngineEventListener<K>>): boolean`

이벤트를 발생시킵니다.

- **매개변수**: 
  - `event` - 발생시킬 이벤트 이름
  - `args` - 이벤트 핸들러에 전달할 인자들
- **반환값**: 이벤트가 처리되었는지 여부

### 리소스 관리

#### `dispose(): void`

엔진과 관련된 모든 리소스를 정리합니다. 등록된 모든 플러그인의 `uninstall` 메서드를 호출합니다.

## 예제

### 기본 사용법

```typescript
import { VectorEngine } from 'modern-vector';
import { CanvasRendererPlugin } from 'modern-vector/plugins/canvas-renderer';
import { ShapePlugin } from 'modern-vector/plugins/shape';

// 엔진 인스턴스 생성
const engine = new VectorEngine();

// 플러그인 등록
engine.use(new CanvasRendererPlugin({ canvas: document.getElementById('canvas') }))
      .use(new ShapePlugin());

// 서비스 등록
engine.registerService('logger', {
  log: (message: string) => console.log(`[Vector]: ${message}`)
});

// 이벤트 리스너 등록
engine.on('render', () => {
  console.log('Scene rendered');
});

// 렌더링 실행
engine.render();

// 리소스 정리
// engine.dispose();
```

### 플러그인 관리

```typescript
// 플러그인 등록
engine.use(new ShapePlugin());

// 플러그인 조회
const shapePlugin = engine.getPlugin<ShapePlugin>('shape');

// 플러그인 존재 확인
if (engine.hasPlugin('shape')) {
  console.log('Shape plugin is installed');
}

// 플러그인 제거
engine.remove('shape');
```

## 관련 API

- [Plugin](/docs/api-reference/core/plugin) - 플러그인 인터페이스
- [Service](/docs/api-reference/core/service) - 서비스 시스템
- [CanvasRendererPlugin](/docs/api-reference/renderers/canvas-renderer) - Canvas 렌더러 플러그인 