
export type SchemaFormat = Array<{ name: string, type: string }>;

export interface ICollectionRow {
    collection_name: string;
    author: string;
    allow_notify: boolean;
    authorized_accounts: string[];
    notify_accounts: string[];
    market_fee: number;
    serialized_data: Uint8Array;
}

export interface ISchemaRow {
    schema_name: string;
    format: SchemaFormat;
}

export interface ITemplateRow {
    template_id: number;
    schema_name: string;
    transferable: boolean;
    burnable: boolean;
    max_supply: number;
    issued_supply: number;
    immutable_serialized_data: Uint8Array;
}

export interface IAssetRow {
    asset_id: string;
    collection_name: string;
    schema_name: string;
    template_id: string;
    ram_payer: string;
    backed_tokens: string[];
    immutable_serialized_data: Uint8Array;
    mutable_serialized_data: Uint8Array;
}

export interface IOfferRow {
    offer_id: string;
    sender: string;
    recipient: string;
    sender_asset_ids: string[];
    recipient_asset_ids: string[];
    memo: string;
}

export interface IConfigRow {
    asset_counter: string;
    offer_counter: string;
    collection_format: SchemaFormat;
}

class SaneCache {
  private readonly store: any;
  constructor() {
    this.store = {};
  }
  
  get(key: string) {
    const res = this.store[key];
    if(typeof res === 'undefined') {
      return null;
    }
    const [value, expires] = res;
    if(new Date() > expires) {
      delete this.store[key];
      return null;
    } else {
      return value
    }
  }
  
  put(key: string, value: any, timeout: number) {
    const expires = new Date(Date.now() + timeout);
    this.store[key] = [value, expires];
  }
  remove(key: string) {
    delete this.store[key];
  }
}

export default class RpcCache {
    private readonly cache: any;

    constructor() {
        this.cache = new SaneCache();
    }

    getAsset(assetID: string, data?: IAssetRow): IAssetRow | null {
        if (data) {
            data.mutable_serialized_data = new Uint8Array(data.mutable_serialized_data);
            data.immutable_serialized_data = new Uint8Array(data.immutable_serialized_data);
        }

        return this.access<IAssetRow>('assets', assetID, data);
    }

    deleteAsset(assetID: string): void {
        this.delete('assets', assetID);
    }

    getTemplate(collectionName: string, templateID: string, data?: ITemplateRow): ITemplateRow | null {
        if (data) {
            data.immutable_serialized_data = new Uint8Array(data.immutable_serialized_data);
        }

        return this.access<ITemplateRow>('templates', collectionName + ':' + templateID, data);
    }

    deleteTemplate(collectionName: string, templateID: string): void {
        this.delete('templates', collectionName + ':' + templateID);
    }

    getSchema(collectionName: string, schemaName: string, data?: ISchemaRow): ISchemaRow | null {
        return this.access<ISchemaRow>('schemas', collectionName + ':' + schemaName, data);
    }

    deleteSchema(collectionName: string, schemaName: string): void {
        this.delete('schemas', collectionName + ':' + schemaName);
    }

    getCollection(collectionName: string, data?: ICollectionRow): ICollectionRow | null {
        return this.access<ICollectionRow>('collections', collectionName, data);
    }

    deleteCollection(collectionName: string): void {
        this.delete('collections', collectionName);
    }

    getOffer(offerID: string, data?: IOfferRow): IOfferRow | null {
        return this.access<IOfferRow>('offers', offerID, data);
    }

    deleteOffer(offerID: string): void {
        this.delete('offers', offerID);
    }

    private access<T>(namespace: any, identifier: any, data?: T): T | null {
        if (typeof data === 'undefined') {
            const cache = this.cache.get(namespace + ':' + identifier);

            return cache === null ? null : cache;
        }

        this.cache.put(namespace + ':' + identifier, data, 15 * 60 * 1000);

        return data;
    }

    private delete(namespace: any, identifier: any): void {
        this.cache.remove(namespace + ':' + identifier);
    }
}
