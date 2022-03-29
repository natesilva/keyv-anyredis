export type RedisCallback<T> = (error: Error | null, result: T) => void;

/**
 * A minimal subset of the callback interface that is implemented by several Redis
 * clients.
 */
export interface CompatibleCallbackRedisClient {
	get(key: string, callback?: RedisCallback<string | null>): unknown;

	set(key: string, value: string, callback?: RedisCallback<unknown>): unknown;

	set(
		key: string,
		value: string,
		expiryMode: string,
		time: number,
		callback?: RedisCallback<unknown>
	): unknown;

	del(key: string, callback?: RedisCallback<number>): unknown;

	on?(event: 'error', callback?: (error: Error) => unknown): unknown;

	sadd(key: string, member: string, callback?: RedisCallback<unknown>): unknown;

	srem(key: string, member: string, callback?: RedisCallback<unknown>): unknown;

	smembers(key: string, callback?: RedisCallback<string[]>): unknown;
}

/**
 * A minimal subset of the Promise interface that is implemented by several Redis clients.
 */
export interface CompatiblePromiseRedisClient {
	get(key: string): PromiseLike<string | null>;

	set(
		key: string,
		value: string,
		expiryMode?: string,
		time?: number
	): PromiseLike<unknown>;

	del(key: string): PromiseLike<number>;

	on?(event: 'error', callback: (error: Error) => unknown): unknown;

	sadd(key: string, member: string): PromiseLike<unknown>;

	srem(key: string, member: string): PromiseLike<unknown>;

	smembers(key: string): PromiseLike<string[]>;
}

/**
 * A minimal subset of the Promise interface that is implemented by the “modern”
 * node-redis version 4.
 */
export interface CompatibleNodeRedisV4Client {
	get(key: string): Promise<string | null>;
	GET(key: string): Promise<string | null>;

	set(key: string, value: string, options?: { PX: number }): Promise<unknown>;
	SET(key: string, value: string, options?: { PX: number }): Promise<unknown>;

	del(key: string): Promise<number>;
	DEL(key: string): Promise<number>;

	on?(event: 'error', callback: (error: Error) => unknown): unknown;

	SADD(key: string, member: string): Promise<unknown>;

	SREM(key: string, member: string): Promise<unknown>;

	SMEMBERS(key: string): Promise<string[]>;
}

export type CompatibleRedisClient =
  | CompatibleCallbackRedisClient
  | CompatiblePromiseRedisClient
  | CompatibleNodeRedisV4Client;

function isPromiseClient(
	client: CompatibleRedisClient
): client is CompatiblePromiseRedisClient {
	const result = client.get('hello');
	if (typeof (result as PromiseLike<unknown>)?.then === 'function') {
		(result as PromiseLike<unknown>).then(
			// Handle fulfilled and rejected callbacks (prevent unhandled Promise rejection)
			() => {
				// Nothing
			},
			error => {
				console.error(error);
			}
		);
		return true;
	}

	return false;
}

export function isCompatiblePromiseRedisClient(
	client: CompatibleRedisClient
): client is CompatiblePromiseRedisClient {
	// It must have lowercase methods
	for (const method of ['get', 'set', 'del', 'sadd', 'srem', 'smembers']) {
		if (!(method in client)) {
			return false;
		}
	}

	return isPromiseClient(client);
}

export function isCompatibleNodeRedisV4Client(
	client: CompatibleRedisClient
): client is CompatibleNodeRedisV4Client {
	// It must have uppercase methods
	for (const method of ['GET', 'SET', 'DEL', 'SADD', 'SREM', 'SMEMBERS']) {
		if (!(method in client)) {
			return false;
		}
	}

	return isPromiseClient(client);
}
