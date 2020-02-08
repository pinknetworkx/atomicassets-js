export type EosioAuthorizationObject = {actor: string, permission: string};
export type EosioActionObject = {
    account: string,
    name: string,
    authorization: EosioAuthorizationObject[],
    data: any,
};

export default class ActionGenerator {
    constructor(public readonly contract: string, public readonly core_token: string, public readonly precision: number) { }

    public acceptoffer(authorization: EosioAuthorizationObject[], offer_id: string) {
        return this._pack(authorization, "acceptoffer", {offer_id});
    }

    private _pack(authorization: EosioAuthorizationObject[], name: string, data: any): EosioActionObject {
        return { account: this.contract, name, authorization, data };
    }
}
