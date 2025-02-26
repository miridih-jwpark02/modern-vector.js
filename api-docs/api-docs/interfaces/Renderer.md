---
title: Renderer
category: interfaces
---

[**Modern Vector.js v0.1.0**](../README.md)

***

[Modern Vector.js](../README.md) / Renderer

# Interface: Renderer

Defined in: [types/index.ts:255](https://github.com/miridih-jwpark02/modern-vector.js/blob/818f2928b755ec9abdaa6d7fd383f3e23236512e/packages/core/src/core/types/index.ts#L255)

Base renderer interface

다양한 렌더링 백엔드를 위한 기본 인터페이스입니다.

## Properties

### capabilities

> `readonly` **capabilities**: [`RendererCapabilities`](RendererCapabilities.md)

Defined in: [types/index.ts:259](https://github.com/miridih-jwpark02/modern-vector.js/blob/818f2928b755ec9abdaa6d7fd383f3e23236512e/packages/core/src/core/types/index.ts#L259)

Renderer의 기능

***

### id

> `readonly` **id**: `string`

Defined in: [types/index.ts:257](https://github.com/miridih-jwpark02/modern-vector.js/blob/818f2928b755ec9abdaa6d7fd383f3e23236512e/packages/core/src/core/types/index.ts#L257)

Renderer의 고유 ID

## Methods

### dispose()

> **dispose**(): `void`

Defined in: [types/index.ts:275](https://github.com/miridih-jwpark02/modern-vector.js/blob/818f2928b755ec9abdaa6d7fd383f3e23236512e/packages/core/src/core/types/index.ts#L275)

리소스 정리

Renderer가 사용한 리소스를 정리합니다.

#### Returns

`void`

***

### render()

> **render**(`scene`): `void`

Defined in: [types/index.ts:268](https://github.com/miridih-jwpark02/modern-vector.js/blob/818f2928b755ec9abdaa6d7fd383f3e23236512e/packages/core/src/core/types/index.ts#L268)

Scene 렌더링

주어진 Scene을 렌더링합니다.

#### Parameters

##### scene

[`Scene`](Scene.md)

렌더링할 Scene

#### Returns

`void`
