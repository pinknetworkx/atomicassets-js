import { SchemaFormat } from '../API/Rpc/RpcCache';
import SerializationError from '../Errors/SerializationError';

export type EosioAuthorizationObject = { actor: string, permission: string };
export type EosioActionObject = {
    account: string,
    name: string,
    authorization: EosioAuthorizationObject[],
    data: any
};
export type AttributeMap = Array<{ key: string, value: [string, any] }>;
export type Format = { name: string, type: string };

/* tslint:disable:variable-name */

export class ActionGenerator {
    constructor(readonly contract: string) {
    }

    async acceptoffer(authorization: EosioAuthorizationObject[], offer_id: string): Promise<EosioActionObject[]> {
        return this._pack(authorization, 'acceptoffer', {offer_id});
    }

    async addcolauth(authorization: EosioAuthorizationObject[], collection_name: string, account_to_add: string): Promise<EosioActionObject[]> {
        return this._pack(authorization, 'addcolauth', {collection_name, account_to_add});
    }

    async addconftoken(authorization: EosioAuthorizationObject[], token_contract: string, token_symbol: string): Promise<EosioActionObject[]> {
        return this._pack(authorization, 'addconftoken', {token_contract, token_symbol});
    }

    async addnotifyacc(authorization: EosioAuthorizationObject[], collection_name: string, account_to_add: string): Promise<EosioActionObject[]> {
        return this._pack(authorization, 'addnotifyacc', {collection_name, account_to_add});
    }

    async announcedepo(authorization: EosioAuthorizationObject[], owner: string, symbol_to_announce: string): Promise<EosioActionObject[]> {
        return this._pack(authorization, 'announcedepo', {owner, symbol_to_announce});
    }

    async backasset(
        authorization: EosioAuthorizationObject[], payer: string, asset_owner: string, asset_id: string, token_to_back: string
    ): Promise<EosioActionObject[]> {
        return this._pack(authorization, 'backasset', {payer, asset_owner, asset_id, token_to_back});
    }

    async burnasset(authorization: EosioAuthorizationObject[], asset_owner: string, asset_id: string): Promise<EosioActionObject[]> {
        return this._pack(authorization, 'burnasset', {asset_owner, asset_id});
    }

    async canceloffer(authorization: EosioAuthorizationObject[], offer_id: string): Promise<EosioActionObject[]> {
        return this._pack(authorization, 'canceloffer', {offer_id});
    }

    async createcol(
        authorization: EosioAuthorizationObject[], author: string, collection_name: string, allow_notify: boolean,
        authorized_accounts: string[], notify_accounts: string[], market_fee: number, data: AttributeMap
    ): Promise<EosioActionObject[]> {
        return this._pack(authorization, 'createcol', {
            author,
            collection_name,
            allow_notify,
            authorized_accounts,
            notify_accounts,
            market_fee,
            data
        });
    }

    async createoffer(
        authorization: EosioAuthorizationObject[], sender: string, recipient: string,
        sender_asset_ids: string[], recipient_asset_ids: string[], memo: string
    ): Promise<EosioActionObject[]> {
        return this._pack(authorization, 'createoffer', {sender, recipient, sender_asset_ids, recipient_asset_ids, memo});
    }

    async createtempl(
        authorization: EosioAuthorizationObject[], authorized_creator: string, collection_name: string, schema_name: string,
        transferable: boolean, burnable: boolean, max_supply: string, immutable_data: AttributeMap
    ): Promise<EosioActionObject[]> {
        return this._pack(authorization, 'createtempl', {
            authorized_creator, collection_name, schema_name, transferable, burnable, max_supply, immutable_data
        });
    }

    async createschema(
        authorization: EosioAuthorizationObject[], authorized_creator: string,
        collection_name: string, schema_name: string, schema_format: Format[]
    ): Promise<EosioActionObject[]> {
        return this._pack(authorization, 'createschema', {authorized_creator, collection_name, schema_name, schema_format});
    }

    async declineoffer(authorization: EosioAuthorizationObject[], offer_id: string): Promise<EosioActionObject[]> {
        return this._pack(authorization, 'declineoffer', {offer_id});
    }

