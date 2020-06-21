import { ObjectSchema } from '../../Schema';
import { deserialize } from '../../Serialization';
import { ICollectionRow } from './Cache';
import RpcApi from './index';

export default class RpcCollection {
    readonly name: string;

    // tslint:disable-next-line:variable-name
    private readonly _data: Promise<ICollectionRow>;

    constructor(private readonly api: RpcApi, name: string, data?: ICollectionRow, cache: boolean = true) {
        this.name = name;

        this._data = new Promise(async (resolve, reject) => {
            if (data) {
                resolve(data);
            } else {
                try {
                    resolve(await api.queue.fetchCollection(name, cache));
                } catch (e) {
                    reject(e);
                }
            }
        });
    }

    async author(): Promise<string> {
        return (await this._data).author;
    }

    async allowNotify(): Promise<boolean> {
        return (await this._data).allow_notify;
    }

    async authorizedAccounts(): Promise<string[]> {
        return (await this._data).authorized_accounts;
    }

    async notifyAccounts(): Promise<string[]> {
        return (await this._data).notify_accounts;
    }

    async marketFee(): Promise<number> {
        return Number((await this._data).market_fee);
    }

    async data(): Promise<any> {
        return deserialize((await this._data).serialized_data, ObjectSchema((await this.api.config()).collection_format));
    }

    async toObject(): Promise<object> {
        return {
            collection_name: this.name,

            author: await this.author(),
            allowNotify: await this.allowNotify(),
            authorizedAccounts: await this.authorizedAccounts(),
            notifyAccounts: await this.notifyAccounts(),
            marketFee: await this.marketFee(),

            data: await this.data()
        };
    }
}
