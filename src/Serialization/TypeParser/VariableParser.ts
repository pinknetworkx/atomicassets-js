import {concat_byte_arrays, packInteger, unpackInteger} from "../../Binary";
import DeserializationError from "../../Errors/DeserializationError";
import SerializationState from "../State";
import {ITypeParser} from "./index";

export default class VariableParser implements ITypeParser {
    public deserialize(state: SerializationState): any {
        const length = unpackInteger(state).toJSNumber();
        state.position += length;

        const data = state.data.slice(state.position - length, state.position);

        if(data.length !== length) {
            throw new DeserializationError(`VariableParser: read past end`);
        }

        return data;
    }

    public serialize(data: any): Uint8Array {
        return concat_byte_arrays([packInteger(BigInt(data.length)), data]);
    }
}
