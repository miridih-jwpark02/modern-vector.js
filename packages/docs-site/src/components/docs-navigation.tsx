"use client";

import Link from 'next/link';
import { allDocs } from 'contentlayer/generated';

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
 * 문서 네비게이션 컴포넌트 props
 */
interface DocsNavigationProps {
  currentSlug?: string;
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
 * 문서 네비게이션 컴포넌트
 * 
 * @param props - 컴포넌트 props
 * @returns 문서 네비게이션 컴포넌트
 */
export function DocsNavigation({ currentSlug }: DocsNavigationProps) {
  const docCategories = getDocsByCategory();
  
  return (
    <div className="w-full">
      {docCategories.map((category) => (
        <div key={category.name} className="mb-6">
          <h4 className="font-medium mb-2 text-sm text-foreground">{category.title}</h4>
          <ul className="space-y-1">
            {category.items.map((doc) => (
              <li key={doc.slug}>
                <Link 
                  href={`/docs/${doc.slug}`} 
                  className={`text-sm block py-1 px-2 rounded-md ${
                    currentSlug === doc.slug 
                      ? 'bg-muted font-medium text-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {doc.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
} 