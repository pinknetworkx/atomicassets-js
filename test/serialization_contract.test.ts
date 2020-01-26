import { expect } from "chai";

import {ObjectSchema} from "../src/Schema";
import {deserialize, serialize} from "../src/Serialization";

describe("Serialization Contract", () => {
    const schema = ObjectSchema([
        {
            name: "id",
            type: "uint64",
            parent: 0,
        },
        {
            name: "name",
            type: "string",
            parent: 0,
        },
        {
            name: "test2",
            type: "fixed16[]",
            parent: 0,
        },
        {
            name: "test3",
            type: "float",
            parent: 0,
        },
        {
            name: "unused",
            type: "int32",
            parent: 0,
        },
        {
            name: "isTrueTrue",
            type: "bool",
            parent: 0,
        },
        {
            name: "image",
            type: "ipfs",
            parent: 0,
        },
        {
            name: "gibnumber",
            type: "int16",
            parent: 0,
        },
        {
            name: "onemore",
            type: "int16[]",
            parent: 0,
        },
    ]);

    const serializedObject = new Uint8Array("04 12 05 06 4d 75 6e 69 63 68 06 04 12 00 7b 00 21 00 90 03 07 00 00 40 bf 09 01 0a 22 12 20 b7 41 a3 b1 cf 5b fe ae 20 8c 86 ef bf ac 8e 0b bc 0c 92 ee a7 ef 9a 2d 96 40 12 e6 c2 21 0f 4c 0b f6 01 0c 08 fe ff 03 ff ff 03 10 18 10 be 3a a9 03 f2 c0 01".split(" ").map((val) => parseInt(val, 16)));
    const rawObject = {
        id: "18",
        name: "Munich",
        test2: [18, 123, 33, 912],
        test3: -0.75,
        isTrueTrue: true,
        image: "Qmag1NRBcpYyz27Kq2demHavXoi7nwbcCfkUq5vh6nuNN7",
        gibnumber: 123,
        onemore: [32767, -32768, 8, 12, 8, 3743, -213, 12345],
    };

    it("serialize object", () => {
        expect(serialize(rawObject, schema)).to.deep.equal(serializedObject);
    });

    it("deserialize object", () => {
        expect(deserialize(serializedObject, schema)).to.deep.equal(rawObject);
    });
});
