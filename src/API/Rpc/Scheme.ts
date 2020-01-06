import {ISchema, ObjectSchema} from "../../Schema";
import {PresetRow, SchemeRow} from "./Cache";
import RpcCollection from "./Collection";
import RpcApi from "./index";

export default class RpcScheme {
    public readonly name;

    private readonly _data?: SchemeRow;

    public constructor(api: RpcApi, name: string, data?: SchemeRow) {
        this.name = name;
    }

    public async author(): Promise<string> {
        return "";
    }

    public async ischema(): Promise<ISchema> {
        return ObjectSchema([]);
    }

    public async mschema(): Promise<ISchema> {
        return ObjectSchema([]);
    }
}
