import { Matrix3x3 } from '../math/matrix';
import { Vector2D } from '../math/vector';
import { Shape, ShapeStyle, Bounds, ShapeOptions } from './types';
import { PathPoint } from './path/types';

/**
 * Scale 기준점 타입
 */
export type ScaleOrigin = 'center' | 'topLeft' | 'custom';
/**
 * Shape의 공통 기능을 구현한 추상 클래스
 */
export declare abstract class AbstractShape implements Shape {
    readonly id: string;
    readonly type: string;
    readonly transform: Matrix3x3;
    readonly style: ShapeStyle;
    protected scaleOrigin: ScaleOrigin;
    protected customScaleOrigin?: {
        x: number;
        y: number;
    };
    constructor(type: string, options?: ShapeOptions);
    /**
     * Scale 기준점 설정
     * @param origin - Scale 기준점 ('center', 'topLeft', 'custom')
     * @param point - Custom 기준점일 경우 좌표
     */
    setScaleOrigin(origin: ScaleOrigin, point?: {
        x: number;
        y: number;
    }): void;
    /**
     * Scale 기준점 가져오기
     * @returns Scale 기준점 좌표
     */
    protected abstract getLocalBounds(): Bounds;
    /**
     * Scale 기준점 가져오기
     * @returns Scale 기준점 좌표
     */
    protected getScaleOriginPoint(): {
        x: number;
        y: number;
    };
    /**
     * Shape의 경계 상자 계산
     */
    abstract get bounds(): Bounds;
    /**
     * Shape 복제
     */
    abstract clone(): Shape;
    /**
     * Shape에 변환 적용
     * @param matrix - 적용할 변환 행렬
     */
    abstract applyTransform(matrix: Matrix3x3): Shape;
    /**
     * Point가 Shape 내부에 있는지 확인
     * @param point - 확인할 점
     */
    abstract containsPoint(point: Vector2D): boolean;
    /**
     * Shape를 Path로 변환
     */
    abstract toPath(): PathPoint[];
    /**
     * 기본 충돌 검사 구현 (Bounds 기반)
     * @param other - 충돌 검사할 다른 Shape
     */
    intersects(other: Shape): boolean;
    /**
     * Scale 행렬 추출
     * @param matrix - Scale을 추출할 행렬 (기본값: this.transform)
     */
    protected getTransformScale(matrix?: Matrix3x3): {
        scaleX: number;
        scaleY: number;
    };
    /**
     * 지정된 기준점으로 변환 행렬 계산
     * @param matrix - 적용할 변환 행렬
     * @param originX - 기준점 X 좌표
     * @param originY - 기준점 Y 좌표
     */
    protected getTransformAroundPoint(matrix: Matrix3x3, originX: number, originY: number): Matrix3x3;
}
//# sourceMappingURL=abstract-shape.d.ts.map