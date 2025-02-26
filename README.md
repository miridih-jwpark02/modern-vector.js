# Modern Vector.js

Modern Vector.js는 플러그인 기반의 벡터 그래픽 라이브러리입니다. Canvas와 SVG 렌더링을 지원하며, 확장 가능한 아키텍처를 제공합니다.

## 소개

Modern Vector.js는 웹 애플리케이션에서 벡터 그래픽을 쉽게 다룰 수 있도록 설계된 JavaScript 라이브러리입니다. 플러그인 기반 아키텍처를 통해 필요한 기능만 선택적으로 사용할 수 있어 번들 크기를 최적화할 수 있습니다.

### 주요 특징

- **플러그인 기반 아키텍처**: 필요한 기능만 선택적으로 사용
- **다중 렌더러 지원**: Canvas, SVG, WebGL 렌더링 지원
- **확장 가능한 구조**: 사용자 정의 플러그인을 통한 기능 확장
- **최신 웹 표준**: 최신 JavaScript/TypeScript 기능 활용
- **성능 최적화**: 효율적인 렌더링 및 연산 처리

## 모노레포 구조

이 프로젝트는 Turborepo와 pnpm workspace를 사용한 모노레포로 구성되어 있습니다.

### 패키지

- `packages/core`: Modern Vector.js 라이브러리 코어
- `packages/docs-site`: 문서 사이트 및 인터랙티브 예제 (Next.js, Tailwind CSS, shadcn/ui)

## 시작하기

### 설치

```bash
# npm 사용
npm install modern-vector

# yarn 사용
yarn add modern-vector

# pnpm 사용
pnpm add modern-vector
```

### 기본 사용법

```javascript
import { VectorEngine } from 'modern-vector';
import { CanvasRenderer, ShapePlugin } from 'modern-vector/plugins';

// 엔진 초기화
const engine = new VectorEngine();

// 플러그인 등록
engine.use(new CanvasRenderer());
engine.use(new ShapePlugin());

// 캔버스 설정
const canvas = document.getElementById('canvas');
engine.renderer.setCanvas(canvas);

// 도형 생성
const rect = engine.shapes.createRect({
  x: 100,
  y: 100,
  width: 200,
  height: 150,
  fill: 'blue',
  stroke: 'black',
  strokeWidth: 2
});

// 씬에 추가
engine.scene.getActive().add(rect);

// 렌더링
engine.renderer.render();
```

## 개발 환경 설정

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 테스트
pnpm test

# 린트
pnpm lint

# 배포
pnpm deploy
```

## 문서 사이트

문서 사이트는 Next.js, Tailwind CSS, shadcn/ui를 사용하여 구축되었으며, TypeDoc으로 생성된 API 문서를 포함합니다.

### 문서 사이트 개발

```bash
# docs-site 디렉토리로 이동
cd packages/docs-site

# 개발 서버 실행
pnpm run dev

# API 문서 생성
pnpm run generate-docs

# 빌드
pnpm run build

# 정적 사이트 실행
pnpm run serve
```

## 주요 기능

- **플러그인 기반 아키텍처**
  - 코어 플러그인: Math, Shape, Transform
  - 렌더러 플러그인: Canvas, SVG, WebGL
  - 효과 플러그인: Filter, Animation
  - 도구 플러그인: Selection, Transform

- **다양한 Shape 지원**
  - Rectangle, Circle, Ellipse
  - Line, Polyline, Polygon
  - Path, Text

- **변환 (Transform) 지원**
  - Translation (이동)
  - Rotation (회전)
  - Scale (크기 조절)
  - Skew (기울이기)
  - Matrix 조합

- **Path 연산 지원**
  - Union (합집합)
  - Intersect (교집합)
  - Subtract (차집합)
  - XOR (배타적 논리합)

## 기여하기

기여는 언제나 환영합니다! 버그 리포트, 기능 요청, 풀 리퀘스트 등 모든 형태의 기여를 환영합니다.

## 라이센스

MIT