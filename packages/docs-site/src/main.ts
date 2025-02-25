/**
 * Modern Vector.js 문서 사이트 메인 스크립트
 */

import { loadExamples } from './examples';
import { setupEventListeners } from './events';
import { initializeExamplePreviews } from './previews';

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
  // 예제 데이터 로드
  loadExamples();
  
  // 이벤트 리스너 설정
  setupEventListeners();
  
  // 예제 미리보기 초기화
  initializeExamplePreviews();
  
  console.log('Modern Vector.js 문서 사이트가 초기화되었습니다.');
}); 