import keyvTestSuite from '@keyv/test-suite';
import test from 'ava';
import { createNodeRedisClient } from 'handy-redis';
import Keyv from 'keyv';
import { KeyvAnyRedis } from '../src/keyv-any-redis';

// Test handy-redis https://github.com/mmkal/handy-redis

const { REDIS_HOST = 'localhost' } = process.env;
const { REDIS_PORT = '6379' } = process.env;

const client = createNodeRedisClient(
	Number.parseInt(REDIS_PORT, 10),
	REDIS_HOST
);

const store = () => new KeyvAnyRedis(client);
keyvTestSuite.default(test, Keyv, store);
