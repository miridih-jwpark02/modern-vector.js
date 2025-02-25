import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Documentation page component
 * 문서 페이지 컴포넌트입니다.
 */
export default function DocsPage() {
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
        </div>
      </header>
      <main className="flex-1 container py-6">
        <div className="flex flex-col space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
            <p className="text-muted-foreground mt-2">
              Learn how to use Modern Vector.js to create amazing vector graphics
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Getting Started</h3>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href="/docs#introduction" 
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Introduction
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/docs#installation" 
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Installation
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/docs#basic-usage" 
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Basic Usage
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Core Concepts</h3>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href="/docs#canvas" 
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Canvas
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/docs#shapes" 
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Shapes
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/docs#styling" 
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Styling
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/docs#transforms" 
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Transforms
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Advanced</h3>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href="/docs#plugins" 
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Plugins
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/docs#renderers" 
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Custom Renderers
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/docs#performance" 
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Performance Tips
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div id="introduction" className="border rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                <p className="mb-4">
                  Modern Vector.js is a powerful and flexible vector graphics library for JavaScript.
                  It provides a simple API for creating and manipulating vector graphics, with support
                  for multiple rendering backends including Canvas, SVG, and WebGL.
                </p>
                <p>
                  The library is designed to be extensible through a plugin system, allowing you to
                  add custom functionality as needed.
                </p>
              </div>
              
              <div id="installation" className="border rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Installation</h2>
                <p className="mb-4">
                  You can install Modern Vector.js using npm or yarn:
                </p>
                <div className="bg-muted p-3 rounded-md font-mono text-sm mb-4">
                  npm install modern-vector
                </div>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">
                  yarn add modern-vector
                </div>
              </div>
              
              <div id="basic-usage" className="border rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
                <p className="mb-4">
                  Here's a simple example of how to use Modern Vector.js:
                </p>
                <div className="bg-muted p-3 rounded-md font-mono text-sm mb-4">
                  {`import { Canvas, Circle } from 'modern-vector';

// Create a new canvas
const canvas = new Canvas(800, 600);

// Create a circle
const circle = new Circle(400, 300, 50);

// Style the circle
circle.fill('#3b82f6');
circle.stroke('#1d4ed8', 2);

// Add the circle to the canvas
canvas.add(circle);

// Render the canvas
canvas.render();`}
                </div>
                <p>
                  This will create a blue circle with a dark blue stroke on a canvas.
                </p>
              </div>
              
              <div id="canvas" className="border rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Canvas</h2>
                <p className="mb-4">
                  The Canvas is the main container for your vector graphics. It provides methods for
                  adding, removing, and manipulating shapes, as well as rendering the final output.
                </p>
                <div className="bg-muted p-3 rounded-md font-mono text-sm mb-4">
                  {`// Create a canvas with width 800 and height 600
const canvas = new Canvas(800, 600);

// Set the background color
canvas.background('#f8fafc');

// Add a shape to the canvas
canvas.add(shape);

// Remove a shape from the canvas
canvas.remove(shape);

// Clear all shapes from the canvas
canvas.clear();

// Render the canvas
canvas.render();`}
                </div>
              </div>
              
              <div className="mt-6">
                <Button asChild>
                  <Link href="/api-docs">View API Reference</Link>
                </Button>
              </div>
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