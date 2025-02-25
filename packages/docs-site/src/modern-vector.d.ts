/**
 * Modern Vector.js 타입 정의
 */

declare module 'modern-vector.js' {
  /**
   * 벡터 엔진 인터페이스
   */
  export interface VectorEngine {
    /** 렌더러 서비스 */
    readonly renderer: RendererService;
    /** 이벤트 서비스 */
    readonly events: EventService;
    /** 장면 서비스 */
    readonly scene: SceneService;
    
    /**
     * 플러그인 설치
     * @param plugin - 설치할 플러그인
     */
    use(plugin: Plugin): void;
    
    /**
     * 플러그인 제거
     * @param pluginId - 제거할 플러그인 ID
     */
    remove(pluginId: string): void;
    
    /**
     * 플러그인 가져오기
     * @param id - 플러그인 ID
     * @returns 플러그인 인스턴스 또는 null
     */
    getPlugin<T extends Plugin>(id: string): T | null;
  }

  /**
   * 플러그인 인터페이스
   */
  export interface Plugin {
    /** 플러그인 ID */
    id: string;
    /** 의존성 플러그인 ID 목록 */
    dependencies?: string[];
    
    /**
     * 플러그인 설치
     * @param engine - 벡터 엔진 인스턴스
     */
    install(engine: VectorEngine): void;
    
    /**
     * 플러그인 제거
     * @param engine - 벡터 엔진 인스턴스
     */
    uninstall(engine: VectorEngine): void;
  }

  /**
   * 렌더러 서비스 인터페이스
   */
  export interface RendererService {
    /**
     * 장면 렌더링
     */
    render(): void;
    
    /**
     * 선형 그라디언트 생성
     * @param options - 그라디언트 옵션
     * @returns 그라디언트 ID
     */
    createLinearGradient(options: GradientOptions): string;
  }

  /**
   * 이벤트 서비스 인터페이스
   */
  export interface EventService {
    /**
     * 이벤트 리스너 등록
     * @param type - 이벤트 타입
     * @param callback - 콜백 함수
     */
    on(type: string, callback: EventCallback): void;
    
    /**
     * 이벤트 리스너 제거
     * @param type - 이벤트 타입
     * @param callback - 콜백 함수
     */
    off(type: string, callback: EventCallback): void;
  }

  /**
   * 장면 서비스 인터페이스
   */
  export interface SceneService {
    /**
     * 사각형 생성
     * @param options - 사각형 옵션
     * @returns 사각형 객체
     */
    createRect(options: RectOptions): Shape;
    
    /**
     * 원 생성
     * @param options - 원 옵션
     * @returns 원 객체
     */
    createCircle(options: CircleOptions): Shape;
    
    /**
     * 선 생성
     * @param options - 선 옵션
     * @returns 선 객체
     */
    createLine(options: LineOptions): Shape;
    
    /**
     * 패스 연산 객체
     */
    pathOp?: PathOperations;
  }

  /**
   * 패스 연산 인터페이스
   */
  export interface PathOperations {
    /**
     * 합집합 연산
     * @param shape1 - 첫 번째 도형
     * @param shape2 - 두 번째 도형
     * @returns 결과 도형
     */
    union(shape1: Shape, shape2: Shape): Shape;
    
    /**
     * 교집합 연산
     * @param shape1 - 첫 번째 도형
     * @param shape2 - 두 번째 도형
     * @returns 결과 도형
     */
    intersect(shape1: Shape, shape2: Shape): Shape;
    
    /**
     * 차집합 연산
     * @param shape1 - 첫 번째 도형
     * @param shape2 - 두 번째 도형
     * @returns 결과 도형
     */
    subtract(shape1: Shape, shape2: Shape): Shape;
  }

  /**
   * 도형 인터페이스
   */
  export interface Shape {
    /** 채우기 색상 */
    fill?: string;
    /** 테두리 색상 */
    stroke?: string;
    /** 테두리 두께 */
    strokeWidth?: number;
    
    /**
     * 이동 변환
     * @param x - X 좌표 이동량
     * @param y - Y 좌표 이동량
     */
    translate(x: number, y: number): void;
    
    /**
     * 회전 변환
     * @param angle - 회전 각도 (도)
     */
    rotate(angle: number): void;
    
    /**
     * 크기 조절 변환
     * @param sx - X 축 크기 비율
     * @param sy - Y 축 크기 비율
     */
    scale(sx: number, sy: number): void;
  }

  /**
   * 사각형 옵션 인터페이스
   */
  export interface RectOptions {
    /** X 좌표 */
    x: number;
    /** Y 좌표 */
    y: number;
    /** 너비 */
    width: number;
    /** 높이 */
    height: number;
    /** 채우기 색상 */
    fill?: string;
    /** 테두리 색상 */
    stroke?: string;
    /** 테두리 두께 */
    strokeWidth?: number;
    /** X 방향 모서리 반경 */
    rx?: number;
    /** Y 방향 모서리 반경 */
    ry?: number;
  }

  /**
   * 원 옵션 인터페이스
   */
  export interface CircleOptions {
    /** X 좌표 */
    x: number;
    /** Y 좌표 */
    y: number;
    /** 반지름 */
    radius: number;
    /** 채우기 색상 */
    fill?: string;
    /** 테두리 색상 */
    stroke?: string;
    /** 테두리 두께 */
    strokeWidth?: number;
  }

  /**
   * 선 옵션 인터페이스
   */
  export interface LineOptions {
    /** 시작점 X 좌표 */
    x1: number;
    /** 시작점 Y 좌표 */
    y1: number;
    /** 끝점 X 좌표 */
    x2: number;
    /** 끝점 Y 좌표 */
    y2: number;
    /** 선 색상 */
    stroke?: string;
    /** 선 두께 */
    strokeWidth?: number;
  }

  /**
   * 그라디언트 옵션 인터페이스
   */
  export interface GradientOptions {
    /** 그라디언트 ID */
    id: string;
    /** 시작점 X 좌표 (0~1) */
    x1: number;
    /** 시작점 Y 좌표 (0~1) */
    y1: number;
    /** 끝점 X 좌표 (0~1) */
    x2: number;
    /** 끝점 Y 좌표 (0~1) */
    y2: number;
    /** 색상 정지점 목록 */
    stops: GradientStop[];
  }

  /**
   * 그라디언트 색상 정지점 인터페이스
   */
  export interface GradientStop {
    /** 위치 (0~1) */
    offset: number;
    /** 색상 */
    color: string;
  }

  /**
   * 이벤트 콜백 타입
   */
  export type EventCallback = (event: any) => void;

  /**
   * 벡터 엔진 생성자
   */
  export class VectorEngineImpl implements VectorEngine {
    renderer: RendererService;
    events: EventService;
    scene: SceneService;
    
    constructor();
    
    use(plugin: Plugin): void;
    remove(pluginId: string): void;
    getPlugin<T extends Plugin>(id: string): T | null;
  }

  /**
   * Canvas 렌더러 플러그인
   */
  export const CanvasRendererPlugin: Plugin;

  /**
   * SVG 렌더러 플러그인
   */
  export const SVGRendererPlugin: Plugin;

  /**
   * 패스 연산 플러그인
   */
  export const PathOperationsPlugin: Plugin;

  // 기본 내보내기
  export { VectorEngineImpl as VectorEngine };
} 