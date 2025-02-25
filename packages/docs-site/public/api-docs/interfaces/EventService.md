---
title: EventService
category: interfaces
---

[**Modern Vector.js v0.1.0**](../README.md)

***

[Modern Vector.js](../README.md) / EventService

# Interface: EventService

Defined in: [types/index.ts:153](https://github.com/miridih-jwpark02/modern-vector.js/blob/37a69dc197ba8a52e9720cae0849c3f533f1e74e/packages/core/src/core/types/index.ts#L153)

Service for managing events with namespacing support

네임스페이스를 지원하는 이벤트 관리 서비스 인터페이스입니다.

## Extends

- [`EventEmitter`](EventEmitter.md)

## Methods

### createNamespace()

> **createNamespace**(`name`): [`EventEmitter`](EventEmitter.md)

Defined in: [types/index.ts:160](https://github.com/miridih-jwpark02/modern-vector.js/blob/37a69dc197ba8a52e9720cae0849c3f533f1e74e/packages/core/src/core/types/index.ts#L160)

이벤트 네임스페이스 생성

#### Parameters

##### name

`string`

네임스페이스 이름

#### Returns

[`EventEmitter`](EventEmitter.md)

생성된 이벤트 이미터

***

### emit()

> **emit**(`event`, `data`): `void`

Defined in: [types/index.ts:117](https://github.com/miridih-jwpark02/modern-vector.js/blob/37a69dc197ba8a52e9720cae0849c3f533f1e74e/packages/core/src/core/types/index.ts#L117)

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

Defined in: [types/index.ts:109](https://github.com/miridih-jwpark02/modern-vector.js/blob/37a69dc197ba8a52e9720cae0849c3f533f1e74e/packages/core/src/core/types/index.ts#L109)

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

Defined in: [types/index.ts:101](https://github.com/miridih-jwpark02/modern-vector.js/blob/37a69dc197ba8a52e9720cae0849c3f533f1e74e/packages/core/src/core/types/index.ts#L101)

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
