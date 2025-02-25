---
title: SceneService
category: interfaces
---

[**Modern Vector.js v0.1.0**](../README.md)

***

[Modern Vector.js](../README.md) / SceneService

# Interface: SceneService

Defined in: [types/index.ts:168](https://github.com/miridih-jwpark02/modern-vector.js/blob/37a69dc197ba8a52e9720cae0849c3f533f1e74e/packages/core/src/core/types/index.ts#L168)

Service for managing scenes

장면을 관리하는 서비스 인터페이스입니다.

## Methods

### create()

> **create**(): [`Scene`](Scene.md)

Defined in: [types/index.ts:174](https://github.com/miridih-jwpark02/modern-vector.js/blob/37a69dc197ba8a52e9720cae0849c3f533f1e74e/packages/core/src/core/types/index.ts#L174)

새 장면 생성

#### Returns

[`Scene`](Scene.md)

생성된 장면

***

### getActive()

> **getActive**(): [`Scene`](Scene.md)

Defined in: [types/index.ts:181](https://github.com/miridih-jwpark02/modern-vector.js/blob/37a69dc197ba8a52e9720cae0849c3f533f1e74e/packages/core/src/core/types/index.ts#L181)

활성 장면 가져오기

#### Returns

[`Scene`](Scene.md)

현재 활성화된 장면

***

### setActive()

> **setActive**(`scene`): `void`

Defined in: [types/index.ts:188](https://github.com/miridih-jwpark02/modern-vector.js/blob/37a69dc197ba8a52e9720cae0849c3f533f1e74e/packages/core/src/core/types/index.ts#L188)

활성 장면 설정

#### Parameters

##### scene

[`Scene`](Scene.md)

활성화할 장면

#### Returns

`void`
