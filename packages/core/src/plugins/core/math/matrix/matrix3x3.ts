import { MatrixBackend } from './types';
import { GLMatrixBackend } from './backends/gl-matrix';

/**
 * 3x3 Matrix implementation
 * 행렬의 불변성을 보장하기 위해 모든 연산은 새로운 행렬을 반환
 */
export class Matrix3x3 {
  private static backend: MatrixBackend = new GLMatrixBackend();

  private constructor(private _values: number[]) {
    if (_values.length !== 9) {
      throw new Error('Matrix3x3 requires exactly 9 values');
    }
  }

  /**
   * Get matrix values
   */
  get values(): number[] {
    return [...this._values];
  }

  /**
   * Set the matrix backend implementation
   * @param backend - The backend implementation to use
   */
  static setBackend(backend: MatrixBackend): void {
    Matrix3x3.backend = backend;
  }

  /**
   * Create a new 3x3 matrix
   * @param values - Optional array of 9 values (row-major order)
   * @returns A new Matrix3x3 instance
   */
  static create(values?: number[]): Matrix3x3 {
    const result = Matrix3x3.backend.create(values);
    return new Matrix3x3(result);
  }

  /**
   * Create a translation matrix
   * @param tx - X translation
   * @param ty - Y translation
   * @returns A new translation matrix
   */
  static translation(tx: number, ty: number): Matrix3x3 {
    const result = Matrix3x3.backend.translation(tx, ty);
    return new Matrix3x3(result);
  }

  /**
   * Create a rotation matrix
   * @param angle - Rotation angle in radians
   * @returns A new rotation matrix
   */
  static rotation(angle: number): Matrix3x3 {
    const result = Matrix3x3.backend.rotation(angle);
    return new Matrix3x3(result);
  }

  /**
   * Create a scale matrix
   * @param sx - X scale factor
   * @param sy - Y scale factor
   * @returns A new scale matrix
   */
  static scale(sx: number, sy: number): Matrix3x3 {
    const result = Matrix3x3.backend.scale(sx, sy);
    return new Matrix3x3(result);
  }

  /**
   * Multiply this matrix with another
   * @param other - Matrix to multiply with
   * @returns A new matrix representing the product
   */
  multiply(other: Matrix3x3): Matrix3x3 {
    const result = Matrix3x3.backend.multiply(this._values, other._values);
    return new Matrix3x3(result);
  }

  /**
   * Calculate the determinant of this matrix
   * @returns The determinant value
   */
  determinant(): number {
    return Matrix3x3.backend.determinant(this._values);
  }

  /**
   * Calculate the inverse of this matrix
   * @returns A new matrix representing the inverse
   * @throws Error if matrix is not invertible
   */
  inverse(): Matrix3x3 {
    const result = Matrix3x3.backend.inverse(this._values);
    return new Matrix3x3(result);
  }
}
