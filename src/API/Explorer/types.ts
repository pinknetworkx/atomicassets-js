import { SchemaObject } from '../../Schema';

export type ApiAsset = {
    contract: string,
    asset_id: string,
    owner: string,
    name: string,
    is_transferable: boolean,
    is_burnable: boolean,
    collection: {
        collection_name: string,
        name: string,
        author: string,
        allow_notify: boolean,
        authorized_accounts: string[],
        notify_accounts: string[],
        market_fee: boolean,
        created_at_block: number,
        created_at_time: number
    },
    schema: {
        schema_name: string,
        format: SchemaObject[],
        created_at_block: number,
        created_at_time: number
    },
    template: null | {
        template_id: number,
        max_supply: number,
        issued_supply: number,
        is_transferable: boolean,
        is_burnable: boolean,
        immutable_data: {[key: string]: any},
        created_at_time: number,
        created_at_block: number
    },
    backed_tokens: Array<{
        token_contract: string,
        token_symbol: string,
        token_precision: number,
        amount: number
    }>,
    immutable_data: {[key: string]: any},
    mutable_data: {[key: string]: any},
    data: {[key: string]: any},
    burned_at_time: number | null,
    burned_at_block: number | null,
    updated_at_time: number,
    updated_at_block: number,
    minted_at_time: number,
    minted_at_block: number
};

export type ApiCollection = {
    contract: string,
    collection_name: string,
    name: string,
    author: string,
    allow_notify: boolean,
    authorized_accounts: string[],
    notify_accounts: string[],
    market_fee: number,
    data: {[key: string]: any},
    created_at_block: number,
    created_at_time: number
};

export type ApiSchema = {
    contract: string,
    schema_name: string,
    format: SchemaObject[],
    created_at_block: number,
    created_at_time: number,
    collection: {
        collection_name: string,
        name: string,
        author: string,
        allow_notify: boolean,
        authorized_accounts: string[],
        notify_accounts: string[],
        market_fee: boolean,
        created_at_block: number,
        created_at_time: number
    }
};

export type ApiTemplate = {
    contract: string,
    template_id: number,
    max_supply: number,
    issued_supply: number,
    is_transferable: boolean,
    is_burnable: boolean,
    immutable_data: {[key: string]: any},
    created_at_time: number,
    created_at_block: number,
    collection: {
        collection_name: string,
        name: string,
        author: string,
        allow_notify: boolean,
        authorized_accounts: string[],
        notify_accounts: string[],
        market_fee: boolean,
        created_at_block: number,
        created_at_time: number
    },
    schema: {
        schema_name: string,
        format: SchemaObject[],
        created_at_block: number,
        created_at_time: number
    }
};

export type ApiOffer = {
    contract: string,
    offer_id: string,
    sender_name: string,
    recipient_name: string,
    memo: string,
    state: number,
    is_sender_contract: boolean,
    is_recipient_contract: boolean,
    sender_assets: ApiAsset[],
    recipient_assets: ApiAsset[],
    updated_at_block: number,
    updated_at_time: number,
    created_at_block: number,
    created_at_time: number
};

export type ApiTransfer = {
    contract: string,
    sender_name: string,
    recipient_name: string,
    memo: string,
    assets: ApiAsset[],
    created_at_block: number,
    created_at_time: number
};

export type ApiLog = {
    log_id: number,
    name: string,
    data: any,
    txid: string,
    created_at_block: number,
    created_at_time: number
};

export type ApiConfig = {
    contract: string,
    version: string,
    collection_format: SchemaObject[]
};
