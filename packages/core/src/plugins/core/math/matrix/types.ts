/**
 * Matrix backend interface
 * Matrix 연산의 실제 구현을 담당하는 backend interface
 */
export interface MatrixBackend {
  /**
   * Create a new matrix
   * @param values - Optional array of values
   * @returns Array of values representing the matrix
   */
  create(values?: number[]): number[];

  /**
   * Create a translation matrix
   * @param tx - X translation
   * @param ty - Y translation
   * @returns Array of values representing the matrix
   */
  translation(tx: number, ty: number): number[];

  /**
   * Create a rotation matrix
   * @param angle - Rotation angle in radians
   * @returns Array of values representing the matrix
   */
  rotation(angle: number): number[];

  /**
   * Create a scale matrix
   * @param sx - X scale factor
   * @param sy - Y scale factor
   * @returns Array of values representing the matrix
   */
  scale(sx: number, sy: number): number[];

  /**
   * Multiply two matrices
   * @param a - First matrix values
   * @param b - Second matrix values
   * @returns Array of values representing the result
   */
  multiply(a: number[], b: number[]): number[];

  /**
   * Calculate matrix determinant
   * @param values - Matrix values
   * @returns Determinant value
   */
  determinant(values: number[]): number;

  /**
   * Calculate matrix inverse
   * @param values - Matrix values
   * @returns Array of values representing the inverse matrix
   * @throws Error if matrix is not invertible
   */
  inverse(values: number[]): number[];
}

/**
 * Matrix operation result
 */
export interface MatrixResult {
  /**
   * Whether the operation was successful
   */
  success: boolean;

  /**
   * Result values if successful
   */
  values?: number[];

  /**
   * Error message if not successful
   */
  error?: string;
}
