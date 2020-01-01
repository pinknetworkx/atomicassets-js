import SerializationState from "../State";
import VariableParser from "./VariableParser";

export class ByteParser extends VariableParser {
    public deserialize(state: SerializationState): Uint8Array {
        return super.deserialize(state);
    }

    public serialize(data: Uint8Array): Uint8Array {
        return super.serialize(data);
    }
}
