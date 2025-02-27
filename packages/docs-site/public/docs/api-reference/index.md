---
title: API 레퍼런스
description: Modern Vector.js API 레퍼런스 문서
---

# API 레퍼런스

Modern Vector.js는 벡터 그래픽을 쉽게 생성하고 조작할 수 있는 다양한 API를 제공합니다. 이 섹션에서는 라이브러리의 주요 클래스, 인터페이스, 타입 및 함수에 대한 상세한 문서를 찾을 수 있습니다.

## 주요 API 카테고리

### Core

- [VectorEngine](/docs/api-reference/core/vector-engine) - 라이브러리의 핵심 엔진 클래스
- [Plugin](/docs/api-reference/core/plugin) - 플러그인 인터페이스 및 관련 타입
- [Service](/docs/api-reference/core/service) - 서비스 시스템 관련 API
- [Group](/docs/api-reference/core/group) - 요소 그룹화를 위한 API

### Renderers

- [CanvasRenderer](/docs/api-reference/renderers/canvas-renderer) - Canvas API를 사용한 렌더링
- [SVGRenderer](/docs/api-reference/renderers/svg-renderer) - SVG 기반 렌더링
- [WebGLRenderer](/docs/api-reference/renderers/webgl-renderer) - WebGL을 사용한 고성능 렌더링

### Math

- [Vector](/docs/api-reference/math/vector) - 벡터 연산 관련 클래스 및 함수
- [Matrix](/docs/api-reference/math/matrix) - 행렬 연산 관련 클래스 및 함수
- [Transform](/docs/api-reference/math/transform) - 변환 관련 유틸리티

### Shapes

- [Shape](/docs/api-reference/shapes/shape) - 기본 도형 인터페이스
- [Path](/docs/api-reference/shapes/path) - 경로 관련 클래스 및 함수
- [Primitives](/docs/api-reference/shapes/primitives) - 기본 도형 (사각형, 원, 다각형 등)

### Effects

- [Filter](/docs/api-reference/effects/filter) - 필터 효과 관련 API
- [Animation](/docs/api-reference/effects/animation) - 애니메이션 관련 클래스 및 함수

### Tools

- [SelectionTool](/docs/api-reference/tools/selection-tool) - 선택 도구 관련 API
- [TransformTool](/docs/api-reference/tools/transform-tool) - 변환 도구 관련 API

## API 문서 사용 방법

각 API 문서 페이지는 다음 정보를 포함합니다:

- **설명**: API의 목적과 기능에 대한 개요
- **구문**: 클래스, 인터페이스, 함수 등의 선언 구문
- **매개변수**: 함수나 생성자에 전달되는 매개변수 설명
- **반환 값**: 함수나 메서드가 반환하는 값의 타입과 설명
- **예제**: API 사용 방법을 보여주는 코드 예제
- **관련 API**: 연관된 다른 API에 대한 링크

자세한 API 문서는 [TypeDoc으로 생성된 API 문서](/api-docs)에서도 확인할 수 있습니다. 