import {signInteger, unsignInteger} from "../../Binary";
import SerializationState from "../State";
import FixedParser from "./FixedParser";

export default class BooleanParser extends FixedParser {
    constructor() {
        super(1);
    }

    public deserialize(state: SerializationState): boolean {
        const data: Uint8Array = super.deserialize(state);

        return data[0] === 1;
    }

    public serialize(data: boolean): Uint8Array {
        return super.serialize(new Uint8Array([data ? 1 : 0]));
    }
}
