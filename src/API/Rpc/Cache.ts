export type SchemeFormat = Array<{name: string, type: string}>;

export interface ICollectionRow {
    collection_name: string;
    author: string;
    allow_notify: boolean;
    authorized_accounts: string[];
    notify_accounts: string[];
    market_fee: number;
    serialized_data: Uint8Array;
}

export interface ISchemeRow {
    scheme_name: string;
    format: SchemeFormat;
}

export interface IPresetRow {
    preset_id: number;
    collection_name: string;
    scheme_name: string;
    transferable: boolean;
    burnable: boolean;
    max_supply: number;
    issued_supply: number;
    immutable_serialized_data: Uint8Array;
}

export interface IAssetRow {
    asset_id: string;
    collection_name: string;
    scheme_name: string;
    preset_id: string;
    ram_payer: string;
    backed_tokens: string[];
    immutable_serialized_data: Uint8Array;
    mutable_serialized_data: Uint8Array;
}

export interface IOfferRow {
    offer_id: string;
    sender: string;
    recipient: string;
    sender_asset_ids: string[];
    recipient_asset_ids: string[];
    memo: string;
}

export interface IConfigRow {
    asset_counter: string;
    offer_counter: string;
    collection_format: SchemeFormat;
}

export default class RpcCache {
    private static access<T>(
        identifier: string | number,
        cache: {[id: string]: {expiration: number, updated: number, data: T}},
        data?: T | null | false,
    ): T | undefined {
        if(data === null) {
            delete cache[String(identifier)];

            return undefined;
        }

        if(data) {
            cache[String(identifier)] = {expiration: Date.now() + 15 * 60 * 1000, updated: Date.now(), data};

            return data;
        }

        if(typeof cache[String(identifier)] === "undefined" || cache[String(identifier)].expiration < Date.now()) {
            return undefined;
        }

        // if data is false then only return cache if it is not older than 5 seconds
        if(data === false && Date.now() - cache[String(identifier)].updated > 5 * 1000) {
            return undefined;
        }

        return cache[String(identifier)].data;
    }

    private readonly assets: {[id: string]: {data: IAssetRow, expiration: number, updated: number}} = {};
    private readonly presets: {[id: string]: {data: IPresetRow, expiration: number, updated: number}} = {};
    private readonly schemes: {[id: string]: {data: ISchemeRow, expiration: number, updated: number}} = {};
    private readonly collections: {[id: string]: {data: ICollectionRow, expiration: number, updated: number}} = {};
    private readonly offers: {[id: string]: {data: IOfferRow, expiration: number, updated: number}} = {};

    public asset(assetID: string, data?: any | null | false): IAssetRow | undefined {
        if(data) {
            data.mutable_serialized_data = new Uint8Array(data.mutable_serialized_data);
            data.immutable_serialized_data = new Uint8Array(data.immutable_serialized_data);
        }

        return RpcCache.access<IAssetRow>(assetID, this.assets, data);
    }

    public preset(presetID: string, data?: any | null | false): IPresetRow | undefined {
        if(data) {
            data.immutable_serialized_data = new Uint8Array(data.immutable_serialized_data);
        }

        return RpcCache.access<IPresetRow>(presetID, this.presets, data);
    }

    public scheme(scheme: string, data?: any | null | false): ISchemeRow | undefined {
        return RpcCache.access<ISchemeRow>(scheme, this.schemes, data);
    }

    public collection(collection: string, data?: any | null | false): ICollectionRow | undefined {
        return RpcCache.access<ICollectionRow>(collection, this.collections, data);
    }

    public offer(offerID: string, data?: any | null | false): IOfferRow | undefined {
        return RpcCache.access<IOfferRow>(offerID, this.offers, data);
    }
}
