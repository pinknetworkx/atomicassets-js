import RpcAsset from './Asset';
import { IAssetRow, IOfferRow } from './RpcCache';
import RpcApi from './index';

export default class RpcOffer {
    readonly id: string;

    // tslint:disable-next-line:variable-name
    private readonly _data: Promise<IOfferRow>;
    // tslint:disable-next-line:variable-name
    private readonly _senderAssets: Promise<Array<string | RpcAsset>>;
    // tslint:disable-next-line:variable-name
    private readonly _recipientAssets: Promise<Array<string | RpcAsset>>;

    constructor(private readonly api: RpcApi, id: string, data?: IOfferRow, senderAssets?: RpcAsset[], receiverAssets?: RpcAsset[], cache: boolean = true) {
        this.id = id;

        this._data = new Promise(async (resolve, reject) => {
            if (data) {
                resolve(data);
            } else {
                try {
                    resolve(await this.api.queue.fetchOffer(id, cache));
                } catch (e) {
                    reject(e);
                }
            }
        });

        this._senderAssets = new Promise(async (resolve, reject) => {
            if (senderAssets) {
                resolve(senderAssets);
            } else {
                try {
                    const row: IOfferRow = await this._data;
                    const inventory: IAssetRow[] = await this.api.queue.fetchAccountAssets(row.sender);

                    return resolve(row.sender_asset_ids.map((assetID) => {
                        const asset = inventory.find((assetRow) => assetRow.asset_id === assetID);

                        return asset ? new RpcAsset(this.api, row.sender, assetID, asset, undefined, undefined, undefined, cache) : assetID;
                    }));
                } catch (e) {
                    return reject(e);
                }
            }
        });

        this._recipientAssets = new Promise(async (resolve, reject) => {
            if (receiverAssets) {
                resolve(receiverAssets);
            } else {
                try {
                    const row: IOfferRow = await this._data;
                    const inventory: IAssetRow[] = await this.api.queue.fetchAccountAssets(row.recipient);

                    return resolve(row.recipient_asset_ids.map((assetID) => {
                        const asset = inventory.find((assetRow) => assetRow.asset_id === assetID);

                        return asset ? new RpcAsset(this.api, row.recipient, assetID, asset, undefined, undefined, undefined, cache) : assetID;
                    }));
                } catch (e) {
                    return reject(e);
                }
            }
        });
    }

    async sender(): Promise<string> {
        return (await this._data).sender;
    }

    async recipient(): Promise<string> {
        return (await this._data).recipient;
    }

    async senderAssets(): Promise<Array<RpcAsset | string>> {
        return await this._senderAssets;
    }

    async recipientAssets(): Promise<Array<RpcAsset | string>> {
        return await this._recipientAssets;
    }

    async memo(): Promise<string> {
        return (await this._data).memo;
    }

    async toObject(): Promise<object> {
        return {
            offer_id: this.id,
            sender: {
                account: await this.sender(),
                assets: await Promise.all((await this.senderAssets()).map(async (asset) => typeof asset === 'string' ? asset : await asset.toObject()))
            },
            recipient: {
                account: await this.recipient(),
                assets: await Promise.all((await this.recipientAssets()).map(async (asset) => typeof asset === 'string' ? asset : await asset.toObject()))
            },
            memo: await this.memo()
        };
    }
}
