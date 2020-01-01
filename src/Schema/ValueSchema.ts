import SchemaError from "../Errors/SchemaError";
import SerializationState from "../Serialization/State";
import {ITypeParser} from "../Serialization/TypeParser";
import {ParserTypes} from "../Serialization/Types";
import {ISchema} from "./index";

export default class ValueSchema implements ISchema {
    public readonly parser: ITypeParser;

    constructor(type: string) {
        if(typeof ParserTypes[type] === "undefined") {
            throw new SchemaError(`attribute type '${type}' not defined`);
        }

        this.parser = ParserTypes[type];
    }

    public deserialize(state: SerializationState): any {
        return this.parser.deserialize(state);
    }

    public serialize(value: any): Uint8Array {
        return this.parser.serialize(value);
    }
}
