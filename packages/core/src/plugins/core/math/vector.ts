/**
 * 2D Vector implementation
 * 벡터의 불변성을 보장하기 위해 모든 연산은 새로운 벡터를 반환
 */
export class Vector2D {
  private constructor(
    readonly x: number,
    readonly y: number
  ) {
    // Convert -0 to +0
    this.x = this.x === 0 ? 0 : this.x;
    this.y = this.y === 0 ? 0 : this.y;
  }

  /**
   * Create a new 2D vector
   * @param x - X coordinate
   * @param y - Y coordinate
   * @returns A new Vector2D instance
   */
  static create(x: number = 0, y: number = 0): Vector2D {
    return new Vector2D(x, y);
  }

  /**
   * Add another vector to this one
   * @param other - Vector to add
   * @returns A new vector representing the sum
   */
  add(other: Vector2D): Vector2D {
    return new Vector2D(this.x + other.x, this.y + other.y);
  }

  /**
   * Subtract another vector from this one
   * @param other - Vector to subtract
   * @returns A new vector representing the difference
   */
  subtract(other: Vector2D): Vector2D {
    return new Vector2D(this.x - other.x, this.y - other.y);
  }

  /**
   * Scale the vector by a scalar value
   * @param scalar - Scale factor
   * @returns A new scaled vector
   */
  scale(scalar: number): Vector2D {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  /**
   * Calculate the dot product with another vector
   * @param other - Vector to calculate dot product with
   * @returns The dot product value
   */
  dot(other: Vector2D): number {
    return this.x * other.x + this.y * other.y;
  }

  /**
   * Get the length (magnitude) of the vector
   */
  get length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Get a normalized (unit length) version of the vector
   * @returns A new normalized vector
   */
  normalize(): Vector2D {
    const len = this.length;
    if (len === 0) return Vector2D.create(0, 0);
    return this.scale(1 / len);
  }

  /**
   * Calculate the angle between this vector and another
   * @param other - Vector to calculate angle with
   * @returns Angle in radians
   */
  angle(other: Vector2D): number {
    const dot = this.dot(other);
    const cos = dot / (this.length * other.length);
    return Math.acos(Math.min(Math.max(cos, -1), 1));
  }

  /**
   * Rotate the vector by an angle
   * @param angle - Angle in radians
   * @returns A new rotated vector
   */
  rotate(angle: number): Vector2D {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector2D(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
  }

  /**
   * Get a perpendicular vector
   * @returns A new vector perpendicular to this one
   */
  perpendicular(): Vector2D {
    // Convert -0 to +0 when creating new vector
    const x = -this.y === 0 ? 0 : -this.y;
    const y = this.x === 0 ? 0 : this.x;
    return new Vector2D(x, y);
  }

  /**
   * Calculate the distance to another vector
   * @param other - Vector to calculate distance to
   * @returns The distance between the vectors
   */
  distanceTo(other: Vector2D): number {
    return this.subtract(other).length;
  }
}
