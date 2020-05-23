import SchemaError from '../Errors/SchemaError';
import SerializationState from '../Serialization/State';
import MappingSchema from './MappingSchema';
import ValueSchema from './ValueSchema';
import VectorSchema from './VectorSchema';

export interface ISchema {
    serialize(data: any): Uint8Array;

    deserialize(state: SerializationState): Uint8Array;
}

export type SchemaObject = { name: string, type: string, parent?: number };
export type MappingAttribute = { name: string, value: ISchema };

type ObjectLookup = { [id: number]: SchemaObject[] };

function buildObjectSchema(objectID: number, lookup: ObjectLookup): ISchema {
    const attributes: MappingAttribute[] = [];
    let fields = lookup[objectID];

    if (typeof fields === 'undefined') {
        fields = [];
    }

    delete lookup[objectID];

    for (const field of fields) {
        attributes.push({name: field.name, value: buildValueSchema(field.type, lookup)});
    }

    return new MappingSchema(attributes);
}

function buildValueSchema(type: string, lookup: ObjectLookup): ISchema {
    if (type.endsWith('[]')) {
        return new VectorSchema(buildValueSchema(type.substring(0, type.length - 2), lookup));
    }

    // not supported by the contract currently
    if (type.startsWith('object{') && type.endsWith('}')) {
        const objectID = parseInt(type.substring(7, type.length - 1), 10);

        if (isNaN(objectID)) {
            throw new SchemaError(`invalid type '${type}'`);
        }

        return buildObjectSchema(objectID, lookup);
    }

    return new ValueSchema(type);
}

export function ObjectSchema(schema: SchemaObject[]): ISchema {
    const objectLookup: ObjectLookup = {};

    for (const schemaObject of schema) {
        const objectID = typeof schemaObject.parent === 'undefined' ? 0 : schemaObject.parent;

        if (typeof objectLookup[objectID] === 'undefined') {
            objectLookup[objectID] = [];
        }

        objectLookup[objectID].push(schemaObject);
    }

    return buildObjectSchema(0, objectLookup);
}
