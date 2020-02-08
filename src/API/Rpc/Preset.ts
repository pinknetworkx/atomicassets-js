import {deserialize} from "../../Serialization";
import {hex_encode} from "../../Serialization/Binary";
import {PresetRow} from "./Cache";
import RpcCollection from "./Collection";
import RpcApi from "./index";
import RpcScheme from "./Scheme";

export default class RpcPreset {
    public readonly id: string;

    // tslint:disable-next-line:variable-name
    private readonly _data: Promise<PresetRow>;

    // tslint:disable-next-line:variable-name
    private readonly _collection: Promise<RpcCollection>;
    // tslint:disable-next-line:variable-name
    private readonly _scheme: Promise<RpcScheme>;

    public constructor(private readonly api: RpcApi, id: string, data?: PresetRow, scheme?: RpcScheme, collection?: RpcCollection, cache: boolean = true) {
        this.id = id;

        this._data = new Promise(async (resolve, reject) => {
            if(data) {
                resolve(data);
            } else {
                try {
                    resolve(await api.queue.preset(id, cache));
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

                    resolve(new RpcScheme(this.api, row.scheme_name, undefined, cache));
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

                    resolve(new RpcCollection(this.api, row.collection_name, undefined, cache));
                } catch (e) {
                    reject(e);
                }
            }
        });
    }

    public async collection(): Promise<RpcCollection> {
        return await this._collection;
    }

    public async scheme(): Promise<RpcScheme> {
        return await this._scheme;
    }

    public async immutableData(): Promise<object | string> {
        const scheme = await this._scheme;

        try {
            return deserialize((await this._data).immutable_serialized_data, await scheme.format());
        } catch (e) {
            return hex_encode((await this._data).immutable_serialized_data);
        }
    }

    public async mutableData(): Promise<object | string> {
        const scheme = await this._scheme;

        try {
            return deserialize((await this._data).mutable_serialized_data, await scheme.format());
        } catch (e) {
            return hex_encode((await this._data).mutable_serialized_data);
        }
    }

    public async isTransferable(): Promise<boolean> {
        return !!(await this._data).transferable;
    }

    public async isBurnable(): Promise<boolean> {
        return !!(await this._data).burnable;
    }

    public async maxSupply(): Promise<number> {
        return (await this._data).max_supply;
    }

    public async circulation(): Promise<number> {
        return (await this._data).issued_supply;
    }

    public async toObject(): Promise<object> {
        return {
            id: this.id,
            collection: await (await this.collection()).toObject(),
            scheme: await (await this.scheme()).toObject(),
            immutableData: await this.immutableData(),
            mutableData: await this.mutableData(),
            transferable: await this.isTransferable(),
            burnable: await this.isBurnable(),
            maxSupply: await this.maxSupply(),
            circulation: await this.circulation(),
        };
    }
}
