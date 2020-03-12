import bigInt from "big-integer";
import {deserialize} from "../../Serialization";
import {IAssetRow} from "./Cache";
import RpcCollection from "./Collection";
import RpcApi from "./index";
import RpcPreset from "./Preset";
import RpcScheme from "./Scheme";

export default class RpcAsset {
    public readonly id: string;

    // tslint:disable-next-line:variable-name
    private readonly _data: Promise<IAssetRow>;
    // tslint:disable-next-line:variable-name
    private readonly _preset: Promise<RpcPreset | null>;
    // tslint:disable-next-line:variable-name
    private readonly _collection: Promise<RpcCollection>;
    // tslint:disable-next-line:variable-name
    private readonly _scheme: Promise<RpcScheme>;

    public constructor(
        private readonly api: RpcApi,
        owner: string,
        id: string,
        data?: IAssetRow,
        collection?: RpcCollection,
        scheme?: RpcScheme,
        preset?: RpcPreset,
        cache: boolean = true,
    ) {
        this.id = id;

        this._data = new Promise(async (resolve, reject) => {
            if(data) {
                resolve(data);
            } else {
                try {
                    resolve(await api.queue.asset(owner, id, cache));
                } catch (e) {
                    reject(e);
                }
            }
        });

        this._preset = new Promise(async (resolve, reject) => {
            if(preset) {
                resolve(preset);
            } else {
                try {
                    const row = await this._data;

                    if(Number(row.preset_id) < 0) {
                        return resolve(null);
                    }

                    resolve(new RpcPreset(api, row.preset_id, undefined, undefined, undefined, cache));
                } catch (e) {
                    reject(e);
                }
            }
        });

        this._collection = new Promise(async (resolve, reject) => {
            if(collection) {
                resolve(collection);
            } else {
                try {
                    const row = await this._data;

                    resolve(new RpcCollection(api, row.collection_name, undefined, cache));
                } catch (e) {
                    reject(e);
                }
            }
        });

        this._scheme = new Promise(async (resolve, reject) => {
            if(scheme) {
                resolve(scheme);
            } else {
                try {
                    const row = await this._data;

                    resolve(new RpcScheme(api, row.collection_name, row.scheme_name, undefined, cache));
                } catch (e) {
                    reject(e);
                }
            }
        });
    }

    public async preset(): Promise<RpcPreset | null> {
        return await this._preset;
    }

    public async collection(): Promise<RpcCollection> {
        return await this._collection;
    }

    public async scheme(): Promise<RpcScheme> {
        return await this._scheme;
    }

    public async backedTokens(): Promise<string[]> {
        return (await this._data).backed_tokens;
    }

    public async immutableData(): Promise<object> {
        const scheme = await this.scheme();
        const row = await this._data;

        return deserialize(row.immutable_serialized_data, await scheme.format());
    }

    public async mutableData(): Promise<object> {
        const scheme = await this.scheme();
        const row = await this._data;

        return deserialize(row.mutable_serialized_data, await scheme.format());
    }

    public async data(): Promise<object> {
        const mutableData = await this.mutableData();
        const immutableData = await this.immutableData();

        const preset = await this.preset();
        const presetData = preset ? await preset.immutableData() : {};

        return Object.assign({}, mutableData, immutableData, presetData);
    }

    public async toObject(): Promise<object> {
        const preset = await this.preset();
        const collection = await this.collection();
        const scheme = await this.scheme();

        return {
            asset_id: this.id,

            collection: await collection.toObject(),
            scheme: await scheme.toObject(),
            preset: preset ? await preset.toObject() : null,

            backedTokens: await this.backedTokens(),
            immutableData: await this.immutableData(),
            mutableData: await this.mutableData(),
            data: await this.data(),
        };
    }
}
