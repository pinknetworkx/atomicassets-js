import RpcError from "../../Errors/RpcError";
import {IAssetRow, ICollectionRow, IOfferRow, IPresetRow, ISchemeRow} from "./Cache";
import RpcApi from "./index";

export default class RpcQueue {
    private elements: any[] = [];
    private interval: any = null;

    constructor(private readonly api: RpcApi, private readonly requestLimit = 4) { }

    public async asset(owner: string, id: string, useCache: boolean = true): Promise<IAssetRow> {
        return this.fetch_single_row("assets", owner, id, this.api.cache.asset.bind(this.api.cache), useCache);
    }

    public async account_assets(account: string, useCache: boolean = true): Promise<IAssetRow[]> {
        return this.fetch_all_rows("assets", account,"id", "", "", this.api.cache.asset.bind(this.api.cache), useCache);
    }

    public async preset(collection: string, id: string, useCache: boolean = true): Promise<IPresetRow> {
        return this.fetch_single_row("presets", collection, id, this.api.cache.preset.bind(this.api.cache), useCache);
    }

    public async collection_presets(collection: string, useCache: boolean = true): Promise<IPresetRow[]> {
        return this.fetch_all_rows("presets", collection, "preset_id", "", "", this.api.cache.preset.bind(this.api.cache), useCache);
    }

    public async scheme(collection: string, name: string, useCache: boolean = true): Promise<ISchemeRow> {
        return this.fetch_single_row("schemes", collection, name, this.api.cache.scheme.bind(this.api.cache), useCache);
    }

    public async collection_schemes(collection: string, useCache: boolean = true): Promise<ISchemeRow[]> {
        return this.fetch_all_rows("schemes", collection, "scheme_name", "", "", this.api.cache.scheme.bind(this.api.cache), useCache);
    }

    public async collection(name: string, useCache: boolean = true): Promise<ICollectionRow> {
        return this.fetch_single_row("collections", this.api.contract, name, this.api.cache.collection.bind(this.api.cache), useCache);
    }

    public async offer(id: string, useCache: boolean = true): Promise<IOfferRow> {
        return this.fetch_single_row("offers", this.api.contract, id, this.api.cache.offer.bind(this.api.cache), useCache);
    }

    public async account_offers(account: string, useCache: boolean = true): Promise<IOfferRow[]> {
        const rows: any[][] = await Promise.all([
            this.fetch_all_rows(
                "offers", this.api.contract, "offer_sender", account, account,
                this.api.cache.offer.bind(this.api.cache), useCache, 2, "name",
            ),
            this.fetch_all_rows(
                "offers", this.api.contract, "offer_recipient", account, account,
                this.api.cache.offer.bind(this.api.cache), useCache, 3, "name",
            ),
        ]);

        return rows[0].concat(rows[1]);
    }

    private dequeue() {
        if(this.interval) {
            return;
        }

        this.interval = setInterval(async () => {
            if(this.elements.length > 0) {
                this.elements.shift()();
            } else {
                clearInterval(this.interval);
                this.interval = null;
            }
        }, Math.ceil(1000 / this.requestLimit));
    }

    private async fetch_single_row(
        table: string, scope: string, match: any,
        cache: any = null, useCache = true,
        indexPosition = 1, keyType = "",
    ): Promise<any> {
        let data = cache(match, useCache ? undefined : false);

        return new Promise((resolve, reject) => {
            if(data) {
                return resolve(data);
            }

            this.elements.push(async () => {
                data = cache(match, useCache ? undefined : false);

                if(data) {
                    if(this.elements.length > 0) {
                        this.elements.shift()();
                    }

                    return resolve(data);
                }

                try {
                    const resp = await this.api.getTableRows({
                        code: this.api.contract, table, scope,
                        limit: 1, lower_bound: match, upper_bound: match,
                        index_position: indexPosition, key_type: keyType,
                    });

                    if(resp.rows.length !== 1) {
                        return reject(new RpcError("row not found '" + match + "'"));
                    }

                    return resolve(cache(match, resp.rows[0]));
                } catch (e) {
                    return reject(e);
                }
            });

            this.dequeue();
        });
    }

    private async fetch_all_rows(
        table: string, scope: string, tableKey: string,
        lowerBound = "", upperBound = "",
        cache: any, useCache = true,
        indexPosition = 1, keyType = "",
    ): Promise<any[]>  {
        return new Promise(async (resolve, reject) => {
            this.elements.push(async () => {
                const resp: { more: boolean, rows: any[] } = await this.api.getTableRows({
                    code: this.api.contract, scope, table,
                    lower_bound: lowerBound, upper_bound: upperBound, limit: 100,
                    index_position: indexPosition, key_type: keyType,
                });

                if(resp.more && indexPosition === 1) {
                    this.elements.unshift(async () => {
                        try {
                            let next = await this.fetch_all_rows(
                                table, scope, tableKey,
                                resp.rows[resp.rows.length - 1][tableKey],
                                upperBound, cache, useCache,
                            );
                            next.shift();

                            next = next.map((element) => {
                                return cache(element[tableKey], element);
                            });

                            resolve(resp.rows.concat(next));
                        } catch (e) {
                            reject(e);
                        }
                    });

                    this.dequeue();
                } else {
                    resolve(resp.rows);
                }
            });

            this.dequeue();
        });
    }
}
