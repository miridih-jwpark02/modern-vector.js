import { Vector2D } from '../math/vector';
import { Matrix3x3 } from '../math/matrix';
import { Shape, Bounds, ShapeFactory, ShapeOptions } from './types';
import { AbstractShape } from './abstract-shape';
import { PathPoint } from './path/types';

/**
 * Line shape options
 */
export interface LineOptions extends ShapeOptions {
    /** Line의 시작점 x 좌표 */
    x1?: number;
    /** Line의 시작점 y 좌표 */
    y1?: number;
    /** Line의 끝점 x 좌표 */
    x2?: number;
    /** Line의 끝점 y 좌표 */
    y2?: number;
}
/**
 * Line shape implementation
 */
export declare class Line extends AbstractShape {
    private _x1;
    private _y1;
    private _x2;
    private _y2;
    constructor(options?: LineOptions);
    protected getLocalBounds(): Bounds;
    get bounds(): Bounds;
    clone(): Shape;
    applyTransform(matrix: Matrix3x3): Shape;
    containsPoint(point: Vector2D): boolean;
    intersects(other: Shape): boolean;
    /**
     * Line을 Path로 변환
     * @returns Path points
     */
    toPath(): PathPoint[];
}
/**
 * Line factory
 */
export declare class LineFactory implements ShapeFactory<Line> {
    create(options: LineOptions): Line;
}
//# sourceMappingURL=line.d.ts.map