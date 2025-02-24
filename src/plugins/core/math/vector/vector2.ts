import { GLVectorBackend } from './backends/gl-matrix';
import { VectorBackend } from './types';

/**
 * 2D vector class with immutable operations
 */
export class Vector2 {
  private static backend: VectorBackend = new GLVectorBackend();
  private readonly values: number[];

  /**
   * Creates a new Vector2 instance
   * @param x - x coordinate
   * @param y - y coordinate
   */
  constructor(x: number = 0, y: number = 0) {
    this.values = Vector2.backend.create(x, y);
  }

  /**
   * x coordinate
   */
  get x(): number {
    return this.values[0];
  }

  /**
   * y coordinate
   */
  get y(): number {
    return this.values[1];
  }

  /**
   * Adds another vector to this one
   * @param other - vector to add
   * @returns new Vector2 instance with the result
   */
  add(other: Vector2): Vector2 {
    const result = Vector2.backend.add(this.values, other.values);
    return Vector2.fromArray(result);
  }

  /**
   * Subtracts another vector from this one
   * @param other - vector to subtract
   * @returns new Vector2 instance with the result
   */
  subtract(other: Vector2): Vector2 {
    const result = Vector2.backend.subtract(this.values, other.values);
    return Vector2.fromArray(result);
  }

  /**
   * Scales this vector by a scalar value
   * @param scalar - value to scale by
   * @returns new Vector2 instance with the result
   */
  scale(scalar: number): Vector2 {
    const result = Vector2.backend.scale(this.values, scalar);
    return Vector2.fromArray(result);
  }

  /**
   * Calculates the dot product with another vector
   * @param other - vector to calculate dot product with
   * @returns dot product value
   */
  dot(other: Vector2): number {
    return Vector2.backend.dot(this.values, other.values);
  }

  /**
   * Calculates the length of this vector
   * @returns vector length
   */
  length(): number {
    return Vector2.backend.length(this.values);
  }

  /**
   * Returns a normalized version of this vector
   * @returns new Vector2 instance with normalized values
   */
  normalize(): Vector2 {
    const result = Vector2.backend.normalize(this.values);
    return Vector2.fromArray(result);
  }

  /**
   * Rotates this vector by an angle in radians
   * @param angle - angle in radians
   * @returns new Vector2 instance with rotated values
   */
  rotate(angle: number): Vector2 {
    const result = Vector2.backend.rotate(this.values, angle);
    return Vector2.fromArray(result);
  }

  /**
   * Creates a Vector2 from an array of values
   * @param values - array containing x and y values
   * @returns new Vector2 instance
   */
  private static fromArray(values: number[]): Vector2 {
    const vector = new Vector2();
    vector.values[0] = values[0];
    vector.values[1] = values[1];
    return vector;
  }
} 