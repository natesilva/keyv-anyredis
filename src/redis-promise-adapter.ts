import EventEmitter from 'events';
import { promisify } from 'util';
import {
	CompatibleCallbackRedisClient,
	CompatiblePromiseRedisClient,
	CompatibleRedisClient,
	isPromiseClient
} from './compatible-redis-client';

/**
 * Converts a Redis callback interface to match a Redis Promise interface. Implements only
 * a minimal subset of Redis functionality as defined in
 * {@link CompatiblePromiseRedisClient}.
 */
export class RedisPromiseAdapter<T extends CompatibleCallbackRedisClient>
	extends EventEmitter
	implements CompatiblePromiseRedisClient {
	readonly #client: T;

	// Promisified client methods
	readonly #get: CompatiblePromiseRedisClient['get'];
	readonly #set: CompatiblePromiseRedisClient['set'];
	readonly #del: CompatiblePromiseRedisClient['del'];
	readonly #sadd: CompatiblePromiseRedisClient['sadd'];
	readonly #srem: CompatiblePromiseRedisClient['srem'];
	readonly #smembers: CompatiblePromiseRedisClient['smembers'];

	constructor(client: T) {
		super();

		this.#client = client;
		// istanbul ignore else
		if (this.#client instanceof EventEmitter) {
			this.#client.on('error', error => this.emit('error', error));
		}

		// Bind Promisified versions of the client methods
		this.#get = promisify(this.#client.get).bind(this.#client);
		this.#set = promisify(this.#client.set).bind(this.#client);
		this.#del = promisify(this.#client.del).bind(this.#client);
		this.#sadd = promisify(this.#client.sadd).bind(this.#client);
		this.#srem = promisify(this.#client.srem).bind(this.#client);
		this.#smembers = promisify(this.#client.smembers).bind(this.#client);
	}

	/**
   * Factory method returns a Promise-based Redis client.
   *
   * If the provided client is a callback client, it’s wrapped in the Promise adapter. If
   * the provided client is a Promise client, it’s passed through and returned.
   *
   * @param client a Redis Promise or callback client
   *
   * @returns a Redis Promise client
   */
	static create(client: CompatibleRedisClient): CompatiblePromiseRedisClient {
		const promiseClient = isPromiseClient(client) ?
			client :
			new RedisPromiseAdapter(client);
		return promiseClient;
	}

	get(key: string) {
		return this.#get(key);
	}

	set(key: string, value: string, expiryMode?: string, time?: number) {
		if (expiryMode && typeof time === 'number') {
			return this.#set(key, value, expiryMode, time);
		}

		return this.#set(key, value);
	}

	del(key: string) {
		return this.#del(key);
	}

	sadd(key: string, member: string) {
		return this.#sadd(key, member);
	}

	srem(key: string, member: string) {
		return this.#srem(key, member);
	}

	smembers(key: string): PromiseLike<string[]> {
		return this.#smembers(key);
	}
}
