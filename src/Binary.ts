import DeserializationError from "./Errors/DeserializationError";
import SerializationError from "./Errors/SerializationError";
import SerializationState from "./Serialization/State";

import bigInt, {BigInteger} from "big-integer";
import BaseCoder from "./Base";

export function packInteger(input: any, maxSize: number = 8): Uint8Array {
    const bytes: number[] = [];
    let n = bigInt(input);

    if(n.lesser(0)) {
        throw new SerializationError("cant pack negative integer");
    }

    if(maxSize > 8) {
        throw new SerializationError("cant pack integer greater than 64bit");
    }

    if(n.greaterOrEquals(bigInt(2).pow(maxSize * 8))) {
        throw new SerializationError("integer too large");
    }

    for(let i = 0; i < maxSize + 1; i++) {
        let byte;

        if(i === maxSize) {
            byte = n.and(0xFF);
            n = n.shiftRight(8);
        } else {
            byte = n.and(0x7F);
            n = n.shiftRight(7);

            if(n.equals(0)) {
                bytes.push(byte.toJSNumber() + 128);

                break;
            }
        }

        bytes.push(byte.toJSNumber());
    }

    return new Uint8Array(bytes);
}

export function unpackInteger(state: SerializationState, maxSize: number = 8): BigInteger {
    let result: BigInteger = bigInt(0);

    if(maxSize > 8) {
        throw new DeserializationError("cant unpack integer greater than 64bit");
    }

    for(let i = 0; i < maxSize + 1; i++) {
        if(state.position >= state.data.length) {
            throw new DeserializationError("failed to unpack integer");
        }

        const byte = bigInt(state.data[state.position]);
        state.position += 1;

        if(byte.greater(127) && i < maxSize) {
            result = result.plus(byte.and(0x7F).shiftLeft(7 * i));

            break;
        }

        result = result.plus(byte.shiftLeft(7 * i));
    }

    return result;
}

export function signInteger(input: any, size: number): BigInteger {
    const n = bigInt(input);

    if(n.greater(bigInt(2).pow(8 * size - 1))) {
        throw new Error("cannot sign integer: too big");
    }

    if(n.greaterOrEquals(0)) {
        return n;
    } else {
        return n.negate().xor(bigInt(2).pow(8 * size).minus(1)).plus(1);
    }
}

export function unsignInteger(input: any, size: number): BigInteger {
    const n = bigInt(input);

    if(n.greater(bigInt(2).pow(8 * size))) {
        throw new Error("cannot unsign integer: too big");
    }

    if(n.greater(bigInt(2).pow(8 * size - 1))) {
        return n.minus(1).xor(bigInt(2).pow(8 * size).minus(1)).negate();
    } else {
        return n;
    }
}

const bs58 = new BaseCoder("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");

export function base58_decode(data: string): Uint8Array {
    return bs58.decode(data);
}

export function base58_encode(data: Uint8Array): string {
    return bs58.encode(data);
}

export function hex_decode(hex: string) {
    const bytes = hex.match(/.{1,2}/g);

    if(!bytes) {
        return new Uint8Array(0);
    }

    return new Uint8Array(bytes.map((byte) => parseInt(byte, 16)));
}

export function hex_encode(bytes: Uint8Array) {
    return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
}

export function concat_byte_arrays(arr: Uint8Array[]) {
    // concat all bytearrays into one array
    const data = new Uint8Array(arr.reduce((acc, val) => acc + val.length, 0));

    let offset = 0;
    for(const bytes of arr) {
        data.set(bytes, offset);
        offset += bytes.length;
    }

    return data;
}
