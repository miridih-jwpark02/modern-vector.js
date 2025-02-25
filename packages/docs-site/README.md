# Modern Vector.js Documentation Site

이 프로젝트는 Modern Vector.js 라이브러리의 문서 사이트입니다. Next.js, Tailwind CSS, shadcn/ui를 사용하여 구축되었으며, TypeDoc으로 생성된 API 문서를 포함합니다.

## 기능

- 반응형 디자인
- 다크 모드 지원
- TypeDoc으로 생성된 API 문서 통합
- 문서, 예제, API 레퍼런스 섹션

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

## 프로젝트 구조

```
docs-site/
├── public/
│   └── api-docs/     # TypeDoc으로 생성된 API 문서
├── src/
│   ├── app/          # Next.js 앱 라우터
│   ├── components/   # 재사용 가능한 컴포넌트
│   └── lib/          # 유틸리티 함수
├── next.config.js    # Next.js 설정
├── package.json      # 프로젝트 메타데이터 및 의존성
└── README.md         # 프로젝트 문서
```

## 기술 스택

- [Next.js](https://nextjs.org/) - React 프레임워크
- [Tailwind CSS](https://tailwindcss.com/) - CSS 프레임워크
- [shadcn/ui](https://ui.shadcn.com/) - 재사용 가능한 컴포넌트 라이브러리
- [TypeDoc](https://typedoc.org/) - TypeScript 코드에서 문서 생성 