    async extendschema(
        authorization: EosioAuthorizationObject[], authorized_editor: string,
        collection_name: string, schema_name: string, schema_format_extension: Format[]
    ): Promise<EosioActionObject[]> {
        return this._pack(authorization, 'extendschema', {authorized_editor, collection_name, schema_name, schema_format_extension});
    }

    async forbidnotify(authorization: EosioAuthorizationObject[], collection_name: string): Promise<EosioActionObject[]> {
        return this._pack(authorization, 'forbidnotify', {collection_name});
    }

    async locktemplate(
        authorization: EosioAuthorizationObject[], authorized_editor: string, collection_name: string, template_id: number
    ): Promise<EosioActionObject[]> {
        return this._pack(authorization, 'locktemplate', {authorized_editor, collection_name, template_id});
    }

    async mintasset(
        authorization: EosioAuthorizationObject[], authorized_minter: string, collection_name: string, schema_name: string, template_id: string,
        new_asset_owner: string, immutable_data: AttributeMap, mutable_data: AttributeMap, tokens_to_back: string[]
    ): Promise<EosioActionObject[]> {
        return this._pack(authorization, 'mintasset', {
            authorized_minter, collection_name, schema_name, template_id, new_asset_owner, immutable_data, mutable_data, tokens_to_back
        });
    }

    async payofferram(authorization: EosioAuthorizationObject[], payer: string, offer_id: string): Promise<EosioActionObject[]> {
        return this._pack(authorization, 'payofferram', {payer, offer_id});
    }

    async remcolauth(authorization: EosioAuthorizationObject[], collection_name: string, account_to_remove: string): Promise<EosioActionObject[]> {
        return this._pack(authorization, 'remcolauth', {collection_name, account_to_remove});
    }

    async remnotifyacc(authorization: EosioAuthorizationObject[], collection_name: string, account_to_remove: string): Promise<EosioActionObject[]> {
        return this._pack(authorization, 'remnotifyacc', {collection_name, account_to_remove});
    }

    async setassetdata(
        authorization: EosioAuthorizationObject[], authorized_editor: string,
        asset_owner: string, asset_id: string, new_mutable_data: AttributeMap
    ): Promise<EosioActionObject[]> {
        return this._pack(authorization, 'setassetdata', {authorized_editor, asset_owner, asset_id, new_mutable_data});
    }

    async setcoldata(authorization: EosioAuthorizationObject[], collection_name: string, data: AttributeMap): Promise<EosioActionObject[]> {
        return this._pack(authorization, 'setcoldata', {collection_name, data});
    }

    async setmarketfee(authorization: EosioAuthorizationObject[], collection_name: string, market_fee: number): Promise<EosioActionObject[]> {
        return this._pack(authorization, 'setmarketfee', {collection_name, market_fee});
    }

    async transfer(
        authorization: EosioAuthorizationObject[], account_from: string, account_to: string, asset_ids: string[], memo: string
    ): Promise<EosioActionObject[]> {
        return this._pack(authorization, 'transfer', {from: account_from, to: account_to, asset_ids, memo});
    }

    async withdraw(authorization: EosioAuthorizationObject[], owner: string, token_to_withdraw: string): Promise<EosioActionObject[]> {
        return this._pack(authorization, 'withdraw', {owner, token_to_withdraw});
    }

    protected _pack(authorization: EosioAuthorizationObject[], name: string, data: any): EosioActionObject[] {
        return [{account: this.contract, name, authorization, data}];
    }
}

export function toAttributeMap(obj: any, schema: SchemaFormat): AttributeMap {
    const translation: {[key: string]: string} = {
        image: 'string',
        ipfs: 'string',
        bool: 'uint8',
        double: 'float64'
    };

    const types: { [id: string]: string } = {};
    const result: AttributeMap = [];

    for (const row of schema) {
        types[row.name] = row.type;
    }

    const keys = Object.keys(obj);
    for (const key of keys) {
        if (typeof types[key] === 'undefined') {
            throw new SerializationError('field not defined in schema');
        }

        const type = types[key];
        let value = obj[key];

        if (type === 'bool') {
            value = value ? 1 : 0;
        }

        result.push({key, value: [translation[type] ?? type, value]});
    }

    return result;
}
