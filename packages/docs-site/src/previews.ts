/**
 * 예제 미리보기 초기화
 */

import { getAllExamples } from './examples';
import { setupPreview } from './setup';

/**
 * 모든 예제 미리보기 초기화
 */
export function initializeExamplePreviews(): void {
  const examples = getAllExamples();
  
  // 각 예제 미리보기 초기화
  Object.keys(examples).forEach(id => {
    const previewContainer = document.getElementById(`${id}-preview`);
    if (previewContainer) {
      setupPreview(id, previewContainer);
    }
  });
} 