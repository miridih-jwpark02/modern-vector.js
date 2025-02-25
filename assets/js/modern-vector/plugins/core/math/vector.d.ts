/**
 * 2D Vector implementation
 * 벡터의 불변성을 보장하기 위해 모든 연산은 새로운 벡터를 반환
 */
export declare class Vector2D {
    readonly x: number;
    readonly y: number;
    private constructor();
    /**
     * Create a new 2D vector
     * @param x - X coordinate
     * @param y - Y coordinate
     * @returns A new Vector2D instance
     */
    static create(x?: number, y?: number): Vector2D;
    /**
     * Add another vector to this one
     * @param other - Vector to add
     * @returns A new vector representing the sum
     */
    add(other: Vector2D): Vector2D;
    /**
     * Subtract another vector from this one
     * @param other - Vector to subtract
     * @returns A new vector representing the difference
     */
    subtract(other: Vector2D): Vector2D;
    /**
     * Scale the vector by a scalar value
     * @param scalar - Scale factor
     * @returns A new scaled vector
     */
    scale(scalar: number): Vector2D;
    /**
     * Calculate the dot product with another vector
     * @param other - Vector to calculate dot product with
     * @returns The dot product value
     */
    dot(other: Vector2D): number;
    /**
     * Get the length (magnitude) of the vector
     */
    get length(): number;
    /**
     * Get a normalized (unit length) version of the vector
     * @returns A new normalized vector
     */
    normalize(): Vector2D;
    /**
     * Calculate the angle between this vector and another
     * @param other - Vector to calculate angle with
     * @returns Angle in radians
     */
    angle(other: Vector2D): number;
    /**
     * Rotate the vector by an angle
     * @param angle - Angle in radians
     * @returns A new rotated vector
     */
    rotate(angle: number): Vector2D;
    /**
     * Get a perpendicular vector
     * @returns A new vector perpendicular to this one
     */
    perpendicular(): Vector2D;
    /**
     * Calculate the distance to another vector
     * @param other - Vector to calculate distance to
     * @returns The distance between the vectors
     */
    distanceTo(other: Vector2D): number;
}
//# sourceMappingURL=vector.d.ts.map