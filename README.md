# Modern Vector.js

Modern Vector.js는 플러그인 기반의 벡터 그래픽 라이브러리입니다. Canvas와 SVG 렌더링을 지원하며, 확장 가능한 아키텍처를 제공합니다.

## 모노레포 구조

이 프로젝트는 Turborepo와 pnpm workspace를 사용한 모노레포로 구성되어 있습니다.

### 패키지

- `packages/core`: Modern Vector.js 라이브러리 코어
- `packages/docs-site`: 문서 사이트 및 인터랙티브 예제

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

## 주요 기능

- 플러그인 기반 아키텍처
- Canvas 및 SVG 렌더링 지원
- 다양한 Shape 지원 (Rectangle, Circle, Line, Path, Text)
- 변환 (Translation, Rotation, Scale) 지원
- Path 연산 (Union, Intersect, Subtract, XOR) 지원

## 라이센스

MIT