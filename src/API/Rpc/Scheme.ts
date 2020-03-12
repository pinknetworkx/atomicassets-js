import {ISchema, ObjectSchema} from "../../Schema";
import {ISchemeRow} from "./Cache";
import RpcApi from "./index";

export default class RpcScheme {
    public readonly name: string;

    // tslint:disable-next-line:variable-name
    private readonly _data: Promise<ISchemeRow>;

    public constructor(private readonly api: RpcApi, collection: string, name: string, data?: ISchemeRow, cache: boolean = true) {
        this.name = name;

        this._data = new Promise(async (resolve, reject) => {
            if(data) {
                resolve(data);
            } else {
                try {
                    resolve(await api.queue.scheme(collection, name, cache));
                } catch (e) {
                    reject(e);
                }
            }
        });
    }

    public async format(): Promise<ISchema> {
        return ObjectSchema((await this._data).format);
    }

    public async rawFormat() {
        return (await this._data).format;
    }

    public async toObject() {
        return {
            scheme_name: this.name,
            format: (await this._data).format,
        };
    }
}
