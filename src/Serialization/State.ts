export default class SerializationState {
    constructor(public readonly data: Uint8Array, public position: number = 0) { }
}

export function prepare(data: Uint8Array) {
    return new SerializationState(data, 0);
}
