---
title: Plugin
description: Modern Vector.js의 플러그인 인터페이스 및 관련 타입에 대한 API 문서
---

# Plugin

`Plugin` 인터페이스는 Modern Vector.js의 확장 시스템의 기반입니다. 모든 플러그인은 이 인터페이스를 구현해야 하며, 이를 통해 라이브러리의 기능을 확장하고 사용자 정의 기능을 추가할 수 있습니다.

## 구문

```typescript
interface Plugin {
  readonly id: string;
  readonly version: string;
  readonly dependencies?: string[];
  
  install(engine: VectorEngine): void | Promise<void>;
  uninstall(engine: VectorEngine): void | Promise<void>;
}
```

## 속성

### `id: string`

플러그인의 고유 식별자입니다. 이 값은 플러그인 등록 및 조회에 사용됩니다.

### `version: string`

플러그인의 버전 정보입니다. 일반적으로 Semantic Versioning(SemVer) 형식을 따릅니다.

### `dependencies?: string[]` (선택사항)

이 플러그인이 의존하는 다른 플러그인의 ID 목록입니다. 엔진은 이 플러그인을 설치하기 전에 모든 의존성이 이미 설치되어 있는지 확인합니다.

## 메서드

### `install(engine: VectorEngine): void | Promise<void>`

플러그인을 엔진에 설치합니다. 이 메서드는 플러그인이 필요로 하는 모든 초기화 작업을 수행해야 합니다.

- **매개변수**: `engine` - 플러그인이 설치될 VectorEngine 인스턴스
- **반환값**: void 또는 Promise&lt;void&gt; (비동기 초기화 지원)

### `uninstall(engine: VectorEngine): void | Promise<void>`

플러그인을 엔진에서 제거합니다. 이 메서드는 플러그인이 할당한 모든 리소스를 정리해야 합니다.

- **매개변수**: `engine` - 플러그인이 제거될 VectorEngine 인스턴스
- **반환값**: void 또는 Promise&lt;void&gt; (비동기 정리 지원)

## 관련 타입

### PluginOptions

```typescript
interface PluginOptions {
  [key: string]: any;
}
```

플러그인 생성자에 전달되는 옵션 객체의 기본 인터페이스입니다. 각 플러그인은 이 인터페이스를 확장하여 자체 옵션을 정의할 수 있습니다.

### PluginConstructor

```typescript
interface PluginConstructor<T extends Plugin = Plugin, O extends PluginOptions = PluginOptions> {
  new (options?: O): T;
}
```

플러그인 클래스의 생성자 타입입니다. 이 타입은 플러그인 팩토리 함수나 플러그인 등록 시스템에서 사용됩니다.

## 예제

### 기본 플러그인 구현

```typescript
import { Plugin, VectorEngine } from 'modern-vector';

interface GridPluginOptions {
  size?: number;
  color?: string;
  visible?: boolean;
}

class GridPlugin implements Plugin {
  readonly id = 'grid';
  readonly version = '1.0.0';
  readonly dependencies = ['renderer'];
  
  private size: number;
  private color: string;
  private visible: boolean;
  
  constructor(options: GridPluginOptions = {}) {
    this.size = options.size || 20;
    this.color = options.color || '#cccccc';
    this.visible = options.visible !== undefined ? options.visible : true;
  }
  
  install(engine: VectorEngine): void {
    // 렌더러 플러그인 가져오기
    const renderer = engine.getPlugin('renderer');
    if (!renderer) {
      throw new Error('Renderer plugin is required');
    }
    
    // 그리드 렌더링 이벤트 리스너 등록
    engine.on('beforeRender', this.renderGrid.bind(this));
    
    // 그리드 관련 서비스 등록
    engine.registerService('grid', {
      setSize: (size: number) => { this.size = size; },
      setColor: (color: string) => { this.color = color; },
      setVisible: (visible: boolean) => { this.visible = visible; },
      getSize: () => this.size,
      getColor: () => this.color,
      isVisible: () => this.visible
    });
    
    console.log(`GridPlugin ${this.version} installed`);
  }
  
  uninstall(engine: VectorEngine): void {
    // 이벤트 리스너 제거
    engine.off('beforeRender', this.renderGrid.bind(this));
    
    console.log(`GridPlugin ${this.version} uninstalled`);
  }
  
  private renderGrid(): void {
    if (!this.visible) return;
    
    // 그리드 렌더링 로직
    // ...
  }
}
```

### 비동기 플러그인 구현

```typescript
import { Plugin, VectorEngine } from 'modern-vector';

class AssetLoaderPlugin implements Plugin {
  readonly id = 'asset-loader';
  readonly version = '1.0.0';
  
  private assets: Map<string, any> = new Map();
  
  async install(engine: VectorEngine): Promise<void> {
    // 에셋 비동기 로드
    await this.loadAssets();
    
    // 에셋 서비스 등록
    engine.registerService('assets', {
      getAsset: (id: string) => this.assets.get(id),
      hasAsset: (id: string) => this.assets.has(id)
    });
    
    console.log('AssetLoaderPlugin installed');
  }
  
  uninstall(engine: VectorEngine): void {
    // 리소스 정리
    this.assets.clear();
    console.log('AssetLoaderPlugin uninstalled');
  }
  
  private async loadAssets(): Promise<void> {
    // 에셋 로딩 로직
    return new Promise(resolve => {
      setTimeout(() => {
        this.assets.set('image1', { /* 이미지 데이터 */ });
        this.assets.set('image2', { /* 이미지 데이터 */ });
        resolve();
      }, 1000);
    });
  }
}
```

## 플러그인 사용 예제

```typescript
import { VectorEngine } from 'modern-vector';
import { GridPlugin } from './plugins/grid-plugin';

const engine = new VectorEngine();

// 플러그인 등록
engine.use(new GridPlugin({ size: 30, color: '#dddddd' }));

// 플러그인 서비스 사용
const gridService = engine.getService('grid');
gridService.setSize(50);
gridService.setVisible(true);

// 플러그인 제거
engine.remove('grid');
```

## 모범 사례

1. **고유한 ID 사용**: 플러그인 ID는 고유해야 하며, 가능하면 네임스페이스를 사용하세요 (예: `@company/feature`).
2. **의존성 명시**: 플러그인이 다른 플러그인에 의존하는 경우, `dependencies` 배열에 명시적으로 선언하세요.
3. **적절한 리소스 정리**: `uninstall` 메서드에서 모든 리소스(이벤트 리스너, 타이머 등)를 정리하세요.
4. **옵션 기본값 제공**: 생성자에서 모든 옵션에 대한 기본값을 제공하여 사용자가 모든 옵션을 지정할 필요가 없도록 하세요.
5. **서비스 등록**: 플러그인의 기능을 외부에 노출하려면 서비스를 등록하세요.

## 관련 API

- [VectorEngine](/docs/api-reference/core/vector-engine) - 플러그인이 설치되는 핵심 엔진
- [Service](/docs/api-reference/core/service) - 서비스 시스템 