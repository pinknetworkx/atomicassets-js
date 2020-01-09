import RpcError from "../../Errors/RpcError";
import {AssetRow, CollectionRow, OfferRow, PresetRow, SchemeRow} from "./Cache";
import RpcApi from "./index";

export default class RpcQueue {
    private elements: any[] = [];
    private interval: any = null;

    constructor(private readonly api: RpcApi, private readonly requestLimit = 4) {
        this.dequeue();
    }

    public async asset(owner: string, id: string, useCache: boolean = true): Promise<AssetRow> {
        return this.fetch_single_row(owner, "assets", "id", id, this.api.cache.asset.bind(this.api.cache), useCache);
    }

    public async account_assets(account: string, useCache: boolean = true): Promise<AssetRow[]> {
        return this.fetch_all_rows(account, "assets", "id", "", "", this.api.cache.asset.bind(this.api.cache), useCache);
    }

    public async preset(id: number, useCache: boolean = true): Promise<PresetRow> {
        return this.fetch_single_row(this.api.contract, "presets", "name", id, this.api.cache.preset.bind(this.api.cache), useCache);
    }

    public async scheme(name: string, useCache: boolean = true): Promise<SchemeRow> {
        return this.fetch_single_row(this.api.contract, "schemes", "name", name, this.api.cache.scheme.bind(this.api.cache), useCache);
    }

    public async collection(name: string, useCache: boolean = true): Promise<CollectionRow> {
        return this.fetch_single_row(this.api.contract, "collections", "name", name, this.api.cache.collection.bind(this.api.cache), useCache);
    }

    public async offer(id: number, useCache: boolean = true): Promise<OfferRow> {
        return this.fetch_single_row(this.api.contract, "offers", "id", id, this.api.cache.offer.bind(this.api.cache), useCache);
    }

    public async account_offers(account: string, useCache: boolean = true): Promise<OfferRow[]> {
        const rows: any[][] = await Promise.all([
            this.fetch_all_rows(account, "offers", "offer_sender", account, account, this.api.cache.offer.bind(this.api.cache), useCache),
            this.fetch_all_rows(account, "offers", "offer_recipient", account, account, this.api.cache.offer.bind(this.api.cache), useCache),
        ]);

        return rows[0].concat(rows[1]);
    }

    public stop() {
        clearInterval(this.interval);

        this.interval = null;
    }

    private dequeue() {
        this.interval = setInterval(async () => {
            if(this.elements.length > 0) {
                this.elements.shift()();
            }
        }, Math.ceil(1000 / this.requestLimit));
    }

    private async fetch_single_row(scope: string, table: string, tableKey: string, match: any, cache: any = null, useCache = true) {
        let data = useCache ? cache(match) : null;

        return new Promise((resolve, reject) => {
            if(data) {
                return resolve(data);
            }

            this.elements.push(async () => {
                data = useCache ? cache(match) : null;

                if(data) {
                    this.elements.shift()();

                    return resolve(data);
                }

                try {
                    const resp = await this.api.get_table_rows({
                        code: this.api.contract, table, scope,
                        table_key: tableKey, lower_bound: match, upper_bound: match,
                    });

                    if(resp.rows.length !== 1) {
                        return reject(new RpcError("row not found '" + match + "'"));
                    }

                    return resolve(cache(match, resp.rows[0]));
                } catch (e) {
                    return reject(e);
                }
            });
        });
    }

    private async fetch_all_rows(
        scope: string, table: string, tableKey: string,
        lowerBound = "", upperBound = "",
        cache: any, useCache: boolean,
    ): Promise<any[]>  {
        return new Promise(async (resolve, reject) => {
            const resp: {more: boolean, rows: any[]} = await this.api.get_table_rows({
                code: this.api.contract, scope, table, table_key: tableKey,
                lower_bound: lowerBound, upper_bound: upperBound,
            });

            this.elements.unshift(async () => {
                try {
                    if(resp.more) {
                        let next = await this.fetch_all_rows(
                            scope, table, tableKey,
                            resp.rows[resp.rows.length - 1][tableKey],
                            upperBound, cache, useCache,
                        );
                        next.shift();

                        next = next.map((element) => {
                            return cache(element[tableKey], element);
                        });

                        resolve(resp.rows.concat(next));
                    } else {
                        resolve(resp.rows);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
}
