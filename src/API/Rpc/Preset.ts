import {hex_encode} from "../../Binary";
import {PresetRow} from "./Cache";
import RpcCollection from "./Collection";
import RpcScheme from "./Scheme";
import RpcApi from "./index";

export default class RpcPreset {
    public readonly id: number;

    // tslint:disable-next-line:variable-name
    private readonly _data: Promise<PresetRow>;

    // tslint:disable-next-line:variable-name
    private readonly _collection: Promise<RpcCollection>;
    // tslint:disable-next-line:variable-name
    private readonly _scheme: Promise<RpcScheme>;

    public constructor(private readonly api: RpcApi, id: number, data?: PresetRow, scheme?: RpcScheme, collection?: RpcCollection) {
        this.id = id;

        this._data = new Promise(async (resolve) => {
            if(data) {
                resolve(data);
            } else {
                resolve(await api.queue.preset(id));
            }
        });

        this._scheme = new Promise(async (resolve) => {
            if(scheme) {
                resolve(scheme);
            } else {
                const row = await this._data;

                resolve(await api.queue.scheme(row.scheme));
            }
        });

        this._collection = new Promise(async (resolve) => {
            if(collection) {
                resolve(collection);
            } else {
                const row = await this._data;

                resolve(await api.queue.collection(row.collection));
            }
        });
    }

    public async collection(): Promise<RpcCollection> {
        return await this._collection;
    }

    public async scheme(): Promise<RpcScheme> {
        return await this._scheme;
    }

    public async idata(): Promise<object | string> {
        const scheme = await this._scheme;

        try {
            return (await scheme.ischema()).deserialize((await this._data).idata);
        } catch (e) {
            return hex_encode((await this._data).idata);
        }
    }

    public async mdata(): Promise<object | string> {
        const scheme = await this._scheme;

        try {
            return (await scheme.mschema()).deserialize((await this._data).mdata);
        } catch (e) {
            return hex_encode((await this._data).mdata);
        }
    }

    public async isTransferable(): Promise<boolean> {
        return !!(await this._data).transferable;
    }

    public async isBurnable(): Promise<boolean> {
        return !!(await this._data).burnable;
    }

    public async maxSupply(): Promise<number> {
        return (await this._data).maxsupply;
    }

    public async circulation(): Promise<number> {
        return (await this._data).circulation;
    }

    public async toObject(): Promise<object> {
        return {
            id: this.id,
            collection: await (await this.collection()).toObject(),
            scheme: await (await this.scheme()).toObject(),
            idata: await this.idata(),
            mdata: await this.mdata(),
            transferable: await this.isTransferable(),
            burnable: await this.isBurnable(),
            maxSupply: await this.maxSupply(),
            circulation: await this.circulation(),
        };
    }
}
