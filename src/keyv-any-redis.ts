import EventEmitter from 'events';
import { Store } from 'keyv';
import {
	CompatiblePromiseRedisClient,
	CompatibleRedisClient
} from './compatible-redis-client';
import { RedisPromiseAdapter } from './redis-promise-adapter';

export class KeyvAnyRedis extends EventEmitter implements Store<string | undefined> {
	opts = {};
	dialect = 'anyredis';
	namespace = '';
	readonly #client: CompatiblePromiseRedisClient;

	constructor(client: CompatibleRedisClient) {
		super();

		this.#client = RedisPromiseAdapter.create(client);

		if (this.#client instanceof EventEmitter) {
			this.#client.on('error', error => this.emit('error', error));
		}
	}

	get ttlSupport() {
		return true;
	}

	_getNamespace() {
		return `namespace:${this.namespace}`;
	}

	async get(key: string) {
		const result = await this.#client.get(key);
		return result ?? undefined;
	}

	async set(key: string, value: string, ttl?: number) {
		await (typeof ttl === 'number' ?
			this.#client.set(key, value, 'PX', ttl) :
			this.#client.set(key, value));
		await this.#client.sadd(this._getNamespace(), key);
	}

	async delete(key: string) {
		const items = await this.#client.del(key);
		await this.#client.srem(this._getNamespace(), key);
		return items > 0;
	}

	async clear() {
		const keys = await this.#client.smembers(this._getNamespace());
		// Keys must be deleted individually for compatibility with cluster mode,
		// in which all keys passed to a single del command must exist on the same
		// cluster slot.
		const promises = keys.map(async key => this.#client.del(key));
		await Promise.all(promises);
		await this.#client.del(this._getNamespace());
	}

	async has(key: string) {
		const result = await this.#client.sismember(this._getNamespace(), key);
		return Boolean(result);
	}
}
