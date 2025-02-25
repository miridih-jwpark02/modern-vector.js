/**
 * 2D vector class with immutable operations
 */
export declare class Vector2 {
    private static backend;
    private readonly values;
    /**
     * Creates a new Vector2 instance
     * @param x - x coordinate
     * @param y - y coordinate
     */
    constructor(x?: number, y?: number);
    /**
     * x coordinate
     */
    get x(): number;
    /**
     * y coordinate
     */
    get y(): number;
    /**
     * Adds another vector to this one
     * @param other - vector to add
     * @returns new Vector2 instance with the result
     */
    add(other: Vector2): Vector2;
    /**
     * Subtracts another vector from this one
     * @param other - vector to subtract
     * @returns new Vector2 instance with the result
     */
    subtract(other: Vector2): Vector2;
    /**
     * Scales this vector by a scalar value
     * @param scalar - value to scale by
     * @returns new Vector2 instance with the result
     */
    scale(scalar: number): Vector2;
    /**
     * Calculates the dot product with another vector
     * @param other - vector to calculate dot product with
     * @returns dot product value
     */
    dot(other: Vector2): number;
    /**
     * Calculates the length of this vector
     * @returns vector length
     */
    length(): number;
    /**
     * Returns a normalized version of this vector
     * @returns new Vector2 instance with normalized values
     */
    normalize(): Vector2;
    /**
     * Rotates this vector by an angle in radians
     * @param angle - angle in radians
     * @returns new Vector2 instance with rotated values
     */
    rotate(angle: number): Vector2;
    /**
     * Creates a Vector2 from an array of values
     * @param values - array containing x and y values
     * @returns new Vector2 instance
     */
    private static fromArray;
}
//# sourceMappingURL=vector2.d.ts.map