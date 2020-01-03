import {packInteger, signInteger, unpackInteger, unsignInteger} from "../../Binary";
import SerializationState from "../State";
import {ITypeParser} from "./index";

import bigInt from "big-integer";

export default class VariableIntegerParser implements ITypeParser {
    constructor(public readonly size: number, private readonly unsigned: boolean, private readonly negative: boolean) { }

    public deserialize(state: SerializationState): number {
        let n = unpackInteger(state, this.size);

        if(!this.unsigned) {
            n = unsignInteger(n, this.size);
        }

        if(this.negative) {
            n = n.negate();
        }

        return n.toJSNumber();
    }

    public serialize(data: any): Uint8Array {
        let n = bigInt(data);

        if(this.negative) {
            n = n.negate();
        }

        if(!this.unsigned) {
            n = signInteger(n, this.size);
        }

        return packInteger(n, this.size);
    }
}
