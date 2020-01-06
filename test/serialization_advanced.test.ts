import { expect } from "chai";

import {ObjectSchema} from "../src/Schema";
import {deserialize, serialize} from "../src/Serialization";

describe("Advanced Serialization", () => {
    const schema = ObjectSchema([
        {
            name: "name",
            type: "string",
            parent: 0,
        },
        {
            name: "id",
            type: "uint64",
            parent: 0,
        },
        {
            name: "ipfs",
            type: "ipfs",
            parent: 0,
        },
        {
            name: "chance",
            type: "float",
            parent: 0,
        },
        {
            name: "attributes",
            type: "object{1}[]",
            parent: 0,
        },
        {
            name: "strength",
            type: "string",
            parent: 1,
        },
        {
            name: "height",
            type: "int16",
            parent: 1,
        },
        {
            name: "matrix",
            type: "fixed32[][]",
            parent: 0,
        },
        {
            name: "isCool",
            type: "bool",
            parent: 0,
        },
        {
            name: "deeper",
            type: "object{78910}",
            parent: 1,
        },
        {
            name: "precise",
            type: "double",
            parent: 78910,
        },
    ]);

    const serializedObject = new Uint8Array("01 04 48 61 6e 73 02 ad e2 e5 0d 03 22 12 20 68 f2 ff 69 2a 26 6f cd f2 5f 89 cc f3 3e 57 9d 27 72 69 b4 44 2a 21 30 c0 33 e0 2e 12 67 0e 44 04 00 00 40 3f 05 02 01 06 62 72 75 74 61 6c 02 84 47 03 01 f7 35 9a 75 e9 08 57 40 00 00 01 0a 61 75 63 68 20 6b 72 61 73 73 02 84 e8 03 00 06 02 03 01 00 00 00 02 00 00 00 03 00 00 00 03 a8 41 01 00 09 00 00 00 38 73 9c 49 07 01".split(" ").map((val) => parseInt(val, 16)));
    const rawObject = {
        name: "Hans",
        id: "28930349",
        attributes: [
            {
                height: 9092,
                strength: "brutal",
                deeper: {
                    precise: 92.13924923,
                },
            },
            {
                height: -3068,
                strength: "auch krass",
            },
        ],
        chance: 0.75,
        ipfs: "QmVQL22VUsxV26aKrJL8ZbQgU2o6veUatE9jZzPCdHV7pf",
        matrix: [
            [
                1,
                2,
                3,
            ],
            [
                82344,
                9,
                1234989880,
            ],
        ],
        isCool: true,
    };

    it("serialize object", () => {
        expect(serialize(rawObject, schema)).to.deep.equal(serializedObject);
    });

    it("deserialize object", () => {
        expect(deserialize(serializedObject, schema)).to.deep.equal(rawObject);
    });
});
