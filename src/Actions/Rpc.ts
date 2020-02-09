import RpcApi from "../API/Rpc";
import {SchemeFormat} from "../API/Rpc/Cache";
import SerializationError from "../Errors/SerializationError";
import ActionGenerator, {AttributeMap, EosioAuthorizationObject} from "./Generator";

/* tslint:disable:variable-name */

export default class RpcActionGenerator extends ActionGenerator {
    private static toAttributeMap(obj: any, scheme: SchemeFormat): AttributeMap {
        const types: {[id: string]: string} = {};
        const result: AttributeMap = [];

        for(const row of scheme) {
            types[row.name] = row.type;
        }

        const keys = Object.keys(obj);
        for(const key of keys) {
            if(typeof types[key] !== "undefined") {
                throw new SerializationError("field not defined in scheme");
            }

            result.push({key, value: [types[key], obj[key]]});
        }

        return result;
    }

    constructor(public readonly api: RpcApi) {
        super(api.contract, api.coreToken, api.precision);
    }

    public async createcol(
        authorization: EosioAuthorizationObject[], author: string, collection_name: string,
        authorized_accounts: string[], notify_accounts: string[], data: object,
    ) {
        const config = await this.api.config();

        return super.createcol(
            authorization, author, collection_name, authorized_accounts, notify_accounts, RpcActionGenerator.toAttributeMap(data, config.collection_format),
        );
    }

    public async createpre(
        authorization: EosioAuthorizationObject[], authorized_creator: string, scheme_name: string, collection_name: string,
        transferable: boolean, burnable: boolean, max_supply: string, immutable_data: object, mutable_data: object,
    ) {
        const scheme = await this.api.getScheme(scheme_name);

        const idata = RpcActionGenerator.toAttributeMap(immutable_data, await scheme.rawFormat());
        const mdata = RpcActionGenerator.toAttributeMap(mutable_data, await scheme.rawFormat());

        return super.createpre(
            authorization, authorized_creator, scheme_name, collection_name,
            transferable, burnable, max_supply, idata, mdata,
        );
    }

    public async mintasset(
        authorization: EosioAuthorizationObject[], authorized_minter: string, preset_id: string,
        new_owner: string, immutable_data: object, mutable_data: object,
    ) {
        const preset = await this.api.getPreset(preset_id);

        const idata = RpcActionGenerator.toAttributeMap(immutable_data, await (await preset.scheme()).rawFormat());
        const mdata = RpcActionGenerator.toAttributeMap(mutable_data, await (await preset.scheme()).rawFormat());

        return super.mintasset(authorization, authorized_minter, preset_id, new_owner, idata, mdata);
    }

    public async setassetdata(
        authorization: EosioAuthorizationObject[], authorized_editor: string, owner: string, asset_id: string, mutable_data: object,
    ) {
        const asset = await this.api.getAsset(owner, asset_id);
        const scheme = await (await asset.preset()).scheme();

        const mdata = RpcActionGenerator.toAttributeMap(mutable_data, await scheme.rawFormat());

        return super.setassetdata(authorization, authorized_editor, owner, asset_id, mdata);
    }

    public async setcoldata(authorization: EosioAuthorizationObject[], collection_name: string, data: object) {
        const mdata = RpcActionGenerator.toAttributeMap(data, (await this.api.config()).collection_format);

        return super.setcoldata(authorization, collection_name, mdata);
    }

    public async setpredata(authorization: EosioAuthorizationObject[], authorized_editor: string, preset_id: string, new_mutable_data: AttributeMap) {
        const preset = await this.api.getPreset(preset_id);

        const mdata = RpcActionGenerator.toAttributeMap(new_mutable_data, await (await preset.scheme()).rawFormat());

        return super.setpredata(authorization, authorized_editor, preset_id, mdata);
    }
}
