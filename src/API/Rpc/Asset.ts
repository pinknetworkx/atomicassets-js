import {AssetRow} from "./Cache";
import RpcPreset from "./Preset";

export default class RpcAsset {
    public readonly id: number;

    private readonly _data?: AssetRow;

    private readonly _preset?: RpcPreset;

    public constructor(id: number, data?: AssetRow, preset?: RpcPreset) {
        this.id = id;

        this._data = data;
        this._preset = preset;
    }

    public async idata(): Promise<any> {
        const preset = await this.preset();
        const scheme = await preset.scheme();

    }

    public async mdata(): Promise<any> {
        const preset = await this.preset();
        const scheme = await preset.scheme();
    }

    public async preset(): Promise<RpcPreset> {
        return this._preset;
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
