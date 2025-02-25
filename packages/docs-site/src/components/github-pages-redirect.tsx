"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * GitHub Pages SPA 리다이렉트 컴포넌트
 * 404.html에서 전달된 path 파라미터를 처리하여 올바른 경로로 리다이렉트합니다.
 */
export function GitHubPagesRedirect() {
  return (
    <Suspense fallback={null}>
      <RedirectHandler />
    </Suspense>
  );
}

/**
 * 실제 리다이렉트 로직을 처리하는 컴포넌트
 * useSearchParams()를 사용하므로 Suspense 경계 내에서 사용해야 합니다.
 */
function RedirectHandler() {
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