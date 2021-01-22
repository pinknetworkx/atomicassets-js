import { expect } from 'chai';

import { ObjectSchema } from '../src/Schema';
import { deserialize, serialize } from '../src/Serialization';

describe('Advanced Serialization', () => {
    const schema = ObjectSchema([
        {
            name: 'name',
            type: 'string',
            parent: 0
        },
        {
            name: 'id',
            type: 'uint64',
            parent: 0
        },
        {
            name: 'ipfs',
            type: 'ipfs',
            parent: 0
        },
        {
            name: 'chance',
            type: 'float',
            parent: 0
        },
        {
            name: 'attributes',
            type: 'object{1}[]',
            parent: 0
        },
        {
            name: 'strength',
            type: 'string',
            parent: 1
        },
        {
            name: 'height',
            type: 'int16',
            parent: 1
        },
        {
            name: 'matrix',
            type: 'fixed32[][]',
            parent: 0
        },
        {
            name: 'isCool',
            type: 'bool',
            parent: 0
        },
        {
            name: 'deeper',
            type: 'object{78910}',
            parent: 1
        },
        {
            name: 'precise',
            type: 'double',
            parent: 78910
        }
    ]);

    // tslint:disable-next-line:max-line-length
    const serializedObject = new Uint8Array([4, 4, 72, 97, 110, 115, 5, 173, 226, 229, 13, 6, 34, 18, 32, 104, 242, 255, 105, 42, 38, 111, 205, 242, 95, 137, 204, 243, 62, 87, 157, 39, 114, 105, 180, 68, 42, 33, 48, 192, 51, 224, 46, 18, 103, 14, 68, 7, 0, 0, 64, 63, 8, 2, 4, 6, 98, 114, 117, 116, 97, 108, 5, 136, 142, 1, 6, 4, 247, 53, 154, 117, 233, 8, 87, 64, 0, 0, 4, 10, 97, 117, 99, 104, 32, 107, 114, 97, 115, 115, 5, 247, 47, 0, 9, 2, 3, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 3, 168, 65, 1, 0, 9, 0, 0, 0, 56, 115, 156, 73, 10, 1]);
    const rawObject = {
        name: 'Hans',
        id: '28930349',
        attributes: [
            {
                height: 9092,
                strength: 'brutal',
                deeper: {
                    precise: 92.13924923
                }
            },
            {
                height: -3068,
                strength: 'auch krass'
            }
        ],
        chance: 0.75,
        ipfs: 'QmVQL22VUsxV26aKrJL8ZbQgU2o6veUatE9jZzPCdHV7pf',
        matrix: [
            [
                1,
                2,
                3
            ],
            [
                82344,
                9,
                1234989880
            ]
        ],
        isCool: 1
    };

    it('serialize object', () => {
        expect(serialize(rawObject, schema)).to.deep.equal(serializedObject);
    });

    it('deserialize object', () => {
        expect(deserialize(serializedObject, schema)).to.deep.equal(rawObject);
    });
});
