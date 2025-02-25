[**Modern Vector.js v0.1.0**](../README.md)

***

[Modern Vector.js](../README.md) / Renderer

# Interface: Renderer

Defined in: [types/index.ts:210](https://github.com/miridih-jwpark02/modern-vector.js/blob/58855110338ab7f20b2d2c6d39daa31fbf837bc1/src/core/types/index.ts#L210)

Base renderer interface

다양한 렌더링 백엔드를 위한 기본 인터페이스입니다.

## Properties

### capabilities

> `readonly` **capabilities**: [`RendererCapabilities`](RendererCapabilities.md)

Defined in: [types/index.ts:214](https://github.com/miridih-jwpark02/modern-vector.js/blob/58855110338ab7f20b2d2c6d39daa31fbf837bc1/src/core/types/index.ts#L214)

Renderer의 기능

***

### id

> `readonly` **id**: `string`

Defined in: [types/index.ts:212](https://github.com/miridih-jwpark02/modern-vector.js/blob/58855110338ab7f20b2d2c6d39daa31fbf837bc1/src/core/types/index.ts#L212)

Renderer의 고유 ID

## Methods

### dispose()

> **dispose**(): `void`

Defined in: [types/index.ts:230](https://github.com/miridih-jwpark02/modern-vector.js/blob/58855110338ab7f20b2d2c6d39daa31fbf837bc1/src/core/types/index.ts#L230)

리소스 정리

Renderer가 사용한 리소스를 정리합니다.

#### Returns

`void`

***

### render()

> **render**(`scene`): `void`

Defined in: [types/index.ts:223](https://github.com/miridih-jwpark02/modern-vector.js/blob/58855110338ab7f20b2d2c6d39daa31fbf837bc1/src/core/types/index.ts#L223)

Scene 렌더링

주어진 Scene을 렌더링합니다.

#### Parameters

##### scene

[`Scene`](Scene.md)

렌더링할 Scene

#### Returns

`void`
