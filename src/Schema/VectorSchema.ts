import {concat_byte_arrays, varint_decode, varint_encode} from "../Serialization/Binary";
import SerializationState from "../Serialization/State";
import {ISchema} from "./index";

export default class VectorSchema implements ISchema {
    constructor(private readonly element: ISchema) { }

    public deserialize(state: SerializationState): any {
        const length = varint_decode(state).toJSNumber();
        const array: any[] = [];

        for(let i = 0; i < length; i++) {
            array.push(this.element.deserialize(state));
        }

        return array;
    }

    public serialize(array: any[]): Uint8Array {
        const data: Uint8Array[] = [varint_encode(array.length)];

        for(const element of array) {
            data.push(this.element.serialize(element));
        }

        return concat_byte_arrays(data);
    }
}
