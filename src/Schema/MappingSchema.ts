import SchemaError from '../Errors/SchemaError';
import { concat_byte_arrays, varint_decode, varint_encode } from '../Serialization/Binary';
import SerializationState from '../Serialization/State';
import { ISchema, MappingAttribute } from './index';

export default class MappingSchema implements ISchema {
    private readonly reserved = 4;

    constructor(private readonly attributes: MappingAttribute[]) {
    }

    deserialize(state: SerializationState, upwardsCompatible: boolean = false): any {
        const object: any = {};

        while (state.position < state.data.length) {
            const identifier = varint_decode(state);

            if (identifier.equals(0)) {
                break;
            }

            const attribute = this.getAttribute(identifier.toJSNumber(), !upwardsCompatible);

            if (attribute) {
                object[attribute.name] = attribute.value.deserialize(state);
            }
        }

        return object;
    }

    serialize(object: any): Uint8Array {
        const data: Uint8Array[] = [];

        for (let i = 0; i < this.attributes.length; i++) {
            const attribute = this.attributes[i];

            if (typeof object[attribute.name] === 'undefined') {
                continue;
            }

            data.push(varint_encode(i + this.reserved));
            data.push(attribute.value.serialize(object[attribute.name]));
        }

        data.push(varint_encode(0));

        return concat_byte_arrays(data);
    }

    private getAttribute(identifier: number, throwError: boolean = true): MappingAttribute | undefined {
        const attributeID = identifier - this.reserved;

        if (attributeID >= this.attributes.length) {
            if (throwError) {
                throw new SchemaError('attribute does not exists');
            }

            return;
        }

        return this.attributes[Number(attributeID)];
    }
}
