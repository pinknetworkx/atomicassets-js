import SerializationState from '../State';
import VariableParser from './VariableParser';

export class ByteParser extends VariableParser {
    deserialize(state: SerializationState): Uint8Array {
        return super.deserialize(state);
    }

    serialize(data: Uint8Array): Uint8Array {
        return super.serialize(data);
    }
}
