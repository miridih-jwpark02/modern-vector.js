# Modern Vector.js Documentation Site

이 프로젝트는 Modern Vector.js 라이브러리의 문서 사이트입니다. Next.js, Tailwind CSS, shadcn/ui를 사용하여 구축되었으며, TypeDoc으로 생성된 API 문서를 포함합니다.

## 기능

- **반응형 디자인**: 모든 디바이스에서 최적화된 사용자 경험
- **다크 모드 지원**: 사용자 선호도에 따른 테마 전환
- **TypeDoc 통합**: 자동 생성된 API 문서 통합
- **인터랙티브 예제**: 라이브 코드 에디터와 실행 결과 표시
- **검색 기능**: 문서 내용 전체 검색 지원
- **GitHub Pages 배포**: 자동화된 배포 워크플로우

## 개발 시작하기

### 필수 조건

- Node.js 18 이상
- pnpm 8 이상

### 설치

```bash
# 저장소 클론
git clone https://github.com/username/modern-vector.js.git
cd modern-vector.js

# 의존성 설치
pnpm install

# docs-site 디렉토리로 이동
cd packages/docs-site
```

### 개발 서버 실행

```bash
pnpm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### API 문서 생성

```bash
pnpm run generate-docs
```

이 명령은 TypeDoc을 사용하여 core 패키지의 API 문서를 생성하고 `public/api-docs` 디렉토리에 저장합니다.

### 빌드

```bash
pnpm run build
```

이 명령은 먼저 API 문서를 생성한 다음 Next.js 애플리케이션을 빌드합니다. 빌드된 파일은 `dist` 디렉토리에 저장됩니다.

### 정적 사이트 실행

```bash
pnpm run serve
```

이 명령은 빌드된 정적 사이트를 로컬 서버에서 실행합니다. 브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

## GitHub Pages 배포

이 프로젝트는 GitHub Actions를 사용하여 GitHub Pages에 자동으로 배포됩니다. `main` 브랜치에 변경사항을 푸시하면 워크플로우가 실행되어 문서 사이트를 빌드하고 `gh-pages` 브랜치에 배포합니다.

### 수동 배포

수동으로 배포하려면 GitHub Actions 워크플로우를 수동으로 트리거할 수 있습니다:

1. GitHub 저장소의 "Actions" 탭으로 이동
2. "Deploy Docs to GitHub Pages" 워크플로우 선택
3. "Run workflow" 버튼 클릭

## 프로젝트 구조

```
docs-site/
├── public/
│   ├── api-docs/     # TypeDoc으로 생성된 API 문서
│   └── 404.html      # GitHub Pages SPA 라우팅을 위한 404 페이지
├── src/
│   ├── app/          # Next.js 앱 라우터
│   │   ├── layout.tsx       # 레이아웃 컴포넌트
│   │   ├── page.tsx         # 홈페이지
│   │   ├── docs/            # 문서 페이지
│   │   ├── examples/        # 예제 페이지
│   │   └── api/             # API 문서 페이지
│   ├── components/   # 재사용 가능한 컴포넌트
│   │   ├── ui/              # UI 컴포넌트
│   │   ├── code-blocks/     # 코드 블록 컴포넌트
│   │   ├── navigation/      # 네비게이션 컴포넌트
│   │   └── github-pages-redirect.tsx  # GitHub Pages SPA 라우팅 지원
│   ├── lib/          # 유틸리티 함수
│   └── types/        # TypeScript 타입 정의
├── next.config.js    # Next.js 설정
├── contentlayer.config.js  # ContentLayer 설정
├── tailwind.config.js      # Tailwind CSS 설정
├── package.json      # 프로젝트 메타데이터 및 의존성
└── README.md         # 프로젝트 문서
```

## 문서 작성 가이드

### 마크다운 문서 추가

1. `src/app/docs` 디렉토리에 새 마크다운 파일 생성
2. 다음 형식의 프론트매터 추가:

```md
---
title: 문서 제목
description: 문서 설명
---

# 문서 내용
```

### 예제 추가

1. `src/app/examples` 디렉토리에 새 디렉토리 생성
2. `page.tsx` 파일 생성 및 예제 코드 작성
3. 필요한 경우 컴포넌트 파일 추가

## 기술 스택

- [Next.js](https://nextjs.org/) - React 프레임워크
- [Tailwind CSS](https://tailwindcss.com/) - CSS 프레임워크
- [shadcn/ui](https://ui.shadcn.com/) - 재사용 가능한 컴포넌트 라이브러리
- [TypeDoc](https://typedoc.org/) - TypeScript 코드에서 문서 생성
- [ContentLayer](https://contentlayer.dev/) - 콘텐츠 관리
- [MDX](https://mdxjs.com/) - 마크다운 확장

## 라이센스

MIT 