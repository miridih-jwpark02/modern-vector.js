import { allApiDocs, ApiDoc } from 'contentlayer/generated';
import { Metadata } from 'next';
import ApiDocPage from './page';

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
 * API 문서 페이지 서버 래퍼 컴포넌트
 *
 * @param props - 래퍼 props
 * @returns API 문서 페이지 컴포넌트
 */
export default function ApiDocWrapper({ params }: { params: { slug: string[] } }) {
  return <ApiDocPage params={params} />;
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
