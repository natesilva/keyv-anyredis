import keyvTestSuite from '@keyv/test-suite';
import test from 'ava';
import Keyv from 'keyv';
import { Tedis } from 'tedis';
import { CompatibleRedisClient } from '../src/compatible-redis-client';
import { KeyvAnyRedis } from '../src/keyv-any-redis';

// Test Tedis https://github.com/silkjs/tedis

const { REDIS_HOST = 'localhost' } = process.env;
const { REDIS_PORT = '6379' } = process.env;

const client = new Tedis({
	host: REDIS_HOST,
	port: Number.parseInt(REDIS_PORT, 10)
});

// The TypeScript cast `as CompatibleRedisClient` is required because Tedis defines its
// get() function to return Promise<string | number | null>, which is non-standard. The
// number type is not normally returned by a Redis GET command.
const store = () => new KeyvAnyRedis(client as CompatibleRedisClient);
keyvTestSuite.default(test, Keyv, store);
