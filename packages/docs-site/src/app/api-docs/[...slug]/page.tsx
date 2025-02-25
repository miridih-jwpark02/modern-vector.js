import { notFound } from 'next/navigation';
import Link from 'next/link';
import { allApiDocs, ApiDoc } from 'contentlayer/generated';
import { Metadata } from 'next';
import TableOfContents from '@/components/TableOfContents';

/**
 * API 문서 페이지 메타데이터 생성
 */
export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Promise<Metadata> {
  const slug = params.slug.join('/');
  const doc = allApiDocs.find((doc: ApiDoc) => doc.slug === slug);

  if (!doc) {
    return {
      title: 'API Documentation - Not Found',
    };
  }

  return {
    title: `${doc.title} | API Documentation`,
    description: doc.description || 'Modern Vector.js API Documentation',
  };
}

/**
 * 정적 경로 생성
 */
export function generateStaticParams() {
  // 빈 배열을 반환하면 빌드 오류가 발생하므로 기본 경로 추가
  if (allApiDocs.length === 0) {
    return [
      { slug: ['README'] },
      { slug: ['classes'] },
      { slug: ['interfaces'] },
      { slug: ['type-aliases'] },
    ];
  }
  
  return allApiDocs.map((doc: ApiDoc) => ({
    slug: doc.slug.split('/'),
  }));
}

/**
 * 현재 경로가 활성 상태인지 확인
 */
function isActive(path: string): boolean {
  // 클라이언트 사이드에서만 window 객체 사용
  if (typeof window !== 'undefined') {
    return window.location.pathname === path;
  }
  return false;
}

/**
 * API 문서 페이지 컴포넌트
 */
export default function ApiDocPage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/');
  const doc = allApiDocs.find((doc: ApiDoc) => doc.slug === slug);

  if (!doc) {
    notFound();
  }

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
          <Link
            href="/api-docs"
            className={`api-nav-link text-foreground ${isActive('/api-docs') ? 'active' : ''}`}
          >
            API Home
          </Link>
          
          <h3 className="text-lg font-semibold mt-4 mb-2">Classes</h3>
          <ul className="space-y-1">
            {categories.classes.map((item: ApiDoc) => (
              <li key={item.slug}>
                <Link
                  href={item.url}
                  className={`api-nav-link text-foreground ${isActive(item.url) ? 'active' : ''}`}
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
                  className={`api-nav-link text-foreground ${isActive(item.url) ? 'active' : ''}`}
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
                  className={`api-nav-link text-foreground ${isActive(item.url) ? 'active' : ''}`}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      
      {/* 문서 내용 */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <article className="prose dark:prose-invert max-w-none lg:col-span-3">
            <h1>{doc.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: doc.body.html }} />
          </article>
          
          <div className="hidden lg:block">
            <div className="sticky top-20">
              <TableOfContents className="mt-6" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 