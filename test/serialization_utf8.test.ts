import { expect } from 'chai';

import { ObjectSchema } from '../src/Schema';
import { deserialize, serialize } from '../src/Serialization';

describe('Serialization Contract', () => {
    const schema = ObjectSchema([
        {
            name: 'name',
            type: 'string'
        }
    ]);

    const serializedObject = new Uint8Array([4, 14, 116, 101, 115, 116, 32, 240, 159, 165, 182, 32, 116, 101, 115, 116]);
    const rawObject = {
        name: 'test 🥶 test'
    };

    it('serialize object', () => {
        expect(serialize(rawObject, schema)).to.deep.equal(serializedObject);
    });

    it('deserialize object', () => {
        expect(deserialize(serializedObject, schema)).to.deep.equal(rawObject);
    });
});
