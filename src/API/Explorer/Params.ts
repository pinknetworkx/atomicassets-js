import { AssetsSort, CollectionsSort, OffersSort, OfferState, OrderParam, SchemasSort, TemplatesSort, TransfersSort } from './Enums';

export interface GreylistParams {
    collection_blacklist?: string;
    collection_whitelist?: string;
}

export interface HideOffersParams {
    hide_offers?: boolean;
}

export interface PrimaryBoundaryParams {
    ids?: string;
    lower_bound?: string;
    upper_bound?: string;
}

export interface DateBoundaryParams {
    before?: number;
    after?: number;
}

export interface AssetFilterParams {
    asset_id?: string;
    owner?: string;
    burned?: boolean;
    collection_name?: string;
    schema_name?: string;
    template_id?: number;
    match?: string;
    is_transferable?: boolean;
    is_burnable?: boolean;
    [key: string]: any;
}

export interface AssetsApiParams extends GreylistParams, HideOffersParams, PrimaryBoundaryParams, DateBoundaryParams {
    authorized_account?: string;
    only_duplicate_templates?: boolean;

    min_template_mint?: number;
    max_template_mint?: number;
    template_blacklist?: string;
    template_whitelist?: string;

    order?: OrderParam;
    sort?: AssetsSort;
}

export interface CollectionApiParams extends GreylistParams, PrimaryBoundaryParams, DateBoundaryParams {
    author?: string;
    match?: string;
    authorized_account?: string;
    notify_account?: string;

    order?: OrderParam;
    sort?: CollectionsSort;
}

export interface SchemaApiParams extends GreylistParams, PrimaryBoundaryParams, DateBoundaryParams {
    collection_name?: string;
    schema_name?: string;
    match?: string;
    authorized_account?: string;

    order?: OrderParam;
    sort?: SchemasSort;
}

export interface TemplateApiParams extends GreylistParams, PrimaryBoundaryParams, DateBoundaryParams {
    collection_name?: string;
    schema_name?: string;
    authorized_account?: string;
    template_id?: string;
    max_supply?: number;
    has_assets?: boolean;

    issued_supply?: number;
    min_issued_supply?: number;
    max_issued_supply?: number;

    is_transferable?: boolean;
    is_burnable?: boolean;

    order?: OrderParam;
    sort?: TemplatesSort;
    [key: string]: any;
}

export interface TransferApiParams extends GreylistParams, PrimaryBoundaryParams, DateBoundaryParams {
    account?: string;
    sender?: string;
    recipient?: string;
    asset_id?: string;

    order?: OrderParam;
    sort?: TransfersSort;
}

export interface OfferApiParams extends GreylistParams, PrimaryBoundaryParams, DateBoundaryParams {
    account?: string;
    sender?: string;
    recipient?: string;
    asset_id?: string;
    state?: OfferState;

    is_recipient_contract?: boolean;
    hide_contracts?: boolean;

    recipient_asset_blacklist?: string;
    recipient_asset_whitelist?: string;
    sender_asset_blacklist?: string;
    sender_asset_whitelist?: string;
    account_whitelist?: string;
    account_blacklist?: string;

    order?: OrderParam;
    sort?: OffersSort;
}

export interface AccountApiParams extends GreylistParams, PrimaryBoundaryParams, DateBoundaryParams {
    match?: string;
    collection_name?: string;
    schema_name?: string;
    template_id?: string;
}
