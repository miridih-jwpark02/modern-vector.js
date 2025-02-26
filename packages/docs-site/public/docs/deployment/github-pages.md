---
title: GitHub Pages 배포
description: Modern Vector.js 문서 사이트를 GitHub Pages에 배포하는 방법
---

# GitHub Pages 배포

Modern Vector.js 문서 사이트는 GitHub Pages를 통해 배포됩니다. 이 문서에서는 GitHub Pages 배포 설정 방법과 자동화된 배포 워크플로우에 대해 설명합니다.

## 배포 설정

### GitHub Actions 워크플로우

Modern Vector.js는 GitHub Actions를 사용하여 문서 사이트를 자동으로 빌드하고 GitHub Pages에 배포합니다. 워크플로우 설정은 `.github/workflows/deploy-docs.yml` 파일에 정의되어 있습니다.

```yaml
name: Deploy Docs to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          run_install: false
      
      - name: Install dependencies
        run: pnpm install --no-frozen-lockfile
      
      - name: Build core package
        run: cd packages/core && pnpm build
      
      - name: Build docs site
        run: cd packages/docs-site && pnpm build
      
      - name: Setup Pages
        uses: actions/configure-pages@v3
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./packages/docs-site/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

이 워크플로우는 다음과 같은 작업을 수행합니다:

1. `main` 브랜치에 푸시하거나 수동으로 워크플로우를 트리거할 때 실행됩니다.
2. 저장소를 체크아웃하고 Node.js와 pnpm을 설정합니다.
3. 의존성을 설치하고 core 패키지와 docs-site 패키지를 빌드합니다.
4. 빌드된 문서 사이트를 GitHub Pages에 배포합니다.

### Next.js 설정

GitHub Pages에서 Next.js 애플리케이션을 올바르게 실행하려면 `next.config.js` 파일에 다음과 같은 설정이 필요합니다:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/modern-vector.js' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/modern-vector.js/' : '',
};

module.exports = nextConfig;
```

- `output: 'export'`: 정적 HTML 파일로 내보내기
- `distDir: 'dist'`: 빌드 결과물을 `dist` 디렉토리에 저장
- `basePath`: GitHub Pages의 저장소 이름에 맞게 기본 경로 설정
- `assetPrefix`: 정적 자산(CSS, JavaScript 등)의 경로 접두사 설정

## SPA 라우팅 지원

GitHub Pages는 기본적으로 SPA(Single Page Application) 라우팅을 지원하지 않습니다. 이를 해결하기 위해 다음과 같은 설정이 필요합니다:

### 404.html 페이지

`public/404.html` 파일을 생성하여 클라이언트 측 라우팅을 지원합니다:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Not Found</title>
  <script>
    // SPA를 위한 리다이렉션 스크립트
    (function() {
      // 현재 URL 가져오기
      var location = window.location;
      var pathname = location.pathname;
      
      // 저장소 이름 (GitHub Pages 경로)
      var repoName = 'modern-vector.js';
      
      // 저장소 이름으로 시작하는 경로인지 확인
      var pathSegments = pathname.split('/');
      var isInRepo = pathSegments[1] === repoName;
      
      // 새 URL 구성
      var redirectUrl = location.origin;
      
      if (isInRepo) {
        redirectUrl += '/' + repoName;
        
        // 쿼리 파라미터로 원래 경로 전달
        var path = pathname.replace('/' + repoName, '');
        if (path) {
          redirectUrl += '?path=' + encodeURIComponent(path);
        }
      }
      
      // 리다이렉션
      window.location.replace(redirectUrl);
    })();
  </script>
</head>
<body>
  <div class="container">
    <h1>페이지를 찾을 수 없습니다</h1>
    <p>요청하신 페이지를 찾을 수 없습니다. 홈페이지로 리다이렉션됩니다.</p>
  </div>
</body>
</html>
```

### GitHubPagesRedirect 컴포넌트

`src/components/github-pages-redirect.tsx` 파일을 생성하여 404 페이지에서 전달된 경로로 리다이렉션합니다:

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * GitHub Pages에서 SPA 라우팅을 지원하기 위한 리다이렉션 컴포넌트
 * 404.html에서 전달된 path 파라미터를 사용하여 적절한 경로로 리다이렉션합니다.
 */
export function GitHubPagesRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // URL에서 path 파라미터 확인
    const path = searchParams.get('path');
    
    // path 파라미터가 있으면 해당 경로로 리다이렉션
    if (path) {
      router.replace(path);
    }
  }, [router, searchParams]);
  
  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
}
```

### 레이아웃에 컴포넌트 추가

`src/app/layout.tsx` 파일에 `GitHubPagesRedirect` 컴포넌트를 추가합니다:

```tsx
import { GitHubPagesRedirect } from '@/components/github-pages-redirect';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GitHubPagesRedirect />
        {children}
      </body>
    </html>
  );
}
```

## GitHub Pages 설정

GitHub 저장소 설정에서 Pages 기능을 활성화하고 배포 소스를 설정해야 합니다:

1. GitHub 저장소 페이지로 이동
2. "Settings" 탭 클릭
3. 왼쪽 사이드바에서 "Pages" 클릭
4. "Build and deployment" 섹션에서:
   - Source: "GitHub Actions"를 선택

## 수동 배포

GitHub Actions 워크플로우를 수동으로 트리거하여 문서 사이트를 배포할 수 있습니다:

1. GitHub 저장소의 "Actions" 탭으로 이동
2. 왼쪽 사이드바에서 "Deploy Docs to GitHub Pages" 워크플로우 선택
3. 오른쪽 상단의 "Run workflow" 버튼 클릭
4. "Run workflow" 대화 상자에서 "Run workflow" 버튼 클릭

## 배포 확인

배포가 완료되면 `https://username.github.io/modern-vector.js/` 주소에서 문서 사이트를 확인할 수 있습니다.

## 문제 해결

### 404 오류

GitHub Pages에서 404 오류가 발생하는 경우:

1. `.github/workflows/deploy-docs.yml` 파일이 올바르게 설정되어 있는지 확인
2. `next.config.js` 파일에서 `basePath`와 `assetPrefix`가 올바르게 설정되어 있는지 확인
3. `public/404.html` 파일이 존재하고 올바르게 설정되어 있는지 확인
4. GitHub 저장소 설정에서 Pages 기능이 활성화되어 있는지 확인

### 정적 자산 로드 실패

정적 자산(CSS, JavaScript 등)이 로드되지 않는 경우:

1. `next.config.js` 파일에서 `assetPrefix`가 올바르게 설정되어 있는지 확인
2. 브라우저 개발자 도구에서 네트워크 탭을 확인하여 정적 자산의 URL이 올바른지 확인

### 클라이언트 측 라우팅 문제

클라이언트 측 라우팅이 작동하지 않는 경우:

1. `public/404.html` 파일이 올바르게 설정되어 있는지 확인
2. `src/components/github-pages-redirect.tsx` 파일이 올바르게 구현되어 있는지 확인
3. `src/app/layout.tsx` 파일에 `GitHubPagesRedirect` 컴포넌트가 추가되어 있는지 확인 