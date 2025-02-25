import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Examples page component
 * 예제 페이지 컴포넌트입니다.
 */
export default function ExamplesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold">Modern Vector.js</span>
            </Link>
            <nav className="flex gap-6">
              <Link
                href="/docs"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
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
                className="flex items-center text-sm font-medium text-foreground transition-colors hover:text-foreground"
              >
                Examples
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <div className="flex flex-col space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Examples</h1>
            <p className="text-muted-foreground mt-2">
              Explore examples of what you can build with Modern Vector.js
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Shapes Example */}
            <div className="border rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <div className="w-32 h-32 bg-blue-500 rounded-full"></div>
              </div>
              <div className="p-4">
                <h3 className="font-bold">Basic Shapes</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Learn how to create and style basic shapes like circles, rectangles, and lines.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/examples/basic-shapes">View Example</Link>
                </Button>
              </div>
            </div>
            
            {/* Path Drawing Example */}
            <div className="border rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20,20 Q60,10 100,20 T100,60 T60,100 T20,60 Z" stroke="#3b82f6" strokeWidth="3" fill="none" />
                </svg>
              </div>
              <div className="p-4">
                <h3 className="font-bold">Path Drawing</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Create complex paths using Bézier curves and other path commands.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/examples/path-drawing">View Example</Link>
                </Button>
              </div>
            </div>
            
            {/* Animations Example */}
            <div className="border rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <div className="w-16 h-16 bg-green-500 rounded-lg animate-bounce"></div>
              </div>
              <div className="p-4">
                <h3 className="font-bold">Animations</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Learn how to animate vector graphics with smooth transitions.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/examples/animations">View Example</Link>
                </Button>
              </div>
            </div>
            
            {/* Interactive Graphics Example */}
            <div className="border rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <div className="w-24 h-24 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors cursor-pointer"></div>
              </div>
              <div className="p-4">
                <h3 className="font-bold">Interactive Graphics</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Create interactive vector graphics that respond to user input.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/examples/interactive">View Example</Link>
                </Button>
              </div>
            </div>
            
            {/* Data Visualization Example */}
            <div className="border rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="20" y="80" width="15" height="30" fill="#3b82f6" />
                  <rect x="45" y="60" width="15" height="50" fill="#3b82f6" />
                  <rect x="70" y="40" width="15" height="70" fill="#3b82f6" />
                  <rect x="95" y="20" width="15" height="90" fill="#3b82f6" />
                </svg>
              </div>
              <div className="p-4">
                <h3 className="font-bold">Data Visualization</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Build charts and graphs to visualize data using vector graphics.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/examples/data-visualization">View Example</Link>
                </Button>
              </div>
            </div>
            
            {/* Custom Plugins Example */}
            <div className="border rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg"></div>
              </div>
              <div className="p-4">
                <h3 className="font-bold">Custom Plugins</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Learn how to create and use custom plugins to extend functionality.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/examples/custom-plugins">View Example</Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-6 mt-8">
            <h2 className="text-2xl font-bold mb-4">Run Examples Locally</h2>
            <p className="mb-4">
              All examples are available in the GitHub repository. You can clone the repository and run them locally:
            </p>
            <div className="bg-muted p-3 rounded-md font-mono text-sm mb-4">
              git clone https://github.com/username/modern-vector.js.git
            </div>
            <div className="bg-muted p-3 rounded-md font-mono text-sm mb-4">
              cd modern-vector.js/examples
            </div>
            <div className="bg-muted p-3 rounded-md font-mono text-sm">
              npm install && npm start
            </div>
          </div>
        </div>
      </main>
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