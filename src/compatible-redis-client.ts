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

type CompatibleRedisClient =
	| CompatibleCallbackRedisClient
	| CompatiblePromiseRedisClient;

export function isPromiseClient(
	client: CompatibleRedisClient
): client is CompatiblePromiseRedisClient {
	const result = client.get('hello');
	if (typeof (result as PromiseLike<unknown>)?.then === 'function') {
		return true;
	}

	return false;
}

export default CompatibleRedisClient;
