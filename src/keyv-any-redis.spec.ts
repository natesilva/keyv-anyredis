import EventEmitter from 'events';
import test from 'ava';
import td from 'testdouble';
import {
	CompatiblePromiseRedisClient,
	CompatibleRedisClient
} from './compatible-redis-client';
import { KeyvAnyRedis } from './keyv-any-redis';
import { RedisPromiseAdapter } from './redis-promise-adapter';

test('constructor: should create the storage adapter', t => {
	const mockClient = 'the client' as unknown as CompatibleRedisClient;

	td.replace(RedisPromiseAdapter, 'create');

	const _unused = new KeyvAnyRedis(mockClient);

	td.verify(RedisPromiseAdapter.create(mockClient));
	t.pass();
});

test('constructor: should listen on the client’s error event if the client is an EventEmitter', t => {
	const mockClient = 'the client' as unknown as CompatibleRedisClient;
	const mockPromiseAdapter = new EventEmitter();

	td.replace(mockPromiseAdapter, 'on');

	td.replace(RedisPromiseAdapter, 'create');
	td.when(RedisPromiseAdapter.create(mockClient)).thenReturn(mockPromiseAdapter);

	const _unused = new KeyvAnyRedis(mockClient);

	td.verify(mockPromiseAdapter.on('error', td.matchers.isA(Function)));
	t.pass();
});

test('constructor: should emit an error if the client emits one', async t => {
	await new Promise<void>((resolve, reject) => {
		const mockClient = 'the client' as unknown as CompatibleRedisClient;
		const mockPromiseAdapter = new EventEmitter();
		const mockError = new Error('the error');

		td.replace(RedisPromiseAdapter, 'create');
		td.when(RedisPromiseAdapter.create(mockClient)).thenReturn(mockPromiseAdapter);

		const adapter = new KeyvAnyRedis(mockClient);

		adapter.on('error', error => {
			t.is(error, mockError);
			resolve();
		});

		mockPromiseAdapter.emit('error', mockError);
	});
});

test('ttlSupport: should be true', t => {
	const mockClient = 'the client' as unknown as CompatibleRedisClient;
	const mockPromiseAdapter = 'the adapter' as unknown as CompatiblePromiseRedisClient;

	td.replace(RedisPromiseAdapter, 'create');
	td.when(RedisPromiseAdapter.create(mockClient)).thenReturn(mockPromiseAdapter);

	const adapter = new KeyvAnyRedis(mockClient);

	t.true(adapter.ttlSupport);
});

test('_getNamespace: should get the namespace', t => {
	const mockClient = 'the client' as unknown as CompatibleRedisClient;
	const mockPromiseAdapter = 'the adapter' as unknown as CompatiblePromiseRedisClient;
	const mockNamespace = 'the namespace';

	td.replace(RedisPromiseAdapter, 'create');
	td.when(RedisPromiseAdapter.create(mockClient)).thenReturn(mockPromiseAdapter);

	const adapter = new KeyvAnyRedis(mockClient);

	adapter.namespace = mockNamespace;

	const actual = adapter._getNamespace();

	t.is(actual, `namespace:${mockNamespace}`);
});

test('get: should delegate to the client', async t => {
	const mockKey = 'the key';
	const mockValue = 'the value';
	const mockClient = 'the client' as unknown as CompatibleRedisClient;
	const mockPromiseAdapter = {
		get: td.func()
	} as unknown as CompatiblePromiseRedisClient;

	td.replace(RedisPromiseAdapter, 'create');
	td.when(RedisPromiseAdapter.create(mockClient)).thenReturn(mockPromiseAdapter);

	td.when(mockPromiseAdapter.get(mockKey)).thenResolve(mockValue as any);

	const adapter = new KeyvAnyRedis(mockClient);
	const actual = await adapter.get(mockKey);

	t.deepEqual(actual, mockValue);
});

test('get: should return undefined (not null) if not found', async t => {
	const mockKey = 'the key';
	const mockClient = 'the client' as unknown as CompatibleRedisClient;
	const mockPromiseAdapter = {
		get: td.func()
	} as unknown as CompatiblePromiseRedisClient;

	td.replace(RedisPromiseAdapter, 'create');
	td.when(RedisPromiseAdapter.create(mockClient)).thenReturn(mockPromiseAdapter);

	td.when(mockPromiseAdapter.get(mockKey)).thenResolve(null as any);

	const adapter = new KeyvAnyRedis(mockClient);
	const actual = await adapter.get(mockKey);

	t.is(actual, undefined);
});

test('set: should delegate to the client (called without ttl)', async t => {
	const mockKey = 'the key';
	const mockValue = 'the value';
	const mockClient = 'the client' as unknown as CompatibleRedisClient;
	const mockPromiseAdapter = {
		set: td.func(),
		sadd: td.func()
	} as unknown as CompatiblePromiseRedisClient;

	td.replace(RedisPromiseAdapter, 'create');
	td.when(RedisPromiseAdapter.create(mockClient)).thenReturn(mockPromiseAdapter);

	const adapter = new KeyvAnyRedis(mockClient);
	await adapter.set(mockKey, mockValue);

	td.verify(mockPromiseAdapter.set(mockKey, mockValue));
	t.pass();
});

