import {byte_vector_to_int} from "../../Serialization/Binary";

export type SchemeFormat = Array<{name: string, type: string}>;

export type AssetRow = {
    id: string, preset_id: string, ram_payer: string, backed_core_amount: string,
    immutable_serialized_data: Uint8Array, mutable_serialized_data: Uint8Array,
};
export type PresetRow = {
    scheme_name: string, collection_name: string,
    transferable: boolean, burnable: boolean,
    max_supply: number, issued_supply: number,
    mutable_serialized_data: Uint8Array,
    immutable_serialized_data: Uint8Array,
};
export type SchemeRow = {scheme_name: string, author: string, format: SchemeFormat};
export type CollectionRow = {collection_name: string, author: string, authorized_accounts: string[], notify_accounts: string[], serialized_data: Uint8Array};
export type OfferRow = {
    id: string, offer_sender: string, offer_recipient: string,
    sender_asset_ids: string[], recipient_asset_ids: string[],
    memo: string,
};
export type ConfigRow = {offer_counter: string, collection_format: SchemeFormat};

export default class RpcCache {
    private readonly assets: {[id: string]: {data: AssetRow, expiration: number, updated: number}} = {};
    private readonly presets: {[id: string]: {data: PresetRow, expiration: number, updated: number}} = {};
    private readonly schemes: {[id: string]: {data: SchemeRow, expiration: number, updated: number}} = {};
    private readonly collections: {[id: string]: {data: CollectionRow, expiration: number, updated: number}} = {};
    private readonly offers: {[id: string]: {data: OfferRow, expiration: number, updated: number}} = {};

    public asset(assetID: string, data?: any | null | false): AssetRow | undefined {
        if(data) {
            data.mutable_serialized_data = new Uint8Array(data.mutable_serialized_data);
            data.immutable_serialized_data = new Uint8Array(data.immutable_serialized_data);
        }

        return this.access<AssetRow>(assetID, this.assets, data);
    }

    public preset(presetID: string, data?: any | null | false): PresetRow | undefined {
        if(data) {
            data.mutable_serialized_data = new Uint8Array(data.mutable_serialized_data);
            data.immutable_serialized_data = new Uint8Array(data.immutable_serialized_data);
            data.max_supply = byte_vector_to_int(new Uint8Array(data.max_supply));
            data.issued_supply = byte_vector_to_int(new Uint8Array(data.issued_supply));
        }

        return this.access<PresetRow>(presetID, this.presets, data);
    }

    public scheme(scheme: string, data?: any | null | false): SchemeRow | undefined {
        return this.access<SchemeRow>(scheme, this.schemes, data);
    }

    public collection(collection: string, data?: any | null | false): CollectionRow | undefined {
        return this.access<CollectionRow>(collection, this.collections, data);
    }

    public offer(offerID: string, data?: any | null | false): OfferRow | undefined {
        return this.access<OfferRow>(offerID, this.offers, data);
    }

    private access<T>(
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
}
