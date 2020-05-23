import SerializationState from '../State';
import VariableParser from './VariableParser';

export default class StringParser extends VariableParser {
    deserialize(state: SerializationState): any {
        return new TextDecoder().decode(super.deserialize(state));
    }

    serialize(data: string): Uint8Array {
        return super.serialize(new TextEncoder().encode(data));
    }
}
