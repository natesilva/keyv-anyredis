# keyv-anyredis [![npm](https://img.shields.io/npm/v/keyv-anyredis.svg)](https://www.npmjs.com/package/keyv-anyredis) [![dependencies](https://img.shields.io/david/natesilva/keyv-anyredis.svg)](https://www.npmjs.com/package/keyv-anyredis) [![license](https://img.shields.io/github/license/natesilva/keyv-anyredis.svg)](https://github.com/natesilva/keyv-anyredis/blob/master/LICENSE)

Zero-dependency storage adapter for [Keyv](https://github.com/lukechilds/keyv) that works with many different Redis clients and supports cluster mode

## Why use this?

Why use this instead of the official [@keyv/redis](https://github.com/lukechilds/keyv-redis) adapter? Because it does more! In particular, it can be used with Redis cluster mode (the official adapter cannot).

* ✅&nbsp;&nbsp;&nbsp;Works with standard Redis (non-cluster) mode
* ✅&nbsp;&nbsp;&nbsp;Works with Redis **cluster mode**
* ✅&nbsp;&nbsp;&nbsp;Works with **ioredis** and [many other Redis clients](#tested-clients)
* ✅&nbsp;&nbsp;&nbsp;Passes all tests in the Keyv test suite

## Tested clients

`keyv-anyredis` works with any Redis client that implements a [standard callback or Promise interface](src/compatible-redis-client.ts), including the two most popular clients, **ioredis** and **node-redis**.

We use the the official [Keyv test suite](https://github.com/lukechilds/keyv-test-suite). For clients that support cluster mode, the test suite is verified against both a standard Redis instance and a Redis cluster.

| Client                                                              | Compatible? | Notes                                                                                    |
| :------------------------------------------------------------------ | :---------- | :--------------------------------------------------------------------------------------- |
| [**redis**](https://github.com/NodeRedis/node-redis)                | ✅&nbsp;&nbsp;&nbsp;Yes          | Also known as **node-redis**                                                                                         |
| [**ioredis**](https://github.com/luin/ioredis)                      | ✅&nbsp;&nbsp;&nbsp;Yes          | Works great in standard and cluster mode                                                              |
| [fakeredis](https://github.com/hdachev/fakeredis)                   | ✅&nbsp;&nbsp;&nbsp;Yes          |                                                                                          |
| [fast-redis-cluster2](https://github.com/h0x91b/fast-redis-cluster) | ✅&nbsp;&nbsp;&nbsp;Yes          | Cluster mode                                                                                         |
| [handy-redis](https://github.com/mmkal/handy-redis)                 | ✅&nbsp;&nbsp;&nbsp;Yes          |                                                                                          |
| [noderis](https://github.com/wallneradam/noderis)                   | ⛔️&nbsp;&nbsp;&nbsp;No         | `smembers` is missing                                                                    |
| [redis-clustr](https://github.com/gosquared/redis-clustr)           | ✅&nbsp;&nbsp;&nbsp;Yes          |        |
| [tedis](https://github.com/silkjs/tedis)                            | ✅&nbsp;&nbsp;&nbsp;Yes         | To use this client, cast the client to `CompatibleRedisClient` in TypeScript |
| [thunk-redis](https://github.com/thunks/thunk-redis)                | ✅&nbsp;&nbsp;&nbsp;Yes         | Set `usePromise: true`; works in standard and cluster mode                                    |
| [xredis](https://github.com/razaellahi/xredis)                      | ✅&nbsp;&nbsp;&nbsp;Yes          |                                                                                          |

## Install

```shell
npm i keyv-anyredis
```

## Usage

```javascript
const Keyv = require('keyv');
const { KeyvAnyRedis } = require('keyv-anyredis');

// Create a client here, using ioredis, redis, or any
// compatible library.
//
// For example, to create a cluster client using ioredis as
// described at https://github.com/luin/ioredis#cluster:
//
// const Redis = require('ioredis');
// const client = new Redis.Cluster(…cluster configuration…);

const store = new KeyvAnyRedis(client);
const keyv = new Keyv({ store });
```
