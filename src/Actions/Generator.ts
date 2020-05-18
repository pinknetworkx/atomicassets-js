export type EosioAuthorizationObject = {actor: string, permission: string};
export type EosioActionObject = {
    account: string,
    name: string,
    authorization: EosioAuthorizationObject[],
    data: any,
};
export type AttributeMap = Array<{key: string, value: [string, any]}>;
export type Format = {name: string, type: string};

/* tslint:disable:variable-name */

export default class ActionGenerator {
    constructor(public readonly contract: string) { }

    public async acceptoffer(authorization: EosioAuthorizationObject[], offer_id: string) {
        return this._pack(authorization, "acceptoffer", {offer_id});
    }

    public async addcolauth(authorization: EosioAuthorizationObject[], collection_name: string, account_to_add: string) {
        return this._pack(authorization, "addcolauth", {collection_name, account_to_add});
    }

    public async addconftoken(authorization: EosioAuthorizationObject[], token_contract: string, token_symbol: string) {
        return this._pack(authorization, "addconftoken", {token_contract, token_symbol});
    }

    public async addnotifyacc(authorization: EosioAuthorizationObject[], collection_name: string, account_to_add: string) {
        return this._pack(authorization, "addnotifyacc", {collection_name, account_to_add});
    }

    public async announcedepo(authorization: EosioAuthorizationObject[], owner: string, symbol_to_announce: string) {
        return this._pack(authorization, "announcedepo", {owner, symbol_to_announce});
    }

    public async backasset(
        authorization: EosioAuthorizationObject[], payer: string, asset_owner: string, asset_id: string, token_to_back: string,
    ) {
        return this._pack(authorization, "backasset", {payer, asset_owner, asset_id, token_to_back});
    }

    public async burnasset(authorization: EosioAuthorizationObject[], asset_owner: string, asset_id: string) {
        return this._pack(authorization, "burnasset", {asset_owner, asset_id});
    }

    public async canceloffer(authorization: EosioAuthorizationObject[], offer_id: string) {
        return this._pack(authorization, "canceloffer", {offer_id});
    }

    public async createcol(
        authorization: EosioAuthorizationObject[], author: string, collection_name: string, allow_notify: boolean,
        authorized_accounts: string[], notify_accounts: string[], market_fee: number, data: AttributeMap,
    ) {
        return this._pack(authorization, "createcol", {author, collection_name, allow_notify, authorized_accounts, notify_accounts, market_fee, data});
    }

    public async createoffer(
        authorization: EosioAuthorizationObject[], sender: string, recipient: string,
        sender_asset_ids: string[], recipient_asset_ids: string[], memo: string,
    ) {
        return this._pack(authorization, "createoffer", {sender, recipient, sender_asset_ids, recipient_asset_ids, memo});
    }

    public async createpreset(
        authorization: EosioAuthorizationObject[], authorized_creator: string, collection_name: string, scheme_name: string,
        transferable: boolean, burnable: boolean, max_supply: string, immutable_data: AttributeMap,
    ) {
        return this._pack(authorization, "createpreset", {
            authorized_creator, collection_name, scheme_name, transferable, burnable, max_supply, immutable_data,
        });
    }

    public async createscheme(
        authorization: EosioAuthorizationObject[], authorized_creator: string,
        collection_name: string, scheme_name: string, scheme_format: Format[],
    ) {
        return this._pack(authorization, "createscheme", {authorized_creator, collection_name, scheme_name, scheme_format});
    }

    public async declineoffer(authorization: EosioAuthorizationObject[], offer_id: string) {
        return this._pack(authorization, "declineoffer", {offer_id});
    }

    public async extendscheme(
        authorization: EosioAuthorizationObject[], authorized_editor: string,
        collection_name: string, scheme_name: string, scheme_format_extension: Format[],
    ) {
        return this._pack(authorization, "extendscheme", {authorized_editor, collection_name, scheme_name, scheme_format_extension});
    }

    public async forbidnotify(authorization: EosioAuthorizationObject[], collection_name: string) {
        return this._pack(authorization, "forbidnotify", {collection_name});
    }

    public async mintasset(
        authorization: EosioAuthorizationObject[], authorized_minter: string, collection_name: string, scheme_name: string, preset_id: string,
        new_asset_owner: string, immutable_data: AttributeMap, mutable_data: AttributeMap, tokens_to_back: string[],
    ) {
        return this._pack(authorization, "mintasset", {
            authorized_minter, collection_name, scheme_name, preset_id, new_asset_owner, immutable_data, mutable_data, tokens_to_back,
        });
    }

    public async payofferram(authorization: EosioAuthorizationObject[], payer: string, offer_id: string) {
        return this._pack(authorization, "payofferram", {payer, offer_id});
    }

    public async remcolauth(authorization: EosioAuthorizationObject[], collection_name: string, account_to_remove: string) {
        return this._pack(authorization, "remcolauth", {collection_name, account_to_remove});
    }

    public async remnotifyacc(authorization: EosioAuthorizationObject[], collection_name: string, account_to_remove: string) {
        return this._pack(authorization, "remnotifyacc", {collection_name, account_to_remove});
    }

    public async setassetdata(
        authorization: EosioAuthorizationObject[], authorized_editor: string,
        asset_owner: string, asset_id: string, new_mutable_data: AttributeMap,
    ) {
        return this._pack(authorization, "setassetdata", {authorized_editor, asset_owner, asset_id, new_mutable_data});
    }

    public async setcoldata(authorization: EosioAuthorizationObject[], collection_name: string, data: AttributeMap) {
        return this._pack(authorization, "setcoldata", {collection_name, data});
    }

    public async setmarketfee(authorization: EosioAuthorizationObject[], collection_name: string, market_fee: number) {
        return this._pack(authorization, "setmarketfee", {collection_name, market_fee});
    }

    public async transfer(authorization: EosioAuthorizationObject[], account_from: string, account_to: string, asset_ids: string[], memo: string) {
        return this._pack(authorization, "transfer", {from: account_from, to: account_to, asset_ids, memo});
    }

    public async withdraw(authorization: EosioAuthorizationObject[], owner: string, token_to_withdraw: string) {
        return this._pack(authorization, "withdraw", {owner, token_to_withdraw});
    }

    protected _pack(authorization: EosioAuthorizationObject[], name: string, data: any): EosioActionObject[] {
        return [{ account: this.contract, name, authorization, data }];
    }
}
