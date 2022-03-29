import keyvTestSuite from '@keyv/test-suite';
import test from 'ava';
import Redis from 'ioredis-4';
import Keyv from 'keyv';
import { KeyvAnyRedis } from '../src/keyv-any-redis';

// Test ioredis in cluster mode

const { REDIS_CLUSTER_NODE_1_HOST = 'localhost' } = process.env;
const { REDIS_CLUSTER_NODE_1_PORT = '7000' } = process.env;

const clusterHost = {
	port: Number.parseInt(REDIS_CLUSTER_NODE_1_PORT, 10),
	host: REDIS_CLUSTER_NODE_1_HOST
};

const client = new Redis.Cluster([clusterHost]);

const store = () => new KeyvAnyRedis(client);
keyvTestSuite(test, Keyv, store);
