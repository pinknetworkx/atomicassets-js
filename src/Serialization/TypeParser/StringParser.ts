import SerializationState from "../State";
import VariableParser from "./VariableParser";

export default class StringParser extends VariableParser {
    public deserialize(state: SerializationState): any {
        return String.fromCharCode.apply(null, super.deserialize(state));
    }

    public serialize(data: string): Uint8Array {
        return super.serialize(new TextEncoder().encode(data));
    }
}
