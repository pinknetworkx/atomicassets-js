import {ISchema, ObjectSchema} from "../../Schema";
import {SchemeRow} from "./Cache";
import RpcApi from "./index";

export default class RpcScheme {
    public readonly name: string;

    // tslint:disable-next-line:variable-name
    private readonly _data: Promise<SchemeRow>;

    public constructor(private readonly api: RpcApi, name: string, data?: SchemeRow) {
        this.name = name;

        this._data = new Promise(async (resolve, reject) => {
            if(data) {
                resolve(data);
            } else {
                try {
                    resolve(await api.queue.scheme(name));
                } catch (e) {
                    reject(e);
                }
            }
        });
    }

    public async author(): Promise<string> {
        return (await this._data).author;
    }

    public async ischema(): Promise<ISchema> {
        return ObjectSchema((await this._data).ischema);
    }

    public async mschema(): Promise<ISchema> {
        return ObjectSchema((await this._data).mschema);
    }

    public async toObject() {
        return {
            author: await this.author(),
            ischema: (await this._data).ischema,
            mschema: (await this._data).mschema,
        };
    }
}
