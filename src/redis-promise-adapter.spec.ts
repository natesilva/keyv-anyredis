import { EventEmitter } from 'stream';
import { strict as assert } from 'assert';
import test from 'ava';
import td from 'testdouble';
import * as CompatibleRedisClientModule from './compatible-redis-client';
import {
	CompatibleCallbackRedisClient,
	CompatiblePromiseRedisClient
} from './compatible-redis-client';
import { RedisPromiseAdapter } from './redis-promise-adapter';

let mockCallbackClient: CompatibleCallbackRedisClient;

test.beforeEach(() => {
	const mockClient = new EventEmitter();

	Object.defineProperties(mockClient, {
		get: { value: td.func(), enumerable: true },
		set: { value: td.func(), enumerable: true },
		del: { value: td.func(), enumerable: true },
		sadd: { value: td.func(), enumerable: true },
		srem: { value: td.func(), enumerable: true },
		smembers: { value: td.func(), enumerable: true },
		exists: { value: td.func(), enumerable: true }
	});

	mockCallbackClient = mockClient as unknown as CompatibleCallbackRedisClient;
});

test.afterEach(() => {
	td.reset();
});

test('create: should pass through if the client uses Promises', t => {
	const mockPromiseClient = {} as unknown as CompatiblePromiseRedisClient;

	td.replace(CompatibleRedisClientModule, 'isPromiseClient');
	td.when(CompatibleRedisClientModule.isPromiseClient(mockPromiseClient)).thenReturn(
		true
	);

	const result = RedisPromiseAdapter.create(mockPromiseClient);

	t.is(result, mockPromiseClient);
});

test('create: should wrap the client if it is callback-based', t => {
	td.replace(CompatibleRedisClientModule, 'isPromiseClient');

	const result = RedisPromiseAdapter.create(mockCallbackClient);

	t.assert(result instanceof RedisPromiseAdapter);
});

test('constructor: should listen on the client’s error event if the client is an EventEmitter', t => {
	td.replace(mockCallbackClient, 'on');

	const result = RedisPromiseAdapter.create(
		mockCallbackClient as unknown as CompatibleCallbackRedisClient
	);

	assert(mockCallbackClient.on);
	td.verify(mockCallbackClient.on('error', td.matchers.isA(Function)));
	t.pass();
});

test.cb('constructor: should emit an error if the client emits one', t => {
	const mockError = new Error('the error');

	const adapter = RedisPromiseAdapter.create(mockCallbackClient);

	assert(mockCallbackClient.on);

	adapter.on?.('error', error => {
		t.is(error, mockError);
		t.end();
	});

	(mockCallbackClient as unknown as EventEmitter).emit('error', mockError);
});

test('get: should delegate to the promisified callback client method', async t => {
	const mockKey = 'the key';
	const mockValue = 'the value';

	const adapter = RedisPromiseAdapter.create(mockCallbackClient);

	td.when(mockCallbackClient.get(mockKey)).thenCallback(null, mockValue);

	const actual = await adapter.get(mockKey);

	t.deepEqual(actual, mockValue);
});

test('get: should reject if the callback returns an error', async t => {
	const mockKey = 'the key';
	const mockError = new Error('the error');

	const adapter = RedisPromiseAdapter.create(mockCallbackClient);

	td.when(mockCallbackClient.get(mockKey)).thenCallback(mockError, null);

	await t.throwsAsync(adapter.get(mockKey), { message: /the error/ });
});

test('del: should delegate to the promisified callback client method', async t => {
	const mockKey = 'the key';
	const mockValue = -99;

	const adapter = RedisPromiseAdapter.create(mockCallbackClient);

	td.when(mockCallbackClient.del(mockKey)).thenCallback(null, mockValue);

	const actual = await adapter.del(mockKey);

	t.deepEqual(actual, mockValue);
});

test('del: should reject if the callback returns an error', async t => {
	const mockKey = 'the key';
	const mockError = new Error('the error');

	const adapter = RedisPromiseAdapter.create(mockCallbackClient);

	td.when(mockCallbackClient.del(mockKey)).thenCallback(mockError, null);

	await t.throwsAsync(adapter.del(mockKey), { message: /the error/ });
});

