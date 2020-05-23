import { ISchema, ObjectSchema, SchemaObject } from '../../Schema';
import { ISchemaRow } from './Cache';
import RpcCollection from './Collection';
import RpcApi from './index';

export default class RpcSchema {
    readonly name: string;

    // tslint:disable-next-line:variable-name
    private readonly _data: Promise<ISchemaRow>;
    // tslint:disable-next-line:variable-name
    private readonly _collection: Promise<RpcCollection>;

    constructor(private readonly api: RpcApi, collection: string, name: string, data?: ISchemaRow, cache: boolean = true) {
        this.name = name;

        this._data = new Promise(async (resolve, reject) => {
            if (data) {
                resolve(data);
            } else {
                try {
                    resolve(await api.queue.schema(collection, name, cache));
                } catch (e) {
                    reject(e);
                }
            }
        });

        this._collection = new Promise(async (resolve, reject) => {
            try {
                resolve(new RpcCollection(api, collection, undefined, cache));
            } catch (e) {
                reject(e);
            }
        });
    }

    async collection(): Promise<RpcCollection> {
        return await this._collection;
    }

    async format(): Promise<ISchema> {
        return ObjectSchema((await this._data).format);
    }

    async rawFormat(): Promise<SchemaObject[]> {
        return (await this._data).format;
    }

    async toObject(): Promise<object> {
        return {
            schema_name: this.name,
            collection: await (await this._collection).toObject(),
            format: (await this._data).format
        };
    }
}
