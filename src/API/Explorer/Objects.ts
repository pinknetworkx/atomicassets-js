import { SchemaObject } from '../../Schema';
import { OfferState } from './Enums';

export interface ILightCollection {
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

export interface ILightSchema {
    schema_name: string;
    format: SchemaObject[];
    created_at_block: string;
    created_at_time: string;
}

export interface ILightTemplate {
    template_id: string;
    max_supply: string;
    is_transferable: boolean;
    is_burnable: boolean;
    issued_supply: string;
    immutable_data: {[key: string]: any};
    created_at_block: string;
    created_at_time: string;
}

export interface IAsset {
    contract: string;
    asset_id: string;
    owner: string | null;
    name: string;
    is_transferable: boolean;
    is_burnable: boolean;
    template_mint: string;
    collection: ILightCollection;
    schema: ILightSchema;
    template: ILightTemplate | null;
    backed_tokens: Array<{token_contract: string, token_symbol: string, token_precision: number, amount: string}>;
    immutable_data: {[key: string]: any};
    mutable_data: {[key: string]: any};
    data: {[key: string]: any};
    burned_by_account: string | null;
    burned_at_block: string | null;
    burned_at_time: string | null;
    updated_at_block: string;
    updated_at_time: string;
    transferred_at_block: string;
    transferred_at_time: string;
    minted_at_block: string;
    minted_at_time: string;
}

export interface ICollection extends ILightCollection {
    contract: string;
}

export interface ISchema extends ILightSchema {
    contract: string;
    collection: ILightCollection;
}

export interface ITemplate extends ILightTemplate {
    contract: string;
    collection: ILightCollection;
    schema: ILightSchema;
}

export interface IOffer {
    contract: string;
    offer_id: string;
    sender_name: string;
    recipient_name: string;
    memo: string;
    state: OfferState;
    sender_assets: IAsset[];
    recipient_assets: IAsset[];
    is_sender_contract: boolean;
    is_recipient_contract: boolean;
    updated_at_block: string;
    updated_at_time: string;
    created_at_block: string;
    created_at_time: string;
}

export interface ITransfer {
    contract: string;
    transfer_id: string;
    sender_name: string;
    recipient_name: string;
    memo: string;
    txid: string;
    assets: IAsset[];
    created_at_block: string;
    created_at_time: string;
}

export interface ILog {
    log_id: string;
    name: string;
    data: {[key: string]: any};
    txid: string;
    created_at_block: string;
    created_at_time: string;
}

export interface IConfig {
    contract: string;
    version: string;
    collection_format: SchemaObject[];
    supported_tokens: Array<{token_contract: string, token_symbol: string, token_precision: number}>;
}

/* RESPONSES */

export interface IAssetStats {
    template_mint: number;
}

export interface ICollectionStats {
    assets: string;
    burned: string;
    templates: string;
    schemas: string;
    burned_by_template: Array<{template_id: string, burned: number}>;
    burned_by_schema: Array<{schema_name: string, burned: number}>;
}

export interface ISchemaStats {
    assets: string;
    burned: string;
    templates: string;
}

export interface ITemplateStats {
    assets: string;
    burned: string;
}

export interface IAccountStats {
    collections: Array<{collection: ICollection, assets: string}>;
    templates: Array<{template_id: string, assets: string}>;
    assets: string;
}

export interface IAccountCollectionStats {
    schemas: Array<{schema_name: ICollection, assets: string}>;
    templates: Array<{template_id: string, assets: string}>;
}
