import {signInteger, unsignInteger} from "../../Binary";
import SerializationState from "../State";
import FixedParser from "./FixedParser";

import bigInt, {BigInteger} from "big-integer";

export default class FixedIntegerParser extends FixedParser {
    public deserialize(state: SerializationState): number {
        const data: Uint8Array = super.deserialize(state);
        let n = bigInt(0);

        for(const byte of data) {
            n = n.shiftLeft(8);
            n = n.plus(byte);
        }

        n = unsignInteger(n, this.size);

        if(this.size < 6) {
            return Number(n);
        }

        return n.toJSNumber();
    }

    public serialize(data: any): Uint8Array {
        let n: BigInteger = bigInt(data);
        const buffer: number[] = [];

        n = signInteger(n, this.size);

        for(let i = 0; i < this.size; i++) {
            buffer.push(n.and(0xFF).toJSNumber());
            n = n.shiftRight(8);
        }

        return super.serialize(new Uint8Array(buffer.reverse()));
    }
}
