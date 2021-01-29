import test from 'ava';
import keyvTestSuite from '@keyv/test-suite';
import Keyv from 'keyv';
import KeyvAnyRedis from '../src/keyv-any-redis';
import { clusterClient } from 'fast-redis-cluster2';

// Test fast-redis-cluster2 https://github.com/h0x91b/fast-redis-cluster

const { REDIS_CLUSTER_NODE_1_HOST = '127.0.0.1' } = process.env;
const { REDIS_CLUSTER_NODE_1_PORT = '7000' } = process.env;

const connectionString = `${REDIS_CLUSTER_NODE_1_HOST}:${REDIS_CLUSTER_NODE_1_PORT}`;

// eslint-disable-next-line new-cap
const client = new clusterClient.clusterInstance(connectionString);

const store = () => new KeyvAnyRedis(client);
keyvTestSuite(test, Keyv, store);
