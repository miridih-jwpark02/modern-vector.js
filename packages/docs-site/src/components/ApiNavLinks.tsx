'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ApiDoc } from 'contentlayer/generated';

/**
 * 현재 경로가 활성 상태인지 확인
 */
function isActive(path: string, currentPath: string | null): boolean {
  if (!currentPath) return false;
  return currentPath === path;
}

/**
 * API 네비게이션 링크 컴포넌트 Props
 */
interface ApiNavLinksProps {
  categories: {
    classes: ApiDoc[];
    interfaces: ApiDoc[];
    'type-aliases': ApiDoc[];
  };
}

/**
 * API 네비게이션 링크 컴포넌트
 * 클라이언트 컴포넌트로 usePathname()을 사용합니다.
 */
export function ApiNavLinks({ categories }: ApiNavLinksProps) {
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