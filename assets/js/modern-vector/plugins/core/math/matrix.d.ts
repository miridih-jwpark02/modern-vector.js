/**
 * 3x3 Matrix implementation
 * 행렬의 불변성을 보장하기 위해 모든 연산은 새로운 행렬을 반환
 */
export declare class Matrix3x3 {
    private _values;
    private constructor();
    /**
     * Get matrix values
     */
    get values(): number[];
    /**
     * Create a new 3x3 matrix
     * @param values - Optional array of 9 values (row-major order)
     * @returns A new Matrix3x3 instance
     */
    static create(values?: number[]): Matrix3x3;
    /**
     * Create a translation matrix
     * @param tx - X translation
     * @param ty - Y translation
     * @returns A new translation matrix
     */
    static translation(tx: number, ty: number): Matrix3x3;
    /**
     * Create a rotation matrix
     * @param angle - Rotation angle in radians
     * @returns A new rotation matrix
     */
    static rotation(angle: number): Matrix3x3;
    /**
     * Create a scale matrix
     * @param sx - X scale factor
     * @param sy - Y scale factor
     * @returns A new scale matrix
     */
    static scale(sx: number, sy: number): Matrix3x3;
    /**
     * Multiply this matrix with another
     * @param other - Matrix to multiply with
     * @returns A new matrix representing the product
     */
    multiply(other: Matrix3x3): Matrix3x3;
    /**
     * Calculate the determinant of this matrix
     * @returns The determinant value
     */
    determinant(): number;
    /**
     * Calculate the inverse of this matrix
     * @returns A new matrix representing the inverse
     * @throws Error if matrix is not invertible
     */
    inverse(): Matrix3x3;
}
//# sourceMappingURL=matrix.d.ts.map