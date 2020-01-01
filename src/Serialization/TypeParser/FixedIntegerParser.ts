import {signInteger, unsignInteger} from "../../Binary";
import SerializationState from "../State";
import FixedParser from "./FixedParser";

export default class FixedIntegerParser extends FixedParser {
    public deserialize(state: SerializationState): number | bigint {
        const data: Uint8Array = super.deserialize(state);
        let n = BigInt(0);

        for(const byte of data) {
            n <<= BigInt(8);
            n += BigInt(byte);
        }

        n = unsignInteger(n, this.size);

        if(this.size < 6) {
            return Number(n);
        }

        return n;
    }

    public serialize(data: number | bigint): Uint8Array {
        let n: bigint = BigInt(data);
        const buffer: number[] = [];

        n = signInteger(n, this.size);

        for(let i = 0; i < this.size; i++) {
            buffer.push(Number(n & BigInt(0xFF)));
            n >>= BigInt(8);
        }

        return super.serialize(new Uint8Array(buffer.reverse()));
    }
}
