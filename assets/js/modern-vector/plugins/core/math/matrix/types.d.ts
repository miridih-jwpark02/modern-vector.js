/**
 * Matrix backend interface
 * Matrix 연산의 실제 구현을 담당하는 backend interface
 */
export interface MatrixBackend {
    /**
     * 새로운 행렬 생성
     * @param values - 초기값 배열 (선택적)
     * @returns 생성된 행렬의 값 배열
     */
    create(values?: number[]): number[];
    /**
     * 이동 변환 행렬 생성
     * @param tx - X축 이동량
     * @param ty - Y축 이동량
     * @returns 이동 변환 행렬의 값 배열
     */
    translation(tx: number, ty: number): number[];
    /**
     * 회전 변환 행렬 생성
     * @param angle - 회전 각도 (라디안)
     * @returns 회전 변환 행렬의 값 배열
     */
    rotation(angle: number): number[];
    /**
     * 크기 변환 행렬 생성
     * @param sx - X축 크기 비율
     * @param sy - Y축 크기 비율
     * @returns 크기 변환 행렬의 값 배열
     */
    scale(sx: number, sy: number): number[];
    /**
     * 두 행렬의 곱 계산
     * @param a - 첫 번째 행렬의 값 배열
     * @param b - 두 번째 행렬의 값 배열
     * @returns 곱셈 결과 행렬의 값 배열
     */
    multiply(a: number[], b: number[]): number[];
    /**
     * 행렬식 계산
     * @param values - 행렬의 값 배열
     * @returns 행렬식 값
     */
    determinant(values: number[]): number;
    /**
     * 역행렬 계산
     * @param values - 행렬의 값 배열
     * @returns 역행렬의 값 배열
     * @throws {Error} 행렬이 역행렬을 가지지 않는 경우
     */
    inverse(values: number[]): number[];
}
/**
 * Matrix 연산 결과
 */
export interface MatrixResult {
    /**
     * 연산 성공 여부
     */
    success: boolean;
    /**
     * 성공한 경우의 결과 값
     */
    values?: number[];
    /**
     * 실패한 경우의 에러 메시지
     */
    error?: string;
}
//# sourceMappingURL=types.d.ts.map