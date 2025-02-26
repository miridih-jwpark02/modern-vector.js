---
title: API 문서 생성
description: TypeDoc을 사용하여 Modern Vector.js API 문서를 생성하는 방법
---

# API 문서 생성

Modern Vector.js는 TypeDoc을 사용하여 TypeScript 코드에서 API 문서를 자동으로 생성합니다. 이 문서에서는 API 문서 생성 방법과 문서 사이트에 통합하는 방법에 대해 설명합니다.

## TypeDoc 설정

### 설치

TypeDoc은 개발 의존성으로 설치되어 있습니다. `package.json` 파일에 다음과 같이 설정되어 있습니다:

```json
{
  "devDependencies": {
    "typedoc": "^0.25.0",
    "typedoc-plugin-markdown": "^3.17.0"
  }
}
```

### 설정 파일

TypeDoc 설정은 `packages/core/typedoc.json` 파일에 정의되어 있습니다:

```json
{
  "entryPoints": ["./src/index.ts"],
  "out": "../docs-site/public/api-docs",
  "plugin": ["typedoc-plugin-markdown"],
  "theme": "markdown",
  "readme": "none",
  "excludePrivate": true,
  "excludeProtected": true,
  "excludeInternal": true,
  "excludeExternals": true,
  "githubPages": false,
  "sort": ["source-order"],
  "categorizeByGroup": true,
  "categoryOrder": ["Core", "Services", "Plugins", "*"]
}
```

주요 설정:
- `entryPoints`: 문서화할 진입점 파일
- `out`: 생성된 문서의 출력 디렉토리
- `plugin`: 사용할 플러그인 (마크다운 형식으로 출력)
- `excludePrivate`, `excludeProtected`, `excludeInternal`: 비공개, 보호된, 내부 멤버 제외
- `categoryOrder`: 카테고리 정렬 순서

## 문서 생성 스크립트

API 문서 생성을 위한 스크립트는 `packages/docs-site/scripts/generate-docs.js` 파일에 정의되어 있습니다:

```javascript
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// 코어 패키지 경로
const corePath = path.resolve(__dirname, '../../core');

// TypeDoc 실행
console.log('Generating API documentation...');
try {
  execSync('pnpm typedoc', { cwd: corePath, stdio: 'inherit' });
  console.log('API documentation generated successfully!');
} catch (error) {
  console.error('Error generating API documentation:', error);
  process.exit(1);
}
```

이 스크립트는 core 패키지 디렉토리에서 `pnpm typedoc` 명령을 실행하여 API 문서를 생성합니다.

## 문서 생성 명령

API 문서를 생성하려면 다음 명령을 실행합니다:

```bash
# docs-site 디렉토리에서
pnpm run generate-docs
```

이 명령은 `package.json` 파일에 다음과 같이 정의되어 있습니다:

```json
{
  "scripts": {
    "generate-docs": "node scripts/generate-docs.js"
  }
}
```

## TSDoc 주석 작성 가이드

TypeDoc은 TSDoc 형식의 주석을 사용하여 API 문서를 생성합니다. 다음은 TSDoc 주석 작성 가이드입니다:

### 클래스 문서화

```typescript
/**
 * Vector Engine 구현 클래스
 * 
 * 플러그인 기반 벡터 그래픽 시스템의 핵심 엔진입니다.
 * 
 * @example
 * ```typescript
 * const engine = new VectorEngine();
 * engine.use(new CanvasRenderer());
 * ```
 */
export class VectorEngineImpl implements VectorEngine {
  // ...
}
```

### 메서드 문서화

```typescript
/**
 * 플러그인을 엔진에 등록합니다.
 * 
 * @param plugin - 등록할 Plugin 인스턴스
 * @throws {Error} 이미 동일한 ID의 플러그인이 등록된 경우
 * @returns 등록된 플러그인 인스턴스
 */
public use(plugin: Plugin): Plugin {
  // ...
}
```

### 인터페이스 문서화

```typescript
/**
 * 벡터 엔진의 플러그인 인터페이스
 * 
 * 모든 플러그인은 이 인터페이스를 구현해야 합니다.
 */
export interface Plugin {
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

### 타입 문서화

```typescript
/**
 * 이벤트 핸들러 함수 타입
 * 
 * @typeParam T - 이벤트 데이터 타입
 * @param data - 이벤트 데이터
 */
export type EventHandler<T = any> = (data: T) => void;
```

## 문서 사이트 통합

생성된 API 문서는 `packages/docs-site/public/api-docs` 디렉토리에 저장됩니다. 이 문서는 Next.js 애플리케이션에서 다음과 같이 통합됩니다:

### API 문서 페이지

`src/app/api/page.tsx` 파일에서 API 문서 목록을 표시합니다:

```tsx
import { getApiDocsList } from '@/lib/api-docs';

export default function ApiDocsPage() {
  const apiDocs = getApiDocsList();
  
  return (
    <div>
      <h1>API 문서</h1>
      <ul>
        {apiDocs.map((doc) => (
          <li key={doc.path}>
            <a href={`/api/${doc.path}`}>{doc.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### API 문서 유틸리티

`src/lib/api-docs.ts` 파일에서 API 문서 목록을 가져오는 함수를 정의합니다:

```typescript
import fs from 'fs';
import path from 'path';

export function getApiDocsList() {
  const apiDocsDir = path.join(process.cwd(), 'public/api-docs');
  const files = fs.readdirSync(apiDocsDir);
  
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const content = fs.readFileSync(path.join(apiDocsDir, file), 'utf-8');
      const titleMatch = content.match(/^# (.+)$/m);
      const title = titleMatch ? titleMatch[1] : file.replace('.md', '');
      
      return {
        path: file.replace('.md', ''),
        title
      };
    });
}
```

## 빌드 프로세스 통합

API 문서 생성은 빌드 프로세스에 통합되어 있습니다. `package.json` 파일에 다음과 같이 정의되어 있습니다:

```json
{
  "scripts": {
    "build": "pnpm run generate-docs && next build"
  }
}
```

이렇게 하면 `pnpm run build` 명령을 실행할 때 API 문서가 자동으로 생성됩니다.

## 문제 해결

### 문서 생성 실패

API 문서 생성이 실패하는 경우:

1. TypeScript 코드에 오류가 없는지 확인
2. TypeDoc 버전이 호환되는지 확인
3. `typedoc.json` 설정이 올바른지 확인

### 문서 내용 누락

일부 API 문서 내용이 누락된 경우:

1. TSDoc 주석이 올바르게 작성되었는지 확인
2. `typedoc.json` 설정에서 `excludePrivate`, `excludeProtected` 등의 설정 확인
3. 문서화하려는 항목이 `index.ts`에서 내보내졌는지 확인

### 스타일 문제

생성된 마크다운 문서의 스타일에 문제가 있는 경우:

1. `typedoc-plugin-markdown` 플러그인 버전 확인
2. 마크다운 렌더링 컴포넌트 확인 