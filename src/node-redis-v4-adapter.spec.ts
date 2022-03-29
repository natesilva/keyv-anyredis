import { strict as assert } from 'assert';
import test from 'ava';
import { EventEmitter } from 'stream';
import td from 'testdouble';
import { CompatibleNodeRedisV4Client } from './compatible-redis-client';
import { NodeRedisV4Adapter } from './node-redis-v4-adapter';

function getMockNodeRedisV4Client(): CompatibleNodeRedisV4Client {
	const mockClient = new EventEmitter();

	Object.defineProperties(mockClient, {
		get: { value: td.func(), enumerable: true },
		GET: { value: td.func(), enumerable: true },
		set: { value: td.func(), enumerable: true },
		SET: { value: td.func(), enumerable: true },
		del: { value: td.func(), enumerable: true },
		DEL: { value: td.func(), enumerable: true },
		SADD: { value: td.func(), enumerable: true },
		SREM: { value: td.func(), enumerable: true },
		SMEMBERS: { value: td.func(), enumerable: true }
	});

	return mockClient as unknown as CompatibleNodeRedisV4Client;
}

test('constructor: should listen on the client’s error event if the client is an EventEmitter', t => {
	const mockClient = getMockNodeRedisV4Client();
	td.replace(mockClient, 'on');

	const result = new NodeRedisV4Adapter(mockClient);

	assert(mockClient.on);
	td.verify(mockClient.on('error', td.matchers.isA(Function)));
	t.pass();
});

test('constructor: should emit an error if the client emits one', async t => {
	await new Promise<void>((resolve, reject) => {
		const mockClient = getMockNodeRedisV4Client();
		const mockError = new Error('the error');

		const adapter = new NodeRedisV4Adapter(mockClient);

		assert(mockClient.on);

		adapter.on?.('error', error => {
			t.is(error, mockError);
			resolve();
		});

		(mockClient as unknown as EventEmitter).emit('error', mockError);
	});
});

test('get: should delegate to the client method', async t => {
	const mockClient = getMockNodeRedisV4Client();
	const mockKey = 'the key';
	const mockValue = 'the value';

	const adapter = new NodeRedisV4Adapter(mockClient);

	// eslint-disable-next-line new-cap
	td.when(mockClient.GET(mockKey)).thenResolve(mockValue);

	const actual = await adapter.get(mockKey);

	t.deepEqual(actual, mockValue);
});

test('get: should reject if the client rejects', async t => {
	const mockClient = getMockNodeRedisV4Client();
	const mockKey = 'the key';
	const mockError = new Error('the error');

	const adapter = new NodeRedisV4Adapter(mockClient);

	// eslint-disable-next-line new-cap
	td.when(mockClient.GET(mockKey)).thenReject(mockError);

	await t.throwsAsync(adapter.get(mockKey), { message: /the error/ });
});

test('del: should delegate to the promisified callback client method', async t => {
	const mockClient = getMockNodeRedisV4Client();
	const mockKey = 'the key';
	const mockValue = -99;

	const adapter = new NodeRedisV4Adapter(mockClient);

	// eslint-disable-next-line new-cap
	td.when(mockClient.DEL(mockKey)).thenResolve(mockValue);

	const actual = await adapter.del(mockKey);

	t.deepEqual(actual, mockValue);
});

test('del: should reject if the callback returns an error', async t => {
	const mockClient = getMockNodeRedisV4Client();
	const mockKey = 'the key';
	const mockError = new Error('the error');

	const adapter = new NodeRedisV4Adapter(mockClient);

	// eslint-disable-next-line new-cap
	td.when(mockClient.DEL(mockKey)).thenReject(mockError);

	await t.throwsAsync(adapter.del(mockKey), { message: /the error/ });
});

test('sadd: should delegate to the promisified callback client method', async t => {
	const mockClient = getMockNodeRedisV4Client();
	const mockSetName = 'the key';
	const mockSetMember = 'the value';
	const placeholderResult = 'placeholder result';

	const adapter = new NodeRedisV4Adapter(mockClient);

	// eslint-disable-next-line new-cap
	td.when(mockClient.SADD(mockSetName, mockSetMember)).thenResolve(placeholderResult);

	const actual = await adapter.sadd(mockSetName, mockSetMember);

	t.deepEqual(actual, placeholderResult);
});

