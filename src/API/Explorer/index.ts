import ExplorerActionGenerator from '../../Actions/Explorer';
import ExplorerError from '../../Errors/ExplorerError';
import { ApiAsset, ApiCollection, ApiConfig, ApiLog, ApiOffer, ApiSchema, ApiTemplate, ApiTransfer } from './types';

type Fetch = (input?: Request | string, init?: RequestInit) => Promise<Response>;
type ApiArgs = { fetch?: Fetch, rateLimit?: number };

export default class ExplorerApi {
    readonly action: Promise<ExplorerActionGenerator>;

    private readonly endpoint: string;
    private readonly namespace: string;

    private readonly fetchBuiltin: Fetch;

    constructor(endpoint: string, namespace: string, args: ApiArgs) {
        this.endpoint = endpoint;
        this.namespace = namespace;

        if (args.fetch) {
            this.fetchBuiltin = args.fetch;
        } else {
            this.fetchBuiltin = (<any>global).fetch;
        }

        this.action = (async () => {
            return new ExplorerActionGenerator((await this.getConfig()).contract, this);
        })();
    }

    async getConfig(): Promise<ApiConfig> {
        return await this.fetchEndpoint('/v1/config', {});
    }

    async getAssets(options: {
        owner?: string,
        collection_name?: string,
        schema_name?: string,
        template_id?: number,
        match?: string,
        authorized_account?: string,
        order?: string,
        sort?: string,
        [key: string]: any
    } = {}, page: number = 1, limit: number = 100): Promise<ApiAsset[]> {
        return await this.fetchEndpoint('/v1/assets', {page, limit, ...options});
    }

    async getAsset(id: string): Promise<ApiAsset> {
        return await this.fetchEndpoint('/v1/assets/' + id, {});
    }

    async getAssetLogs(id: string, page: number = 1, limit: number = 100): Promise<ApiLog[]> {
        return await this.fetchEndpoint('/v1/assets/' + id + '/logs', {page, limit});
    }

    async getCollections(options: {
        author?: string,
        match?: string,
        authorized_account?: string,
        notify_account?: string,
        order?: string,
        sort?: string
    } = {}, page: number = 1, limit: number = 100): Promise<ApiCollection[]> {
        return await this.fetchEndpoint('/v1/collections', {page, limit, ...options});
    }

    async getCollection(name: string): Promise<ApiCollection> {
        return await this.fetchEndpoint('/v1/collections/' + name, {});
    }

    async getCollectionLogs(name: string, page: number = 1, limit: number = 100): Promise<ApiLog[]> {
        return await this.fetchEndpoint('/v1/collections/' + name + '/logs', {page, limit});
    }

    async getSchemas(options: {
        collection_name?: string,
        match?: string,
        authorized_account?: string,
        order?: string,
        sort?: string
    } = {}, page: number = 1, limit: number = 100): Promise<ApiSchema[]> {
        return await this.fetchEndpoint('/v1/schemas', {page, limit, ...options});
    }

    async getSchema(collection: string, name: string): Promise<ApiSchema> {
        return await this.fetchEndpoint('/v1/schemas/' + collection + '/' + name, {});
    }

    async getSchemaLogs(collection: string, name: string, page: number = 1, limit: number = 100): Promise<ApiLog[]> {
        return await this.fetchEndpoint('/v1/schemas/' + collection + '/' + name + '/logs', {page, limit});
    }

    async getTemplates(options: {
        collection_name?: string,
        schema_name?: string,
        authorized_account?: string,
        order?: string,
        sort?: string,
        [key: string]: any
    } = {}, page: number = 1, limit: number = 100): Promise<ApiTemplate[]> {
        return await this.fetchEndpoint('/v1/templates', {page, limit, ...options});
    }

    async getTemplate(collection: string, id: string): Promise<ApiTemplate> {
        return await this.fetchEndpoint('/v1/templates/' + collection + '/' + id, {});
    }

    async getTemplateLogs(collection: string, id: string, page: number = 1, limit: number = 100): Promise<ApiLog[]> {
        return await this.fetchEndpoint('/v1/templates/' + collection + '/' + id + '/logs', {page, limit});
    }

    async getTransfers(options: {
        account?: string,
        sender?: string,
        recipient?: string,
        order?: string,
        sort?: string
    } = {}, page: number = 1, limit: number = 100): Promise<ApiTransfer[]> {
        return await this.fetchEndpoint('/v1/transfers', {page, limit, ...options});
    }

    async getOffers(options: {
        account?: string,
        sender?: string,
        recipient?: string,
        order?: string,
        sort?: string
    } = {}, page: number = 1, limit: number = 100): Promise<ApiOffer[]> {
        return await this.fetchEndpoint('/v1/offers', {page, limit, ...options});
    }

    async getOffer(id: string): Promise<ApiOffer> {
        return await this.fetchEndpoint('/v1/offers/' + id, {});
    }

    async fetchEndpoint(path: string, args: any): Promise<any> {
        let response;
        let json;

        try {
            const f = this.fetchBuiltin;
            const queryString = Object.keys(args).map((key) => {
                return key + '=' + encodeURIComponent(args[key]);
            }).join('&');

            response = await f(this.endpoint + '/' + this.namespace + path + (queryString.length > 0 ? '?' + queryString : ''));

            json = await response.json();
        } catch (e) {
            e.isFetchError = true;

            throw e;
        }

        if (!json.success) {
            throw new ExplorerError(json.message);
        }

        return json.data;
    }
}
