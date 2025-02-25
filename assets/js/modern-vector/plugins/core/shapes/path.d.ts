import { Vector2D } from '../math/vector';
import { Matrix3x3 } from '../math/matrix';
import { Shape, Bounds, ShapeFactory, ShapeOptions } from './types';
import { AbstractShape } from './abstract-shape';

/**
 * Path의 각 점을 표현하는 인터페이스
 */
export interface PathPoint {
    /** 점의 x 좌표 */
    x: number;
    /** 점의 y 좌표 */
    y: number;
    /** 점의 타입 (이동 또는 선) */
    type: 'move' | 'line';
}
/**
 * Path shape options
 */
export interface PathOptions extends ShapeOptions {
    /** Path를 구성하는 점들의 배열 */
    points?: PathPoint[];
}
/**
 * Path shape implementation
 */
export declare class Path extends AbstractShape {
    private _points;
    constructor(options?: PathOptions);
    /**
     * Path에 점 추가
     * @param x - 점의 x 좌표
     * @param y - 점의 y 좌표
     * @param type - 점의 타입 (이동 또는 선)
     */
    addPoint(x: number, y: number, type?: 'move' | 'line'): void;
    /**
     * Path의 모든 점 가져오기
     */
    get points(): PathPoint[];
    /**
     * Path를 Path points로 변환
     * @returns Path points
     */
    toPath(): PathPoint[];
    protected getLocalBounds(): Bounds;
    get bounds(): Bounds;
    clone(): Shape;
    applyTransform(matrix: Matrix3x3): Shape;
    containsPoint(point: Vector2D): boolean;
    intersects(other: Shape): boolean;
}
/**
 * Path factory
 */
export declare class PathFactory implements ShapeFactory<Path> {
    create(options: PathOptions): Path;
}
//# sourceMappingURL=path.d.ts.map