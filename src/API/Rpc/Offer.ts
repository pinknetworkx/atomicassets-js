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

        this._data = new Promise(async (resolve) => {
            if(data) {
                resolve(data);
            } else {
                resolve(await this.api.queue.offer(id));
            }
        });

        this._senderAssets = new Promise(async (resolve) => {
            if(senderAssets) {
                resolve(senderAssets);
            } else {
                const row = await this._data;
                const inventory = await this.api.queue.account_assets(await row.sender);

                resolve(inventory.filter((element) => {
                    return row.senderAssets.indexOf(element.id) >= 0;
                }));
            }
        });

        this._receiverAssets = new Promise(async (resolve) => {
            if(receiverAssets) {
                resolve(receiverAssets);
            } else {
                const row = await this._data;
                const inventory = await this.api.queue.account_assets(await row.receiver);

                resolve(inventory.filter((element) => {
                    return row.senderAssets.indexOf(element.id) >= 0;
                }));
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
