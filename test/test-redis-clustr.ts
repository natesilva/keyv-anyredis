import test from 'ava';
import keyvTestSuite from '@keyv/test-suite';
import Keyv from 'keyv';
import KeyvAnyRedis from '../src/keyv-any-redis';
import RedisClustr from 'redis-clustr';
import * as dns from 'dns';

// Test redis-clustr https://github.com/gosquared/redis-clustr

const { REDIS_CLUSTER_NODE_1_HOST = 'localhost' } = process.env;
const { REDIS_CLUSTER_NODE_1_PORT = '7000' } = process.env;

// This Redis client seems to have problems with hostnames, throwing
// “couldn't get client”. Resolving the hostname to an IP address seems
// to work.

dns.lookup(REDIS_CLUSTER_NODE_1_HOST, (error, address) => {
	const clusterHost = {
		port: Number.parseInt(REDIS_CLUSTER_NODE_1_PORT, 10),
		host: address
	};

	const client = new RedisClustr({ servers: [clusterHost] });

	const store = () => new KeyvAnyRedis(client);
	keyvTestSuite(test, Keyv, store);
});
