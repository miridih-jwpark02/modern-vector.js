# Modern Vector.js

A modern vector graphics library for the web with TypeScript, ESM, and better performance.

## Features

- 🚀 Modern ES Modules & TypeScript
- 🎨 Canvas & WebGL rendering
- 📦 Tree-shakeable
- 🔧 Extensible architecture
- ⚡️ High performance

## Architecture

### Core Concepts

1. **Modern Stack**
   - TypeScript for type safety
   - ES Modules for tree-shaking
   - Vite for fast development and optimized builds
   - WebGL for hardware-accelerated rendering

2. **Performance Improvements**
   - Optimized path operations using WebAssembly
   - Efficient memory management with object pooling
   - WebGL-based rendering for complex scenes
   - Worker-based computation for heavy operations

3. **Better Architecture**
   - Clear separation of concerns
   - Pluggable rendering backends
   - Extensible event system
   - Modular design for tree-shaking

### Directory Structure

```
src/
├── core/           # Core utilities and math
│   ├── math/      # Vector math operations
│   └── utils/     # Common utilities
├── geometry/       # Geometric primitives
│   ├── path/      # Path operations
│   └── shapes/    # Basic shapes
├── rendering/      # Rendering system
│   ├── canvas/    # Canvas 2D renderer
│   └── webgl/     # WebGL renderer
├── events/        # Event handling
└── animation/     # Animation system
```

## Installation

```bash
npm install modern-vector
```

## Usage

```typescript
import { Canvas, Path, Point } from 'modern-vector';

const canvas = new Canvas('#myCanvas');
const path = new Path();

path.moveTo(new Point(100, 100))
    .lineTo(new Point(200, 100))
    .lineTo(new Point(200, 200))
    .lineTo(new Point(100, 200))
    .closePath();

canvas.add(path);
canvas.render();
```

## Contributing

Contributions are welcome! Please read our contributing guidelines for details.

## License

MIT