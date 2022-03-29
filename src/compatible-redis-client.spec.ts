import test from 'ava';
import td from 'testdouble';
import {
	CompatibleCallbackRedisClient,
	CompatibleNodeRedisV4Client,
	CompatiblePromiseRedisClient,
	isCompatibleNodeRedisV4Client,
	isCompatiblePromiseRedisClient
} from './compatible-redis-client';

test('isCompatiblePromiseRedisClient: should return true if the client conforms to the interface', t => {
	const mockClient = {
		get: td.func(),
		set: td.func(),
		del: td.func(),
		sadd: td.func(),
		srem: td.func(),
		smembers: td.func()
	} as unknown as CompatiblePromiseRedisClient;

	td.when(mockClient.get('hello')).thenResolve('world' as any);
	t.true(isCompatiblePromiseRedisClient(mockClient));
});

test('isCompatiblePromiseRedisClient: should return false if the client is not Promise-based', t => {
	const mockClient = {
		get: td.func(),
		set: td.func(),
		del: td.func(),
		sadd: td.func(),
		srem: td.func(),
		smembers: td.func()
	} as unknown as CompatiblePromiseRedisClient;

	t.false(isCompatiblePromiseRedisClient(mockClient));
});

test('isCompatiblePromiseRedisClient: should return false if the client is node-redis V4', t => {
	const mockClient = {
		get: td.func(),
		GET: td.func(),
		set: td.func(),
		SET: td.func(),
		del: td.func(),
		DEL: td.func(),
		SADD: td.func(),
		SREM: td.func(),
		SMEMBERS: td.func()
	} as unknown as CompatibleNodeRedisV4Client;

	td.when(mockClient.get('hello')).thenResolve('world' as any);
	t.false(isCompatiblePromiseRedisClient(mockClient));
});

test('isCompatiblePromiseRedisClient: should handle a Promise error', async t => {
	const mockError = new Error('some error');

	td.replace(console, 'error');

	const mockClient = {
		get: td.func(),
		set: td.func(),
		del: td.func(),
		sadd: td.func(),
		srem: td.func(),
		smembers: td.func()
	} as unknown as CompatiblePromiseRedisClient;

	td.when(mockClient.get('hello')).thenReject(mockError);

	t.notThrows(() => isCompatiblePromiseRedisClient(mockClient));

	// Give the Promise time to reject
	await new Promise(resolve => {
		setImmediate(resolve);
	});

	// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
	td.verify(console.error(mockError));

	td.reset();
});

test('isCompatibleNodeRedisV4Client: should return true if the client conforms to the interface', t => {
	const mockClient = {
		get: td.func(),
		GET: td.func(),
		set: td.func(),
		SET: td.func(),
		del: td.func(),
		DEL: td.func(),
		SADD: td.func(),
		SREM: td.func(),
		SMEMBERS: td.func()
	} as unknown as CompatibleNodeRedisV4Client;

	td.when(mockClient.get('hello')).thenResolve('world' as any);
	t.true(isCompatibleNodeRedisV4Client(mockClient));
});

test('isCompatibleNodeRedisV4Client: should return false if the client is not Promise-based', t => {
	const mockClient = {
		get: td.func(),
		GET: td.func(),
		set: td.func(),
		SET: td.func(),
		del: td.func(),
		DEL: td.func(),
		SADD: td.func(),
		SREM: td.func(),
		SMEMBERS: td.func()
	} as unknown as CompatibleNodeRedisV4Client;

	t.false(isCompatibleNodeRedisV4Client(mockClient));
});

test('isCompatibleNodeRedisV4Client: should return false if the client is a traditional Promise-based client', t => {
	const mockClient = {
		get: td.func(),
		set: td.func(),
		del: td.func(),
		sadd: td.func(),
		srem: td.func(),
		smembers: td.func()
	} as unknown as CompatiblePromiseRedisClient;

	td.when(mockClient.get('hello')).thenResolve('world' as any);
	t.false(isCompatibleNodeRedisV4Client(mockClient));
});

test('isCompatibleNodeRedisV4Client: should handle a Promise error', async t => {
	const mockError = new Error('some error');

	td.replace(console, 'error');

	const mockClient = {
		get: td.func(),
		GET: td.func(),
		set: td.func(),
		SET: td.func(),
		del: td.func(),
		DEL: td.func(),
		SADD: td.func(),
		SREM: td.func(),
		SMEMBERS: td.func()
	} as unknown as CompatibleNodeRedisV4Client;

	td.when(mockClient.get('hello')).thenReject(mockError);

	t.notThrows(() => isCompatibleNodeRedisV4Client(mockClient));

	// Give the Promise time to reject
	await new Promise(resolve => {
		setImmediate(resolve);
	});

	// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
	td.verify(console.error(mockError));

	td.reset();
});
