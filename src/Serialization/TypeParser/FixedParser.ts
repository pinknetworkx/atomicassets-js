import DeserializationError from "../../Errors/DeserializationError";
import SerializationError from "../../Errors/SerializationError";
import SerializationState from "../State";
import {ITypeParser} from "./index";

export default class FixedParser implements ITypeParser {
    constructor(public readonly size: number) { }

    public deserialize(state: SerializationState): any {
        state.position += this.size;

        const data = state.data.slice(state.position - this.size, state.position);

        if(data.length !== this.size) {
            throw new DeserializationError("FixedParser: read past end");
        }

        return data;
    }

    public serialize(data: any): Uint8Array {
        if(data.length !== this.size) {
            throw new SerializationError(`input data does not conform fixed size`);
        }

        return data;
    }
}
