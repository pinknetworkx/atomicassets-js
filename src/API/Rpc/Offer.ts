import {AssetRow, OfferRow} from "./Cache";
import RpcApi from "./index";

export default class RpcOffer {
    public readonly id: number;

    // tslint:disable-next-line:variable-name
    private readonly _data: Promise<OfferRow>;
    // tslint:disable-next-line:variable-name
    private readonly _senderAssets: Promise<AssetRow[]>;
    // tslint:disable-next-line:variable-name
    private readonly _receiverAssets: Promise<AssetRow[]>;

    constructor(private readonly api: RpcApi, id: number, data?: OfferRow, senderAssets?: AssetRow[], receiverAssets?: AssetRow[]) {
        this.id = id;

        this._data = new Promise(async (resolve, reject) => {
            if(data) {
                resolve(data);
            } else {
                try {
                    resolve(await this.api.queue.offer(id));
                } catch (e) {
                    reject(e);
                }
            }
        });

        this._senderAssets = new Promise(async (resolve, reject) => {
            if(senderAssets) {
                resolve(senderAssets);
            } else {
                try {
                    const row: OfferRow = await this._data;
                    const inventory: AssetRow[] = await this.api.queue.account_assets(await row.sender);

                    resolve(inventory.filter((element) => {
                        return row.senderAssets.indexOf(element.id) >= 0;
                    }));
                } catch (e) {
                    return reject(e);
                }
            }
        });

        this._receiverAssets = new Promise(async (resolve, reject) => {
            if(receiverAssets) {
                resolve(receiverAssets);
            } else {
                try {
                    const row: OfferRow = await this._data;
                    const inventory: AssetRow[] = await this.api.queue.account_assets(await row.receiver);

                    resolve(inventory.filter((element) => {
                        return row.receiverAssets.indexOf(element.id) >= 0;
                    }));
                } catch (e) {
                    return reject(e);
                }
            }
        });
    }

    public async sender() {
        return (await this._data).sender;
    }

    public async receiver() {
        return (await this._data).sender;
    }

    public async senderAssets() {
        return await this._senderAssets;
    }

    public async receiverAssets() {
        return await this._receiverAssets;
    }

    public async createdAt() {
        return (await this._data).created;
    }

    public async toObject(): Promise<object> {
        return {
            id: this.id,
            sender: {
                account: await this.sender(),
                assets: await this.senderAssets(),
            },
            receiver: {
                account: await this.receiver(),
                assets: await this.receiverAssets(),
            },
            created: await this.createdAt(),
        };
    }
}
