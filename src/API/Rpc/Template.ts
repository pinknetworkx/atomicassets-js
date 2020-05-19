import {deserialize} from "../../Serialization";
import {ITemplateRow} from "./Cache";
import RpcApi from "./index";
import RpcSchema from "./Schema";

export default class RpcTemplate {
    public readonly id: string;

    // tslint:disable-next-line:variable-name
    private readonly _data: Promise<ITemplateRow>;

    // tslint:disable-next-line:variable-name
    private readonly _schema: Promise<RpcSchema>;

    public constructor(private readonly api: RpcApi, collection: string, id: string, data?: ITemplateRow, schema?: RpcSchema, cache: boolean = true) {
        this.id = id;

        this._data = new Promise(async (resolve, reject) => {
            if(data) {
                resolve(data);
            } else {
                try {
                    resolve(await api.queue.template(collection, id, cache));
                } catch (e) {
                    reject(e);
                }
            }
        });

        this._schema = new Promise(async (resolve, reject) => {
            if(schema) {
                resolve(schema);
            } else {
                try {
                    const row = await this._data;

                    resolve(new RpcSchema(this.api, collection, row.schema_name, undefined, cache));
                } catch (e) {
                    reject(e);
                }
            }
        });
    }

    public async schema(): Promise<RpcSchema> {
        return await this._schema;
    }

    public async immutableData(): Promise<object> {
        const schema = await this._schema;

        return deserialize((await this._data).immutable_serialized_data, await schema.format());
    }

    public async isTransferable(): Promise<boolean> {
        return (await this._data).transferable;
    }

    public async isBurnable(): Promise<boolean> {
        return (await this._data).burnable;
    }

    public async maxSupply(): Promise<number> {
        return (await this._data).max_supply;
    }

    public async circulation(): Promise<number> {
        return (await this._data).issued_supply;
    }

    public async toObject(): Promise<object> {
        return {
            template_id: this.id,
            schema: await (await this.schema()).toObject(),
            immutableData: await this.immutableData(),
            transferable: await this.isTransferable(),
            burnable: await this.isBurnable(),
            maxSupply: await this.maxSupply(),
            circulation: await this.circulation(),
        };
    }
}
