import keyvTestSuite from '@keyv/test-suite';
import test from 'ava';
import redis from 'fakeredis';
import Keyv from 'keyv';
import { KeyvAnyRedis } from '../src/keyv-any-redis';

// Test the “fakeredis” client github.com/hdachev/fakeredis

const { REDIS_HOST = 'localhost' } = process.env;
const { REDIS_PORT = '6379' } = process.env;

const client = redis.createClient(Number.parseInt(REDIS_PORT, 10), REDIS_HOST);

const store = () => new KeyvAnyRedis(client);
keyvTestSuite.default(test, Keyv, store);
