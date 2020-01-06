import {AssetRow, CollectionRow, PresetRow, SchemeRow} from "./Cache";
import RpcApi from "./index";

export default class RpcQueue {
    private elements: any[] = [];
    private times = [];

    constructor(private readonly api: RpcApi, private readonly requestLimit = 6) { }

    public async asset(id: number, cache: boolean = true): Promise<AssetRow> {
        return null;
    }

    public async preset(id: number, cache: boolean = true): Promise<PresetRow> {
        return null;
    }

    public async scheme(name: string, cache: boolean = true): Promise<SchemeRow> {
        return null;
    }

    public async collection(name: string, cache: boolean = true): Promise<CollectionRow> {
        return null;
    }

    public async inventory(account: string, cache: boolean = true): Promise<CollectionRow> {
        return null;
    }
}
