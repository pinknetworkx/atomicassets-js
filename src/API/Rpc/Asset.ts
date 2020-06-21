import { deserialize } from '../../Serialization';
import { IAssetRow } from './Cache';
import RpcCollection from './Collection';
import RpcApi from './index';
import RpcSchema from './Schema';
import RpcTemplate from './Template';

export default class RpcAsset {
    readonly owner: string;
    readonly id: string;

    // tslint:disable-next-line:variable-name
    private readonly _data: Promise<IAssetRow>;
    // tslint:disable-next-line:variable-name
    private readonly _template: Promise<RpcTemplate | null>;
    // tslint:disable-next-line:variable-name
    private readonly _collection: Promise<RpcCollection>;
    // tslint:disable-next-line:variable-name
    private readonly _schema: Promise<RpcSchema>;

    constructor(
        private readonly api: RpcApi,
        owner: string,
        id: string,
        data?: IAssetRow,
        collection?: RpcCollection,
        schema?: RpcSchema,
        template?: RpcTemplate,
        cache: boolean = true
    ) {
        this.owner = owner;
        this.id = id;

        this._data = new Promise(async (resolve, reject) => {
            if (data) {
                resolve(data);
            } else {
                try {
                    resolve(await api.queue.fetchAsset(owner, id, cache));
                } catch (e) {
                    reject(e);
                }
            }
        });

        this._template = new Promise(async (resolve, reject) => {
            if (template) {
                resolve(template);
            } else {
                try {
                    const row = await this._data;

                    if (Number(row.template_id) < 0) {
                        return resolve(null);
                    }

                    resolve(new RpcTemplate(api, row.collection_name, row.template_id, undefined, undefined, cache));
                } catch (e) {
                    reject(e);
                }
            }
        });

        this._collection = new Promise(async (resolve, reject) => {
            if (collection) {
                resolve(collection);
            } else {
                try {
                    const row = await this._data;

                    resolve(new RpcCollection(api, row.collection_name, undefined, cache));
                } catch (e) {
                    reject(e);
                }
            }
        });

        this._schema = new Promise(async (resolve, reject) => {
            if (schema) {
                resolve(schema);
            } else {
                try {
                    const row = await this._data;

                    resolve(new RpcSchema(api, row.collection_name, row.schema_name, undefined, cache));
                } catch (e) {
                    reject(e);
                }
            }
        });
    }

    async template(): Promise<RpcTemplate | null> {
        return await this._template;
    }

    async collection(): Promise<RpcCollection> {
        return await this._collection;
    }

    async schema(): Promise<RpcSchema> {
        return await this._schema;
    }

    async backedTokens(): Promise<string[]> {
        return (await this._data).backed_tokens;
    }

    async immutableData(): Promise<object> {
        const schema = await this.schema();
        const row = await this._data;

        return deserialize(row.immutable_serialized_data, await schema.format());
    }

    async mutableData(): Promise<object> {
        const schema = await this.schema();
        const row = await this._data;

        return deserialize(row.mutable_serialized_data, await schema.format());
    }

    async data(): Promise<object> {
        const mutableData = await this.mutableData();
        const immutableData = await this.immutableData();

        const template = await this.template();
        const templateData = template ? await template.immutableData() : {};

        return Object.assign({}, mutableData, immutableData, templateData);
    }

    async toObject(): Promise<object> {
        const template = await this.template();
        const collection = await this.collection();
        const schema = await this.schema();

        return {
            asset_id: this.id,

            collection: await collection.toObject(),
            schema: await schema.toObject(),
            template: template ? await template.toObject() : null,

            backedTokens: await this.backedTokens(),
            immutableData: await this.immutableData(),
            mutableData: await this.mutableData(),
            data: await this.data()
        };
    }
}
