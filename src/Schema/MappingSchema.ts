import SchemaError from "../Errors/SchemaError";
import {concat_byte_arrays, varint_decode, varint_encode} from "../Serialization/Binary";
import SerializationState from "../Serialization/State";
import {ISchema, MappingAttribute} from "./index";

export default class MappingSchema implements ISchema {
    private readonly reserved = 4;

    constructor(private readonly attributes: MappingAttribute[]) { }

    public deserialize(state: SerializationState): any {
        const object: any = {};

        while(state.position < state.data.length) {
            const identifier = varint_decode(state);

            if(identifier.equals(0)) {
                break;
            }

            const attribute = this.getAttribute(identifier.toJSNumber());

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

            data.push(varint_encode(i + this.reserved));
            data.push(attribute.value.serialize(object[attribute.name]));
        }

        data.push(varint_encode(0));

        return concat_byte_arrays(data);
    }

    private getAttribute(identifier: number): MappingAttribute {
        const attributeID = identifier - this.reserved;

        if(attributeID >= this.attributes.length) {
            throw new SchemaError("attribute does not exists");
        }

        return this.attributes[Number(attributeID)];
    }
}
