---
title: SceneNode
category: interfaces
---

[**Modern Vector.js v0.1.0**](../README.md)

***

[Modern Vector.js](../README.md) / SceneNode

# Interface: SceneNode

Defined in: [types/index.ts:210](https://github.com/miridih-jwpark02/modern-vector.js/blob/818f2928b755ec9abdaa6d7fd383f3e23236512e/packages/core/src/core/types/index.ts#L210)

SceneNode interface representing a node in the scene graph

장면 그래프의 노드를 나타내는 인터페이스입니다.

## Extends

- [`EventEmitter`](EventEmitter.md)

## Properties

### children

> `readonly` **children**: [`SceneNode`](SceneNode.md)[]

Defined in: [types/index.ts:216](https://github.com/miridih-jwpark02/modern-vector.js/blob/818f2928b755ec9abdaa6d7fd383f3e23236512e/packages/core/src/core/types/index.ts#L216)

자식 노드 목록

***

### data

> **data**: `any`

Defined in: [types/index.ts:218](https://github.com/miridih-jwpark02/modern-vector.js/blob/818f2928b755ec9abdaa6d7fd383f3e23236512e/packages/core/src/core/types/index.ts#L218)

노드에 연결된 데이터

***

### id

> `readonly` **id**: `string`

Defined in: [types/index.ts:212](https://github.com/miridih-jwpark02/modern-vector.js/blob/818f2928b755ec9abdaa6d7fd383f3e23236512e/packages/core/src/core/types/index.ts#L212)

노드의 고유 ID

***

### parent

> **parent**: `null` \| [`SceneNode`](SceneNode.md)

Defined in: [types/index.ts:214](https://github.com/miridih-jwpark02/modern-vector.js/blob/818f2928b755ec9abdaa6d7fd383f3e23236512e/packages/core/src/core/types/index.ts#L214)

부모 노드

## Methods

### addChild()

> **addChild**(`child`): [`SceneNode`](SceneNode.md)

Defined in: [types/index.ts:226](https://github.com/miridih-jwpark02/modern-vector.js/blob/818f2928b755ec9abdaa6d7fd383f3e23236512e/packages/core/src/core/types/index.ts#L226)

자식 노드 추가

#### Parameters

##### child

[`SceneNode`](SceneNode.md)

추가할 자식 노드

#### Returns

[`SceneNode`](SceneNode.md)

추가된 자식 노드

***

### clearChildren()

> **clearChildren**(): `void`

Defined in: [types/index.ts:239](https://github.com/miridih-jwpark02/modern-vector.js/blob/818f2928b755ec9abdaa6d7fd383f3e23236512e/packages/core/src/core/types/index.ts#L239)

모든 자식 노드 제거

#### Returns

`void`

***

### emit()

> **emit**(`event`, `data`): `void`

Defined in: [types/index.ts:117](https://github.com/miridih-jwpark02/modern-vector.js/blob/818f2928b755ec9abdaa6d7fd383f3e23236512e/packages/core/src/core/types/index.ts#L117)

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

### findChildById()

> **findChildById**(`id`): `null` \| [`SceneNode`](SceneNode.md)

Defined in: [types/index.ts:247](https://github.com/miridih-jwpark02/modern-vector.js/blob/818f2928b755ec9abdaa6d7fd383f3e23236512e/packages/core/src/core/types/index.ts#L247)

ID로 자식 노드 찾기

#### Parameters

##### id

`string`

찾을 노드의 ID

#### Returns

`null` \| [`SceneNode`](SceneNode.md)

찾은 노드 또는 null

***

### off()

> **off**(`event`, `handler`): `void`

Defined in: [types/index.ts:109](https://github.com/miridih-jwpark02/modern-vector.js/blob/818f2928b755ec9abdaa6d7fd383f3e23236512e/packages/core/src/core/types/index.ts#L109)

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

Defined in: [types/index.ts:101](https://github.com/miridih-jwpark02/modern-vector.js/blob/818f2928b755ec9abdaa6d7fd383f3e23236512e/packages/core/src/core/types/index.ts#L101)

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

***

### removeChild()

> **removeChild**(`child`): `boolean`

Defined in: [types/index.ts:234](https://github.com/miridih-jwpark02/modern-vector.js/blob/818f2928b755ec9abdaa6d7fd383f3e23236512e/packages/core/src/core/types/index.ts#L234)

자식 노드 제거

#### Parameters

##### child

[`SceneNode`](SceneNode.md)

제거할 자식 노드

#### Returns

`boolean`

제거 성공 여부
