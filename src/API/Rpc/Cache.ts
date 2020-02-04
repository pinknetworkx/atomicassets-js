import {byte_vector_to_int} from "../../Serialization/Binary";

export type AssetRow = any;
export type PresetRow = any;
export type SchemeRow = any;
export type CollectionRow = any;
export type OfferRow = any;
export type ConfigRow = any;

export default class RpcCache {
    private readonly assets: {[id: string]: {data: AssetRow, expiration: number}} = {};
    private readonly presets: {[id: string]: {data: PresetRow, expiration: number}} = {};
    private readonly schemes: {[id: string]: {data: SchemeRow, expiration: number}} = {};
    private readonly collections: {[id: string]: {data: CollectionRow, expiration: number}} = {};
    private readonly offers: {[id: string]: {data: OfferRow, expiration: number}} = {};

    public asset(assetID: string, data?: AssetRow): AssetRow | null {
        if(data) {
            data.mutable_serialized_data = new Uint8Array(data.mutable_serialized_data);
            data.immutable_serialized_data = new Uint8Array(data.immutable_serialized_data);
            data.backed_core_tokens = data.backed_core_tokens.replace(" WAX", "");
        }

        return this.access<AssetRow>(assetID, this.assets, data);
    }

    public preset(presetID: number, data?: PresetRow): PresetRow | null {
        if(data) {
            data.mutable_serialized_data = new Uint8Array(data.mutable_serialized_data);
            data.immutable_serialized_data = new Uint8Array(data.immutable_serialized_data);
            data.max_supply = byte_vector_to_int(new Uint8Array(data.max_supply));
            data.issued_supply = byte_vector_to_int(new Uint8Array(data.issued_supply));
        }

        return this.access<PresetRow>(presetID, this.presets, data);
    }

    public scheme(scheme: string, data?: SchemeRow): SchemeRow | null {
        return this.access<SchemeRow>(scheme, this.schemes, data);
    }

    public collection(collection: string, data?: CollectionRow): CollectionRow | null {
        return this.access<CollectionRow>(collection, this.collections, data);
    }

    public offer(offerID: string, data?: OfferRow): OfferRow | null {
        return this.access<OfferRow>(offerID, this.offers, data);
    }

    private access<T>(identifier: string | number, cache: {[id: string]: {expiration: number, data: T}}, data?: T): T | undefined {
        if(data) {
            cache[String(identifier)] = {expiration: Date.now() + 15 * 60 * 1000, data};

            return data;
        }

        if(typeof cache[String(identifier)] === "undefined" || cache[String(identifier)].expiration < Date.now()) {
            return undefined;
        }

        return cache[String(identifier)].data;
    }
}
