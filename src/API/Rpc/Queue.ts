import RpcError from "../../Errors/RpcError";
import {AssetRow, CollectionRow, OfferRow, PresetRow, SchemeRow} from "./Cache";
import RpcApi from "./index";

export default class RpcQueue {
    private elements: any[] = [];
    private times = [];

    private interval: any = null;

    constructor(private readonly api: RpcApi, private readonly requestLimit = 4) {
        this.dequeue();
    }

    public async asset(owner: string, id: string, useCache: boolean = true): Promise<AssetRow> {
        const cache = useCache ? this.api.cache.asset(id) : null;

        return new Promise((resolve, reject) => {
            if(cache) {
                return cache;
            }

            this.elements.push(async () => {
                let rows;

                try {
                    rows = await this.api.get_table_rows({code: this.api.contract, scope: owner, table_key: "id", lower_bound: id, upper_bound: id});
                } catch (e) {
                    return reject(e);
                }

                if(rows.length !== 1) {
                    return reject(new RpcError("no asset found"));
                }

                return resolve(this.api.cache.asset(id, rows[0]));
            });
        });
    }

    public async account_assets(account: string, useCache: boolean = true): Promise<AssetRow[]> {
        // TODO
        return [];
    }

    public async preset(id: number, useCache: boolean = true): Promise<PresetRow> {
        // TODO
        return null;
    }

    public async scheme(name: string, useCache: boolean = true): Promise<SchemeRow> {
        // TODO
        return null;
    }

    public async collection(name: string, useCache: boolean = true): Promise<CollectionRow> {
        // TODO
        return null;
    }

    public async offer(id: number, useCache: boolean = true): Promise<OfferRow> {
        // TODO
        return null;
    }

    public async account_offers(account: string, useCache: boolean = true): Promise<OfferRow[]> {
        // TODO
        return [];
    }

    public stop() {
        clearInterval(this.interval);

        this.interval = null;
    }

    public listenResult(name: string, cb: (data: any) => any) {
        // TODO
    }

    public fireResult(name: string, data: any) {
        // TODO
    }

    private dequeue() {
        this.interval = setInterval(async () => {
            if(this.elements.length > 0) {
                this.elements.shift()();
            }
        }, Math.ceil(1000 / this.requestLimit));
    }

    private async fetch_all_rows(code: string, scope: string, table: string, tableKey: string, lowerBound = "", upperBound = ""): Promise<any[]>  {
        let rows: any[] = [];
        let resp = {more: true, rows: []};

        while(resp.more) {
            resp = await this.api.get_table_rows({
                code, scope, table, table_key: tableKey,
                lower_bound: rows.length === 0 ? lowerBound : rows[rows.length - 1][tableKey],
                upper_bound: upperBound,
            });

            // first element is duplicate
            if(rows.length > 0) {
                resp.rows.shift();
            }

            // concat arrays
            rows = rows.concat(resp.rows);
        }

        return rows;
    }
}
