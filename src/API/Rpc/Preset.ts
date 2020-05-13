import {deserialize} from "../../Serialization";
import {IPresetRow} from "./Cache";
import RpcApi from "./index";
import RpcScheme from "./Scheme";

export default class RpcPreset {
    public readonly id: string;

    // tslint:disable-next-line:variable-name
    private readonly _data: Promise<IPresetRow>;

    // tslint:disable-next-line:variable-name
    private readonly _scheme: Promise<RpcScheme>;

    public constructor(private readonly api: RpcApi, collection: string, id: string, data?: IPresetRow, scheme?: RpcScheme, cache: boolean = true) {
        this.id = id;

        this._data = new Promise(async (resolve, reject) => {
            if(data) {
                resolve(data);
            } else {
                try {
                    resolve(await api.queue.preset(collection, id, cache));
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

                    resolve(new RpcScheme(this.api, collection, row.scheme_name, undefined, cache));
                } catch (e) {
                    reject(e);
                }
            }
        });
    }

    public async scheme(): Promise<RpcScheme> {
        return await this._scheme;
    }

    public async immutableData(): Promise<object> {
        const scheme = await this._scheme;

        return deserialize((await this._data).immutable_serialized_data, await scheme.format());
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
            preset_id: this.id,
            scheme: await (await this.scheme()).toObject(),
            immutableData: await this.immutableData(),
            transferable: await this.isTransferable(),
            burnable: await this.isBurnable(),
            maxSupply: await this.maxSupply(),
            circulation: await this.circulation(),
        };
    }
}
