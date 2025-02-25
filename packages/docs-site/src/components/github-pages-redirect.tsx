"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * GitHub Pages SPA 리다이렉트 컴포넌트
 * 404.html에서 전달된 path 파라미터를 처리하여 올바른 경로로 리다이렉트합니다.
 */
export function GitHubPagesRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // 첫 로드 시에만 실행
    if (pathname === "/" || pathname === "") {
      const path = searchParams?.get("path");
      if (path) {
        // path 파라미터가 있으면 해당 경로로 라우팅
        router.replace(`/${path}`);
      }
    }
  }, [pathname, router, searchParams]);
  
  return null;
} 