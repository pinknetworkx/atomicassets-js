import bigInt, { BigInteger } from 'big-integer';

import SerializationState from '../State';
import FixedParser from './FixedParser';

export default class FixedIntegerParser extends FixedParser {
    deserialize(state: SerializationState): number | string {
        const data: Uint8Array = super.deserialize(state).reverse();
        let n = bigInt(0);

        for (const byte of data) {
            n = n.shiftLeft(8);
            n = n.plus(byte);
        }

        if (this.size <= 6) {
            return n.toJSNumber();
        }

        return n.toString();
    }

    serialize(data: any): Uint8Array {
        let n: BigInteger = bigInt(data);
        const buffer: number[] = [];

        for (let i = 0; i < this.size; i++) {
            buffer.push(n.and(0xFF).toJSNumber());
            n = n.shiftRight(8);
        }

        return super.serialize(new Uint8Array(buffer));
    }
}
