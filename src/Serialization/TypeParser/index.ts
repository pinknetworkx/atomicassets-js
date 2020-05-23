import SerializationState from '../State';

export interface ITypeParser {
    serialize(object: any): Uint8Array;

    deserialize(data: SerializationState): any;
}
