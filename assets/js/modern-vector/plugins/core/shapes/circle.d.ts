import { Vector2D } from '../math/vector';
import { Matrix3x3 } from '../math/matrix';
import { Shape, Bounds, ShapeFactory, ShapeOptions } from './types';
import { AbstractShape } from './abstract-shape';
import { PathPoint } from './path/types';

/**
 * Circle shape options
 */
export interface CircleOptions extends ShapeOptions {
    /** Circle의 중심 x 좌표 */
    centerX?: number;
    /** Circle의 중심 y 좌표 */
    centerY?: number;
    /** Circle의 반지름 */
    radius?: number;
}
/**
 * Circle shape implementation
 */
export declare class Circle extends AbstractShape {
    private _centerX;
    private _centerY;
    private _radius;
    constructor(options?: CircleOptions);
    protected getLocalBounds(): Bounds;
    get bounds(): Bounds;
    clone(): Shape;
    applyTransform(matrix: Matrix3x3): Shape;
    containsPoint(point: Vector2D): boolean;
    intersects(other: Shape): boolean;
    /**
     * Circle을 Path로 변환
     * @param segments - 원을 근사할 선분의 수 (기본값: 32)
     * @returns Path points
     */
    toPath(segments?: number): PathPoint[];
}
/**
 * Circle factory
 */
export declare class CircleFactory implements ShapeFactory<Circle> {
    create(options: CircleOptions): Circle;
}
//# sourceMappingURL=circle.d.ts.map