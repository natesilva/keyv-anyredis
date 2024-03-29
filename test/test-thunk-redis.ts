import keyvTestSuite from '@keyv/test-suite';
import test from 'ava';
import Keyv from 'keyv';
import * as redis from 'thunk-redis';
import { KeyvAnyRedis } from '../src/keyv-any-redis';

// Test thunk-redis https://github.com/thunks/thunk-redis

// NOTE: Only works in Promise mode.

const { REDIS_HOST = 'localhost' } = process.env;
const { REDIS_PORT = '6379' } = process.env;

const connectString = `${REDIS_HOST}:${REDIS_PORT}`;

const client = redis.createClient(connectString, { usePromise: true });

const store = () => new KeyvAnyRedis(client);
keyvTestSuite.default(test, Keyv, store);
