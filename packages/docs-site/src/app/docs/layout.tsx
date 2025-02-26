import Link from 'next/link';
import { DocsNavigation } from '@/components/docs-navigation';
import { MobileNav } from '@/components/mobile-nav';

/**
 * 문서 레이아웃 props
 */
interface DocsLayoutProps {
  children: React.ReactNode;
  params: {
    slug?: string[];
  };
}

/**
 * 문서 레이아웃 컴포넌트
 * 
 * @param props - 컴포넌트 props
 * @returns 문서 레이아웃 컴포넌트
 */
export default async function DocsLayout({ children, params }: DocsLayoutProps) {
  // params 객체를 await로 처리
  const slugParams = await params;
  
  // 현재 slug 계산
  const currentSlug = slugParams.slug?.join('/');
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex items-center space-x-4">
            <MobileNav currentSlug={currentSlug} />
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold">Modern Vector.js</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/docs"
              className="flex items-center text-sm font-medium text-foreground transition-colors hover:text-foreground"
            >
              Documentation
            </Link>
            <Link
              href="/api-docs"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              API Reference
            </Link>
            <Link
              href="/examples"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Examples
            </Link>
          </nav>
        </div>
      </header>
      
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 py-8">
        <aside className="fixed top-24 z-30 -ml-2 hidden h-[calc(100vh-6rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6 lg:py-8">
            <DocsNavigation currentSlug={currentSlug} />
          </div>
        </aside>
        <main className="relative py-6 lg:gap-10 lg:py-8">
          {children}
        </main>
      </div>
      
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with Next.js, Tailwind CSS, and shadcn/ui.
          </p>
        </div>
      </footer>
    </div>
  );
} 