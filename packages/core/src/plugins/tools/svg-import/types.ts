/**
 * SVG Import Tool Plugin 타입 정의
 *
 * SVG 가져오기 관련 타입을 정의합니다.
 *
 * @packageDocumentation
 * @module Plugins.Tools.SVGImport
 */

import { SceneNode } from '../../../core/types';

/**
 * ViewBox 정보를 담는 인터페이스
 *
 * SVG의 viewBox 속성 정보를 저장합니다.
 */
export interface ViewBox {
  /** X 좌표 */
  x: number;
  /** Y 좌표 */
  y: number;
  /** 너비 */
  width: number;
  /** 높이 */
  height: number;
}

/**
 * SVG Import Tool Plugin 인터페이스
 *
 * SVG Import Tool Plugin이 제공하는 기능을 정의합니다.
 */
export interface SVGImportToolPluginInterface {
  /**
   * Import SVG from a string
   *
   * 문자열에서 SVG를 가져옵니다.
   *
   * @param svgString - SVG content as string
   * @param options - Import options
   * @returns Promise resolving to the imported scene node
   */
  importFromString(svgString: string, options?: SVGImportOptions): Promise<SceneNode>;

  /**
   * Import SVG from a URL
   *
   * URL에서 SVG를 가져옵니다.
   *
   * @param url - URL to the SVG file
   * @param options - Import options
   * @returns Promise resolving to the imported scene node
   */
  importFromURL(url: string, options?: SVGImportOptions): Promise<SceneNode>;

  /**
   * Import SVG from a File object
   *
   * File 객체에서 SVG를 가져옵니다.
   *
   * @param file - File object containing SVG data
   * @param options - Import options
   * @returns Promise resolving to the imported scene node
   */
  importFromFile(file: File, options?: SVGImportOptions): Promise<SceneNode>;
}

/**
 * SVG Import Tool Plugin을 확장한 VectorEngine 인터페이스
 *
 * VectorEngine에 SVG Import Tool Plugin 기능을 추가합니다.
 */
export interface SVGImportToolPluginExtension {
  svgImport: SVGImportToolPluginInterface;
}

/**
 * SVG 스타일 속성
 *
 * SVG 요소의 스타일 속성을 정의합니다.
 */
export interface SVGStyleAttributes {
  /** 채우기 색상 */
  fill?: string;
  /** 테두리 색상 */
  stroke?: string;
  /** 테두리 두께 */
  strokeWidth?: number;
  /** 투명도 */
  opacity?: number;
  /** 기타 스타일 속성 */
  [key: string]: any;
}

/**
 * SVG import options
 *
 * SVG 가져오기 옵션
 */
export interface SVGImportOptions {
  /**
   * Whether to preserve original SVG viewBox
   *
   * 원본 SVG viewBox를 유지할지 여부
   */
  preserveViewBox?: boolean;

  /**
   * Whether to flatten groups into individual shapes
   *
   * 그룹을 개별 도형으로 평탄화할지 여부
   */
  flattenGroups?: boolean;

  /**
   * Scale factor to apply during import
   *
   * 가져오기 중 적용할 스케일 팩터
   */
  scale?: number;
}
