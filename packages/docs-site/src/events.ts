/**
 * 이벤트 처리
 */

import { getExample } from './examples';
import { setupExample } from './setup';

/**
 * 이벤트 리스너 설정
 */
export function setupEventListeners(): void {
  console.log('이벤트 리스너 설정 중...');
  
  // 예제 보기 버튼 클릭 이벤트
  document.querySelectorAll('[data-action="view-example"]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const target = (button as HTMLElement).dataset.target;
      console.log('예제 보기 버튼 클릭:', target);
      if (target) {
        showExample(target);
      }
    });
  });

  // 목록으로 돌아가기 버튼 클릭 이벤트
  const backButton = document.getElementById('back-to-examples');
  if (backButton) {
    backButton.addEventListener('click', () => {
      console.log('목록으로 돌아가기 버튼 클릭');
      hideExampleViewer();
    });
  } else {
    console.error('back-to-examples 버튼을 찾을 수 없습니다.');
  }

  // 모달 닫기 버튼 클릭 이벤트
  const closeModal = document.querySelector('.close-modal');
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      hideModal();
    });
  }

  // 모달 외부 클릭 시 닫기
  const modal = document.getElementById('modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        hideModal();
      }
    });
  }

  // URL 해시 변경 이벤트
  window.addEventListener('hashchange', handleHashChange);
  
  // 초기 해시 처리
  handleHashChange();
  
  console.log('이벤트 리스너 설정 완료');
}

/**
 * 해시 변경 처리
 */
function handleHashChange(): void {
  const hash = window.location.hash.substring(1);
  console.log('해시 변경:', hash);
  
  // 예제 ID가 해시에 있는 경우 해당 예제 표시
  if (hash.startsWith('example-')) {
    const exampleId = hash.substring(8);
    showExample(exampleId);
  } else if (hash === 'examples') {
    hideExampleViewer();
    document.getElementById('examples')?.scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * 예제 표시
 * @param id - 예제 ID
 */
function showExample(id: string): void {
  console.log('예제 표시 시작:', id);
  const example = getExample(id);
  if (!example) {
    console.error('예제를 찾을 수 없음:', id);
    return;
  }

  // 예제 제목 설정
  const titleElement = document.getElementById('example-title');
  if (titleElement) {
    titleElement.textContent = example.title;
  }

  // 예제 코드 설정
  const codeElement = document.getElementById('example-code');
  if (codeElement) {
    codeElement.textContent = example.code;
  }

  // 예제 캔버스 설정
  const canvasContainer = document.getElementById('example-canvas');
  if (canvasContainer) {
    canvasContainer.innerHTML = '';
    setupExample(id, canvasContainer);
  }

  // 예제 뷰어 표시
  const examplesSection = document.getElementById('examples');
  const exampleViewerSection = document.getElementById('example-viewer');
  
  if (examplesSection) {
    console.log('examples 섹션 숨기기');
    examplesSection.classList.add('hidden');
  } else {
    console.error('examples 섹션을 찾을 수 없음');
  }
  
  if (exampleViewerSection) {
    console.log('example-viewer 섹션 표시');
    exampleViewerSection.classList.remove('hidden');
  } else {
    console.error('example-viewer 섹션을 찾을 수 없음');
  }

  // URL 해시 업데이트
  window.location.hash = `example-${id}`;
  console.log('예제 표시 완료:', id);
}

/**
 * 예제 뷰어 숨기기
 */
function hideExampleViewer(): void {
  console.log('예제 뷰어 숨기기 시작');
  const examplesSection = document.getElementById('examples');
  const exampleViewerSection = document.getElementById('example-viewer');
  
  if (examplesSection) {
    console.log('examples 섹션 표시');
    examplesSection.classList.remove('hidden');
  } else {
    console.error('examples 섹션을 찾을 수 없음');
  }
  
  if (exampleViewerSection) {
    console.log('example-viewer 섹션 숨기기');
    exampleViewerSection.classList.add('hidden');
  } else {
    console.error('example-viewer 섹션을 찾을 수 없음');
  }

  // URL 해시 업데이트
  window.location.hash = 'examples';
  console.log('예제 뷰어 숨기기 완료');
}

/**
 * 모달 표시
 * @param content - 모달 내용
 */
export function showModal(content: string): void {
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modal-content');
  
  if (modal && modalContent) {
    modalContent.innerHTML = content;
    modal.style.display = 'block';
  }
}

/**
 * 모달 숨기기
 */
function hideModal(): void {
  const modal = document.getElementById('modal');
  if (modal) {
    modal.style.display = 'none';
  }
} 