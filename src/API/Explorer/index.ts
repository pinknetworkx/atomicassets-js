import ExplorerActionGenerator from '../../Actions/Explorer';
import ApiError from '../../Errors/ApiError';
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

interface GreylistParams {
    collection_blacklist?: string;
    collection_whitelist?: string;
}

interface HideOffersParams {
    hide_offers?: boolean;
    hide_sales?: boolean;
}

interface PrimaryBoundaryParams {
    ids?: string;
    lower_bound?: string;
    upper_bound?: string;
}

interface DateBoundaryParams {
    before?: number;
    after?: number;
}

export interface AssetParams extends GreylistParams, HideOffersParams, PrimaryBoundaryParams, DateBoundaryParams {
    owner?: string;
    collection_name?: string;
    schema_name?: string;
    template_id?: number;
    match?: string;
    authorized_account?: string;
    is_transferable?: boolean;
    is_burnable?: boolean;
    only_duplicate_templates?: boolean;
    order?: string;
    sort?: string;
    [key: string]: any;
}

export interface CollectionParams extends GreylistParams, PrimaryBoundaryParams, DateBoundaryParams {
    author?: string;
    match?: string;
    authorized_account?: string;
    notify_account?: string;
    order?: string;
    sort?: string;
}

export interface SchemaParams extends GreylistParams, PrimaryBoundaryParams, DateBoundaryParams {
    collection_name?: string;
    schema_name?: string;
    match?: string;
    authorized_account?: string;
    order?: string;
    sort?: string;
}

export interface TemplateParams extends GreylistParams, PrimaryBoundaryParams, DateBoundaryParams {
    collection_name?: string;
    schema_name?: string;
    authorized_account?: string;
    template_id?: string;
    max_supply?: number;
    issued_supply?: number;
    is_transferable?: boolean;
    is_burnable?: boolean;
    order?: string;
    sort?: string;
    [key: string]: any;
}

export interface TransferParams extends GreylistParams, PrimaryBoundaryParams, DateBoundaryParams {
    account?: string;
    sender?: string;
    recipient?: string;
    asset_id?: string;
    order?: string;
    sort?: string;
}

export interface OfferParams extends GreylistParams, PrimaryBoundaryParams, DateBoundaryParams {
    account?: string;
    sender?: string;
    recipient?: string;
    is_recipient_contract?: boolean;
    asset_id?: string;
    order?: string;
    sort?: string;
}

export interface AccountParams extends GreylistParams, PrimaryBoundaryParams, DateBoundaryParams {
    match?: string;
    collection_name?: string;
    schema_name?: string;
    template_id?: string;
}

export type DataOptions = {[key: string]: any};

function buildDataOptions(options: {[key: string]: any}, data: DataOptions): {[key: string]: any} {
    const dataKeys = Object.keys(data);
    const dataFields: DataOptions = {};

    for (const key of dataKeys) {
        if (typeof data[key] === 'number') {
            dataFields['data:number.' + key] = data[key];
        } else if (typeof data[key] === 'boolean') {
            dataFields['data:bool.' + key] = data[key];
        } else {
            dataFields['data.' + key] = data[key];
        }
    }

    return Object.assign({}, options, dataFields);
}

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
            this.fetchBuiltin = <any>window.fetch;
        }

        this.action = (async () => {
            return new ExplorerActionGenerator((await this.getConfig()).contract, this);
        })();
    }

    async getConfig(): Promise<ApiConfig> {
        return await this.fetchEndpoint('/v1/config', {});
    }

    async getAssets(options: AssetParams = {}, page: number = 1, limit: number = 100, data: DataOptions = {}): Promise<ApiAsset[]> {
        return await this.fetchEndpoint('/v1/assets', {page, limit, ...buildDataOptions(options, data)});
    }

    async countAssets(options: AssetParams, data: DataOptions = {}): Promise<number> {
        return await this.countEndpoint('/v1/assets', buildDataOptions(options, data));
    }

    async getAsset(id: string): Promise<ApiAsset> {
        return await this.fetchEndpoint('/v1/assets/' + id, {});
    }

    async getAssetLogs(id: string, page: number = 1, limit: number = 100, order: string = 'desc'): Promise<ApiLog[]> {
        return await this.fetchEndpoint('/v1/assets/' + id + '/logs', {page, limit, order});
    }

    async getCollections(options: CollectionParams = {}, page: number = 1, limit: number = 100): Promise<ApiCollection[]> {
        return await this.fetchEndpoint('/v1/collections', {page, limit, ...options});
    }

    async countCollections(options: CollectionParams = {}): Promise<number> {
        return await this.countEndpoint('/v1/collections', options);
    }

    async getCollection(name: string): Promise<ApiCollection> {
        return await this.fetchEndpoint('/v1/collections/' + name, {});
    }

    async getCollectionLogs(name: string, page: number = 1, limit: number = 100, order: string = 'desc'): Promise<ApiLog[]> {
        return await this.fetchEndpoint('/v1/collections/' + name + '/logs', {page, limit, order});
    }

    async getSchemas(options: SchemaParams = {}, page: number = 1, limit: number = 100): Promise<ApiSchema[]> {
        return await this.fetchEndpoint('/v1/schemas', {page, limit, ...options});
    }

    async countSchemas(options: SchemaParams = {}): Promise<number> {
        return await this.countEndpoint('/v1/schemas', options);
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

    async getTemplates(options: TemplateParams = {}, page: number = 1, limit: number = 100, data: DataOptions = {}): Promise<ApiTemplate[]> {
        return await this.fetchEndpoint('/v1/templates', {page, limit, ...buildDataOptions(options, data)});
    }

    async countTemplates(options: TemplateParams = {}, data: DataOptions = {}): Promise<number> {
        return await this.countEndpoint('/v1/templates', buildDataOptions(options, data));
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

    async getTransfers(options: TransferParams = {}, page: number = 1, limit: number = 100): Promise<ApiTransfer[]> {
        return await this.fetchEndpoint('/v1/transfers', {page, limit, ...options});
    }

    async countTransfers(options: TransferParams = {}): Promise<number> {
        return await this.countEndpoint('/v1/transfers', options);
    }

    async getOffers(options: OfferParams = {}, page: number = 1, limit: number = 100): Promise<ApiOffer[]> {
        return await this.fetchEndpoint('/v1/offers', {page, limit, ...options});
    }

    async countOffers(options: OfferParams = {}): Promise<number> {
        return await this.countEndpoint('/v1/offers', options);
    }

    async getOffer(id: string): Promise<ApiOffer> {
        return await this.fetchEndpoint('/v1/offers/' + id, {});
    }

    async getAccounts(options: AccountParams = {}, page: number = 1, limit: number = 100): Promise<Array<{account: string, assets: string}>> {
        return await this.fetchEndpoint('/v1/accounts', {page, limit, ...options});
    }

    async countAccounts(options: AccountParams = {}): Promise<number> {
        return await this.countEndpoint('/v1/accounts', options);
    }

    async getAccount(account: string, options: any = {}): Promise<{assets: string, collections: Array<{collection: ApiCollection, assets: string}>}> {
        return await this.fetchEndpoint('/v1/accounts/' + account, options);
    }

    async getAccountCollection(
        account: string, collection: string, options: any = {}
    ): Promise<{templates: Array<{template_id: string, assets: string}>, schemas: Array<{schema_name: string, assets: string}>}> {
        return await this.fetchEndpoint('/v1/accounts/' + account + '/' + collection, options);
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

    async countEndpoint(path: string, args: any): Promise<number> {
        const res = await this.fetchEndpoint(path + '/_count', args);

        return parseInt(res, 10);
    }
}
