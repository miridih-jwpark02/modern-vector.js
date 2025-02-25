import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "highlight.js/styles/github.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Modern Vector.js Documentation",
  description: "Documentation for Modern Vector.js - A Modern Vector Graphics Library with Plugin System",
};

/**
 * Root layout component
 * 모든 페이지의 기본 레이아웃을 정의합니다.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>
          {`
            /* 다크 모드에서 highlight.js 스타일 */
            .dark .hljs {
              background: #1e1e1e;
              color: #dcdcdc;
            }
            .dark .hljs-keyword,
            .dark .hljs-selector-tag,
            .dark .hljs-tag,
            .dark .hljs-name {
              color: #569cd6;
            }
            .dark .hljs-attribute,
            .dark .hljs-literal,
            .dark .hljs-number,
            .dark .hljs-keyword {
              color: #b5cea8;
            }
            .dark .hljs-string,
            .dark .hljs-doctag {
              color: #ce9178;
            }
            .dark .hljs-title,
            .dark .hljs-section,
            .dark .hljs-selector-id {
              color: #dcdcaa;
            }
            .dark .hljs-comment {
              color: #6a9955;
            }
            .dark .hljs-meta,
            .dark .hljs-operator,
            .dark .hljs-punctuation {
              color: #d4d4d4;
            }
            .dark .hljs-template-tag {
              color: #d7ba7d;
            }
            .dark .hljs-type,
            .dark .hljs-class,
            .dark .hljs-builtin-name {
              color: #4ec9b0;
            }
            .dark .hljs-params {
              color: #9cdcfe;
            }
            .dark .hljs-variable,
            .dark .hljs-attr {
              color: #9cdcfe;
            }
            .dark .hljs-regexp {
              color: #d16969;
            }
            
            /* 코드 블록 스타일 개선 */
            .prose pre {
              margin: 1.5em 0;
              border-radius: 0.375rem;
              padding: 1rem;
              overflow-x: auto;
            }
            
            .prose code {
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
              font-size: 0.9em;
            }
            
            /* 링크 스타일 개선 */
            .prose a {
              text-decoration: none;
              transition: color 0.2s ease;
            }
            
            .prose a:hover {
              text-decoration: underline;
            }
            
            /* 테이블 스타일 개선 */
            .prose table {
              width: 100%;
              border-collapse: collapse;
              margin: 1.5em 0;
            }
            
            .prose table th,
            .prose table td {
              padding: 0.75rem;
              border: 1px solid hsl(var(--border));
            }
            
            .prose table th {
              background-color: hsl(var(--muted));
              font-weight: 600;
            }
            
            .dark .prose table th {
              background-color: hsl(var(--muted));
            }
            
            /* 헤더 스타일 개선 */
            .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
              scroll-margin-top: 5rem;
              position: relative;
            }
            
            .prose h1 {
              font-size: 2.25rem;
              margin-top: 2.5rem;
              margin-bottom: 1.5rem;
              font-weight: 700;
            }
            
            .prose h2 {
              font-size: 1.875rem;
              margin-top: 2rem;
              margin-bottom: 1rem;
              font-weight: 600;
              border-bottom: 1px solid hsl(var(--border));
              padding-bottom: 0.5rem;
            }
            
            .prose h3 {
              font-size: 1.5rem;
              margin-top: 1.5rem;
              margin-bottom: 0.75rem;
              font-weight: 600;
            }
            
            /* 목록 스타일 개선 */
            .prose ul, .prose ol {
              margin: 1.25em 0;
              padding-left: 1.625em;
            }
            
            .prose li {
              margin-bottom: 0.5em;
            }
            
            /* 인용구 스타일 개선 */
            .prose blockquote {
              border-left: 4px solid hsl(var(--border));
              padding-left: 1rem;
              font-style: italic;
              margin: 1.5em 0;
              color: hsl(var(--muted-foreground));
            }
            
            /* 다크 모드 텍스트 색상 개선 */
            .dark .prose {
              color: hsl(var(--foreground));
            }
            
            .dark .prose h1,
            .dark .prose h2,
            .dark .prose h3,
            .dark .prose h4,
            .dark .prose h5,
            .dark .prose h6 {
              color: hsl(var(--foreground));
            }
            
            .dark .prose p,
            .dark .prose ul,
            .dark .prose ol,
            .dark .prose li {
              color: hsl(var(--foreground));
            }
            
            .dark .prose strong {
              color: hsl(var(--foreground));
            }
            
            .dark .prose table td {
              color: hsl(var(--foreground));
            }
            
            .dark .prose table th {
              color: hsl(var(--foreground));
            }
            
            /* 다크 모드에서 API 네비게이션 스타일 */
            .dark .api-nav-link {
              color: hsl(var(--foreground));
            }
          `}
        </style>
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
} 