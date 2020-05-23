/* based on npm base-x module (removed buffer, added class structure) */
export default class BaseCoder {
    private readonly BASE: number;
    private readonly BASE_MAP: Uint8Array;
    private readonly LEADER: string;
    private readonly FACTOR: number;
    private readonly iFACTOR: number;

    constructor(private readonly ALPHABET: string) {
        if (ALPHABET.length >= 255) {
            throw new TypeError('Alphabet too long');
        }
        this.BASE_MAP = new Uint8Array(256);

        for (let j = 0; j < this.BASE_MAP.length; j++) {
            this.BASE_MAP[j] = 255;
        }

        for (let i = 0; i < ALPHABET.length; i++) {
            const x = ALPHABET.charAt(i);
            const xc = x.charCodeAt(0);
            if (this.BASE_MAP[xc] !== 255) {
                throw new TypeError(x + ' is ambiguous');
            }
            this.BASE_MAP[xc] = i;
        }

        this.BASE = ALPHABET.length;
        this.LEADER = ALPHABET.charAt(0);
        this.FACTOR = Math.log(this.BASE) / Math.log(256); // log(BASE) / log(256), rounded up
        this.iFACTOR = Math.log(256) / Math.log(this.BASE); // log(256) / log(BASE), rounded up
    }

    encode(source: Uint8Array): string {
        if (source.length === 0) {
            return '';
        }
        // Skip & count leading zeroes.
        let zeroes = 0;
        let length = 0;
        let pbegin = 0;
        const pend = source.length;

        while (pbegin !== pend && source[pbegin] === 0) {
            pbegin++;
            zeroes++;
        }

        // Allocate enough space in big-endian base58 representation.
        const size = ((pend - pbegin) * this.iFACTOR + 1) >>> 0;
        const b58 = new Uint8Array(size);
        // Process the bytes.
        while (pbegin !== pend) {
            let carry = source[pbegin];
            // Apply "b58 = b58 * 256 + ch".
            let i = 0;
            for (let it1 = size - 1; (carry !== 0 || i < length) && (it1 !== -1); it1--, i++) {
                carry += (256 * b58[it1]) >>> 0;
                b58[it1] = (carry % this.BASE) >>> 0;
                carry = (carry / this.BASE) >>> 0;
            }
            if (carry !== 0) {
                throw new Error('Non-zero carry');
            }
            length = i;
            pbegin++;
        }

        // Skip leading zeroes in base58 result.
        let it2 = size - length;
        while (it2 !== size && b58[it2] === 0) {
            it2++;
        }

        // Translate the result into a string.
        let str = this.LEADER.repeat(zeroes);
        for (; it2 < size; ++it2) {
            str += this.ALPHABET.charAt(b58[it2]);
        }

        return str;
    }

    decode(source: string): Uint8Array {
        const buffer = this.decodeUnsafe(source);
        if (buffer) {
            return buffer;
        }

        throw new Error('Non-base' + this.BASE + ' character');
    }

    private decodeUnsafe(source: string): Uint8Array {
        if (source.length === 0) {
            return new Uint8Array(0);
        }
        let psz = 0;
        // Skip leading spaces.
        if (source[psz] === ' ') {
            return new Uint8Array(0);
        }

        // Skip and count leading '1's.
        let zeroes = 0;
        let length = 0;
        while (source[psz] === this.LEADER) {
            zeroes++;
            psz++;
        }

        // Allocate enough space in big-endian base256 representation.
        const size = (((source.length - psz) * this.FACTOR) + 1) >>> 0; // log(58) / log(256), rounded up.
        const b256 = new Uint8Array(size);

        // Process the characters.
        while (source[psz]) {
            // Decode character
            let carry = this.BASE_MAP[source.charCodeAt(psz)];
            // Invalid character
            if (carry === 255) {
                return new Uint8Array(0);
            }
            let i = 0;
            for (let it3 = size - 1; (carry !== 0 || i < length) && (it3 !== -1); it3--, i++) {
                carry += (this.BASE * b256[it3]) >>> 0;
                b256[it3] = (carry % 256) >>> 0;
                carry = (carry / 256) >>> 0;
            }
            if (carry !== 0) {
                throw new Error('Non-zero carry');
            }
            length = i;
            psz++;
        }

        // Skip trailing spaces.
        if (source[psz] === ' ') {
            return new Uint8Array(0);
        }
        // Skip leading zeroes in b256.
        let it4 = size - length;
        while (it4 !== size && b256[it4] === 0) {
            it4++;
        }

        const vch = new Uint8Array(zeroes + (size - it4));
        vch.fill(0x00, 0, zeroes);

        let j = zeroes;
        while (it4 !== size) {
            vch[j++] = b256[it4++];
        }

        return vch;
    }
}
