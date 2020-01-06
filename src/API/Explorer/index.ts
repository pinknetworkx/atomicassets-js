type Fetch = (input?: Request | string, init?: RequestInit) => Promise<Response>;
type ApiArgs = {fetch?: Fetch, rateLimit?: number };

export default class ExplorerApi {
    private readonly endpoint: string;

    constructor(endpoint: string) {
        this
    }
}
