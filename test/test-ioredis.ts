import keyvTestSuite from '@keyv/test-suite';
import test from 'ava';
import Redis from 'ioredis';
import Keyv from 'keyv';
import { KeyvAnyRedis } from '../src/keyv-any-redis';

// Test ioredis

const { REDIS_HOST = 'localhost' } = process.env;
const { REDIS_PORT = '6379' } = process.env;

const redisURI = `redis://${REDIS_HOST}:${REDIS_PORT}`;

const client = new Redis(redisURI);

const store = () => new KeyvAnyRedis(client);
keyvTestSuite(test, Keyv, store);
