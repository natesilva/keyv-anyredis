import keyvTestSuite from '@keyv/test-suite';
import test from 'ava';
import Keyv from 'keyv';
import * as redis from 'thunk-redis';
import KeyvAnyRedis from '../src/keyv-any-redis';

// Test thunk-redis in cluster mode https://github.com/thunks/thunk-redis

// NOTE: Only works in Promise mode.

const { REDIS_CLUSTER_NODE_1_HOST = 'localhost' } = process.env;
const { REDIS_CLUSTER_NODE_1_PORT = '7000' } = process.env;

const connectString = `${REDIS_CLUSTER_NODE_1_HOST}:${REDIS_CLUSTER_NODE_1_PORT}`;

const client = redis.createClient([connectString], { usePromise: true });

const store = () => new KeyvAnyRedis(client);
keyvTestSuite(test, Keyv, store);
