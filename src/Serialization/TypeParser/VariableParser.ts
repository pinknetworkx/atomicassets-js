import DeserializationError from '../../Errors/DeserializationError';
import { concat_byte_arrays, varint_decode, varint_encode } from '../Binary';
import SerializationState from '../State';
import { ITypeParser } from './index';

export default class VariableParser implements ITypeParser {
    deserialize(state: SerializationState): any {
        const length = varint_decode(state).toJSNumber();
        state.position += length;

        const data = state.data.slice(state.position - length, state.position);

        if (data.length !== length) {
            throw new DeserializationError(`VariableParser: read past end`);
        }

        return data;
    }

    serialize(data: any): Uint8Array {
        return concat_byte_arrays([varint_encode(data.length), data]);
    }
}
