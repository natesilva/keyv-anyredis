import EventEmitter from 'events';
import CompatibleRedisClient, {
	CompatiblePromiseRedisClient,
	isPromiseClient
} from './compatible-redis-client';
import { WrappedCallbackClient } from './wrapped-callback-client';

export default class KeyvAnyRedis extends EventEmitter {
	namespace = '';
	readonly #client: CompatiblePromiseRedisClient;

	constructor(client: CompatibleRedisClient) {
		super();

		if (isPromiseClient(client)) {
			this.#client = client;
		} else {
			this.#client = new WrappedCallbackClient(client);
		}

		if (this.#client instanceof EventEmitter) {
			this.#client.on('error', error => this.emit('error', error));
		}
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
}
