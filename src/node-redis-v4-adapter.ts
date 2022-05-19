import EventEmitter from 'events';
import {
	CompatibleNodeRedisV4Client,
	CompatiblePromiseRedisClient
} from './compatible-redis-client';

/**
 * Converts a node-redis version 4 Promise interface to match the traditional Redis
 * Promise interface. Implements only a minimal subset of Redis functionality as defined
 * in {@link CompatibleNodeRedisV4Client}.
 */
export class NodeRedisV4Adapter<T extends CompatibleNodeRedisV4Client>
	extends EventEmitter
	implements CompatiblePromiseRedisClient {
	readonly #client: T;

	constructor(client: T) {
		super();

		this.#client = client;

		// istanbul ignore else
		if (this.#client instanceof EventEmitter) {
			this.#client.on('error', error => this.emit('error', error));
		}
	}

	async get(key: string) {
		// eslint-disable-next-line new-cap
		return this.#client.GET(key);
	}

	async set(key: string, value: string, expiryMode?: 'PX', time?: number) {
		if (expiryMode === 'PX' && typeof time === 'number') {
			// eslint-disable-next-line new-cap
			return this.#client.SET(key, value, { PX: time });
		}

		// eslint-disable-next-line new-cap
		return this.#client.SET(key, value);
	}

	async del(key: string) {
		// eslint-disable-next-line new-cap
		return this.#client.DEL(key);
	}

	async sadd(key: string, member: string) {
		// eslint-disable-next-line new-cap
		return this.#client.SADD(key, member);
	}

	async srem(key: string, member: string) {
		// eslint-disable-next-line new-cap
		return this.#client.SREM(key, member);
	}

	async smembers(key: string) {
		// eslint-disable-next-line new-cap
		return this.#client.SMEMBERS(key);
	}

	async sismember(key: string, member: string) {
		// eslint-disable-next-line new-cap
		return this.#client.SISMEMBER(key, member);
	}
}
