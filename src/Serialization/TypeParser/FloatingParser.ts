import SerializationState from "../State";
import FixedParser from "./FixedParser";

// tslint:disable-next-line:no-var-requires
const fp: any = require("../Coders/Float");

export default class FloatingParser extends FixedParser {
    constructor(private readonly isDouble: boolean) {
        super(isDouble ? 8 : 4);
    }

    public deserialize(state: SerializationState): number {
        if(this.isDouble) {
            return fp.readDoubleLE(super.deserialize(state));
        } else {
            return fp.readFloatLE(super.deserialize(state));
        }
    }

    public serialize(data: number): Uint8Array {
        // tslint:disable-next-line:prefer-const
        let bytes: number[] = [];

        if(this.isDouble) {
            fp.writeDoubleLE(bytes, data);

            return super.serialize(new Uint8Array(bytes));
        } else {
            fp.writeFloatLE(bytes, data);

            return super.serialize(new Uint8Array(bytes));
        }
    }
}
