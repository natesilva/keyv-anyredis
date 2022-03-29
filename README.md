# keyv-anyredis [![npm](https://img.shields.io/npm/v/keyv-anyredis.svg)](https://www.npmjs.com/package/keyv-anyredis) [![dependencies](https://img.shields.io/david/natesilva/keyv-anyredis.svg)](https://www.npmjs.com/package/keyv-anyredis) [![license](https://img.shields.io/github/license/natesilva/keyv-anyredis.svg)](https://github.com/natesilva/keyv-anyredis/blob/master/LICENSE)

Zero-dependency storage adapter for [Keyv](https://github.com/jaredwray/keyv) that works with many different Redis clients and supports cluster mode

## Why use this?

This adapter does more than the official [@keyv/redis](https://github.com/jaredwray/keyv/tree/main/packages/redis) adapter. This adapter can be used with Redis cluster mode — the official adapter cannot. Of course it can also be used with standard, non-cluster, Redis servers.

This adapter also works with many Redis clients, whereas the official adapter bundles a specific version of ioredis.

* ✅&nbsp;&nbsp;&nbsp;Works with standard Redis servers
* ✅&nbsp;&nbsp;&nbsp;Works Redis **cluster** servers
* ✅&nbsp;&nbsp;&nbsp;Works with **ioredis** and [many other Redis clients](#tested-clients)
* ✅&nbsp;&nbsp;&nbsp;Passes all tests in the Keyv test suite

## Tested clients

`keyv-anyredis` works with any Redis client that implements a [standard callback or Promise interface](src/compatible-redis-client.ts), including the two most popular clients, **ioredis** and **node-redis**.

We test with the the [Keyv test suite](https://github.com/jaredwray/keyv/tree/main/packages/test-suite), and we test with both a standard Redis server and a Redis cluster. If you are familiar with Redis cluster, you may know that many utlities that claim to be compatible with clusters, are not. `keyv-anyredis` really is compatible and is tested against a cluster running in a Docker container.

| Client                                                              | Compatible? | Notes                                                                                    |
| :------------------------------------------------------------------ | :---------- | :--------------------------------------------------------------------------------------- |
| [**redis**](https://github.com/NodeRedis/node-redis)                | ✅&nbsp;&nbsp;&nbsp;Yes          | Also known as **node-redis**; works with version 3 and the new version 4, which adds support for cluster mode; works in Promise mode or legacy callback mode                                                                                         |
| [**ioredis**](https://github.com/luin/ioredis)                      | ✅&nbsp;&nbsp;&nbsp;Yes          | Works great in standard and cluster mode                                                              |
| [fakeredis](https://github.com/hdachev/fakeredis)                   | ✅&nbsp;&nbsp;&nbsp;Yes          |                                                                                          |
| [fast-redis-cluster2](https://github.com/h0x91b/fast-redis-cluster) | ✅&nbsp;&nbsp;&nbsp;Yes          | Cluster mode                                                                                         |
| [handy-redis](https://github.com/mmkal/handy-redis)                 | ✅&nbsp;&nbsp;&nbsp;Yes          |                                                                                          |
| [noderis](https://github.com/wallneradam/noderis)                   | ⛔️&nbsp;&nbsp;&nbsp;No         | `smembers` is missing                                                                    |
| [redis-clustr](https://github.com/gosquared/redis-clustr)           | ✅&nbsp;&nbsp;&nbsp;Yes          | Cluster mode       |
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

## Running tests

To run the unit tets, Docker must be running. Containers for Redis and Redis Cluster will be started so that tests can run against them.

```shell
npm run test:docker
```
