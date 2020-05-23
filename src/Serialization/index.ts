import { ISchema } from '../Schema';
import MappingSchema from '../Schema/MappingSchema';
import { concat_byte_arrays, varint_encode } from './Binary';
import SerializationState from './State';

export function serialize(object: any, schema: ISchema): Uint8Array {
    const data = schema.serialize(object);

    // remove terminating 0 byte because it is unnecessary
    if (schema instanceof MappingSchema) {
        return data.slice(0, data.length - 1);
    }

    return data;
}

export function deserialize(data: Uint8Array, schema: ISchema): any {
    if (schema instanceof MappingSchema) {
        data = concat_byte_arrays([data, varint_encode(0)]);
    }

    const state = new SerializationState(data, 0);

    return schema.deserialize(state);
}
