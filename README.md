# keyv-anyredis [![npm](https://img.shields.io/npm/v/keyv-anyredis.svg)](https://www.npmjs.com/package/keyv-anyredis) [![dependencies](https://img.shields.io/david/natesilva/keyv-anyredis.svg)](https://www.npmjs.com/package/keyv-anyredis) [![license](https://img.shields.io/github/license/natesilva/keyv-anyredis.svg)](https://github.com/natesilva/keyv-anyredis/blob/master/LICENSE)

Zero-dependency storage adapter for [Keyv](https://github.com/lukechilds/keyv) that works with many different Redis clients and supports cluster mode

## Background

The official [@keyv/redis](https://github.com/lukechilds/keyv-redis) adapter is built on the assumption that you are using the [ioredis](https://github.com/luin/ioredis) client in its normal (non-cluster) mode.

While this covers many use cases, it doesn’t work for the following:

- Using ioredis in [cluster mode](https://github.com/luin/ioredis#cluster)
- Using a different client

**keyv-anyredis** works with any Redis client that implements a [standard callback or Promise interface](src/compatible-redis-client.ts).

## Tested clients

| Client                                                              | Compatible? | Notes                                                                                    |
| :------------------------------------------------------------------ | :---------- | :--------------------------------------------------------------------------------------- |
| [**redis**](https://github.com/NodeRedis/node-redis)                | ✅          |                                                                                          |
| [**ioredis**](https://github.com/luin/ioredis)                      | ✅          | Standalone and cluster mode                                                              |
| [fakeredis](https://github.com/hdachev/fakeredis)                   | ✅          |                                                                                          |
| [fast-redis-cluster2](https://github.com/h0x91b/fast-redis-cluster) | ✅          |                                                                                          |
| [handy-redis](https://github.com/mmkal/handy-redis)                 | ✅          |                                                                                          |
| [noderis](https://github.com/wallneradam/noderis)                   | ⛔️         | `smembers` is missing                                                                    |
| [redis-clustr](https://github.com/gosquared/redis-clustr)           | ✅          |        |
| [tedis](https://github.com/silkjs/tedis)                            | 🟡          | Non-standard `get` return type; cast the client to `CompatibleRedisClient` in TypeScript |
| [thunk-redis](https://github.com/thunks/thunk-redis)                | ✅          | Set `usePromise: true`; works in cluster mode                                    |
| [xredis](https://github.com/razaellahi/xredis)                      | ✅          |                                                                                          |

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

## Testing

To run the unit tests, it’s easiest to use Docker:

```shell
npm run test:docker
```

If you choose to run the tests locally (with `npm test`) you’ll need to have a standalone instance of Redis on port 6379 **and** a cluster instance of Redis on port 7000.
