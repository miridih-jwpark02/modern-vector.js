[**Modern Vector.js v0.1.0**](../README.md)

***

[Modern Vector.js](../README.md) / Scene

# Interface: Scene

Defined in: [types/index.ts:196](https://github.com/miridih-jwpark02/modern-vector.js/blob/58855110338ab7f20b2d2c6d39daa31fbf837bc1/src/core/types/index.ts#L196)

Scene interface representing a container for shapes

Shape들을 포함하는 장면 인터페이스입니다.

## Extends

- [`EventEmitter`](EventEmitter.md)

## Properties

### plugins

> `readonly` **plugins**: `Map`\<`string`, [`Plugin`](Plugin.md)\>

Defined in: [types/index.ts:202](https://github.com/miridih-jwpark02/modern-vector.js/blob/58855110338ab7f20b2d2c6d39daa31fbf837bc1/src/core/types/index.ts#L202)

장면에 등록된 플러그인 맵

***

### renderer

> `readonly` **renderer**: [`Renderer`](Renderer.md)

Defined in: [types/index.ts:200](https://github.com/miridih-jwpark02/modern-vector.js/blob/58855110338ab7f20b2d2c6d39daa31fbf837bc1/src/core/types/index.ts#L200)

장면의 렌더러

***

### root

> `readonly` **root**: `Node`

Defined in: [types/index.ts:198](https://github.com/miridih-jwpark02/modern-vector.js/blob/58855110338ab7f20b2d2c6d39daa31fbf837bc1/src/core/types/index.ts#L198)

장면의 루트 노드

## Methods

### emit()

> **emit**(`event`, `data`): `void`

Defined in: [types/index.ts:117](https://github.com/miridih-jwpark02/modern-vector.js/blob/58855110338ab7f20b2d2c6d39daa31fbf837bc1/src/core/types/index.ts#L117)

이벤트 발생

#### Parameters

##### event

`string`

발생시킬 이벤트 이름

##### data

`any`

이벤트와 함께 전달할 데이터

#### Returns

`void`

#### Inherited from

[`EventEmitter`](EventEmitter.md).[`emit`](EventEmitter.md#emit)

***

### off()

> **off**(`event`, `handler`): `void`

Defined in: [types/index.ts:109](https://github.com/miridih-jwpark02/modern-vector.js/blob/58855110338ab7f20b2d2c6d39daa31fbf837bc1/src/core/types/index.ts#L109)

이벤트 리스너 제거

#### Parameters

##### event

`string`

이벤트 이름

##### handler

[`EventHandler`](../type-aliases/EventHandler.md)

제거할 이벤트 핸들러 함수

#### Returns

`void`

#### Inherited from

[`EventEmitter`](EventEmitter.md).[`off`](EventEmitter.md#off)

***

### on()

> **on**(`event`, `handler`): `void`

Defined in: [types/index.ts:101](https://github.com/miridih-jwpark02/modern-vector.js/blob/58855110338ab7f20b2d2c6d39daa31fbf837bc1/src/core/types/index.ts#L101)

이벤트 리스너 등록

#### Parameters

##### event

`string`

이벤트 이름

##### handler

[`EventHandler`](../type-aliases/EventHandler.md)

이벤트 핸들러 함수

#### Returns

`void`

#### Inherited from

[`EventEmitter`](EventEmitter.md).[`on`](EventEmitter.md#on)
