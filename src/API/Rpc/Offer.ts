import RpcAsset from "./Asset";
import {AssetRow, OfferRow} from "./Cache";
import RpcApi from "./index";

export default class RpcOffer {
    public readonly id: number;

    // tslint:disable-next-line:variable-name
    private readonly _data: Promise<OfferRow>;
    // tslint:disable-next-line:variable-name
    private readonly _senderAssets: Promise<RpcAsset[]>;
    // tslint:disable-next-line:variable-name
    private readonly _recipientAssets: Promise<RpcAsset[]>;

    constructor(private readonly api: RpcApi, id: number, data?: OfferRow, senderAssets?: RpcAsset[], receiverAssets?: RpcAsset[], cache: boolean = true) {
        this.id = id;

        this._data = new Promise(async (resolve, reject) => {
            if(data) {
                resolve(data);
            } else {
                try {
                    resolve(await this.api.queue.offer(id, cache));
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
                    const inventory: AssetRow[] = await this.api.queue.account_assets(await row.offer_sender, cache);

                    let offerAssets = inventory.filter((element) => {
                        return row.sender_asset_ids.indexOf(element.id) >= 0;
                    });

                    if(offerAssets.length !== row.sender_asset_ids.length) {
                        return reject(new Error("user does not own all items anymore"));
                    }

                    offerAssets = offerAssets.map((asset) => new RpcAsset(this.api, asset.owner, asset.id, asset));

                    return resolve(offerAssets);
                } catch (e) {
                    return reject(e);
                }
            }
        });

        this._recipientAssets = new Promise(async (resolve, reject) => {
            if(receiverAssets) {
                resolve(receiverAssets);
            } else {
                try {
                    const row: OfferRow = await this._data;
                    const inventory: AssetRow[] = await this.api.queue.account_assets(await row.offer_recipient, cache);

                    let offerAssets = inventory.filter((element) => {
                        return row.recipient_asset_ids.indexOf(element.id) >= 0;
                    });

                    if(offerAssets.length !== row.recipient_asset_ids.length) {
                        return reject(new Error("user does not own all items anymore"));
                    }

                    offerAssets = offerAssets.map((asset) => new RpcAsset(this.api, asset.owner, asset.id, asset));

                    return resolve(offerAssets);
                } catch (e) {
                    return reject(e);
                }
            }
        });
    }

    public async sender(): Promise<string> {
        return (await this._data).offer_sender;
    }

    public async recipient(): Promise<string> {
        return (await this._data).offer_recipient;
    }

    public async senderAssets(): Promise<RpcAsset[]> {
        return await this._senderAssets;
    }

    public async recipientAssets(): Promise<RpcAsset[]> {
        return await this._recipientAssets;
    }

    public async memo(): Promise<string> {
        return (await this._data).memo;
    }

    public async toObject(): Promise<object> {
        return {
            id: this.id,
            sender: {
                account: await this.sender(),
                assets: await Promise.all((await this.senderAssets()).map(async (asset) => await asset.toObject())),
            },
            recipient: {
                account: await this.recipient(),
                assets: await Promise.all((await this.recipientAssets()).map(async (asset) => await asset.toObject())),
            },
            memo: await this.memo(),
        };
    }
}
