---
title: 프로젝트 구조
description: Modern Vector.js 프로젝트의 구조와 아키텍처 설명
---

# 프로젝트 구조

Modern Vector.js는 모노레포 구조로 구성되어 있으며, 여러 패키지로 나뉘어 있습니다. 이 문서에서는 프로젝트의 전체 구조와 각 패키지의 역할에 대해 설명합니다.

## 모노레포 구조

Modern Vector.js는 Turborepo와 pnpm workspace를 사용한 모노레포로 구성되어 있습니다. 이 구조는 다음과 같은 이점을 제공합니다:

- **코드 공유**: 패키지 간 코드 공유 및 의존성 관리 용이
- **빌드 최적화**: Turborepo를 통한 빌드 캐싱 및 병렬 처리
- **일관된 개발 환경**: 모든 패키지에 동일한 개발 환경 적용
- **통합 테스트**: 패키지 간 통합 테스트 용이

### 루트 디렉토리 구조

```
modern-vector.js/
├── .github/                # GitHub 관련 설정
│   └── workflows/          # GitHub Actions 워크플로우
├── packages/               # 패키지 디렉토리
│   ├── core/               # 코어 라이브러리
│   └── docs-site/          # 문서 사이트
├── .husky/                 # Git hooks 설정
├── .eslintrc.json          # ESLint 설정
├── .prettierrc             # Prettier 설정
├── .gitignore              # Git 무시 파일 목록
├── pnpm-workspace.yaml     # pnpm workspace 설정
├── turbo.json              # Turborepo 설정
├── package.json            # 루트 패키지 설정
└── README.md               # 프로젝트 설명
```

### pnpm Workspace 설정

`pnpm-workspace.yaml` 파일은 워크스페이스에 포함된 패키지를 정의합니다:

```yaml
packages:
  - 'packages/*'
```

### Turborepo 설정

