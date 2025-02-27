import { Group, GroupOptions } from './types';
import { Matrix3x3 } from '../math/matrix';
import { Vector2D } from '../math/vector';
import { PathPoint } from '../shapes/path/types';
import { v4 as uuidv4 } from 'uuid';
import { AbstractShape } from '../shapes/abstract-shape';
import { EventEmitter } from '../../../core/types';
import { SceneNode } from '../../../core/types';

/**
 * Group 클래스는 여러 SceneNode 객체를 그룹화하는 컨테이너입니다.
 * @implements {Group}
 * @extends {AbstractShape}
 */
export class DefaultGroup extends AbstractShape implements Group {
  /** Group의 타입 */
  readonly type = 'group';

  /**
   * Group 생성자
   * @param {string} id - Group의 고유 식별자
   * @param {GroupOptions} [options] - Group 생성 옵션
   * @param {EventEmitter} eventEmitter - 이벤트 이미터
   */
  constructor(id: string, options: GroupOptions = {}, eventEmitter: EventEmitter) {
    const transform = options.transform || Matrix3x3.create();
    const style = options.style || {};
    const bounds = { x: 0, y: 0, width: 0, height: 0 }; // 초기 경계 상자는 비어있음

    super(id, 'group', transform, bounds, style, eventEmitter);

    this.data = options.data || {};

    // 초기 자식 요소들이 제공된 경우 추가
    if (options.children) {
      options.children.forEach(child => this.add(child));
    }

    // 자식 요소들의 경계 상자를 기반으로 그룹의 경계 상자 업데이트
    this.updateBounds();
  }

  /**
   * 자식 노드 목록 반환
   * @returns {SceneNode[]} 자식 노드 객체 배열
   */
  get children(): SceneNode[] {
    return super.children;
  }

  /**
   * Group에 노드 추가
   * @param {SceneNode} node - 추가할 노드 객체
   * @returns {SceneNode} 추가된 노드 객체
   */
  add(node: SceneNode): SceneNode {
    this.addChild(node);
    this.updateBounds();
    return node;
  }

  /**
   * Group에서 노드 제거
   * @param {SceneNode} node - 제거할 노드 객체
   * @returns {boolean} 제거 성공 여부
   */
  remove(node: SceneNode): boolean {
    const result = this.removeChild(node);
    if (result) {
      this.updateBounds();
    }
    return result;
  }

  /**
   * Group의 모든 자식 요소 제거
   */
  clear(): void {
    this.clearChildren();
    // 경계 상자 초기화
    this.updateBounds();
  }

  /**
   * ID로 자식 노드 찾기
   * @param {string} id - 찾을 노드의 ID
   * @returns {SceneNode | null} 찾은 노드 또는 null
   */
  findById(id: string): SceneNode | null {
    return this.findChildById(id);
  }

  /**
   * Group 복제
   * @returns {Group} 복제된 Group 객체
   */
  clone(): Group {
    // 새로운 그룹 인스턴스 생성
    const clonedGroup = new DefaultGroup(
      uuidv4(),
      {
        style: { ...this.style },
        transform: Matrix3x3.create(this.transform.values),
      },
      // EventEmitter는 외부에서 주입받아야 함
      this.getEventEmitter()
    );

    // 자식 요소들도 복제
    this.children.forEach(child => {
      if ('clone' in child && typeof child.clone === 'function') {
        const clonedChild = child.clone();
        clonedGroup.add(clonedChild);
      }
    });

    return clonedGroup;
  }

  /**
   * Group 변환 적용
   * @param {Matrix3x3} matrix - 적용할 변환 행렬
   * @returns {Group} 변환이 적용된 새로운 Group 인스턴스
   */
  applyTransform(matrix: Matrix3x3): Group {
    // 모든 자식에게 변환 적용
    const transformedChildren = this.children.map(child => {
      if ('applyTransform' in child && typeof child.applyTransform === 'function') {
        return child.applyTransform(matrix);
      }
      return child;
    });

    // 새 그룹 생성
    const newGroup = new DefaultGroup(
      uuidv4(),
      {
        style: { ...this.style },
        transform: this.transform.multiply(matrix),
      },
      this.getEventEmitter()
    );

    // 변환된 자식들 추가
    transformedChildren.forEach(child => {
      newGroup.add(child);
    });

    return newGroup;
  }

  /**
   * Point가 Group 내부에 있는지 확인
   * @param {Vector2D} point - 확인할 점
   * @returns {boolean} 점이 Group 내부에 있으면 true, 아니면 false
   */
  containsPoint(point: Vector2D): boolean {
    // 자식 중 하나라도 점을 포함하면 true
    return this.children.some(child => {
      if ('containsPoint' in child && typeof child.containsPoint === 'function') {
        return child.containsPoint(point);
      }
      return false;
    });
  }

  /**
   * Group가 다른 노드와 겹치는지 확인
   * @param {SceneNode} other - 겹침을 확인할 다른 노드
   * @returns {boolean} 두 노드가 겹치면 true, 아니면 false
   */
  intersects(other: SceneNode): boolean {
    // 자식 중 하나라도 다른 노드와 겹치면 true
    return this.children.some(child => {
      if ('intersects' in child && typeof child.intersects === 'function') {
        return child.intersects(other);
      }
      return false;
    });
  }

  /**
   * Scale 기준점 설정
   * @param {string} origin - Scale 기준점 ('center', 'topLeft', 'custom')
   * @param {Object} [point] - Custom 기준점일 경우 좌표
   */
  setScaleOrigin(origin: 'center' | 'topLeft' | 'custom', point?: { x: number; y: number }): void {
    // 모든 자식에게 Scale 기준점 설정 전파
    this.children.forEach(child => {
      if ('setScaleOrigin' in child && typeof child.setScaleOrigin === 'function') {
        child.setScaleOrigin(origin, point);
      }
    });
  }

  /**
   * Group를 Path로 변환
   * @returns {PathPoint[]} Path 점들의 배열
   */
  toPath(): PathPoint[] {
    // 모든 자식의 Path를 합침
    const paths: PathPoint[] = [];
    this.children.forEach(child => {
      if ('toPath' in child && typeof child.toPath === 'function') {
        paths.push(...child.toPath());
      }
    });

    return paths;
  }

  /**
   * 그룹의 경계 상자 업데이트
   * 모든 자식 요소의 경계 상자를 포함하도록 계산
   * @private
   */
  private updateBounds(): void {
    // bounds 속성을 가진 자식 노드만 필터링
    const nodesWithBounds = this.children.filter(child => 'bounds' in child) as Array<{
      bounds: { x: number; y: number; width: number; height: number };
    }>;

    if (nodesWithBounds.length === 0) {
      Object.assign(this._bounds, { x: 0, y: 0, width: 0, height: 0 });
      return;
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    nodesWithBounds.forEach(child => {
      const childBounds = child.bounds;
      minX = Math.min(minX, childBounds.x);
      minY = Math.min(minY, childBounds.y);
      maxX = Math.max(maxX, childBounds.x + childBounds.width);
      maxY = Math.max(maxY, childBounds.y + childBounds.height);
    });

    Object.assign(this._bounds, {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    });
  }

  /**
   * 이벤트 이미터 가져오기
   * @private
   * @returns {EventEmitter} 이벤트 이미터
   */
  private getEventEmitter(): EventEmitter {
    return {
      on: this.on.bind(this),
      off: this.off.bind(this),
      emit: this.emit.bind(this),
    };
  }
}
