/**
 * Vector backend interface
 * Vector 연산의 실제 구현을 담당하는 backend interface
 */
export interface VectorBackend {
    /**
     * 새로운 벡터 생성
     * @param x - X 좌표
     * @param y - Y 좌표
     * @returns 생성된 벡터의 값 배열
     */
    create(x?: number, y?: number): number[];
    /**
     * 두 벡터의 덧셈
     * @param a - 첫 번째 벡터의 값 배열
     * @param b - 두 번째 벡터의 값 배열
     * @returns 덧셈 결과 벡터의 값 배열
     */
    add(a: number[], b: number[]): number[];
    /**
     * 두 벡터의 뺄셈
     * @param a - 첫 번째 벡터의 값 배열
     * @param b - 두 번째 벡터의 값 배열
     * @returns 뺄셈 결과 벡터의 값 배열
     */
    subtract(a: number[], b: number[]): number[];
    /**
     * 벡터의 스칼라 곱
     * @param values - 벡터의 값 배열
     * @param scalar - 스칼라 값
     * @returns 스칼라 곱 결과 벡터의 값 배열
     */
    scale(values: number[], scalar: number): number[];
    /**
     * 두 벡터의 내적
     * @param a - 첫 번째 벡터의 값 배열
     * @param b - 두 번째 벡터의 값 배열
     * @returns 내적 값
     */
    dot(a: number[], b: number[]): number;
    /**
     * 벡터의 길이 계산
     * @param values - 벡터의 값 배열
     * @returns 벡터의 길이
     */
    length(values: number[]): number;
    /**
     * 벡터의 정규화
     * @param values - 벡터의 값 배열
     * @returns 정규화된 벡터의 값 배열
     */
    normalize(values: number[]): number[];
    /**
     * 벡터의 회전
     * @param values - 벡터의 값 배열
     * @param angle - 회전 각도 (라디안)
     * @returns 회전된 벡터의 값 배열
     */
    rotate(values: number[], angle: number): number[];
}
//# sourceMappingURL=types.d.ts.map