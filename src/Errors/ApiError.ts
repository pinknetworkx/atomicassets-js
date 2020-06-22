export default class ApiError extends Error {
    isApiError = true;

    constructor(readonly message: any, readonly status: number) {
        super(message);
    }
}
