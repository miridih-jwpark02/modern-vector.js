---
title: Service
description: Modern Vector.js의 서비스 시스템에 대한 API 문서
---

# Service 시스템

Modern Vector.js의 서비스 시스템은 플러그인 간 통신과 기능 공유를 위한 메커니즘을 제공합니다. 서비스는 특정 기능이나 리소스에 대한 접근을 제공하는 객체로, 플러그인이나 애플리케이션 코드에서 사용할 수 있습니다.

## 개요

서비스 시스템은 다음과 같은 주요 기능을 제공합니다:

1. **플러그인 간 통신**: 플러그인은 서비스를 통해 다른 플러그인과 통신할 수 있습니다.
2. **기능 공유**: 플러그인은 자신의 기능을 서비스로 노출하여 다른 플러그인이나 애플리케이션 코드에서 사용할 수 있게 합니다.
3. **의존성 관리**: 서비스는 플러그인 간의 직접적인 의존성을 줄이는 데 도움이 됩니다.

## 서비스 등록 및 사용

### 서비스 등록

```typescript
// VectorEngine 인스턴스에 서비스 등록
engine.registerService<T>(serviceId: string, service: T): VectorEngine
```

#### 매개변수

- `serviceId`: 서비스의 고유 식별자
- `service`: 등록할 서비스 객체

#### 반환값

메서드 체이닝을 위한 VectorEngine 인스턴스

### 서비스 조회

```typescript
// 서비스 조회
engine.getService<T>(serviceId: string): T | undefined
```

#### 매개변수

- `serviceId`: 조회할 서비스의 식별자

#### 반환값

서비스 객체 또는 서비스가 없는 경우 undefined

## 서비스 인터페이스

서비스는 특별한 인터페이스를 구현할 필요가 없습니다. 어떤 객체든 서비스로 등록할 수 있습니다. 그러나 일관성을 위해 서비스 인터페이스를 정의하는 것이 좋습니다.

```typescript
// 로거 서비스 인터페이스 예시
interface LoggerService {
  log(message: string, level?: LogLevel): void;
  error(message: string, error?: Error): void;
  warn(message: string): void;
  info(message: string): void;
  debug(message: string): void;
}

// 렌더링 서비스 인터페이스 예시
interface RenderService {
  render(scene: Scene): void;
  clear(): void;
  resize(width: number, height: number): void;
  getContext(): RenderContext;
}
```

## 예제

### 서비스 등록 예제

```typescript
import { Plugin, VectorEngine } from 'modern-vector';

// 로거 서비스 인터페이스
interface LoggerService {
  log(message: string, level?: string): void;
  error(message: string, error?: Error): void;
  warn(message: string): void;
  info(message: string): void;
  debug(message: string): void;
}

// 로거 플러그인 구현
class LoggerPlugin implements Plugin {
  readonly id = 'logger';
  readonly version = '1.0.0';
  
  install(engine: VectorEngine): void {
    // 로거 서비스 구현
    const loggerService: LoggerService = {
      log: (message, level = 'info') => {
        console.log(`[${level.toUpperCase()}] ${message}`);
      },
      error: (message, error) => {
        console.error(`[ERROR] ${message}`, error);
      },
      warn: (message) => {
        console.warn(`[WARN] ${message}`);
      },
      info: (message) => {
        console.info(`[INFO] ${message}`);
      },
      debug: (message) => {
        console.debug(`[DEBUG] ${message}`);
      }
    };
    
    // 서비스 등록
    engine.registerService<LoggerService>('logger', loggerService);
  }
  
  uninstall(engine: VectorEngine): void {
    // 정리 작업 (필요한 경우)
  }
}
```

### 서비스 사용 예제

```typescript
import { Plugin, VectorEngine } from 'modern-vector';

// 다른 플러그인에서 로거 서비스 사용
class ShapePlugin implements Plugin {
  readonly id = 'shape';
  readonly version = '1.0.0';
  readonly dependencies = ['logger']; // 로거 플러그인에 의존
  
  install(engine: VectorEngine): void {
    // 로거 서비스 가져오기
    const logger = engine.getService<LoggerService>('logger');
    
    if (!logger) {
      throw new Error('Logger service is required');
    }
    
    // 로거 서비스 사용
    logger.info('ShapePlugin installed');
    
    // 도형 관련 서비스 등록
    engine.registerService('shape', {
      createRectangle: (x, y, width, height) => {
        logger.debug(`Creating rectangle at (${x}, ${y}) with size ${width}x${height}`);
        // 사각형 생성 로직
        return { type: 'rectangle', x, y, width, height };
      },
      createCircle: (x, y, radius) => {
        logger.debug(`Creating circle at (${x}, ${y}) with radius ${radius}`);
        // 원 생성 로직
        return { type: 'circle', x, y, radius };
      }
    });
  }
  
  uninstall(engine: VectorEngine): void {
    const logger = engine.getService<LoggerService>('logger');
    if (logger) {
      logger.info('ShapePlugin uninstalled');
    }
  }
}
```

### 애플리케이션 코드에서 서비스 사용

```typescript
import { VectorEngine } from 'modern-vector';
import { LoggerPlugin } from './plugins/logger-plugin';
import { ShapePlugin } from './plugins/shape-plugin';

// 엔진 인스턴스 생성
const engine = new VectorEngine();

// 플러그인 등록
engine.use(new LoggerPlugin())
      .use(new ShapePlugin());

// 서비스 사용
const logger = engine.getService<LoggerService>('logger');
const shapeService = engine.getService('shape');

if (logger && shapeService) {
  logger.info('Creating shapes');
  
  // 도형 생성
  const rectangle = shapeService.createRectangle(10, 10, 100, 50);
  const circle = shapeService.createCircle(150, 150, 30);
  
  logger.info('Shapes created');
}
```

## 모범 사례

1. **명확한 서비스 인터페이스 정의**: 서비스의 인터페이스를 명확하게 정의하여 사용자가 서비스의 기능을 쉽게 이해할 수 있도록 합니다.

2. **서비스 ID 네이밍 규칙**: 서비스 ID는 고유하고 의미 있는 이름을 사용하세요. 가능하면 네임스페이스를 사용하여 충돌을 방지하세요 (예: `@company/feature`).

3. **서비스 의존성 처리**: 서비스가 다른 서비스에 의존하는 경우, 해당 서비스가 존재하는지 확인하고 적절하게 처리하세요.

4. **타입 안전성 유지**: TypeScript의 제네릭을 활용하여 서비스 등록 및 조회 시 타입 안전성을 유지하세요.

5. **서비스 생명주기 관리**: 플러그인이 제거될 때 해당 플러그인이 등록한 서비스도 정리되어야 합니다.

## 관련 API

- [VectorEngine](/docs/api-reference/core/vector-engine) - 서비스 등록 및 조회 메서드를 제공하는 핵심 엔진
- [Plugin](/docs/api-reference/core/plugin) - 서비스를 등록하고 사용하는 플러그인 인터페이스 