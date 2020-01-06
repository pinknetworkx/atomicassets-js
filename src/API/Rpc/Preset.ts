import {PresetRow} from "./Cache";
import RpcCollection from "./Collection";
import RpcScheme from "./Scheme";
import RpcApi from "./index";

export default class RpcPreset {
    public readonly id: number;

    private readonly _data?: PresetRow;

    private readonly _collection?: RpcCollection;
    private readonly _scheme?: RpcScheme;

    public constructor(private readonly api: RpcApi, id: number, data?: PresetRow, scheme?: RpcScheme, collection?: RpcCollection) {
        this.id = id;
    }

    public async collection(): Promise<RpcCollection> {
        return this._collection;
    }

    public async scheme(): Promise<RpcScheme> {
        return this._scheme;
    }

    public async isTransferable(): Promise<boolean> {
        return true;
    }

    public async isBurnable(): Promise<boolean> {
        return true;
    }

    public async maxSupply(): Promise<number> {
        return 0;
    }

    public async circulation(): Promise<number> {
        return 0;
    }

    public async toObject(): Promise<object> {
        return {};
    }
}
