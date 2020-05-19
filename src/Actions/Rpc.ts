import RpcApi from "../API/Rpc";
import {SchemaFormat} from "../API/Rpc/Cache";
import SerializationError from "../Errors/SerializationError";
import ActionGenerator, {AttributeMap, EosioAuthorizationObject} from "./Generator";

/* tslint:disable:variable-name */

export default class RpcActionGenerator extends ActionGenerator {
    private static toAttributeMap(obj: any, schema: SchemaFormat): AttributeMap {
        const types: {[id: string]: string} = {};
        const result: AttributeMap = [];

        for(const row of schema) {
            types[row.name] = row.type;
        }

        const keys = Object.keys(obj);
        for(const key of keys) {
            if(typeof types[key] !== "undefined") {
                throw new SerializationError("field not defined in schema");
            }

            result.push({key, value: [types[key], obj[key]]});
        }

        return result;
    }

    constructor(public readonly api: RpcApi) {
        super(api.contract);
    }

    public async createcol(
        authorization: EosioAuthorizationObject[], author: string, collection_name: string,
        allow_notify: boolean, authorized_accounts: string[], notify_accounts: string[], market_fee: number, data: object,
    ) {
        const config = await this.api.config();

        return super.createcol(
            authorization, author, collection_name, allow_notify, authorized_accounts, notify_accounts, market_fee,
            RpcActionGenerator.toAttributeMap(data, config.collection_format),
        );
    }

    public async createtempl(
        authorization: EosioAuthorizationObject[], authorized_creator: string,
        collection_name: string, schema_name: string,
        transferable: boolean, burnable: boolean, max_supply: string, immutable_data: object,
    ) {
        const schema = await this.api.getSchema(collection_name, schema_name);

        const immutable_attribute_map = RpcActionGenerator.toAttributeMap(immutable_data, await schema.rawFormat());

        return super.createtempl(
            authorization, authorized_creator, collection_name, schema_name,
            transferable, burnable, max_supply, immutable_attribute_map,
        );
    }

    public async mintasset(
        authorization: EosioAuthorizationObject[], authorized_minter: string,
        collection_name: string, schema_name: string, template_id: string,
        new_owner: string, immutable_data: object, mutable_data: object, tokens_to_back: string[],
    ) {
        const template = await this.api.getTemplate(collection_name, template_id);

        const immutable_attribute_map = RpcActionGenerator.toAttributeMap(immutable_data, await (await template.schema()).rawFormat());
        const mutable_attribute_map = RpcActionGenerator.toAttributeMap(mutable_data, await (await template.schema()).rawFormat());

        return super.mintasset(
            authorization, authorized_minter, collection_name, schema_name, template_id,
            new_owner, immutable_attribute_map, mutable_attribute_map, tokens_to_back,
        );
    }

    public async setassetdata(
        authorization: EosioAuthorizationObject[], authorized_editor: string, owner: string, asset_id: string, mutable_data: object,
    ) {
        const asset = await this.api.getAsset(owner, asset_id);
        const schema = await asset.schema();

        const mutable_attribute_map = RpcActionGenerator.toAttributeMap(mutable_data, await schema.rawFormat());

        return super.setassetdata(authorization, authorized_editor, owner, asset_id, mutable_attribute_map);
    }

    public async setcoldata(authorization: EosioAuthorizationObject[], collection_name: string, data: object) {
        const mdata = RpcActionGenerator.toAttributeMap(data, (await this.api.config()).collection_format);

        return super.setcoldata(authorization, collection_name, mdata);
    }
}
