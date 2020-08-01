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
            this.cache.deleteAsset(id);
        }

        const data = await this.queue.fetchAsset(owner, id, cache);

        return new RpcAsset(this, owner, id, data, undefined, undefined, undefined, cache);
    }

    async getTemplate(collectionName: string, templateID: string, cache: boolean = true): Promise<RpcTemplate> {
        if (!cache) {
            this.cache.deleteTemplate(collectionName, templateID);
        }

        const data = await this.queue.fetchTemplate(collectionName, templateID, cache);

        return new RpcTemplate(this, collectionName, templateID, data, undefined, cache);
    }

    async getCollection(collectionName: string, cache: boolean = true): Promise<RpcCollection> {
        if (!cache) {
            this.cache.deleteCollection(collectionName);
        }

        const data = await this.queue.fetchCollection(collectionName, cache);

        return new RpcCollection(this, collectionName, data, cache);
    }

    async getCollectionTemplates(collectionName: string): Promise<RpcTemplate[]> {
        return (await this.queue.fetchCollectionTemplates(collectionName)).map((templateRow) => {
            return new RpcTemplate(this, collectionName, String(templateRow.template_id), templateRow, undefined);
        });
    }

    async getCollectionsSchemas(collectionName: string): Promise<RpcSchema[]> {
        return (await this.queue.fetchCollectionSchemas(collectionName)).map((schemaRow) => {
            return new RpcSchema(this, collectionName, schemaRow.schema_name, undefined);
        });
    }

    async getSchema(collectionName: string, schemaName: string, cache: boolean = true): Promise<RpcSchema> {
        if (!cache) {
            this.cache.deleteSchema(collectionName, schemaName);
        }

        const data = await this.queue.fetchSchema(collectionName, schemaName, cache);

        return new RpcSchema(this, collectionName, schemaName, data, cache);
    }

    async getOffer(offerID: string, cache: boolean = true): Promise<RpcOffer> {
        if (!cache) {
            this.cache.deleteOffer(offerID);
        }

        const data = await this.queue.fetchOffer(offerID, cache);

        return new RpcOffer(this, offerID, data, undefined, undefined, cache);
    }

    async getAccountOffers(account: string): Promise<RpcOffer[]> {
        return (await this.queue.fetchAccountOffers(account)).map((offerRow) => {
            return new RpcOffer(this, offerRow.offer_id, offerRow, undefined, undefined);
        });
    }

    async getAccountAssets(account: string): Promise<RpcAsset[]> {
        return (await this.queue.fetchAccountAssets(account)).map((assetRow) => {
            return new RpcAsset(this, account, assetRow.asset_id, assetRow, undefined, undefined, undefined);
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
