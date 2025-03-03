---
title: Modern Vector.js
description: Modern Vector.js는 벡터 그래픽을 위한 차세대 JavaScript 라이브러리입니다.
---

# Modern Vector.js

Modern Vector.js는 웹에서 벡터 그래픽을 쉽게 만들고 조작할 수 있는 현대적인 JavaScript 라이브러리입니다. 플러그인 시스템, 장면 그래프, 그리고 확장 가능한 아키텍처를 통해 다양한 벡터 그래픽 작업을 위한 강력한 기반을 제공합니다.

## 주요 특징

- **플러그인 시스템**: 핵심 기능을 확장하는 플러그인 아키텍처
- **장면 그래프**: 계층적 구조로 쉽게 조작할 수 있는 요소들
- **타입 안전성**: TypeScript 기반의 강력한 타입 시스템
- **모던 API**: 최신 자바스크립트 표준 및 패턴 활용
- **성능 최적화**: 대규모 벡터 그래픽 처리에 최적화

## 타입 안전성 개선

Modern Vector.js는 최근 주요 타입 안전성 향상을 통해 더욱 강력하고 믿을 수 있는 개발 경험을 제공합니다:

- **브랜딩된 타입(Branded Types)**: `NodeID`, `PluginID` 등 브랜딩된 타입을 통해 타입 안전성 강화
- **타입 안전한 이벤트 시스템**: `TypedEventEmitter`를 통한 이벤트 이름과 데이터 타입 연결
- **제네릭 활용**: 다양한 컴포넌트에서 제네릭을 활용한 타입 안전성 보장
- **any 타입 제거**: `unknown`과 타입 가드를 활용한 안전한 타입 처리

자세한 내용은 [타입 안전성](/docs/core-concepts/type-safety)과 [브랜딩된 타입](/docs/core-concepts/branded-types) 문서를 참조하세요.

## 시작하기

Modern Vector.js를 사용하려면 npm을 통해 설치하세요:

```bash
npm install modern-vector
```

기본적인 사용 예시:

```javascript
import { VectorEngine, SceneNode, RectangleShape } from 'modern-vector';

// 벡터 엔진 초기화
const engine = new VectorEngine({
  container: document.getElementById('canvas-container')
});

// 장면에 요소 추가
const rect = new RectangleShape({
  x: 100,
  y: 100,
  width: 200,
  height: 150,
  fill: '#3498db'
});

engine.scene.root.addChild(rect);

// 애니메이션 적용
engine.animate(rect, {
  properties: {
    rotation: 360
  },
  duration: 2000,
  repeat: -1
});
```

## 탐색

Modern Vector.js 문서를 탐색하려면 다음 링크를 사용하세요:

- [API 레퍼런스](/docs/api-reference) - 클래스, 메소드, 인터페이스에 대한 자세한 문서
- [튜토리얼](/docs/tutorials) - 단계별 가이드와 사용 예시
- [핵심 개념](/docs/core-concepts) - 중요한 개념 이해
- [예제](/docs/examples) - 다양한 인터랙티브 예제

## 생태계

Modern Vector.js는 다음과 같은 플러그인을 통해 기능을 확장할 수 있습니다:

- **Group Plugin**: 요소를 그룹화하고 관리하는 기능
- **Path Plugin**: 복잡한 패스와 SVG 지원
- **Export Plugin**: 다양한 형식으로 내보내기
- **Animation Plugin**: 고급 애니메이션 기능

## 기여하기

Modern Vector.js는 오픈 소스 프로젝트이며 기여를 환영합니다. 버그 신고, 기능 요청, 또는 코드 기여를 통해 참여할 수 있습니다.

- [GitHub 리포지토리](https://github.com/example/modern-vector)
- [기여 가이드라인](/docs/contributing) 