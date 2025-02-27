/**
 * 예제 플러그인 타입 정의
 *
 * @packageDocumentation
 * @module Example
 */

/**
 * 예제 플러그인 옵션
 */
export interface ExampleOptions {
  /** 옵션 값 */
  value?: string;
  /** 추가 설정 */
  settings?: Record<string, any>;
}

/**
 * 예제 플러그인 결과
 */
export interface ExampleResult {
  /** 결과 ID */
  id: string;
  /** 결과 데이터 */
  data: any;
  /** 생성 시간 */
  createdAt: Date;
}

/**
 * 예제 플러그인 인터페이스
 */
export interface ExamplePluginManipulators {
  /**
   * 예제 기능 실행
   *
   * @param options - 예제 옵션
   * @returns 예제 결과
   */
  executeExample(options?: ExampleOptions): ExampleResult;
}
