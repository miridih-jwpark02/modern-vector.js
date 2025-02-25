import Link from 'next/link';
import { allApiDocs, ApiDoc } from 'contentlayer/generated';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { ApiNavLinks } from '@/components/ApiNavLinks';

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