import { SchemaObject } from '../../Schema';

export enum ApiOfferState {
    Pending,
    Invalid,
    Unknown,
    Accepted,
    Declined,
    Canceled
}

export interface ApiAsset {
    contract: string;
    asset_id: string;
    owner: string;
    name: string;
    is_transferable: boolean;
    is_burnable: boolean;
    collection: {
        collection_name: string,
        name: string,
        author: string,
        allow_notify: boolean,
        authorized_accounts: string[],
        notify_accounts: string[],
        market_fee: boolean,
        created_at_block: string,
        created_at_time: string
    };
    schema: {
        schema_name: string,
        format: SchemaObject[],
        created_at_block: string,
        created_at_time: string
    };
    template: null | {
        template_id: string,
        max_supply: string,
        issued_supply: string,
        is_transferable: boolean,
        is_burnable: boolean;
        immutable_data: {[key: string]: any},
        created_at_time: string,
        created_at_block: string
    };
    backed_tokens: Array<{
        token_contract: string,
        token_symbol: string,
        token_precision: number,
        amount: string
    }>;
    immutable_data: {[key: string]: any};
    mutable_data: {[key: string]: any};
    data: {[key: string]: any};
    burned_by_account: string | null;
    burned_at_time: string | null;
    burned_at_block: string | null;
    transferred_at_time: string;
    transferred_at_block: string;
    updated_at_time: string;
    updated_at_block: string;
    minted_at_time: string;
    minted_at_block: string;
}

export interface ApiCollection {
    contract: string;
    collection_name: string;
    name: string;
    img: string;
    author: string;
    allow_notify: boolean;
    authorized_accounts: string[];
    notify_accounts: string[];
    market_fee: number;
    data: {[key: string]: any};
    created_at_block: string;
    created_at_time: string;
}

export interface ApiSchema {
    contract: string;
    schema_name: string;
    format: SchemaObject[];
    created_at_block: string;
    created_at_time: string;
    collection: {
        collection_name: string,
        name: string,
        img: string,
        author: string,
        allow_notify: boolean,
        authorized_accounts: string[],
        notify_accounts: string[],
        market_fee: boolean,
        created_at_block: string,
        created_at_time: string
    };
}

export interface ApiSchemaStats {
    assets: string;
    templates: string;
}

export interface ApiTemplate {
    contract: string;
    template_id: string;
    max_supply: string;
    issued_supply: string;
    is_transferable: boolean;
    is_burnable: boolean;
    immutable_data: {[key: string]: any};
    created_at_time: string;
    created_at_block: string;
    collection: {
        collection_name: string,
        name: string,
        img: string,
        author: string,
        allow_notify: boolean,
        authorized_accounts: string[],
        notify_accounts: string[],
        market_fee: boolean,
        created_at_block: string,
        created_at_time: string
    };
    schema: {
        schema_name: string,
        format: SchemaObject[],
        created_at_block: string,
        created_at_time: string
    };
}

export interface ApiTemplateStats {
    assets: string;
}

export interface ApiOffer {
    contract: string;
    offer_id: string;
    sender_name: string;
    recipient_name: string;
    memo: string;
    state: ApiOfferState;
    is_sender_contract: boolean;
    is_recipient_contract: boolean;
    sender_assets: ApiAsset[];
    recipient_assets: ApiAsset[];
    updated_at_block: string;
    updated_at_time: string;
    created_at_block: string;
    created_at_time: string;
}

export interface ApiTransfer {
    contract: string;
    sender_name: string;
    recipient_name: string;
    memo: string;
    assets: ApiAsset[];
    created_at_block: string;
    created_at_time: string;
}

export interface ApiLog {
    log_id: number;
    name: string;
    data: any;
    txid: string;
    created_at_block: string;
    created_at_time: string;
}

export interface ApiConfig {
    contract: string;
    version: string;
    collection_format: SchemaObject[];
    supported_tokens: Array<{token_contract: string, token_symbol: string, token_precision: number}>;
}
