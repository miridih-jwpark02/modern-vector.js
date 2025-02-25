import { MatrixBackend } from '../types';

/**
 * gl-matrix 라이브러리를 사용한 행렬 연산 backend 구현
 * @implements {MatrixBackend}
 */
export declare class GLMatrixBackend implements MatrixBackend {
    /**
     * 새로운 행렬 생성
     * @param values - 초기값 배열 (9개의 요소)
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
//# sourceMappingURL=gl-matrix.d.ts.map