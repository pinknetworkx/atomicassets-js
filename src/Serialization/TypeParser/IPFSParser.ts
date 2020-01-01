import {base58_decode, base58_encode} from "../../Binary";
import SerializationError from "../../Errors/SerializationError";
import SerializationState from "../State";
import FixedParser from "./FixedParser";

export default class IPFSParser extends FixedParser {
    public static hashSize = 34;

    constructor() {
        super(IPFSParser.hashSize);
    }

    public deserialize(state: SerializationState): any {
        return base58_encode(super.deserialize(state));
    }

    public serialize(data: string): Uint8Array {
        const bytes = base58_decode(data);

        if(bytes.length !== IPFSParser.hashSize) {
            throw new SerializationError(`invalid ipfs hash size`);
        }

        return super.serialize(bytes);
    }
}
