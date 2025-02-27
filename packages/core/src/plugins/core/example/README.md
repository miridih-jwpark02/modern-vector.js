# Example Plugin

이 플러그인은 Modern Vector.js 프레임워크 확장성의 예제를 보여주기 위한 기본 플러그인입니다.

## 기능

- 간단한 예제 기능 제공
- 플러그인 패턴 구현 예시
- 타입 안전한 메서드 확장 예시

## 설치 방법

```typescript
import { VectorEngineImpl } from '@modern-vector/core';
import { ExamplePlugin } from '@modern-vector/core/plugins/core/example';

// 엔진 인스턴스 생성
const engine = new VectorEngineImpl();

// 플러그인 설치
engine.use(new ExamplePlugin());

// 플러그인 기능 사용
const result = engine.executeExample({ value: 'custom-value' });
console.log(result);
// 출력: { id: 'uuid', data: 'custom-value', createdAt: Date }
```

## 옵션

`executeExample` 메서드는 다음 옵션을 지원합니다:

```typescript
interface ExampleOptions {
  /** 옵션 값 */
  value?: string;
  /** 추가 설정 */
  settings?: Record<string, any>;
}
```

## 반환 값

`executeExample` 메서드는 다음과 같은 구조의 객체를 반환합니다:

```typescript
interface ExampleResult {
  /** 결과 ID */
  id: string;
  /** 결과 데이터 */
  data: any;
  /** 생성 시간 */
  createdAt: Date;
}
```

## 플러그인 제거

플러그인 사용이 끝나면 다음과 같이 제거할 수 있습니다:

```typescript
engine.remove('example-plugin');
```

## 참고 사항

이 플러그인은 학습 목적으로 만들어진 예제입니다. 실제 애플리케이션에서는 더 복잡한 기능과 오류 처리를 구현해야 합니다. 