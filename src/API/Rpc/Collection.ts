import {CollectionRow, PresetRow} from "./Cache";
import RpcScheme from "./Scheme";
import RpcApi from "./index";

export default class RpcCollection {
    public readonly name: string;

    private readonly _data?: CollectionRow;

    public constructor(private readonly api: RpcApi, name: string, data?: CollectionRow) {
        this.name = name;
    }

    public async owner(): Promise<string> {
        return "";
    }

    public async notifiers(): Promise<string[]> {
        return [];
    }

    public async issuers(): Promise<string[]> {
        return [];
    }
}