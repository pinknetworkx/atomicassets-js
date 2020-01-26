import {packInteger, signInteger, unpackInteger, unsignInteger, zigzag_decode, zigzag_encode} from "../Binary";
import SerializationState from "../State";
import {ITypeParser} from "./index";

import bigInt from "big-integer";

export default class VariableIntegerParser implements ITypeParser {
    constructor(public readonly size: number, private readonly unsigned: boolean) { }

    public deserialize(state: SerializationState): number | string {
        let n = unpackInteger(state, this.size);

        if(!this.unsigned) {
            n = zigzag_decode(n, this.size);
        }

        if(this.size <= 6) {
            return n.toJSNumber();
        }

        return n.toString();
    }

    public serialize(data: any): Uint8Array {
        let n = bigInt(data);

        if(!this.unsigned) {
            n = zigzag_encode(n, this.size);
        }

        return packInteger(n, this.size);
    }
}
