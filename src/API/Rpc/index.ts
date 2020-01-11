import RpcError from "../../Errors/RpcError";
import {ObjectSchema} from "../../Schema";
import RpcAsset from "./Asset";
import RpcCache, {ConfigRow} from "./Cache";
import RpcOffer from "./Offer";
import RpcPreset from "./Preset";
import RpcQueue from "./Queue";
import RpcScheme from "./Scheme";

type Fetch = (input?: Request | string, init?: RequestInit) => Promise<Response>;
type ApiArgs = {fetch?: Fetch, rateLimit?: number };

export default class RpcApi {
    public readonly queue: RpcQueue;
    public readonly cache: RpcCache;

    public readonly endpoint: string;
    public readonly contract: string;

    private readonly fetchBuiltin: Fetch;

    // tslint:disable-next-line:variable-name
    private readonly _config: Promise<ConfigRow>;

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

        this._config = new Promise((async (resolve, reject) => {
            try {
                const resp = await this.get_table_rows({
                    code: this.contract, scope: this.contract, table: "config",
                });

                if(resp.rows.length !== 1) {
                    return reject("invalid config");
                }

                const data = resp.rows[0];
                data.collection_format = ObjectSchema(data.collection_format.map((element: string) => JSON.parse(element)));

                return resolve(data);
            } catch (e) {
                reject(e);
            }
        }));
    }

    public async config() {
        return await this._config;
    }

    public async get_asset(owner: string, id: string): Promise<RpcAsset> {
        return new RpcAsset(this, owner, id);
    }

    public async get_preset(id: number): Promise<RpcPreset> {
        return new RpcPreset(this, id);
    }

    public async get_scheme(name: string): Promise<RpcScheme> {
        return new RpcScheme(this, name);
    }

    public async get_offer(id: number): Promise<RpcOffer> {
        return new RpcOffer(this, id);
    }

    public async get_account_offers(account: string): Promise<RpcOffer[]> {
        return await this.queue.account_offers(account);
    }

    public async get_account_assets(account: string): Promise<RpcAsset[]> {
        return await this.queue.account_assets(account);
    }

    public async get_table_rows({
        code, scope, table, table_key = "", lower_bound = "", upper_bound = "",
        index_position = 1, key_type = "",
    }: any): Promise<any> {
        return await this.fetch_rpc("/v1/chain/get_table_rows", {
            code, scope, table, table_key,
            lower_bound, upper_bound, index_position,
            key_type, limit: 101, reverse: false, show_payer: false, json: true,
        });
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
