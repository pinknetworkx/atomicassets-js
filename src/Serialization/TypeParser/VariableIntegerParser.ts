import {packInteger, signInteger, unpackInteger, unsignInteger} from "../../Binary";
import SerializationState from "../State";
import {ITypeParser} from "./index";

export default class VariableIntegerParser implements ITypeParser {
    constructor(public readonly size: number, private readonly unsigned: boolean, private readonly negative: boolean) { }

    public deserialize(state: SerializationState): bigint | number {
        let n = unpackInteger(state, this.size);

        if(!this.unsigned) {
            n = unsignInteger(n, this.size);
        }

        if(this.negative) {
            n = BigInt(-1) * n;
        }

        if(this.size < 6) {
            return Number(n);
        }

        return n;
    }

    public serialize(data: bigint | number): Uint8Array {
        let n = BigInt(data);

        if(this.negative) {
            n = BigInt(-1) * n;
        }

        if(!this.unsigned) {
            n = signInteger(n, this.size);
        }

        return packInteger(n, this.size);
    }
}
