'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * 목차 항목 인터페이스
 */
interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * 목차 컴포넌트 Props
 */
interface TableOfContentsProps {
  className?: string;
}

/**
 * 목차(Table of Contents) 컴포넌트
 * 
 * 문서 내의 헤딩 요소를 추출하여 목차를 생성합니다.
 */
export default function TableOfContents({ className = '' }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const pathname = usePathname();

  // 헤딩 요소 추출
  useEffect(() => {
    const article = document.querySelector('article');
    if (!article) return;

    const elements = Array.from(
      article.querySelectorAll('h1, h2, h3, h4, h5, h6')
    ).filter((element) => element.id);

    const items: TocItem[] = elements.map((element) => ({
      id: element.id,
      text: element.textContent || '',
      level: Number(element.tagName.substring(1)),
    }));

    setHeadings(items);
  }, [pathname]);

  // 스크롤 위치에 따른 활성 헤딩 감지
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const headingElements = headings.map(({ id }) => 
        document.getElementById(id)
      );
      
      const visibleHeadings = headingElements.filter((el) => {
        if (!el) return false;
        
        const rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= 300;
      });
      
      if (visibleHeadings.length === 0) {
        // 화면에 보이는 헤딩이 없으면 첫 번째 헤딩을 활성화
        setActiveId(headings[0].id);
      } else {
        // 가장 위에 있는 헤딩을 활성화
        setActiveId(visibleHeadings[0]?.id || '');
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className={`toc ${className}`}>
      <h3 className="text-lg font-semibold mb-3">목차</h3>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`pl-${(heading.level - 1) * 2} ${
              activeId === heading.id ? 'text-primary font-medium' : 'text-foreground/80'
            }`}
          >
            <a
              href={`#${heading.id}`}
              className="hover:text-primary transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: 'smooth',
                });
                setActiveId(heading.id);
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
} 