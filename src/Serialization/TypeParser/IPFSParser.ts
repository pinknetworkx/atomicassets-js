import { base58_decode, base58_encode } from '../Binary';
import SerializationState from '../State';
import VariableParser from './VariableParser';

export default class IPFSParser extends VariableParser {
    deserialize(state: SerializationState): any {
        return base58_encode(super.deserialize(state));
    }

    serialize(data: string): Uint8Array {
        return super.serialize(base58_decode(data));
    }
}
