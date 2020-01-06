import RpcError from "../../Errors/RpcError";
import {AssetRow, CollectionRow, OfferRow, PresetRow, SchemeRow} from "./Cache";
import RpcApi from "./index";

export default class RpcQueue {
    private elements: any[] = [];
    private times = [];

    constructor(private readonly api: RpcApi, private readonly requestLimit = 6) { }

    public async asset(owner: string, id: string, cache: boolean = true): Promise<AssetRow> {
        const rows = await this.api.get_table_rows({code: this.api.contract, scope: owner, table_key: "id", lower_bound: id, upper_bound: id});

        if(rows.length !== 1) {
            throw new RpcError("no asset found");
        }

        const asset = this.api.cache.asset(id, rows[0]);
    }

    public async account_assets(account: string, cache: boolean = true): Promise<AssetRow[]> {
        return [];
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

    public async offer(id: number, cache: boolean = true): Promise<OfferRow> {
        return null;
    }

    public async account_offers(account: string, cache: boolean = true): Promise<OfferRow[]> {
        return [];
    }
}
