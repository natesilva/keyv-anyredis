import test from 'ava';
import td from 'testdouble';
import {
	CompatibleCallbackRedisClient,
	CompatiblePromiseRedisClient,
	isPromiseClient
} from './compatible-redis-client';

test.afterEach(() => {
	td.reset();
});

test('should return true if the client is Promise-based', t => {
	const mockClient = ({
		get: td.func()
	} as unknown) as CompatiblePromiseRedisClient;

	td.when(mockClient.get('hello')).thenResolve('world' as any);
	t.true(isPromiseClient(mockClient));
});

test('should return false if the client is not Promise-based', t => {
	const mockClient = ({
		get: td.func()
	} as unknown) as CompatibleCallbackRedisClient;

	t.false(isPromiseClient(mockClient));
});

test('should handle a Promise error', async t => {
	const mockError = new Error('some error');

	td.replace(console, 'error');

	const mockClient = ({
		get: td.func()
	} as unknown) as CompatiblePromiseRedisClient;

	td.when(mockClient.get('hello')).thenReject(mockError);

	t.notThrows(() => isPromiseClient(mockClient));

	// Give the Promise time to reject
	await new Promise(resolve => {
		setImmediate(resolve);
	});

	// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
	td.verify(console.error(mockError));
});