test('sadd: should reject if the callback returns an error', async t => {
	const mockClient = getMockNodeRedisV4Client();
	const mockSetName = 'the key';
	const mockSetMember = 'the value';
	const mockError = new Error('the error');

	const adapter = new NodeRedisV4Adapter(mockClient);

	// eslint-disable-next-line new-cap
	td.when(mockClient.SADD(mockSetName, mockSetMember)).thenReject(mockError);

	await t.throwsAsync(adapter.sadd(mockSetName, mockSetMember), { message: /the error/ });
});

test('srem: should delegate to the promisified callback client method', async t => {
	const mockClient = getMockNodeRedisV4Client();
	const mockSetName = 'the key';
	const mockSetMember = 'the value';
	const placeholderResult = 'placeholder result';

	const adapter = new NodeRedisV4Adapter(mockClient);

	// eslint-disable-next-line new-cap
	td.when(mockClient.SREM(mockSetName, mockSetMember)).thenResolve(placeholderResult);

	const actual = await adapter.srem(mockSetName, mockSetMember);

	t.deepEqual(actual, placeholderResult);
});

test('srem: should reject if the callback returns an error', async t => {
	const mockClient = getMockNodeRedisV4Client();
	const mockSetName = 'the key';
	const mockSetMember = 'the value';
	const mockError = new Error('the error');

	const adapter = new NodeRedisV4Adapter(mockClient);

	// eslint-disable-next-line new-cap
	td.when(mockClient.SREM(mockSetName, mockSetMember)).thenReject(mockError);

	await t.throwsAsync(adapter.srem(mockSetName, mockSetMember), { message: /the error/ });
});

test('smembers: should delegate to the promisified callback client method', async t => {
	const mockClient = getMockNodeRedisV4Client();
	const mockSetName = 'the key';
	const placeholderResult = ['placeholder result'];

	const adapter = new NodeRedisV4Adapter(mockClient);

	// eslint-disable-next-line new-cap
	td.when(mockClient.SMEMBERS(mockSetName)).thenResolve(placeholderResult);

	const actual = await adapter.smembers(mockSetName);

	t.deepEqual(actual, placeholderResult);
});

test('smembers: should reject if the callback returns an error', async t => {
	const mockClient = getMockNodeRedisV4Client();
	const mockSetName = 'the key';
	const mockError = new Error('the error');

	const adapter = new NodeRedisV4Adapter(mockClient);

	// eslint-disable-next-line new-cap
	td.when(mockClient.SMEMBERS(mockSetName)).thenReject(mockError);

	await t.throwsAsync(adapter.smembers(mockSetName), { message: /the error/ });
});

test('set: should delegate to the promisified callback client method with no TTL', async t => {
	const mockClient = getMockNodeRedisV4Client();
	const mockKey = 'the key';
	const mockValue = 'the value';
	const placeholderResult = 'placeholder result';

	const adapter = new NodeRedisV4Adapter(mockClient);

	// eslint-disable-next-line new-cap
	td.when(mockClient.SET(mockKey, mockValue)).thenResolve(placeholderResult);

	const actual = await adapter.set(mockKey, mockValue);

	t.deepEqual(actual, placeholderResult);
});

test('set: should delegate to the promisified callback client method with a TTL', async t => {
	const mockClient = getMockNodeRedisV4Client();
	const mockKey = 'the key';
	const mockValue = 'the value';
	const mockExpiryMode = 'PX';
	const mockTtl = -42;
	const placeholderResult = 'placeholder result';

	const adapter = new NodeRedisV4Adapter(mockClient);

	// eslint-disable-next-line new-cap
	td.when(mockClient.SET(mockKey, mockValue, { PX: mockTtl })).thenResolve(
		placeholderResult
	);

	const actual = await adapter.set(mockKey, mockValue, mockExpiryMode, mockTtl);

	t.deepEqual(actual, placeholderResult);
});

test('set: should reject if the callback returns an error', async t => {
	const mockClient = getMockNodeRedisV4Client();
	const mockKey = 'the key';
	const mockValue = 'the value';
	const mockError = new Error('the error');

	const adapter = new NodeRedisV4Adapter(mockClient);

	// eslint-disable-next-line new-cap
	td.when(mockClient.SET(mockKey, mockValue)).thenReject(mockError);

	const actual = await mockClient.set(mockKey, mockValue);

	await t.throwsAsync(adapter.set(mockKey, mockValue), { message: /the error/ });
});
