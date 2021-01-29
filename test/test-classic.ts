import keyvTestSuite from '@keyv/test-suite';
import test from 'ava';
import Keyv from 'keyv';
import redis from 'redis';
import { KeyvAnyRedis } from '../src/keyv-any-redis';

// Test the classic redis client (npm install redis)

const { REDIS_HOST = 'localhost' } = process.env;
const { REDIS_PORT = '6379' } = process.env;

const client = redis.createClient(Number.parseInt(REDIS_PORT, 10), REDIS_HOST);

const store = () => new KeyvAnyRedis(client);
keyvTestSuite(test, Keyv, store);
