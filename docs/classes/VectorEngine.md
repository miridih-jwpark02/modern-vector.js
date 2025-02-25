[**Modern Vector.js v0.1.0**](../README.md)

***

[Modern Vector.js](../README.md) / VectorEngine

# Class: VectorEngine

Defined in: [engine.ts:9](https://github.com/miridih-jwpark02/modern-vector.js/blob/58855110338ab7f20b2d2c6d39daa31fbf837bc1/src/core/engine.ts#L9)

Vector Graphics Engine implementation

## Implements

- `VectorEngine`

## Constructors

### new VectorEngine()

> **new VectorEngine**(): [`VectorEngine`](VectorEngine.md)

Defined in: [engine.ts:16](https://github.com/miridih-jwpark02/modern-vector.js/blob/58855110338ab7f20b2d2c6d39daa31fbf837bc1/src/core/engine.ts#L16)

#### Returns

[`VectorEngine`](VectorEngine.md)

## Properties

### events

> `readonly` **events**: [`EventService`](../interfaces/EventService.md)

Defined in: [engine.ts:13](https://github.com/miridih-jwpark02/modern-vector.js/blob/58855110338ab7f20b2d2c6d39daa31fbf837bc1/src/core/engine.ts#L13)

Event service

#### Implementation of

`VectorEngine.events`

***

### renderer

> `readonly` **renderer**: [`RendererService`](../interfaces/RendererService.md)

Defined in: [engine.ts:12](https://github.com/miridih-jwpark02/modern-vector.js/blob/58855110338ab7f20b2d2c6d39daa31fbf837bc1/src/core/engine.ts#L12)

Renderer service

#### Implementation of

`VectorEngine.renderer`

***

### scene

> `readonly` **scene**: [`SceneService`](../interfaces/SceneService.md)

Defined in: [engine.ts:14](https://github.com/miridih-jwpark02/modern-vector.js/blob/58855110338ab7f20b2d2c6d39daa31fbf837bc1/src/core/engine.ts#L14)

Scene service

#### Implementation of

`VectorEngine.scene`

## Methods

### getPlugin()

> **getPlugin**\<`T`\>(`id`): `null` \| `T`

Defined in: [engine.ts:66](https://github.com/miridih-jwpark02/modern-vector.js/blob/58855110338ab7f20b2d2c6d39daa31fbf837bc1/src/core/engine.ts#L66)

Get a plugin by ID

#### Type Parameters

• **T** *extends* [`Plugin`](../interfaces/Plugin.md)

#### Parameters

##### id

`string`

Plugin ID

#### Returns

`null` \| `T`

The plugin instance or null if not found

#### Implementation of

`VectorEngine.getPlugin`

***

### remove()

> **remove**(`pluginId`): `void`

Defined in: [engine.ts:46](https://github.com/miridih-jwpark02/modern-vector.js/blob/58855110338ab7f20b2d2c6d39daa31fbf837bc1/src/core/engine.ts#L46)

Remove a plugin from the engine

#### Parameters

##### pluginId

`string`

ID of the plugin to remove

#### Returns

`void`

#### Implementation of

`VectorEngine.remove`

***

### use()

> **use**(`plugin`): `void`

Defined in: [engine.ts:27](https://github.com/miridih-jwpark02/modern-vector.js/blob/58855110338ab7f20b2d2c6d39daa31fbf837bc1/src/core/engine.ts#L27)

Install a plugin into the engine

#### Parameters

##### plugin

[`Plugin`](../interfaces/Plugin.md)

The plugin to install

#### Returns

`void`

#### Throws

Error if plugin dependencies are not met

#### Implementation of

`VectorEngine.use`
