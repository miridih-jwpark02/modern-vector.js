import Link from "next/link";
import { Button } from "@/components/ui/button";
import { allDocs } from "contentlayer/generated";

/**
 * 문서 카테고리 타입
 */
interface DocCategory {
  name: string;
  title: string;
  items: {
    title: string;
    slug: string;
    description?: string;
  }[];
}

/**
 * 카테고리 이름을 사람이 읽기 쉬운 형태로 변환
 * 
 * @param category - 카테고리 이름
 * @returns 변환된 카테고리 이름
 */
function formatCategoryName(category: string): string {
  // 하이픈을 공백으로 변환하고 각 단어의 첫 글자를 대문자로 변환
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * 문서를 카테고리별로 그룹화하는 함수
 * 
 * @returns 카테고리별로 그룹화된 문서 목록
 */
function getDocsByCategory(): DocCategory[] {
  // 문서 경로에서 카테고리 추출 (예: 'getting-started/project-structure' -> 'getting-started')
  const categories = allDocs.reduce<Record<string, DocCategory>>((acc, doc) => {
    if (!doc.slug) return acc;
    
    const [category] = doc.slug.split('/');
    
    if (!acc[category]) {
      acc[category] = {
        name: category,
        title: formatCategoryName(category),
        items: []
      };
    }
    
    acc[category].items.push({
      title: doc.title,
      slug: doc.slug,
      description: doc.description
    });
    
    return acc;
  }, {});
  
  // 카테고리 이름에 따라 정렬
  return Object.values(categories).sort((a, b) => {
    // 특정 카테고리 순서 정의
    const order: Record<string, number> = {
      'getting-started': 1,
      'core-concepts': 2,
      'api-reference': 3,
      'api-docs': 4,
      'deployment': 5
    };
    
    return (order[a.name] || 99) - (order[b.name] || 99);
  });
}

/**
 * Documentation page component
 * 문서 페이지 컴포넌트입니다.
 */
export default function DocsPage() {
  const docCategories = getDocsByCategory();
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
          <p className="text-muted-foreground mt-2">
            Learn how to use Modern Vector.js to create amazing vector graphics
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="border rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="mb-4">
              Modern Vector.js is a powerful and flexible vector graphics library for JavaScript.
              It provides a simple API for creating and manipulating vector graphics, with support
              for multiple rendering backends including Canvas, SVG, and WebGL.
            </p>
            <p className="mb-4">
              The library is designed to be extensible through a plugin system, allowing you to
              add custom functionality as needed.
            </p>
            <div className="mt-4">
              <Button asChild>
                <Link href="/docs/getting-started/project-structure">Get Started</Link>
              </Button>
            </div>
          </div>
          
          <div className="border rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Documentation Structure</h2>
            <p className="mb-4">
              Our documentation is organized into the following sections:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              {docCategories.map((category) => (
                <li key={category.name}>
                  <strong>{category.title}</strong>: 
                  {category.items.map((doc, index) => (
                    <span key={doc.slug}>
                      {index > 0 ? ', ' : ' '}
                      <Link 
                        href={`/docs/${doc.slug}`} 
                        className="text-blue-600 hover:underline"
                      >
                        {doc.title}
                      </Link>
                    </span>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 