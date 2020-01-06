export type AssetRow = any;
export type PresetRow = any;
export type SchemeRow = any;
export type CollectionRow = any;

export default class RpcCache {
    private assets: {[id: string]: AssetRow} = {};
    private presets: {[id: string]: PresetRow} = {};
    private schemes: {[id: string]: SchemeRow} = {};
    private collections: {[id: string]: CollectionRow} = {};

    public asset(assetID: number | string, data?: AssetRow): AssetRow {
        if(data) {
            this.assets[String(assetID)] = data;

            return data;
        }

        if(typeof this.assets[String(assetID)] === "undefined") {
            return null;
        }

        return this.assets[String(assetID)];
    }

    public preset(presetID: number, data?: PresetRow): PresetRow {
        if(data) {
            this.presets[String(presetID)] = data;

            return data;
        }

        if(typeof this.presets[String(presetID)] === "undefined") {
            return null;
        }

        return this.presets[String(presetID)];
    }

    public scheme(scheme: string, data?: SchemeRow): SchemeRow {
        if(data) {
            this.schemes[String(scheme)] = data;

            return data;
        }

        if(typeof this.schemes[String(scheme)] === "undefined") {
            return null;
        }

        return this.schemes[String(scheme)];
    }

    public collection(collection: string, data?: CollectionRow): CollectionRow {
        if(data) {
            this.collections[String(collection)] = data;

            return data;
        }

        if(typeof this.collections[String(collection)] === "undefined") {
            return null;
        }

        return this.collections[String(collection)];
    }
}
