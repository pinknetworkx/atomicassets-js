import {hex_encode} from "../../Serialization/Binary";
import {AssetRow} from "./Cache";
import RpcApi from "./index";
import RpcPreset from "./Preset";
import {deserialize} from "../../Serialization";

export default class RpcAsset {
    public readonly id: string;

    // tslint:disable-next-line:variable-name
    private readonly _data: Promise<AssetRow>;
    // tslint:disable-next-line:variable-name
    private readonly _preset: Promise<RpcPreset>;

    public constructor(private readonly api: RpcApi, owner: string, id: string, data?: AssetRow, preset?: RpcPreset) {
        this.id = id;

        this._data = new Promise(async (resolve, reject) => {
            if(data) {
                resolve(data);
            } else {
                try {
                    resolve(await api.queue.asset(owner, id));
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

                    resolve(new RpcPreset(api, row.preset_id));
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
        return (await this._data).backed_core_tokens;
    }

    public async immutableData(): Promise<any> {
        const preset = await this.preset();
        const scheme = await preset.scheme();

        const data = await this._data;

        let pdata = await preset.immutableData();
        if(typeof pdata === "string") {
            pdata = {};
        }

        try {
            return Object.assign({}, pdata, deserialize(data.immutable_serialized_data, await scheme.format()));
        } catch (e) {
            return hex_encode(data.idata);
        }
    }

    public async mutableData(): Promise<any> {
        const preset = await this.preset();
        const scheme = await preset.scheme();

        const data = await this._data;

        let pdata = await preset.mutableData();
        if(typeof pdata === "string") {
            pdata = {};
        }

        try {
            return Object.assign({}, pdata, deserialize(data.mutable_serialized_data, await scheme.format()));
        } catch (e) {
            return hex_encode(data.mdata);
        }
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
