import test from 'ava';
import keyvTestSuite from '@keyv/test-suite';
import Keyv from 'keyv';
import KeyvAnyRedis from '../src/keyv-any-redis';
import { createNodeRedisClient } from 'handy-redis';

// Test the classic redis client (npm install redis)

const { REDIS_HOST = 'localhost' } = process.env;
const { REDIS_PORT = '6379' } = process.env;

const client = createNodeRedisClient(
	Number.parseInt(REDIS_PORT, 10),
	REDIS_HOST
);

const store = () => new KeyvAnyRedis(client);
keyvTestSuite(test, Keyv, store);
