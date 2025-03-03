'use client';

import { useMDXComponent } from 'next-contentlayer/hooks';
import Link from 'next/link';

/**
 * MDX 컴포넌트 props
 */
interface MdxProps {
  code: string;
}

/**
 * 커스텀 MDX 컴포넌트
 */
export const components = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className={`mt-8 mb-4 text-3xl font-bold ${className || ''}`} {...props} />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className={`mt-8 mb-4 text-2xl font-bold ${className || ''}`} {...props} />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={`mt-6 mb-3 text-xl font-bold ${className || ''}`} {...props} />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className={`mt-4 mb-2 text-lg font-bold ${className || ''}`} {...props} />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={`mb-4 leading-7 ${className || ''}`} {...props} />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={`mb-4 ml-6 list-disc ${className || ''}`} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={`mb-4 ml-6 list-decimal ${className || ''}`} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={`mb-1 ${className || ''}`} {...props} />
  ),
  a: ({ className, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (href?.startsWith('/')) {
      return (
        <Link
          href={href}
          className={`text-blue-600 hover:underline ${className || ''}`}
          {...props}
        />
      );
    }
    return (
      <a
        href={href}
        className={`text-blue-600 hover:underline ${className || ''}`}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    );
  },
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    if (className?.includes('language-')) {
      return <code className={`bg-muted px-1 py-0.5 rounded text-sm ${className}`} {...props} />;
    }
    return (
      <code className={`bg-muted px-1 py-0.5 rounded text-sm ${className || ''}`} {...props} />
    );
  },
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    return <pre className={className} {...props} />;
  },
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={`mb-4 border-l-4 border-muted pl-4 italic ${className || ''}`}
      {...props}
    />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="mb-4 overflow-auto">
      <table className={`w-full border-collapse ${className || ''}`} {...props} />
    </div>
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={`border border-muted px-4 py-2 text-left font-bold ${className || ''}`}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className={`border border-muted px-4 py-2 ${className || ''}`} {...props} />
  ),
  hr: ({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className={`my-6 border-muted ${className || ''}`} {...props} />
  ),
};

/**
 * MDX 컴포넌트
 *
 * @param props - MDX 컴포넌트 props
 * @returns MDX 컴포넌트
 */
export function Mdx({ code }: MdxProps) {
  const MDXContent = useMDXComponent(code);
  return <MDXContent components={components} />;
}
