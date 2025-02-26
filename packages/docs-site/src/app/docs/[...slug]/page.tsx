import { notFound } from 'next/navigation';
import { allDocs } from 'contentlayer/generated';
import { MDXRemote } from 'next-mdx-remote/rsc';

interface DocPageProps {
  params: {
    slug: string[];
  };
}

/**
 * 문서 페이지 컴포넌트
 * 
 * @param props - 페이지 props
 * @returns 문서 페이지 컴포넌트
 */
export default async function DocPage({ params }: DocPageProps) {
  // params 객체를 await로 처리
  const slugParams = await params;
  
  // slug 배열을 문자열로 변환 (예: ['getting-started', 'project-structure'] -> 'getting-started/project-structure')
  const slug = slugParams.slug?.join('/');
  
  // slug에 해당하는 문서 찾기
  const doc = allDocs.find((doc) => doc.slug === slug);
  
  // 문서가 없으면 404 페이지 표시
  if (!doc) {
    notFound();
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{doc.title}</h1>
      {doc.description && (
        <p className="text-muted-foreground mb-8">{doc.description}</p>
      )}
      <div className="prose dark:prose-invert max-w-none">
        <MDXRemote source={doc.body.raw} />
      </div>
    </div>
  );
}

/**
 * 정적 경로 생성
 * 
 * @returns 정적 경로 목록
 */
export function generateStaticParams() {
  // 모든 문서의 slug를 배열로 변환하여 반환
  return allDocs.map((doc) => {
    // slug가 없는 경우 빈 배열 반환
    if (!doc.slug) return { slug: [] };
    
    // slug를 '/'로 분리하여 배열로 변환
    const slugArray = doc.slug.split('/');
    return { slug: slugArray };
  });
} 