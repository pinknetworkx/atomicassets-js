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
    constructor(public readonly contract: string, public readonly core_token: string, public readonly precision: number) { }

    public async acceptoffer(authorization: EosioAuthorizationObject[], offer_id: string) {
        return this._pack(authorization, "acceptoffer", {offer_id});
    }

    public async addcolauth(authorization: EosioAuthorizationObject[], collection_name: string, account_to_add: string) {
        return this._pack(authorization, "addcolauth", {collection_name, account_to_add});
    }

    public async addnotifyacc(authorization: EosioAuthorizationObject[], collection_name: string, account_to_add: string) {
        return this._pack(authorization, "addnotifyacc", {collection_name, account_to_add});
    }

    public async burnasset(authorization: EosioAuthorizationObject[], owner: string, asset_id: string) {
        return this._pack(authorization, "burnasset", {owner, asset_id});
    }

    public async canceloffer(authorization: EosioAuthorizationObject[], offer_id: string) {
        return this._pack(authorization, "canceloffer", {offer_id});
    }

    public async createcol(
        authorization: EosioAuthorizationObject[], author: string, collection_name: string,
        authorized_accounts: string[], notify_accounts: string[], data: AttributeMap,
    ) {
        return this._pack(authorization, "createcol", {author, collection_name, authorized_accounts, notify_accounts, data});
    }

    public async createoffer(
        authorization: EosioAuthorizationObject[], sender: string, recipient: string,
        sender_asset_ids: string[], recipient_asset_ids: string[], memo: string,
    ) {
        return this._pack(authorization, "createoffer", {sender, recipient, sender_asset_ids, recipient_asset_ids, memo});
    }

    public async createpre(
        authorization: EosioAuthorizationObject[], authorized_creator: string, scheme_name: string, collection_name: string,
        transferable: boolean, burnable: boolean, max_supply: string, immutable_data: AttributeMap, mutable_data: AttributeMap,
    ) {
        return this._pack(authorization, "createpre", {
            authorized_creator, scheme_name, collection_name, transferable, burnable, max_supply, immutable_data, mutable_data,
        });
    }

    public async createscheme(authorization: EosioAuthorizationObject[], author: string, scheme_name: string, scheme_format: Format[]) {
        return this._pack(authorization, "createscheme", {scheme_name, scheme_format});
    }

    public async declineoffer(authorization: EosioAuthorizationObject[], offer_id: string) {
        return this._pack(authorization, "declineoffer", {offer_id});
    }

    public async extendscheme(authorization: EosioAuthorizationObject[], scheme_name: string, scheme_format_extension: Format[]) {
        return this._pack(authorization, "extendscheme", {scheme_name, scheme_format_extension});
    }

    public async mintasset(
        authorization: EosioAuthorizationObject[], authorized_minter: string, preset_id: string,
        new_owner: string, immutable_data: AttributeMap, mutable_data: AttributeMap,
    ) {
        return this._pack(authorization, "mintasset", {authorized_minter, preset_id, new_owner, immutable_data, mutable_data});
    }

    public async remcolauth(authorization: EosioAuthorizationObject[], collection_name: string, account_to_remove: string) {
        return this._pack(authorization, "remcolauth", {collection_name, account_to_remove});
    }

    public async remnotifyacc(authorization: EosioAuthorizationObject[], collection_name: string, account_to_remove: string) {
        return this._pack(authorization, "remnotifyacc", {collection_name, account_to_remove});
    }

    public async setassetdata(
        authorization: EosioAuthorizationObject[], authorized_editor: string,
        owner: string, asset_id: string, mutable_data: AttributeMap,
    ) {
        return this._pack(authorization, "setassetdata", {authorized_editor, owner, asset_id, mutable_data});
    }

    public async setcoldata(authorization: EosioAuthorizationObject[], collection_name: string, data: AttributeMap) {
        return this._pack(authorization, "setcoldata", {collection_name, data});
    }

    public async setpredata(authorization: EosioAuthorizationObject[], authorized_editor: string, preset_id: string, new_mutable_data: AttributeMap) {
        return this._pack(authorization, "setpredata", {authorized_editor, preset_id, new_mutable_data});
    }

    public async transfer(authorization: EosioAuthorizationObject[], account_from: string, account_to: string, asset_ids: string[], memo: string) {
        return this._pack(authorization, "transfer", {from: account_from, to: account_to, asset_ids, memo});
    }

    public async backtokens(authorization: EosioAuthorizationObject[], owner: string, asset_id: string, payer: string, quantity: string) {
        return {
            account: "eosio.token",
            name: "transfer",
            authorization,
            data: {from: payer, to: this.contract, quantity},
        };
    }

    protected _pack(authorization: EosioAuthorizationObject[], name: string, data: any): EosioActionObject {
        return { account: this.contract, name, authorization, data };
    }
}
