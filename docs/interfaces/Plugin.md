[**Modern Vector.js v0.1.0**](../README.md)

***

[Modern Vector.js](../README.md) / Plugin

# Interface: Plugin

Defined in: [types/index.ts:13](https://github.com/miridih-jwpark02/modern-vector.js/blob/58855110338ab7f20b2d2c6d39daa31fbf837bc1/src/core/types/index.ts#L13)

Plugin interface for the vector graphics engine

벡터 그래픽 엔진을 위한 플러그인 인터페이스

## Properties

### dependencies?

> `readonly` `optional` **dependencies**: `string`[]

Defined in: [types/index.ts:19](https://github.com/miridih-jwpark02/modern-vector.js/blob/58855110338ab7f20b2d2c6d39daa31fbf837bc1/src/core/types/index.ts#L19)

Optional array of plugin IDs that this plugin depends on

***

### id

> `readonly` **id**: `string`

Defined in: [types/index.ts:15](https://github.com/miridih-jwpark02/modern-vector.js/blob/58855110338ab7f20b2d2c6d39daa31fbf837bc1/src/core/types/index.ts#L15)

Unique identifier for the plugin

***

### version

> `readonly` **version**: `string`

Defined in: [types/index.ts:17](https://github.com/miridih-jwpark02/modern-vector.js/blob/58855110338ab7f20b2d2c6d39daa31fbf837bc1/src/core/types/index.ts#L17)

Semantic version of the plugin

## Methods

### install()

> **install**(`engine`): `void`

Defined in: [types/index.ts:28](https://github.com/miridih-jwpark02/modern-vector.js/blob/58855110338ab7f20b2d2c6d39daa31fbf837bc1/src/core/types/index.ts#L28)

Install the plugin into the engine

엔진에 플러그인을 설치합니다.

#### Parameters

##### engine

`VectorEngine`

The vector engine instance

#### Returns

`void`

***

### uninstall()

> **uninstall**(`engine`): `void`

Defined in: [types/index.ts:37](https://github.com/miridih-jwpark02/modern-vector.js/blob/58855110338ab7f20b2d2c6d39daa31fbf837bc1/src/core/types/index.ts#L37)

Uninstall the plugin from the engine

엔진에서 플러그인을 제거합니다.

#### Parameters

##### engine

`VectorEngine`

The vector engine instance

#### Returns

`void`
