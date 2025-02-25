import Link from 'next/link';
import { allApiDocs, ApiDoc } from 'contentlayer/generated';
import { Metadata } from 'next';
import { Suspense } from 'react';

/**
 * API 문서 메타데이터
 */
export const metadata: Metadata = {
  title: 'API Documentation | Modern Vector.js',
  description: 'API documentation for Modern Vector.js library',
};

/**
 * API 문서 인덱스 페이지 컴포넌트
 */
export default function ApiDocsPage() {
  // 카테고리별 문서 그룹화
  const categories = {
    classes: allApiDocs.filter((doc: ApiDoc) => doc.category === 'classes'),
    interfaces: allApiDocs.filter((doc: ApiDoc) => doc.category === 'interfaces'),
    'type-aliases': allApiDocs.filter((doc: ApiDoc) => doc.category === 'type-aliases'),
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* 사이드바 네비게이션 */}
      <aside className="w-full md:w-64 p-4 border-r border-border bg-card">
        <nav className="api-nav">
          <Suspense fallback={<div>Loading...</div>}>
            <ApiNavLinks categories={categories} />
          </Suspense>
        </nav>
      </aside>
      
      {/* 문서 내용 */}
      <main className="flex-1 p-6">
        <article className="prose dark:prose-invert max-w-none">
          <h1>Modern Vector.js API Documentation</h1>
          <p>
            Welcome to the API documentation for Modern Vector.js. This documentation provides detailed information about the classes, interfaces, and type aliases available in the library.
          </p>
          
          <h2>Getting Started</h2>
          <p>
            To get started with Modern Vector.js, please refer to the following sections:
          </p>
          
          <ul>
            <li>
              <Link href="/api-docs/classes" className="text-primary hover:underline">
                Classes
              </Link>
              : Core classes that provide the main functionality of the library.
            </li>
            <li>
              <Link href="/api-docs/interfaces" className="text-primary hover:underline">
                Interfaces
              </Link>
              : Interfaces that define the structure of various components.
            </li>
            <li>
              <Link href="/api-docs/type-aliases" className="text-primary hover:underline">
                Type Aliases
              </Link>
              : Type definitions used throughout the library.
            </li>
          </ul>
          
          <h2>Main Components</h2>
          <p>
            The main components of Modern Vector.js include:
          </p>
          
          <ul>
            {categories.classes.slice(0, 5).map((item: ApiDoc) => (
              <li key={item.slug}>
                <Link href={item.url} className="text-primary hover:underline">
                  {item.title}
                </Link>
                {item.description && `: ${item.description}`}
              </li>
            ))}
          </ul>
          
          <p>
            For more detailed information, please navigate through the sidebar to explore the full API documentation.
          </p>
        </article>
      </main>
    </div>
  );
}

// 클라이언트 컴포넌트로 분리
'use client';

import { usePathname } from 'next/navigation';

/**
 * 현재 경로가 활성 상태인지 확인
 */
function isActive(path: string, currentPath: string | null): boolean {
  if (!currentPath) return false;
  return currentPath === path;
}

/**
 * API 네비게이션 링크 컴포넌트
 */
function ApiNavLinks({ categories }: { categories: Record<string, ApiDoc[]> }) {
  const pathname = usePathname();
  
  return (
    <>
      <Link
        href="/api-docs"
        className={`api-nav-link text-foreground ${isActive('/api-docs', pathname) ? 'active' : ''}`}
      >
        API Home
      </Link>
      
      <h3 className="text-lg font-semibold mt-4 mb-2">Classes</h3>
      <ul className="space-y-1">
        {categories.classes.map((item: ApiDoc) => (
          <li key={item.slug}>
            <Link
              href={item.url}
              className={`api-nav-link text-foreground ${isActive(item.url, pathname) ? 'active' : ''}`}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
      
      <h3 className="text-lg font-semibold mt-4 mb-2">Interfaces</h3>
      <ul className="space-y-1">
        {categories.interfaces.map((item: ApiDoc) => (
          <li key={item.slug}>
            <Link
              href={item.url}
              className={`api-nav-link text-foreground ${isActive(item.url, pathname) ? 'active' : ''}`}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
      
      <h3 className="text-lg font-semibold mt-4 mb-2">Type Aliases</h3>
      <ul className="space-y-1">
        {categories['type-aliases'].map((item: ApiDoc) => (
          <li key={item.slug}>
            <Link
              href={item.url}
              className={`api-nav-link text-foreground ${isActive(item.url, pathname) ? 'active' : ''}`}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
} 