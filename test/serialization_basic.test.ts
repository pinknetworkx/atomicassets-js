import { expect } from "chai";

import {base58_decode, concat_byte_arrays, hex_decode, packInteger, signInteger} from "../src/Binary";
import {ObjectSchema} from "../src/Schema";
import {deserialize, serialize} from "../src/Serialization";

describe("Basic Serialization", () => {
    const schema = ObjectSchema([
        /* 04 */ {name: "name", type: "string", parent: 0},
        /* 05 */ {name: "img", type: "ipfs", parent: 0},
        /* 06 */ {name: "rarity1", type: "int16", parent: 0},
        /* 07 */ {name: "rarity2", type: "uint16", parent: 0},
        /* 08 */ {name: "rarity3", type: "sint16", parent: 0},
        /* 09 */ {name: "rarity4", type: "fixed16", parent: 0},
        /* 10 */ {name: "depth1", type: "int32", parent: 0},
        /* 11 */ {name: "depth2", type: "uint32", parent: 0},
        /* 12 */ {name: "depth3", type: "sint32", parent: 0},
        /* 13 */ {name: "depth4", type: "fixed32", parent: 0},
        /* 14 */ {name: "wear", type: "float", parent: 0},
        /* 15 */ {name: "tradeable", type: "bool", parent: 0},
        /* 16 */ {name: "share", type: "double", parent: 0},
    ]);

    const encoder = new TextEncoder();

    const rawObject = {
        name: "M4A4 Skin",
        img: "QmS6AaitSdut3Te4fagW6jgfyKL73A1NBSSt3K38vQP9xf",
        rarity1: 534,
        rarity2: 534,
        rarity3: 534,
        rarity4: 534,
        depth1: -1000000,
        depth2: 1000000,
        depth3: -1000000,
        depth4: -1000000,
        wear: 0.75,
        tradeable: true,
        share: 1024.25,
    };

    const serializedName = concat_byte_arrays([
        packInteger(4),
        packInteger(rawObject.name.length),
        new Uint8Array(encoder.encode(rawObject.name)),
    ]);

    const serializedImage = concat_byte_arrays([
        packInteger(5),
        packInteger(base58_decode(rawObject.img).length),
        base58_decode(rawObject.img),
    ]);

    const serializedRarity = concat_byte_arrays([
        packInteger(6),
        packInteger(534, 2),
        packInteger(7),
        packInteger(534, 2),
        packInteger(8),
        new Uint8Array([0b11101010, 0b11111011, 0b00000011]), // negative integer
        packInteger(9),
        new Uint8Array([0x2, 0x16].reverse()),
    ]);

    const serializedDepth = concat_byte_arrays([
        packInteger(10),
        packInteger(signInteger(-1000000, 4), 4),
        packInteger(11),
        packInteger(1000000, 4),
        packInteger(12),
        packInteger(1000000, 4),
        packInteger(13),
        new Uint8Array([0b11111111, 0b11110000, 0b10111101, 0b11000000].reverse()),
    ]);

    const serializedWear = concat_byte_arrays([
        packInteger(14),
        new Uint8Array([0x3f, 0x40, 0, 0].reverse()),
    ]);

    const serializedTradeable = concat_byte_arrays([
        packInteger(15),
        new Uint8Array([1]),
    ]);

    const serializedShare = concat_byte_arrays([
        packInteger(16),
        hex_decode("4090010000000000").reverse(),
    ]);

    it("serialize string", () => {
        expect(serialize({
            name: rawObject.name,
        }, schema)).to.deep.equal(serializedName);
    });

    it("deserialize string", () => {
        expect(deserialize(serializedName, schema)).to.deep.equal({
            name: rawObject.name,
        });
    });

    it("serialize ipfs", () => {
        expect(serialize({
            img: rawObject.img,
        }, schema)).to.deep.equal(serializedImage);
    });

    it("deserialize ipfs", () => {
        expect(deserialize(serializedImage, schema)).to.deep.equal({
            img: rawObject.img,
        });
    });

    it("serialize int", () => {
        expect(serialize({
            rarity1: rawObject.rarity1,
            rarity2: rawObject.rarity2,
            rarity3: rawObject.rarity3,
            rarity4: rawObject.rarity4,
        }, schema)).to.deep.equal(serializedRarity);
    });

    it("deserialize int", () => {
        expect(deserialize(serializedRarity, schema)).to.deep.equal({
            rarity1: rawObject.rarity1,
            rarity2: rawObject.rarity2,
            rarity3: rawObject.rarity3,
            rarity4: rawObject.rarity4,
        });
    });

    it("serialize negative int", () => {
        expect(serialize({
            depth1: rawObject.depth1,
            depth2: rawObject.depth2,
            depth3: rawObject.depth3,
            depth4: rawObject.depth4,
        }, schema)).to.deep.equal(serializedDepth);
    });

    it("deserialize negative int", () => {
        expect(deserialize(serializedDepth, schema)).to.deep.equal({
            depth1: rawObject.depth1,
            depth2: rawObject.depth2,
            depth3: rawObject.depth3,
            depth4: rawObject.depth4,
        });
    });

    it("serialize float", () => {
        expect(serialize({
            wear: rawObject.wear,
        }, schema)).to.deep.equal(serializedWear);
    });

    it("deserialize float", () => {
        expect(deserialize(serializedWear, schema)).to.deep.equal({
            wear: rawObject.wear,
        });
    });

    it("serialize double", () => {
        expect(serialize({
            share: rawObject.share,
        }, schema)).to.deep.equal(serializedShare);
    });

    it("deserialize double", () => {
        expect(deserialize(serializedShare, schema)).to.deep.equal({
            share: rawObject.share,
        });
    });

    it("serialize bool", () => {
        expect(serialize({
            tradeable: rawObject.tradeable,
        }, schema)).to.deep.equal(serializedTradeable);
    });

    it("deserialize bool", () => {
        expect(deserialize(serializedTradeable, schema)).to.deep.equal({
            tradeable: rawObject.tradeable,
        });
    });

    it("serialize object", () => {
        expect(serialize(rawObject, schema)).to.deep.equal(concat_byte_arrays([
            serializedName,
            serializedImage,
            serializedRarity,
            serializedDepth,
            serializedWear,
            serializedTradeable,
            serializedShare,
        ]));
    });

    it("deserialize object", () => {
        expect(deserialize(concat_byte_arrays([
            serializedName,
            serializedImage,
            serializedRarity,
            serializedDepth,
            serializedWear,
            serializedTradeable,
            serializedShare,
        ]), schema)).to.deep.equal(rawObject);
    });
});
