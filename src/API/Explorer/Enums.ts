export enum OfferState {
    Pending,
    Invalid,
    Unknown,
    Accepted,
    Declined,
    Canceled
}

export enum OrderParam {
    Asc = 'asc',
    Desc = 'desc'
}

export enum AssetsSort {
    AssetId = 'asset_id',
    Updated = 'updated',
    Transferred = 'transferred',
    Minted = 'minted',
    TemplateMint = 'template_mint',
    Name = 'name'
}

export enum CollectionsSort {
    Created = 'created',
    CollectionName = 'collection_name'
}

export enum OffersSort {
    Created = 'created',
    Updated = 'updated'
}

export enum SchemasSort {
    Created = 'created',
    SchemaName = 'schema_name'
}

export enum TemplatesSort {
    Created = 'created',
    Name = 'name'
}

export enum TransfersSort {
    Created = 'created'
}
