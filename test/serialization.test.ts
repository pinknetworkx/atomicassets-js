import { expect } from "chai";

import {base58_decode, concatByteArrays, packInteger} from "../src/Binary";
import {ObjectSchema} from "../src/Schema";
import {deserialize, serialize} from "../src/Serialization";

describe("Basic Serialization", () => {
    const schema = ObjectSchema([
        {name: "name", type: "string", object: 0},
        {name: "img", type: "ipfs", object: 0},
        {name: "rarity", type: "int16", object: 0},
    ]);

    const object = {
        name: "M4A4 Skin",
        img: "QmS6AaitSdut3Te4fagW6jgfyKL73A1NBSSt3K38vQP9xf",
        rarity: 230,
    };

    const encoder = new TextEncoder();

    const serializedObject = concatByteArrays([
        packInteger(BigInt(1)),
        packInteger(BigInt(object.name.length)),
        new Uint8Array(encoder.encode(object.name)),
        packInteger(BigInt(2)),
        base58_decode(object.img),
        packInteger(BigInt(3)),
        packInteger(BigInt(230)),
    ]);

    it("serialize (saved: " + (100 - 100 * serializedObject.length / JSON.stringify(object).length).toFixed(2) + "%" + ")", () => {
        expect(serialize(object, schema)).to.deep.equal(serializedObject);
    });

    it("deserialize", () => {
        expect(deserialize(serializedObject, schema)).to.deep.equal(object);
    });
});
