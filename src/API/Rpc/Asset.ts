import bigInt from "big-integer";
import {deserialize} from "../../Serialization";
import {AssetRow} from "./Cache";
import RpcApi from "./index";
import RpcPreset from "./Preset";

export default class RpcAsset {
    public readonly id: string;

    // tslint:disable-next-line:variable-name
    private readonly _data: Promise<AssetRow>;
    // tslint:disable-next-line:variable-name
    private readonly _preset: Promise<RpcPreset>;

    public constructor(private readonly api: RpcApi, owner: string, id: string, data?: AssetRow, preset?: RpcPreset, cache: boolean = true) {
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

                    resolve(new RpcPreset(api, row.preset_id, undefined, undefined, undefined, cache));
                } catch (e) {
                    reject(e);
                }
            }
        });
    }

    public async preset(): Promise<RpcPreset> {
        return await this._preset;
    }

    public async backedTokens(): Promise<string> {
        return bigInt((await this._data).backed_core_amount).divide(this.api.precision).toString();
    }

    public async immutableData(): Promise<object | string> {
        const preset = await this.preset();
        const scheme = await preset.scheme();

        const data = await this._data;
        const pdata = await preset.immutableData();

        return Object.assign({}, pdata, deserialize(data.immutable_serialized_data, await scheme.format()));
    }

    public async mutableData(): Promise<object | string> {
        const preset = await this.preset();
        const scheme = await preset.scheme();

        const data = await this._data;
        const pdata = await preset.mutableData();

        return Object.assign({}, pdata, deserialize(data.mutable_serialized_data, await scheme.format()));
    }

    public async data(): Promise<object> {
        const mutableData = await this.mutableData();
        const immutableData = await this.immutableData();

        return Object.assign({}, mutableData, immutableData);
    }

    public async toObject(): Promise<object> {
        return {
            id: this.id,
            backedTokens: await this.backedTokens(),
            immutableData: await this.immutableData(),
            mutableData: await this.mutableData(),
            preset: await (await this.preset()).toObject(),
        };
    }
}
