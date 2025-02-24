import { exec } from 'child_process';
import { promisify } from 'util';
import { mkdir, copyFile } from 'fs/promises';
import { join } from 'path';

const execAsync = promisify(exec);

async function buildWasm() {
  try {
    // Create dist/wasm directory if it doesn't exist
    await mkdir(join(process.cwd(), 'dist', 'wasm'), { recursive: true });

    // Build WebAssembly modules
    await execAsync('wat2wasm src/wasm/geometry.wat -o dist/wasm/geometry.wasm');

    // Copy WebAssembly modules to public directory
    await copyFile(
      join(process.cwd(), 'dist', 'wasm', 'geometry.wasm'),
      join(process.cwd(), 'public', 'wasm', 'geometry.wasm')
    );

    console.log('WebAssembly modules built successfully');
  } catch (error) {
    console.error('Failed to build WebAssembly modules:', error);
    process.exit(1);
  }
}

buildWasm();