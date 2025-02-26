---
title: EventEmitter
category: interfaces
---

[**Modern Vector.js v0.1.0**](../README.md)

***

[Modern Vector.js](../README.md) / EventEmitter

# Interface: EventEmitter

Defined in: [types/index.ts:94](https://github.com/miridih-jwpark02/modern-vector.js/blob/312167d62a717a0944239670c1130d0801cfdeb2/packages/core/src/core/types/index.ts#L94)

Event emitter interface for handling events

이벤트를 발생시키고 처리하기 위한 인터페이스입니다.

## Extended by

- [`EventService`](EventService.md)
- [`Scene`](Scene.md)
- [`SceneNode`](SceneNode.md)

## Methods

### emit()

> **emit**(`event`, `data`): `void`

Defined in: [types/index.ts:117](https://github.com/miridih-jwpark02/modern-vector.js/blob/312167d62a717a0944239670c1130d0801cfdeb2/packages/core/src/core/types/index.ts#L117)

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

***

### off()

> **off**(`event`, `handler`): `void`

Defined in: [types/index.ts:109](https://github.com/miridih-jwpark02/modern-vector.js/blob/312167d62a717a0944239670c1130d0801cfdeb2/packages/core/src/core/types/index.ts#L109)

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

***

### on()

> **on**(`event`, `handler`): `void`

Defined in: [types/index.ts:101](https://github.com/miridih-jwpark02/modern-vector.js/blob/312167d62a717a0944239670c1130d0801cfdeb2/packages/core/src/core/types/index.ts#L101)

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