test('set: should delegate to the client (called with ttl)', async t => {
	const mockKey = 'the key';
	const mockValue = 'the value';
	const mockTtl = -42;
	const mockClient = 'the client' as unknown as CompatibleRedisClient;
	const mockPromiseAdapter = {
		set: td.func(),
		sadd: td.func()
	} as unknown as CompatiblePromiseRedisClient;

	td.replace(RedisPromiseAdapter, 'create');
	td.when(RedisPromiseAdapter.create(mockClient)).thenReturn(mockPromiseAdapter);

	const adapter = new KeyvAnyRedis(mockClient);
	await adapter.set(mockKey, mockValue, mockTtl);

	td.verify(mockPromiseAdapter.set(mockKey, mockValue, 'PX', mockTtl));
	t.pass();
});

test('set: should log the key in a set', async t => {
	const mockKey = 'the key';
	const mockValue = 'the value';
	const mockNamespace = 'the namespace';
	const mockClient = 'the client' as unknown as CompatibleRedisClient;
	const mockPromiseAdapter = {
		set: td.func(),
		sadd: td.func()
	} as unknown as CompatiblePromiseRedisClient;

	td.replace(RedisPromiseAdapter, 'create');
	td.when(RedisPromiseAdapter.create(mockClient)).thenReturn(mockPromiseAdapter);

	const adapter = new KeyvAnyRedis(mockClient);

	td.replace(adapter, '_getNamespace');
	td.when(adapter._getNamespace()).thenReturn(mockNamespace);

	await adapter.set(mockKey, mockValue);

	td.verify(mockPromiseAdapter.sadd(mockNamespace, mockKey));
	t.pass();
});

test('delete: should delegate to the client', async t => {
	const mockKey = 'the key';
	const mockClient = 'the client' as unknown as CompatibleRedisClient;
	const mockPromiseAdapter = {
		del: td.func(),
		srem: td.func()
	} as unknown as CompatiblePromiseRedisClient;

	td.replace(RedisPromiseAdapter, 'create');
	td.when(RedisPromiseAdapter.create(mockClient)).thenReturn(mockPromiseAdapter);

	const adapter = new KeyvAnyRedis(mockClient);
	await adapter.delete(mockKey);

	td.verify(mockPromiseAdapter.del(mockKey));
	t.pass();
});

test('delete: should log the key removal', async t => {
	const mockKey = 'the key';
	const mockClient = 'the client' as unknown as CompatibleRedisClient;
	const mockNamespace = 'the namespace';
	const mockPromiseAdapter = {
		del: td.func(),
		srem: td.func()
	} as unknown as CompatiblePromiseRedisClient;

	td.replace(RedisPromiseAdapter, 'create');
	td.when(RedisPromiseAdapter.create(mockClient)).thenReturn(mockPromiseAdapter);

	const adapter = new KeyvAnyRedis(mockClient);

	td.replace(adapter, '_getNamespace');
	td.when(adapter._getNamespace()).thenReturn(mockNamespace);

	await adapter.delete(mockKey);

	td.verify(mockPromiseAdapter.srem(mockNamespace, mockKey));
	t.pass();
});

test('delete: should return true if a key was removed', async t => {
	const mockKey = 'the key';
	const mockClient = 'the client' as unknown as CompatibleRedisClient;
	const mockPromiseAdapter = {
		del: td.func(),
		srem: td.func()
	} as unknown as CompatiblePromiseRedisClient;

	td.replace(RedisPromiseAdapter, 'create');
	td.when(RedisPromiseAdapter.create(mockClient)).thenReturn(mockPromiseAdapter);

	td.when(mockPromiseAdapter.del(mockKey)).thenResolve(1 as any);

	const adapter = new KeyvAnyRedis(mockClient);
	const actual = await adapter.delete(mockKey);

	t.is(actual, true);
});

test('delete: should return false if no key was removed', async t => {
	const mockKey = 'the key';
	const mockClient = 'the client' as unknown as CompatibleRedisClient;
	const mockPromiseAdapter = {
		del: td.func(),
		srem: td.func()
	} as unknown as CompatiblePromiseRedisClient;

	td.replace(RedisPromiseAdapter, 'create');
	td.when(RedisPromiseAdapter.create(mockClient)).thenReturn(mockPromiseAdapter);

	td.when(mockPromiseAdapter.del(mockKey)).thenResolve(0 as any);

	const adapter = new KeyvAnyRedis(mockClient);
	const actual = await adapter.delete(mockKey);

	t.is(actual, false);
});

test('clear: should call del for all keys and the namespace', async t => {
	const mockKey = 'the key';
	const mockClient = 'the client' as unknown as CompatibleRedisClient;
	const mockNamespace = 'the namespace';
	const mockPromiseAdapter = {
		del: td.func(),
		smembers: td.func()
	} as unknown as CompatiblePromiseRedisClient;
	const keys = ['key1', 'key2', 'key3'];

	td.replace(RedisPromiseAdapter, 'create');
	td.when(RedisPromiseAdapter.create(mockClient)).thenReturn(mockPromiseAdapter);

	td.when(mockPromiseAdapter.smembers(mockNamespace)).thenResolve(keys as any);

	const adapter = new KeyvAnyRedis(mockClient);

	td.replace(adapter, '_getNamespace');
	td.when(adapter._getNamespace()).thenReturn(mockNamespace);

	await adapter.clear();

	for (const key of keys) {
		td.verify(mockPromiseAdapter.del(key));
	}

	td.verify(mockPromiseAdapter.del(mockNamespace));

	t.pass();
});
