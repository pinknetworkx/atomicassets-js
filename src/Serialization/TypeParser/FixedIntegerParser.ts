import {integer_sign, integer_unsign} from "../Binary";
import SerializationState from "../State";
import FixedParser from "./FixedParser";

import bigInt, {BigInteger} from "big-integer";

export default class FixedIntegerParser extends FixedParser {
    public deserialize(state: SerializationState): number | string {
        const data: Uint8Array = super.deserialize(state).reverse();
        let n = bigInt(0);

        for(const byte of data) {
            n = n.shiftLeft(8);
            n = n.plus(byte);
        }

        n = integer_unsign(n, this.size);

        if(this.size <= 6) {
            return n.toJSNumber();
        }

        return n.toString();
    }

    public serialize(data: any): Uint8Array {
        let n: BigInteger = bigInt(data);
        const buffer: number[] = [];

        n = integer_sign(n, this.size);

        for(let i = 0; i < this.size; i++) {
            buffer.push(n.and(0xFF).toJSNumber());
            n = n.shiftRight(8);
        }

        return super.serialize(new Uint8Array(buffer));
    }
}
