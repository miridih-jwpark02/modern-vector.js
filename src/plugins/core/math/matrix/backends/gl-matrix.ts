import { mat3 } from 'gl-matrix';
import { MatrixBackend } from '../types';

/**
 * gl-matrix backend implementation
 */
export class GLMatrixBackend implements MatrixBackend {
  create(values?: number[]): number[] {
    const matrix = mat3.create();
    if (values) {
      mat3.set(matrix, ...values);
    }
    return Array.from(matrix);
  }

  translation(tx: number, ty: number): number[] {
    const matrix = mat3.create();
    mat3.fromTranslation(matrix, [tx, ty]);
    return Array.from(matrix);
  }

  rotation(angle: number): number[] {
    const matrix = mat3.create();
    mat3.fromRotation(matrix, angle);
    return Array.from(matrix);
  }

  scale(sx: number, sy: number): number[] {
    const matrix = mat3.create();
    mat3.fromScaling(matrix, [sx, sy]);
    return Array.from(matrix);
  }

  multiply(a: number[], b: number[]): number[] {
    const result = mat3.create();
    const matA = new Float32Array(a);
    const matB = new Float32Array(b);
    mat3.multiply(result, matA, matB);
    return Array.from(result);
  }

  determinant(values: number[]): number {
    const matrix = new Float32Array(values);
    return mat3.determinant(matrix);
  }

  inverse(values: number[]): number[] {
    const matrix = new Float32Array(values);
    const result = mat3.create();
    
    if (Math.abs(mat3.determinant(matrix)) < 1e-6) {
      throw new Error('Matrix is not invertible');
    }
    
    mat3.invert(result, matrix);
    return Array.from(result);
  }
} 