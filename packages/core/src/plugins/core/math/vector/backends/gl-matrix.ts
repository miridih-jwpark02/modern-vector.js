import { vec2 } from 'gl-matrix';
import { VectorBackend } from '../types';

/**
 * gl-matrix backend implementation for vectors
 */
export class GLVectorBackend implements VectorBackend {
  create(x: number = 0, y: number = 0): number[] {
    const vector = vec2.fromValues(x, y);
    return Array.from(vector);
  }

  add(a: number[], b: number[]): number[] {
    const result = vec2.create();
    const vecA = new Float32Array(a);
    const vecB = new Float32Array(b);
    vec2.add(result, vecA, vecB);
    return Array.from(result);
  }

  subtract(a: number[], b: number[]): number[] {
    const result = vec2.create();
    const vecA = new Float32Array(a);
    const vecB = new Float32Array(b);
    vec2.subtract(result, vecA, vecB);
    return Array.from(result);
  }

  scale(values: number[], scalar: number): number[] {
    const result = vec2.create();
    const vector = new Float32Array(values);
    vec2.scale(result, vector, scalar);
    return Array.from(result);
  }

  dot(a: number[], b: number[]): number {
    const vecA = new Float32Array(a);
    const vecB = new Float32Array(b);
    return vec2.dot(vecA, vecB);
  }

  length(values: number[]): number {
    const vector = new Float32Array(values);
    return vec2.length(vector);
  }

  normalize(values: number[]): number[] {
    const result = vec2.create();
    const vector = new Float32Array(values);
    vec2.normalize(result, vector);
    return Array.from(result);
  }

  rotate(values: number[], angle: number): number[] {
    const result = vec2.create();
    const vector = new Float32Array(values);
    vec2.rotate(result, vector, [0, 0], angle);
    return Array.from(result);
  }
}
