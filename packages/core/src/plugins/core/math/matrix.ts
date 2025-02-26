/**
 * 3x3 Matrix implementation
 * 행렬의 불변성을 보장하기 위해 모든 연산은 새로운 행렬을 반환
 */
export class Matrix3x3 {
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
   * Create a new 3x3 matrix
   * @param values - Optional array of 9 values (row-major order)
   * @returns A new Matrix3x3 instance
   */
  static create(values?: number[]): Matrix3x3 {
    if (!values) {
      return new Matrix3x3([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    }
    return new Matrix3x3([...values]);
  }

  /**
   * Create a translation matrix
   * @param tx - X translation
   * @param ty - Y translation
   * @returns A new translation matrix
   */
  static translation(tx: number, ty: number): Matrix3x3 {
    return new Matrix3x3([1, 0, tx, 0, 1, ty, 0, 0, 1]);
  }

  /**
   * Create a rotation matrix
   * @param angle - Rotation angle in radians
   * @returns A new rotation matrix
   */
  static rotation(angle: number): Matrix3x3 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Matrix3x3([cos, -sin, 0, sin, cos, 0, 0, 0, 1]);
  }

  /**
   * Create a scale matrix
   * @param sx - X scale factor
   * @param sy - Y scale factor
   * @returns A new scale matrix
   */
  static scale(sx: number, sy: number): Matrix3x3 {
    return new Matrix3x3([sx, 0, 0, 0, sy, 0, 0, 0, 1]);
  }

  /**
   * Multiply this matrix with another
   * @param other - Matrix to multiply with
   * @returns A new matrix representing the product
   */
  multiply(other: Matrix3x3): Matrix3x3 {
    const a = this._values;
    const b = other._values;
    const result = new Array(9);

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let sum = 0;
        for (let k = 0; k < 3; k++) {
          sum += a[i * 3 + k] * b[k * 3 + j];
        }
        result[i * 3 + j] = sum;
      }
    }

    return new Matrix3x3(result);
  }

  /**
   * Calculate the determinant of this matrix
   * @returns The determinant value
   */
  determinant(): number {
    const [a00, a01, a02, a10, a11, a12, a20, a21, a22] = this._values;

    return (
      a00 * (a11 * a22 - a12 * a21) - a01 * (a10 * a22 - a12 * a20) + a02 * (a10 * a21 - a11 * a20)
    );
  }

  /**
   * Calculate the inverse of this matrix
   * @returns A new matrix representing the inverse
   * @throws Error if matrix is not invertible
   */
  inverse(): Matrix3x3 {
    const det = this.determinant();
    if (Math.abs(det) < 1e-6) {
      throw new Error('Matrix is not invertible');
    }

    const [a00, a01, a02, a10, a11, a12, a20, a21, a22] = this._values;

    // Calculate cofactor matrix
    const b00 = a11 * a22 - a12 * a21;
    const b01 = a02 * a21 - a01 * a22;
    const b02 = a01 * a12 - a02 * a11;
    const b10 = a12 * a20 - a10 * a22;
    const b11 = a00 * a22 - a02 * a20;
    const b12 = a02 * a10 - a00 * a12;
    const b20 = a10 * a21 - a11 * a20;
    const b21 = a01 * a20 - a00 * a21;
    const b22 = a00 * a11 - a01 * a10;

    // Divide by determinant
    const invDet = 1 / det;
    return new Matrix3x3([
      b00 * invDet,
      b01 * invDet,
      b02 * invDet,
      b10 * invDet,
      b11 * invDet,
      b12 * invDet,
      b20 * invDet,
      b21 * invDet,
      b22 * invDet,
    ]);
  }
}
