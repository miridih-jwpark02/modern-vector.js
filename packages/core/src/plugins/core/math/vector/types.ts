/**
 * Vector backend interface
 * Vector 연산의 실제 구현을 담당하는 backend interface
 */
export interface VectorBackend {
  /**
   * Create a new vector
   * @param x - X coordinate
   * @param y - Y coordinate
   * @returns Array of values representing the vector
   */
  create(x?: number, y?: number): number[];

  /**
   * Add two vectors
   * @param a - First vector values
   * @param b - Second vector values
   * @returns Array of values representing the sum
   */
  add(a: number[], b: number[]): number[];

  /**
   * Subtract two vectors
   * @param a - First vector values
   * @param b - Second vector values
   * @returns Array of values representing the difference
   */
  subtract(a: number[], b: number[]): number[];

  /**
   * Scale a vector by a scalar
   * @param values - Vector values
   * @param scalar - Scale factor
   * @returns Array of values representing the scaled vector
   */
  scale(values: number[], scalar: number): number[];

  /**
   * Calculate dot product of two vectors
   * @param a - First vector values
   * @param b - Second vector values
   * @returns Dot product value
   */
  dot(a: number[], b: number[]): number;

  /**
   * Calculate length of a vector
   * @param values - Vector values
   * @returns Vector length
   */
  length(values: number[]): number;

  /**
   * Normalize a vector
   * @param values - Vector values
   * @returns Array of values representing the normalized vector
   */
  normalize(values: number[]): number[];

  /**
   * Rotate a vector by an angle
   * @param values - Vector values
   * @param angle - Rotation angle in radians
   * @returns Array of values representing the rotated vector
   */
  rotate(values: number[], angle: number): number[];
}
