export interface ICache {
    get<T = any>(key: string): T | null;
    put(key: string, value: any, timeout: number): void;
    remove(key: string): void;
}

export class MemoryCache implements ICache {
    private readonly store: any;

    constructor() {
        this.store = {};
    }

    get<T = any>(key: string): T | null {
        const res = this.store[key];

        if (typeof res === 'undefined') {
            return null;
        }

        const [value, expires] = res;

        if (new Date() > expires) {
            delete this.store[key];
            return null;
        }

        return value;
    }

    put(key: string, value: any, timeout: number): void {
        const expires = new Date(Date.now() + timeout);

        this.store[key] = [value, expires];
    }

    remove(key: string): void {
        delete this.store[key];
    }
}
