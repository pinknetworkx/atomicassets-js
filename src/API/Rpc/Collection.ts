import {CollectionRow} from "./Cache";
import RpcApi from "./index";

export default class RpcCollection {
    public readonly name: string;

    // tslint:disable-next-line:variable-name
    private readonly _data: Promise<CollectionRow>;

    public constructor(private readonly api: RpcApi, name: string, data?: CollectionRow) {
        this.name = name;

        this._data = new Promise(async (resolve) => {
            if(data) {
                resolve(data);
            } else {
                resolve(await api.queue.collection(name));
            }
        });
    }

    public async owner(): Promise<string> {
        return (await this._data).owner;
    }

    public async notifiers(): Promise<string[]> {
        return (await this._data).notifiers;
    }

    public async issuers(): Promise<string[]> {
        return (await this._data).issuers;
    }

    public async toObject() {
        return {
            owner: await this.owner(),
            notifiers: await this.notifiers(),
            issuers: await this.issuers(),
        };
    }
}
