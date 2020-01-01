import {concatByteArrays, packInteger, unpackInteger} from "../Binary";
import SchemaError from "../Errors/SchemaError";
import SerializationState from "../Serialization/State";
import {ISchema, MappingAttribute} from "./index";

export default class MappingSchema implements ISchema {
    private readonly reserved: bigint = BigInt(1);

    constructor(private readonly attributes: MappingAttribute[]) { }

    public deserialize(state: SerializationState): any {
        const object: any = {};

        while(state.position < state.data.length) {
            const identifier = unpackInteger(state);

            if(identifier === BigInt(0)) {
                break;
            }

            const attribute = this.getAttribute(identifier);

            object[attribute.name] = attribute.value.deserialize(state);
        }

        return object;
    }

    public serialize(object: any): Uint8Array {
        const data: Uint8Array[] = [];

        for(let i = 0; i < this.attributes.length; i++) {
            const attribute = this.attributes[i];

            if(typeof object[attribute.name] === "undefined") {
                continue;
            }

            data.push(packInteger(BigInt(i) + this.reserved));
            data.push(attribute.value.serialize(object[attribute.name]));
        }

        data.push(packInteger(BigInt(0)));

        return concatByteArrays(data);
    }

    private getAttribute(identifier: bigint): MappingAttribute {
        const attributeID = identifier - this.reserved;

        if(attributeID >= this.attributes.length) {
            throw new SchemaError("attribute does not exists");
        }

        return this.attributes[Number(attributeID)];
    }
}
