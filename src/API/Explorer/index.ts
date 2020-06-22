import ExplorerActionGenerator from '../../Actions/Explorer';
import ApiError from '../../Errors/ApiError';
import ExplorerError from '../../Errors/ExplorerError';
import {
    ApiAsset,
    ApiCollection,
    ApiConfig,
    ApiLog,
    ApiOffer,
    ApiSchema,
    ApiSchemaStats,
    ApiTemplate,
    ApiTemplateStats,
    ApiTransfer
} from './Types';

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
    } = {}, page: number = 1, limit: number = 100, data: { [key: string]: any} = {}): Promise<ApiAsset[]> {
        const dataKeys = Object.keys(data);

        for (const key of dataKeys) {
            options['data.' + key] = data[key];
        }

        return await this.fetchEndpoint('/v1/assets', {page, limit, ...options});
    }

    async getAsset(id: string): Promise<ApiAsset> {
        return await this.fetchEndpoint('/v1/assets/' + id, {});
    }

    async getAssetLogs(id: string, page: number = 1, limit: number = 100, order: string = 'desc'): Promise<ApiLog[]> {
        return await this.fetchEndpoint('/v1/assets/' + id + '/logs', {page, limit, order});
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

    async getCollectionLogs(name: string, page: number = 1, limit: number = 100, order: string = 'desc'): Promise<ApiLog[]> {
        return await this.fetchEndpoint('/v1/collections/' + name + '/logs', {page, limit, order});
    }

    async getSchemas(options: {
        collection_name?: string,
        schema_name?: string,
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

    async getSchemaStats(collection: string, name: string): Promise<ApiSchemaStats> {
        return await this.fetchEndpoint('/v1/schemas/' + collection + '/' + name + '/stats', {});
    }

    async getSchemaLogs(collection: string, name: string, page: number = 1, limit: number = 100, order: string = 'desc'): Promise<ApiLog[]> {
        return await this.fetchEndpoint('/v1/schemas/' + collection + '/' + name + '/logs', {page, limit, order});
    }

    async getTemplates(options: {
        collection_name?: string,
        schema_name?: string,
        authorized_account?: string,
        template_id?: string,
        order?: string,
        sort?: string,
        [key: string]: any
    } = {}, page: number = 1, limit: number = 100, data: {[key: string]: any}): Promise<ApiTemplate[]> {
        const dataKeys = Object.keys(data);

        for (const key of dataKeys) {
            options['data.' + key] = data[key];
        }

        return await this.fetchEndpoint('/v1/templates', {page, limit, ...options});
    }

    async getTemplate(collection: string, id: string): Promise<ApiTemplate> {
        return await this.fetchEndpoint('/v1/templates/' + collection + '/' + id, {});
    }

    async getTemplateStats(collection: string, name: string): Promise<ApiTemplateStats> {
        return await this.fetchEndpoint('/v1/templates/' + collection + '/' + name + '/stats', {});
    }

    async getTemplateLogs(collection: string, id: string, page: number = 1, limit: number = 100, order: string = 'desc'): Promise<ApiLog[]> {
        return await this.fetchEndpoint('/v1/templates/' + collection + '/' + id + '/logs', {page, limit, order});
    }

    async getTransfers(options: {
        account?: string,
        sender?: string,
        recipient?: string,
        asset_id?: string,
        order?: string,
        sort?: string
    } = {}, page: number = 1, limit: number = 100): Promise<ApiTransfer[]> {
        return await this.fetchEndpoint('/v1/transfers', {page, limit, ...options});
    }

    async getOffers(options: {
        account?: string,
        sender?: string,
        recipient?: string,
        is_recipient_contract?: boolean,
        asset_id?: string,
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

        const f = this.fetchBuiltin;
        const queryString = Object.keys(args).map((key) => {
            return key + '=' + encodeURIComponent(args[key]);
        }).join('&');

        try {
            response = await f(this.endpoint + '/' + this.namespace + path + (queryString.length > 0 ? '?' + queryString : ''));
        } catch (e) {
            throw new ApiError(e.message, 500);
        }

        const json = await response.json();

        if (response.status !== 200) {
            throw new ApiError(json.message, response.status);
        }

        if (!json.success) {
            throw new ApiError(json.message, response.status);
        }

        return json.data;
    }
}
