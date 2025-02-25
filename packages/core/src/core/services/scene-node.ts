import { SceneNode, EventEmitter } from '../types';

/**
 * Default implementation of SceneNode
 * 
 * 장면 그래프의 노드를 구현한 기본 클래스입니다.
 */
export class DefaultSceneNode implements SceneNode {
  /** 노드의 고유 ID */
  readonly id: string;
  
  /** 부모 노드 */
  parent: SceneNode | null = null;
  
  /** 자식 노드 목록 */
  private _children: SceneNode[] = [];
  
  /** 노드에 연결된 데이터 */
  data: any = null;
  
  /** 이벤트 이미터 */
  private eventEmitter: EventEmitter;
  
  /**
   * DefaultSceneNode 생성자
   * 
   * @param id - 노드의 고유 ID (생략 시 자동 생성)
   * @param eventEmitter - 이벤트 이미터
   */
  constructor(id: string = `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`, eventEmitter: EventEmitter) {
    this.id = id;
    this.eventEmitter = eventEmitter;
  }
  
  /**
   * 자식 노드 목록 getter
   */
  get children(): SceneNode[] {
    return [...this._children]; // 복사본 반환하여 직접 수정 방지
  }
  
  /**
   * 자식 노드 추가
   * 
   * @param child - 추가할 자식 노드
   * @returns 추가된 자식 노드
   */
  addChild(child: SceneNode): SceneNode {
    // 이미 다른 부모가 있는 경우 제거
    if (child.parent) {
      child.parent.removeChild(child);
    }
    
    // 이미 자식으로 있는 경우 무시
    if (this._children.includes(child)) {
      return child;
    }
    
    // 자식으로 추가
    this._children.push(child);
    child.parent = this;
    
    // 이벤트 발생
    this.emit('childAdded', { child });
    
    return child;
  }
  
  /**
   * 자식 노드 제거
   * 
   * @param child - 제거할 자식 노드
   * @returns 제거 성공 여부
   */
  removeChild(child: SceneNode): boolean {
    const index = this._children.indexOf(child);
    
    if (index === -1) {
      return false;
    }
    
    // 자식에서 제거
    this._children.splice(index, 1);
    child.parent = null;
    
    // 이벤트 발생
    this.emit('childRemoved', { child });
    
    return true;
  }
  
  /**
   * 모든 자식 노드 제거
   */
  clearChildren(): void {
    // 모든 자식의 부모 참조 제거
    this._children.forEach(child => {
      child.parent = null;
    });
    
    // 자식 목록 초기화
    const oldChildren = [...this._children];
    this._children = [];
    
    // 이벤트 발생
    this.emit('childrenCleared', { children: oldChildren });
  }
  
  /**
   * ID로 자식 노드 찾기
   * 
   * @param id - 찾을 노드의 ID
   * @returns 찾은 노드 또는 null
   */
  findChildById(id: string): SceneNode | null {
    // 직접 자식 중에서 찾기
    for (const child of this._children) {
      if (child.id === id) {
        return child;
      }
      
      // 재귀적으로 자식의 자식에서 찾기
      const found = child.findChildById(id);
      if (found) {
        return found;
      }
    }
    
    return null;
  }
  
  /**
   * 이벤트 리스너 등록
   * 
   * @param event - 이벤트 이름
   * @param handler - 이벤트 핸들러 함수
   */
  on(event: string, handler: (data: any) => void): void {
    this.eventEmitter.on(event, handler);
  }
  
  /**
   * 이벤트 리스너 제거
   * 
   * @param event - 이벤트 이름
   * @param handler - 제거할 이벤트 핸들러 함수
   */
  off(event: string, handler: (data: any) => void): void {
    this.eventEmitter.off(event, handler);
  }
  
  /**
   * 이벤트 발생
   * 
   * @param event - 발생시킬 이벤트 이름
   * @param data - 이벤트와 함께 전달할 데이터
   */
  emit(event: string, data: any): void {
    this.eventEmitter.emit(event, data);
  }
} 