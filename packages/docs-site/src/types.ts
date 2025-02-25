/**
 * 문서 사이트 타입 정의
 */

/**
 * 예제 데이터 인터페이스
 */
export interface Example {
  /** 예제 제목 */
  title: string;
  /** 예제 설명 */
  description: string;
  /** 예제 코드 */
  code: string;
  /** 예제 설정 함수 이름 */
  setupFunction: string;
}

/**
 * 예제 설정 함수 타입
 */
export type ExampleSetupFunction = (container: HTMLElement) => void;

/**
 * 예제 미리보기 설정 함수 타입
 */
export type PreviewSetupFunction = (container: HTMLElement) => void; 