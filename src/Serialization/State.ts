export default class SerializationState {
    constructor(readonly data: Uint8Array, public position: number = 0) {
    }
}

export function prepare(data: Uint8Array): SerializationState {
    return new SerializationState(data, 0);
}
