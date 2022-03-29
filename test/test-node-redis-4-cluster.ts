import keyvTestSuite from '@keyv/test-suite';
import test from 'ava';
import Keyv from 'keyv';
import * as redis from 'redis-4';
import { KeyvAnyRedis } from '../src/keyv-any-redis';

// Test the classic redis client (npm install redis), version 4, cluster API

const { REDIS_CLUSTER_NODE_1_HOST = 'localhost' } = process.env;
const { REDIS_CLUSTER_NODE_1_PORT = '7000' } = process.env;

const clusterOptions = {
	rootNodes: [
		{ url: `redis://${REDIS_CLUSTER_NODE_1_HOST}:${REDIS_CLUSTER_NODE_1_PORT}` }
	]
};

const client = redis.createCluster(clusterOptions);

void client.connect().then(() => {
	const store = () => new KeyvAnyRedis(client);
	keyvTestSuite.default(test, Keyv, store);
});
