import {ObjectSchema} from "../../Schema";
import {deserialize} from "../../Serialization";
import {CollectionRow} from "./Cache";
import RpcApi from "./index";

export default class RpcCollection {
    public readonly name: string;

    // tslint:disable-next-line:variable-name
    private readonly _data: Promise<CollectionRow>;

    public constructor(private readonly api: RpcApi, name: string, data?: CollectionRow, cache: boolean = true) {
        this.name = name;

        this._data = new Promise(async (resolve, reject) => {
            if(data) {
                resolve(data);
            } else {
                try {
                    resolve(await api.queue.collection(name, cache));
                } catch (e) {
                    reject(e);
                }
            }
        });
    }

    public async author(): Promise<string> {
        return (await this._data).author;
    }

    public async authorizedAccounts(): Promise<string[]> {
        return (await this._data).authorized_accounts;
    }

    public async notifyAccounts(): Promise<string[]> {
        return (await this._data).notify_accounts;
    }

    public async data(): Promise<any> {
        return deserialize((await this._data).serialized_data, ObjectSchema((await this.api.config()).collection_format));
    }

    public async toObject(): Promise<object> {
        return {
            author: await this.author(),
            authorizedAccounts: await this.authorizedAccounts(),
            notifyAccounts: await this.notifyAccounts(),
            data: await this.data(),
        };
    }
}
