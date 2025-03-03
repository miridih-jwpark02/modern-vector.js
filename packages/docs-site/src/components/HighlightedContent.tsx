'use client';

import { useEffect } from 'react';
import { initializeHighlighting, refreshHighlighting } from '@/lib/highlight-code';

interface HighlightedContentProps {
  html: string;
}

/**
 * HTML 내용에 코드 하이라이팅을 적용하는 클라이언트 컴포넌트
 *
 * @param props - 컴포넌트 props
 * @returns 하이라이팅된 HTML 컨텐츠
 */
export default function HighlightedContent({ html }: HighlightedContentProps) {
  useEffect(() => {
    // highlight.js 초기화
    initializeHighlighting();

    // 페이지 이동 후에도 하이라이팅 적용
    return () => {
      refreshHighlighting();
    };
  }, [html]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
