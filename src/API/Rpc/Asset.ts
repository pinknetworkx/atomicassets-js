import {hex_encode} from "../../Binary";
import {AssetRow} from "./Cache";
import RpcApi from "./index";
import RpcPreset from "./Preset";

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

                    resolve(new RpcPreset(api, row.presetid));
                } catch (e) {
                    reject(e);
                }
            }
        });
    }

    public async preset(): Promise<RpcPreset> {
        return await this._preset;
    }

    public async idata(): Promise<any> {
        const preset = await this.preset();
        const scheme = await preset.scheme();

        const data = await this._data;

        let pdata = await preset.idata();
        if(typeof pdata === "string") {
            pdata = {};
        }

        try {
            return Object.assign({}, pdata, (await scheme.ischema()).deserialize(data.idata));
        } catch (e) {
            return hex_encode(data.idata);
        }
    }

    public async mdata(): Promise<any> {
        const preset = await this.preset();
        const scheme = await preset.scheme();

        const data = await this._data;

        let pdata = await preset.mdata();
        if(typeof pdata === "string") {
            pdata = {};
        }

        try {
            return Object.assign({}, pdata, (await scheme.mschema()).deserialize(data.mdata));
        } catch (e) {
            return hex_encode(data.mdata);
        }
    }

    public async toObject(): Promise<object> {
        return {
            id: this.id,
            idata: await this.idata(),
            mdata: await this.mdata(),
            preset: await (await this.preset()).toObject(),
        };
    }
}
