import RpcError from "../../Errors/RpcError";
import RpcAsset from "./Asset";
import RpcCache from "./Cache";
import RpcQueue from "./Queue";
import RpcPreset from "./Preset";
import RpcScheme from "./Scheme";
import RpcOffer from "./Offer";

type Fetch = (input?: Request | string, init?: RequestInit) => Promise<Response>;
type ApiArgs = {fetch?: Fetch, rateLimit?: number };

export default class RpcApi {
    public readonly queue: RpcQueue;
    public readonly cache: RpcCache;

    private readonly endpoint: string;
    private readonly contract: string;
    private readonly fetchBuiltin: Fetch;

    constructor(endpoint: string, contract: string, args: ApiArgs = {rateLimit: 4}) {
        this.endpoint = endpoint;
        this.contract = contract;

        if (args.fetch) {
            this.fetchBuiltin = args.fetch;
        } else {
            this.fetchBuiltin = (global as any).fetch;
        }

        this.queue = new RpcQueue(this, args.rateLimit);
        this.cache = new RpcCache();
    }

    public async get_asset(owner: string, id: number): Promise<RpcAsset> {
        const rows = await this.get_table_rows({code: this.contract, scope: owner, table_key: "id", lower_bound: id, upper_bound: id});

        if(rows.length !== 1) {
            return null;
        }

        const asset = this.cache.asset(id, rows[0]);

        return new RpcAsset(asset.id, asset);
    }

    public async get_preset(id: number): Promise<RpcPreset> {

    }

    public async get_scheme(id: number): Promise<RpcScheme> {

    }

    public async get_offer(id: number): Promise<RpcOffer> {

    }

    public async get_account_assets(account: string): Promise<RpcAsset[]> {

    }

    public async get_table_rows({
        code, scope, table, table_key, lower_bound = "", upper_bound = "",
        index_position = 1, key_type = "",
    }: any): Promise<any> {
        let rows: any[] = [];
        let resp = {more: true, rows: []};

        while(resp.more) {
            resp = await this.fetch_rpc("/v1/chain/get_table_rows", {
                code, scope, table, table_key,
                lower_bound: rows.length === 0 ? lower_bound : rows[rows.length - 1][table_key],
                upper_bound, index_position,
                key_type, limit: 101, reverse: false, show_payer: false,
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

    public async fetch_rpc(path: string, body: any) {
        let response;
        let json;

        try {
            response = await this.fetchBuiltin(this.endpoint + path, {
                body: JSON.stringify(body),
                method: "POST",
            });

            json = await response.json();
        } catch (e) {
            e.isFetchError = true;
            throw e;
        }

        if ((json.processed && json.processed.except) || !response.ok) {
            throw new RpcError(json);
        }

        return json;
    }
}
