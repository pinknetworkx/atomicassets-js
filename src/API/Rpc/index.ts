import RpcActionGenerator from '../../Actions/Rpc';
import RpcError from '../../Errors/RpcError';
import RpcAsset from './Asset';
import RpcCache, { IConfigRow } from './Cache';
import RpcCollection from './Collection';
import RpcOffer from './Offer';
import RpcQueue from './Queue';
import RpcSchema from './Schema';
import RpcTemplate from './Template';

type Fetch = (input?: Request | string, init?: RequestInit) => Promise<Response>;
type ApiArgs = { fetch?: Fetch, rateLimit?: number };

export default class RpcApi {
    readonly queue: RpcQueue;
    readonly cache: RpcCache;

    readonly action: RpcActionGenerator;

    readonly endpoint: string;
    readonly contract: string;

    private readonly fetchBuiltin: Fetch;

    // tslint:disable-next-line:variable-name
    private readonly _config: Promise<IConfigRow>;

    constructor(endpoint: string, contract: string, args: ApiArgs = {rateLimit: 4}) {
        this.endpoint = endpoint;
        this.contract = contract;

        if (args.fetch) {
            this.fetchBuiltin = args.fetch;
        } else {
            this.fetchBuiltin = (<any>global).fetch;
        }

        this.queue = new RpcQueue(this, args.rateLimit);
        this.cache = new RpcCache();
        this.action = new RpcActionGenerator(this);

        this._config = new Promise((async (resolve, reject) => {
            try {
                const resp = await this.getTableRows({
                    code: this.contract, scope: this.contract, table: 'config'
                });

                if (resp.rows.length !== 1) {
                    return reject('invalid config');
                }

                return resolve(resp.rows[0]);
            } catch (e) {
                reject(e);
            }
        }));
    }

    async config(): Promise<IConfigRow> {
        return await this._config;
    }

    async getAsset(owner: string, id: string, cache: boolean = true): Promise<RpcAsset> {
        if (!cache) {
            this.cache.asset(id, null);
        }

        return new RpcAsset(this, owner, id, undefined, undefined, undefined, undefined, cache);
    }

    async getTemplate(collection: string, id: string, cache: boolean = true): Promise<RpcTemplate> {
        if (!cache) {
            this.cache.template(id, null);
        }

        return new RpcTemplate(this, collection, id, undefined, undefined, cache);
    }

    async getCollection(name: string, cache: boolean = true): Promise<RpcCollection> {
        if (!cache) {
            this.cache.collection(name, null);
        }

        return new RpcCollection(this, name, undefined, cache);
    }

    async getCollectionTemplates(collection: string, cache: boolean = true): Promise<RpcTemplate[]> {
        return (await this.queue.collection_templates(collection)).map((templateRow) => {
            return new RpcTemplate(this, collection, String(templateRow.template_id), templateRow, undefined, cache);
        });
    }

    async getCollectionsSchemas(collection: string, cache: boolean = true): Promise<RpcSchema[]> {
        return (await this.queue.collection_schemas(collection)).map((schemaRow) => {
            return new RpcSchema(this, collection, schemaRow.schema_name, undefined, cache);
        });
    }

    async getSchema(collection: string, name: string, cache: boolean = true): Promise<RpcSchema> {
        if (!cache) {
            this.cache.schema(name, null);
        }

        return new RpcSchema(this, collection, name, undefined, cache);
    }

    async getOffer(id: string, cache: boolean = true): Promise<RpcOffer> {
        if (!cache) {
            this.cache.offer(id, null);
        }

        return new RpcOffer(this, id, undefined, undefined, undefined, cache);
    }

    async getAccountOffers(account: string, cache: boolean = true): Promise<RpcOffer[]> {
        return (await this.queue.account_offers(account)).map((offerRow) => {
            return new RpcOffer(this, offerRow.offer_id, offerRow, undefined, undefined, cache);
        });
    }

    async getAccountAssets(account: string, cache: boolean = true): Promise<RpcAsset[]> {
        return (await this.queue.account_assets(account)).map((assetRow) => {
            return new RpcAsset(this, account, assetRow.asset_id, assetRow, undefined, undefined, undefined, cache);
        });
    }

    async getTableRows({
                           code, scope, table, table_key = '', lower_bound = '', upper_bound = '',
                           index_position = 1, key_type = ''
                       }: any): Promise<any> {
        return await this.fetchRpc('/v1/chain/get_table_rows', {
            code, scope, table, table_key,
            lower_bound, upper_bound, index_position,
            key_type, limit: 101, reverse: false, show_payer: false, json: true
        });
    }

    async fetchRpc(path: string, body: any): Promise<any> {
        let response;
        let json;

        try {
            const f = this.fetchBuiltin;

            response = await f(this.endpoint + path, {
                body: JSON.stringify(body),
                method: 'POST'
            });

            json = await response.json();
        } catch (e) {
            e.isFetchError = true;
            throw e;
        }

        if ((json.processed && json.processed.except) || !response.ok) {
            throw new RpcError(json);
        }

        return json;
    }
}
