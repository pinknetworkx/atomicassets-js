import ExplorerApi from '../API/Explorer';
import { IConfig } from '../API/Explorer/Objects';
import { ActionGenerator, EosioActionObject, EosioAuthorizationObject, toAttributeMap } from './Generator';

/* tslint:disable:variable-name */

export default class ExplorerActionGenerator extends ActionGenerator {
    private config: Promise<IConfig>;

    constructor(contract: string, readonly api: ExplorerApi) {
        super(contract);

        this.config = api.getConfig();
    }

    async createcol(
        authorization: EosioAuthorizationObject[], author: string, collection_name: string,
        allow_notify: boolean, authorized_accounts: string[], notify_accounts: string[], market_fee: number, data: object
    ): Promise<EosioActionObject[]> {
        return super.createcol(
            authorization, author, collection_name, allow_notify, authorized_accounts, notify_accounts, market_fee,
            toAttributeMap(data, (await this.config).collection_format)
        );
    }

    async createtempl(
        authorization: EosioAuthorizationObject[], authorized_creator: string,
        collection_name: string, schema_name: string,
        transferable: boolean, burnable: boolean, max_supply: string, immutable_data: object
    ): Promise<EosioActionObject[]> {
        const schema = await this.api.getSchema(collection_name, schema_name);

        const immutable_attribute_map = toAttributeMap(immutable_data, schema.format);

        return super.createtempl(
            authorization, authorized_creator, collection_name, schema_name,
            transferable, burnable, max_supply, immutable_attribute_map
        );
    }

    async mintasset(
        authorization: EosioAuthorizationObject[], authorized_minter: string,
        collection_name: string, schema_name: string, template_id: string,
        new_owner: string, immutable_data: object, mutable_data: object, tokens_to_back: string[]
    ): Promise<EosioActionObject[]> {
        const schema = await this.api.getSchema(collection_name, schema_name);

        const immutable_attribute_map = toAttributeMap(immutable_data, schema.format);
        const mutable_attribute_map = toAttributeMap(mutable_data, schema.format);

        return super.mintasset(
            authorization, authorized_minter, collection_name, schema_name, template_id,
            new_owner, immutable_attribute_map, mutable_attribute_map, tokens_to_back
        );
    }

    async setassetdata(
        authorization: EosioAuthorizationObject[], authorized_editor: string, owner: string, asset_id: string, mutable_data: object
    ): Promise<EosioActionObject[]> {
        const asset = await this.api.getAsset(asset_id);

        const mutable_attribute_map = toAttributeMap(mutable_data, asset.schema.format);

        return super.setassetdata(authorization, authorized_editor, owner, asset_id, mutable_attribute_map);
    }

    async setcoldata(authorization: EosioAuthorizationObject[], collection_name: string, data: object): Promise<EosioActionObject[]> {
        const mdata = toAttributeMap(data, (await this.config).collection_format);

        return super.setcoldata(authorization, collection_name, mdata);
    }
}
