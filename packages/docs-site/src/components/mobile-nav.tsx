"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DocsNavigation } from './docs-navigation';

/**
 * 모바일 네비게이션 컴포넌트 props
 */
interface MobileNavProps {
  currentSlug?: string;
}

/**
 * 모바일 네비게이션 컴포넌트
 * 
 * @param props - 컴포넌트 props
 * @returns 모바일 네비게이션 컴포넌트
 */
export function MobileNav({ currentSlug }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
            <span className="font-bold">Modern Vector.js</span>
          </Link>
        </div>
        <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6 overflow-y-auto">
          <DocsNavigation currentSlug={currentSlug} />
        </div>
      </SheetContent>
    </Sheet>
  );
} 