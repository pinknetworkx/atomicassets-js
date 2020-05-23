import bigInt from 'big-integer';

import DeserializationError from '../../Errors/DeserializationError';
import SerializationError from '../../Errors/SerializationError';
import { varint_decode, varint_encode, zigzag_decode, zigzag_encode } from '../Binary';
import SerializationState from '../State';
import { ITypeParser } from './index';

export default class VariableIntegerParser implements ITypeParser {
    constructor(readonly size: number, private readonly unsigned: boolean) {
    }

    deserialize(state: SerializationState): number | string {
        let n = varint_decode(state);

        if (!this.unsigned) {
            n = zigzag_decode(n);
        }

        if (n.greaterOrEquals(bigInt(2).pow(this.size * 8 - (this.unsigned ? 0 : 1)))) {
            throw new DeserializationError('number \'' + n.toString() + '\' too large for given type');
        }

        if (this.size <= 6) {
            return n.toJSNumber();
        }

        return n.toString();
    }

    serialize(data: any): Uint8Array {
        let n = bigInt(data);

        if (n.greaterOrEquals(bigInt(2).pow(this.size * 8 - (this.unsigned ? 0 : 1)))) {
            throw new SerializationError('number \'' + n.toString() + '\' too large for given type');
        }

        if (!this.unsigned) {
            n = zigzag_encode(n);
        }

        return varint_encode(n);
    }
}
