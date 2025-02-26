---
title: RendererService
category: interfaces
---

[**Modern Vector.js v0.1.0**](../README.md)

***

[Modern Vector.js](../README.md) / RendererService

# Interface: RendererService

Defined in: [types/index.ts:125](https://github.com/miridih-jwpark02/modern-vector.js/blob/312167d62a717a0944239670c1130d0801cfdeb2/packages/core/src/core/types/index.ts#L125)

Service for managing renderers

렌더러를 관리하는 서비스 인터페이스입니다.

## Methods

### register()

> **register**(`renderer`): `void`

Defined in: [types/index.ts:131](https://github.com/miridih-jwpark02/modern-vector.js/blob/312167d62a717a0944239670c1130d0801cfdeb2/packages/core/src/core/types/index.ts#L131)

렌더러 등록

#### Parameters

##### renderer

[`Renderer`](Renderer.md)

등록할 렌더러

#### Returns

`void`

***

### render()

> **render**(`scene`): `void`

Defined in: [types/index.ts:145](https://github.com/miridih-jwpark02/modern-vector.js/blob/312167d62a717a0944239670c1130d0801cfdeb2/packages/core/src/core/types/index.ts#L145)

장면 렌더링

#### Parameters

##### scene

[`Scene`](Scene.md)

렌더링할 장면

#### Returns

`void`

***

### setActive()

> **setActive**(`rendererId`): `void`

Defined in: [types/index.ts:138](https://github.com/miridih-jwpark02/modern-vector.js/blob/312167d62a717a0944239670c1130d0801cfdeb2/packages/core/src/core/types/index.ts#L138)

활성 렌더러 설정

#### Parameters

##### rendererId

`string`

활성화할 렌더러의 ID

#### Returns

`void`