test('sadd: should delegate to the promisified callback client method', async t => {
	const mockSetName = 'the key';
	const mockSetMember = 'the value';
	const placeholderResult = 'placeholder result';

	const adapter = RedisPromiseAdapter.create(mockCallbackClient);

	td.when(mockCallbackClient.sadd(mockSetName, mockSetMember)).thenCallback(
		null,
		placeholderResult
	);

	const actual = await adapter.sadd(mockSetName, mockSetMember);

	t.deepEqual(actual, placeholderResult);
});

test('sadd: should reject if the callback returns an error', async t => {
	const mockSetName = 'the key';
	const mockSetMember = 'the value';
	const mockError = new Error('the error');

	const adapter = RedisPromiseAdapter.create(mockCallbackClient);

	td.when(mockCallbackClient.sadd(mockSetName, mockSetMember)).thenCallback(
		mockError,
		null
	);

	await t.throwsAsync(adapter.sadd(mockSetName, mockSetMember), { message: /the error/ });
});

test('srem: should delegate to the promisified callback client method', async t => {
	const mockSetName = 'the key';
	const mockSetMember = 'the value';
	const placeholderResult = 'placeholder result';

	const adapter = RedisPromiseAdapter.create(mockCallbackClient);

	td.when(mockCallbackClient.srem(mockSetName, mockSetMember)).thenCallback(
		null,
		placeholderResult
	);

	const actual = await adapter.srem(mockSetName, mockSetMember);

	t.deepEqual(actual, placeholderResult);
});

test('srem: should reject if the callback returns an error', async t => {
	const mockSetName = 'the key';
	const mockSetMember = 'the value';
	const mockError = new Error('the error');

	const adapter = RedisPromiseAdapter.create(mockCallbackClient);

	td.when(mockCallbackClient.srem(mockSetName, mockSetMember)).thenCallback(
		mockError,
		null
	);

	await t.throwsAsync(adapter.srem(mockSetName, mockSetMember), { message: /the error/ });
});

test('smembers: should delegate to the promisified callback client method', async t => {
	const mockSetName = 'the key';
	const placeholderResult = ['placeholder result'];

	const adapter = RedisPromiseAdapter.create(mockCallbackClient);

	td.when(mockCallbackClient.smembers(mockSetName)).thenCallback(null, placeholderResult);

	const actual = await adapter.smembers(mockSetName);

	t.deepEqual(actual, placeholderResult);
});

test('smembers: should reject if the callback returns an error', async t => {
	const mockSetName = 'the key';
	const mockError = new Error('the error');

	const adapter = RedisPromiseAdapter.create(mockCallbackClient);

	td.when(mockCallbackClient.smembers(mockSetName)).thenCallback(mockError, null);

	await t.throwsAsync(adapter.smembers(mockSetName), { message: /the error/ });
});

test('set: should delegate to the promisified callback client method with no TTL', async t => {
	const mockKey = 'the key';
	const mockValue = 'the value';
	const placeholderResult = 'placeholder result';

	const adapter = RedisPromiseAdapter.create(mockCallbackClient);

	td.when(mockCallbackClient.set(mockKey, mockValue)).thenCallback(
		null,
		placeholderResult
	);

	const actual = await adapter.set(mockKey, mockValue);

	t.deepEqual(actual, placeholderResult);
});

test('set: should delegate to the promisified callback client method with a TTL', async t => {
	const mockKey = 'the key';
	const mockValue = 'the value';
	const mockExpiryMode = 'the mode';
	const mockTtl = -42;
	const placeholderResult = 'placeholder result';

	const adapter = RedisPromiseAdapter.create(mockCallbackClient);

	td.when(
		mockCallbackClient.set(mockKey, mockValue, mockExpiryMode, mockTtl)
	).thenCallback(null, placeholderResult);

	const actual = await adapter.set(mockKey, mockValue, mockExpiryMode, mockTtl);

	t.deepEqual(actual, placeholderResult);
});

test('set: should reject if the callback returns an error', async t => {
	const mockKey = 'the key';
	const mockValue = 'the value';
	const mockError = new Error('the error');

	const adapter = RedisPromiseAdapter.create(mockCallbackClient);

	td.when(mockCallbackClient.set(mockKey, mockValue)).thenCallback(mockError, null);

	const actual = await mockCallbackClient.set(mockKey, mockValue);

	await t.throwsAsync(adapter.set(mockKey, mockValue), { message: /the error/ });
});
