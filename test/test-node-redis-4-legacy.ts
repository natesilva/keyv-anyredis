import keyvTestSuite from '@keyv/test-suite';
import test from 'ava';
import Keyv from 'keyv';
import * as redis from 'redis-4';
import { KeyvAnyRedis } from '../src/keyv-any-redis';

// Test the classic redis client (npm install redis), version 4, legacy API

const { REDIS_HOST = 'localhost' } = process.env;
const { REDIS_PORT = '6379' } = process.env;

const redisURI = `redis://${REDIS_HOST}:${REDIS_PORT}`;

const client = redis.createClient({ url: redisURI, legacyMode: true });

void client.connect().then(() => {
	const store = () => new KeyvAnyRedis(client);
	keyvTestSuite.default(test, Keyv, store);
});
