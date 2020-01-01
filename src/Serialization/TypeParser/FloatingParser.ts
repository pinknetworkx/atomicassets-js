import SerializationState from "../State";
import FixedParser from "./FixedParser";

// tslint:disable-next-line:no-var-requires
const fp: any = require("ieee-float");

export default class FloatingParser extends FixedParser {
    constructor(private readonly isDouble: boolean) {
        super(isDouble ? 8 : 4);
    }

    public deserialize(state: SerializationState): number {
        if(this.isDouble) {
            return fp.readDoubleBE(super.deserialize(state));
        } else {
            return fp.readFloatBE(super.deserialize(state));
        }
    }

    public serialize(data: number): Uint8Array {
        // tslint:disable-next-line:prefer-const
        let bytes: number[] = [];

        if(this.isDouble) {
            fp.writeDoubleBE(bytes, data);

            return super.serialize(new Uint8Array(bytes));
        } else {
            fp.writeFloatBE(bytes, data);

            return super.serialize(new Uint8Array(bytes));
        }
    }
}
