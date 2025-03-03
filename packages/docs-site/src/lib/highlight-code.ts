'use client';

import hljs from 'highlight.js';
import 'highlight.js/styles/vs2015.css';

/**
 * 코드 블록에 하이라이팅 적용
 *
 * 페이지가 로드된 후 모든 code 요소에 highlight.js 적용
 */
export function initializeHighlighting(): void {
  // 문서가 완전히 로드되었는지 확인
  if (typeof document !== 'undefined') {
    // 서버 사이드 렌더링이므로 'load' 이벤트 사용 불가
    setTimeout(() => {
      // pre > code 요소 선택
      const codeBlocks = document.querySelectorAll('pre code');

      // 각 코드 블록에 하이라이팅 적용
      codeBlocks.forEach(block => {
        hljs.highlightElement(block as HTMLElement);
      });

      // 코드 블록에 복사 버튼 추가
      addCopyButtons();

      console.log(`Highlighting applied to ${codeBlocks.length} code blocks`);
    }, 0);
  }
}

/**
 * 페이지가 업데이트될 때 하이라이팅 다시 적용
 *
 * 페이지 이동 후에도 하이라이팅 유지
 */
export function refreshHighlighting(): void {
  if (typeof document !== 'undefined') {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
      hljs.highlightElement(block as HTMLElement);
    });

    // 복사 버튼도 다시 추가
    addCopyButtons();
  }
}

/**
 * 모든 코드 블록에 복사 버튼 추가
 */
function addCopyButtons(): void {
  // 이미 존재하는 복사 버튼 제거 (중복 방지)
  const existingButtons = document.querySelectorAll('.copy-code-button');
  existingButtons.forEach(button => button.remove());

  // pre 요소 선택 (코드 블록의 컨테이너)
  const codeBlocks = document.querySelectorAll('pre');

  codeBlocks.forEach(codeBlock => {
    // pre 요소를 HTMLElement로 타입 캐스팅
    const preElement = codeBlock as HTMLElement;

    // 부모가 figure인 경우만 처리 (rehype-pretty-code로 생성된 코드 블록)
    if (codeBlock.parentElement?.tagName === 'FIGURE' || codeBlock.querySelector('code')) {
      // 복사 버튼 생성
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-code-button';
      copyButton.ariaLabel = '코드 복사';
      copyButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="copy-icon">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="check-icon" style="display: none;">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;

      // 복사 버튼 위치 조정
      copyButton.style.position = 'absolute';
      copyButton.style.top = '0.75rem';
      copyButton.style.right = '2.5rem';
      copyButton.style.cursor = 'pointer';

      // 코드 블록에 상대적 위치 속성 추가 (버튼 위치 지정용)
      if (preElement.style.position !== 'relative') {
        preElement.style.position = 'relative';
      }

      // 복사 버튼 클릭 이벤트 핸들러
      copyButton.addEventListener('click', () => {
        // code 요소에서 텍스트 추출
        const codeElement = codeBlock.querySelector('code');
        if (!codeElement) return;

        // 코드 내용 가져오기 (줄바꿈과 공백 유지)
        const code = codeElement.textContent || '';

        // 클립보드에 복사
        navigator.clipboard
          .writeText(code)
          .then(() => {
            // 복사 성공 시 아이콘 변경 및 효과
            const copyIcon = copyButton.querySelector('.copy-icon');
            const checkIcon = copyButton.querySelector('.check-icon');

            if (copyIcon && checkIcon) {
              (copyIcon as HTMLElement).style.display = 'none';
              (checkIcon as HTMLElement).style.display = 'inline-block';

              // 2초 후 아이콘 원상복구
              setTimeout(() => {
                (copyIcon as HTMLElement).style.display = 'inline-block';
                (checkIcon as HTMLElement).style.display = 'none';
              }, 2000);
            }
          })
          .catch(err => {
            console.error('Failed to copy code: ', err);
          });
      });

      // 코드 블록에 버튼 추가
      codeBlock.appendChild(copyButton);
    }
  });
}