`turbo.json` 파일은 Turborepo 파이프라인을 정의합니다:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["src/**/*.tsx", "src/**/*.ts", "test/**/*.ts", "test/**/*.tsx"]
    }
  }
}
```

## Core 패키지

Core 패키지는 Modern Vector.js의 핵심 라이브러리를 포함합니다. 이 패키지는 플러그인 기반 아키텍처를 구현하고 벡터 그래픽 시스템의 기본 기능을 제공합니다.

### 디렉토리 구조

```
packages/core/
├── src/                    # 소스 코드
│   ├── core/               # 코어 시스템
│   │   ├── engine.ts       # VectorEngine 구현
│   │   ├── services/       # 코어 서비스
│   │   │   ├── renderer.ts # RendererService
│   │   │   ├── events.ts   # EventService
│   │   │   └── scene.ts    # SceneService
│   │   └── types/          # 타입 정의
│   ├── plugins/            # 플러그인
│   │   ├── core/           # 코어 플러그인
│   │   └── renderers/      # 렌더러 플러그인
│   ├── performance/        # 성능 최적화
│   └── index.ts            # 진입점
├── dist/                   # 빌드 결과물
├── typedoc.json            # TypeDoc 설정
├── vite.config.ts          # Vite 설정
├── vitest.config.ts        # Vitest 설정
├── tsconfig.json           # TypeScript 설정
└── package.json            # 패키지 설정
```

### 핵심 모듈

#### Core System

Core System은 Modern Vector.js의 핵심 기능을 구현합니다:

- **VectorEngine**: 플러그인 관리 및 핵심 서비스 제공
- **Services**: 렌더링, 이벤트, 씬 관리 등의 핵심 서비스
- **Types**: 인터페이스, 타입, 열거형 등의 타입 정의

#### Plugins

Plugins는 Modern Vector.js의 기능을 확장하는 플러그인을 구현합니다:

- **Core Plugins**: Math, Shape, Transform 등의 기본 플러그인
- **Renderer Plugins**: Canvas, SVG, WebGL 등의 렌더러 플러그인

## Docs Site 패키지

Docs Site 패키지는 Modern Vector.js의 문서 사이트를 구현합니다. 이 패키지는 Next.js, Tailwind CSS, shadcn/ui를 사용하여 구축되었으며, TypeDoc으로 생성된 API 문서를 포함합니다.

### 디렉토리 구조

```
packages/docs-site/
├── public/                 # 정적 파일
│   ├── api-docs/           # TypeDoc으로 생성된 API 문서
│   └── 404.html            # GitHub Pages SPA 라우팅을 위한 404 페이지
├── src/                    # 소스 코드
│   ├── app/                # Next.js 앱 라우터
│   │   ├── layout.tsx      # 레이아웃 컴포넌트
│   │   ├── page.tsx        # 홈페이지
│   │   ├── docs/           # 문서 페이지
│   │   ├── examples/       # 예제 페이지
│   │   └── api/            # API 문서 페이지
│   ├── components/         # 재사용 가능한 컴포넌트
│   │   ├── ui/             # UI 컴포넌트
│   │   ├── code-blocks/    # 코드 블록 컴포넌트
│   │   ├── navigation/     # 네비게이션 컴포넌트
│   │   └── github-pages-redirect.tsx  # GitHub Pages SPA 라우팅 지원
│   ├── lib/                # 유틸리티 함수
│   └── types/              # TypeScript 타입 정의
├── scripts/                # 스크립트
│   └── generate-docs.js    # API 문서 생성 스크립트
├── dist/                   # 빌드 결과물
├── next.config.js          # Next.js 설정
├── contentlayer.config.js  # ContentLayer 설정
├── tailwind.config.js      # Tailwind CSS 설정
├── tsconfig.json           # TypeScript 설정
└── package.json            # 패키지 설정
```

### 주요 기능

#### 문서 페이지

문서 페이지는 Modern Vector.js의 사용법, API, 예제 등을 설명합니다:

- **Getting Started**: 시작하기 가이드
- **Core Concepts**: 핵심 개념 설명
- **API Reference**: API 문서
- **Examples**: 예제 코드

#### 예제 페이지

예제 페이지는 Modern Vector.js의 다양한 기능을 보여주는 인터랙티브 예제를 제공합니다:

- **Basic Shapes**: 기본 도형 그리기
- **Transformations**: 변환 적용하기
- **Path Operations**: 경로 연산
- **Plugins**: 플러그인 사용하기

#### API 문서

API 문서는 TypeDoc을 사용하여 자동으로 생성된 API 레퍼런스를 제공합니다:

- **Classes**: 클래스 문서
- **Interfaces**: 인터페이스 문서
- **Types**: 타입 문서
- **Functions**: 함수 문서

## 개발 워크플로우

### 로컬 개발

로컬 개발을 위한 명령어:

```bash
# 모든 패키지 개발 서버 실행
pnpm dev

# 특정 패키지 개발 서버 실행
pnpm --filter @modern-vector/core dev
pnpm --filter docs-site dev
```

### 빌드

빌드를 위한 명령어:

```bash
# 모든 패키지 빌드
pnpm build

# 특정 패키지 빌드
pnpm --filter @modern-vector/core build
pnpm --filter docs-site build
```

### 테스트

테스트를 위한 명령어:

```bash
# 모든 패키지 테스트
pnpm test

# 특정 패키지 테스트
pnpm --filter @modern-vector/core test
```

### 린트

린트를 위한 명령어:

```bash
# 모든 패키지 린트
pnpm lint

# 특정 패키지 린트
pnpm --filter @modern-vector/core lint
pnpm --filter docs-site lint
```

## 배포

### Core 패키지 배포

Core 패키지는 npm에 배포됩니다:

```bash
# 버전 업데이트
cd packages/core
pnpm version patch|minor|major

# 배포
pnpm publish
```

### Docs Site 배포

Docs Site는 GitHub Pages에 배포됩니다:

```bash
# 수동 배포
cd packages/docs-site
pnpm build
pnpm deploy
```

또는 GitHub Actions를 통한 자동 배포:

1. `main` 브랜치에 변경사항 푸시
2. GitHub Actions 워크플로우 실행
3. GitHub Pages에 배포 