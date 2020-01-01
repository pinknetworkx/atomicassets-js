import DeserializationError from "./Errors/DeserializationError";
import SerializationError from "./Errors/SerializationError";
import SerializationState from "./Serialization/State";

export function packInteger(input: bigint, maxSize: number = 8): Uint8Array {
    const bytes: number[] = [];
    let n = input;

    if(n < 0) {
        throw new SerializationError("cant pack negative integer");
    }

    if(maxSize > 8) {
        throw new SerializationError("cant pack integer greater than 64bit");
    }

    if(n >= bigPow(2, maxSize * 8)) {
        throw new SerializationError("integer too large");
    }

    for(let i = 0; i < maxSize + 1; i++) {
        let byte;

        if(i === maxSize) {
            byte = n & BigInt(0xFF);
            n >>= BigInt(8);
        } else {
            byte = n & BigInt(0x7F);
            n >>= BigInt(7);

            if(n === BigInt(0)) {
                bytes.push(Number(byte) + 128);

                break;
            }
        }

        bytes.push(Number(byte));
    }

    return new Uint8Array(bytes);
}

export function unpackInteger(state: SerializationState, maxSize: number = 8): bigint {
    let result: bigint = BigInt(0);

    if(maxSize > 8) {
        throw new DeserializationError("cant unpack integer greater than 64bit");
    }

    for(let i = 0; i < maxSize + 1; i++) {
        if(state.position >= state.data.length) {
            throw new DeserializationError("failed to unpack integer");
        }

        const byte: number = state.data[state.position];
        state.position += 1;

        if(byte > 127 && i < maxSize) {
            result += (BigInt(byte) & BigInt(0x7F)) << BigInt(7 * i);

            break;
        }

        result += BigInt(byte) << BigInt(7 * i);
    }

    return result;
}

export function signInteger(n: bigint, size: number): bigint {
    if(n > bigPow(2, (8 * size - 1))) {
        throw new Error("cannot sign integer: too big");
    }

    if(n >= 0) {
        return n;
    } else {
        return ((BigInt(-1) * n) ^ (bigPow(2, 8 * size) - BigInt(1))) + BigInt(1);
    }
}

export function unsignInteger(n: bigint, size: number): bigint {
    if(n > bigPow(2, (8 * size))) {
        throw new Error("cannot unsign integer: too big");
    }

    if(n > bigPow(2, (8 * size - 1))) {
        return BigInt(-1) * ((n - BigInt(1)) ^ (bigPow(2, 8 * size) - BigInt(1)));
    } else {
        return n;
    }
}

// tslint:disable-next-line:no-var-requires
const bs58 = require("base-x")("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");

export function base58_decode(data: string): Uint8Array {
    const buffer = bs58.decode(data);

    return new Uint8Array(buffer);
}

export function base58_encode(data: Uint8Array): string {
    return bs58.encode(Buffer.from(data.buffer));
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

export function concatByteArrays(arr: Uint8Array[]) {
    // concat all bytearrays into one array
    const data = new Uint8Array(arr.reduce((acc, val) => acc + val.length, 0));

    let offset = 0;
    for(const bytes of arr) {
        data.set(bytes, offset);
        offset += bytes.length;
    }

    return data;
}

export function bigPow(n: bigint | number, e: bigint | number): bigint {
    let sum = BigInt(1);

    for(let i = BigInt(0); i < BigInt(e); i++) {
        sum *= BigInt(n);
    }

    return sum;
}
