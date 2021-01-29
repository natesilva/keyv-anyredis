import EventEmitter from 'events';
import {
	CompatiblePromiseRedisClient,
	CompatibleCallbackRedisClient,
} from './compatible-redis-client';
import { promisify } from 'util';

/** A Promise wrapper for callback-based Redis clients. */
export class WrappedCallbackClient
	extends EventEmitter
	implements CompatiblePromiseRedisClient {
	readonly #client: CompatibleCallbackRedisClient;

	// Promisified client methods
	readonly #get: CompatiblePromiseRedisClient['get'];
	readonly #set: CompatiblePromiseRedisClient['set'];
	readonly #del: CompatiblePromiseRedisClient['del'];
	readonly #sadd: CompatiblePromiseRedisClient['sadd'];
	readonly #srem: CompatiblePromiseRedisClient['srem'];
	readonly #smembers: CompatiblePromiseRedisClient['smembers'];

	constructor(client: CompatibleCallbackRedisClient) {
		super();

		this.#client = client;
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
