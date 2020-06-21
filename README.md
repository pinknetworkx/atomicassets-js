# AtomicAssets JavaScript

JS Library to read data from the atomicassets NFT standard.

Contract / General Documentation can be found on [https://github.com/pinknetworkx/atomicassets-contract/wiki](https://github.com/pinknetworkx/atomicassets-contract/wiki)

## Usage

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
$ npm install atomicassets
```

### Initialize

Web library can be found in the [dist](https://github.com/pinknetworkx/atomicassets-js/blob/master/dist/atomicassets.js) folder

```javascript
// standard import
const {ExplorerApi, RpcApi} = require("atomicassets");
// ES6 import
import {ExplorerApi, RpcApi} from "atomicassets"
```

### Serialization

AtomicAssets uses serialization to store data on the blockchain more efficiently. 
The API classes will handle this for you but if you need to manually parse the data,
the library provides you a serialize and deserialize function

More information can be found [here](https://github.com/pinknetworkx/atomicassets-contract/wiki/Serialization)

#### Example
```javascript
import {serialize, deserialize, ObjectSchema} from "atomicassets"

// this schema is used for serialisation / deserialization
const schema = ObjectSchema([
    {"name": "attr1", "type": "int32"}, // int8, int16, int32, int64
    {"name": "attr2", "type": "uint32"}, // uint8, uint16, uint32, uint64
    {"name": "attr3", "type": "fixed32"}, // fixed8, fixed16, fixed32, fixed64
    
    {"name": "attr4", "type": "bool"},
    
    {"name": "attr5", "type": "bytes"}, // variable length raw bytes (UInt8Array)
    {"name": "attr6", "type": "string"}, // variable length string
    
    {"name": "attr7", "type": "ipfs"}, // ipfs hash
    {"name": "attr7", "type": "float"}, 
    {"name": "attr9", "type": "double"},
    
    {"name": "arr1", "type": "int32[]"}, // you can add [] to define a type array
]);

// the object which will be serialized does not need to have all attributes
// and only the ones who are set, are transferred
const rawObject = {
    "attr1": -5843
};

// serialize
const serializedData = serialize(rawObject, schema);
// deserialize
const deserializedData = deserialize(serializedData, schema);
// deserializedData === rawObject
```

## Documentation

There are two methods available to fetch data from the blockchain.

* **ExplorerAPI**: uses an hosted API which proves simple and fast REST API endpoints
* **RpcAPI**: uses only native nodeos calls

### Explorer API

The explorer API uses [atomicassets-api](https://github.com/pinknetworkx/atomicassets-api) to query data about the NFTs. 
A documentation of each endpoint and its responses can be found [here](https://wax-test.api.atomicassets.io/atomicassets/docs/#/).
It is recommended to self-host the API for the best performance.


#### Example
```javascript
// init Explorer Api
// endpoint: server where atomicassets api is deployed
// namespace: used namespace for the API
// options:
// - fetch: either node-fetch module or the browser equivalent
const api = new ExplorerApi("https://wax-test.api.atomicassets.io", "atomicassets", {fetch});

const asset = await api.getAsset("1099511627786");

// create the action to mint an asset
const actions = (await api.action).mintasset(
    [{actor: "pinknetworkx", permission: "active"}],
    "collection", "scheme", -1, "pinknetworkx", {"name": "test"}, {"species": "test2"}
)
```

#### Methods

##### Config
`async getConfig(): Promise<ApiConfig>`

##### Assets
`async getAssets(options, page: number = 1, limit: number = 100, data = {}): Promise<ApiAsset[]>`
options
* **owner**: string
* **collection_name**: string
* **schema_name**: string
* **template_id**: number
* **match**: search for input in name
* **authorized_account**: string
* **order**: field which is used to sort result
* **sort**: asc | desc

data
* query for specific asset attributes

`async getAsset(id: string): Promise<ApiAsset>`

`async getAssetLogs(id: string, page: number = 1, limit: number = 100, order: string = 'desc'): Promise<ApiLog[]>`

##### Collections
`async getCollections(options, page: number = 1, limit: number = 100): Promise<ApiCollection[]>`

options
* **author**: string
* **match**: search for input in name
* **authorized_account**: string
* **notify_account**: string
* **order**: field which is used to sort result
* **sort**: asc | desc

`async getCollection(name: string): Promise<ApiCollection>`

`async getCollectionLogs(name: string, page: number = 1, limit: number = 100, order: string = 'desc'): Promise<ApiLog[]>`

##### Schemas
`async getSchemas(options, page: number = 1, limit: number = 100): Promise<ApiSchema[]>`

options
* **collection_name**: string
* **schema_name**: string
* **match**: search for input in name
* **authorized_account**: string
* **order**: field which is used to sort result
* **sort**: asc | desc

`async getSchema(collection: string, name: string): Promise<ApiSchema>`

`async getSchemaStats(collection: string, name: string): Promise<ApiSchemaStats[]>`

`async getSchemaLogs(collection: string, name: string, page: number = 1, limit: number = 100, order: string = 'desc'): Promise<ApiLog[]>`

##### Templates
`async getTemplates(options, page: number = 1, limit: number = 100, data = {}): Promise<ApiTemplate[]>`

options
* **collection_name**: string
* **schema_name**: string
* **authorized_account**: string
* **order**: field which is used to sort result
* **sort**: asc | desc

data
* filter for specific template attributes

`async getTemplate(collection: string, id: string): Promise<ApiTemplate>`

`async getTemplateStats(collection: string, id: string): Promise<ApiTemplateStats[]>`

`async getTemplateLogs(collection: string, id: string, page: number = 1, limit: number = 100, order: string = 'desc'): Promise<ApiLog[]>`

##### Trading
`async getTransfers(options, page: number = 1, limit: number = 100): Promise<ApiTransfe[]>`

options
* **account**: string
* **sender**: string
* **recipient**: string
* **asset_id**: asset id which should be included in the offer
* **order**: field which is used to sort result
* **sort**: asc | desc

`async getOffers(options, page: number = 1, limit: number = 100): Promise<ApiOffer[]>`

options
* **account**: notified account
* **sender**: sender of offer
* **recipient**: recipient of offer
* **is_recipient_contract**: filter if recipient is contract or not
* **asset_id**: asset_id included in offer
* **order**: field which is used to sort result
* **sort**: asc | desc

`async getOffer(id: string): Promise<ApiOffer>`

#### ExplorerActionGenerator

The Explorer API has an `action` attribute which contains a helper class to construct contract actions 
which can be pushed on chain with eosjs. 

Detailed information about each action can be found [here](https://github.com/pinknetworkx/atomicassets-contract/wiki/Actions) 

#### Types

Each method returns the unmodified response from the API call. For more information look at the Models 
on [the documentation](https://wax-test.api.atomicassets.io/atomicassets/docs/#/)

### RpcApi

This API only uses native nodeos api calls to fetch data about NFTs. 
It is recommended to use the Explorer API for production or applications which require fast load times.

#### Example
```javascript
// init RPC Api
// node: standard rpc node which will be used to fetch data (no v1 or v2 history needed)
// contract: account name where the contract is deployed
// options:
// - fetch: either node-fetch module or the browser equivalent
// - rateLimit: defines how much requests per second can be made to not exceed the rate limit of the node
const api = new RpcApi("https://testnet.wax.pink.gg", "atomicassets", {fetch, rateLimit: 4});

const asset = await api.getAsset("leonleonleon", "1099511627786");

// create the action to mint an asset
const actions = api.action.mintasset(
    [{actor: "pinknetworkx", permission: "active"}],
    "collection", "scheme", -1, "pinknetworkx", {"name": "test"}, {"species": "test2"}
)
```

#### Methods

Caching can be disabled by explicitly setting cache to false

`async getAsset(owner: string, id: string, cache: boolean = true): Promise<RpcAsset>`

*Gets data about a specific asset owned by owner*

`async getTemplate(id: string, cache: boolean = true): Promise<RpcTemplate>`

*Gets a specific template by id*

`async getScheme(collection: string, name: string, cache: boolean = true): Promise<RpcScheme>`

*Get a scheme by its name*

`async getCollection(name: string, cache: boolean = true): Promise<RpcCollection>`

*Gets an offer by its id*

`async getCollectionTemplates(collection: string, cache: boolean = true): Promise<RpcTemplates[]>`

*Gets all templates of a collection*

`async getCollectionSchemes(collection: string, cache: boolean = true): Promise<RpcSchemes[]>`

*Gets all schemes of a collection*

`async getOffer(id: string, cache: boolean = true): Promise<RpcOffer>`

*Gets an offer by its id*

`async getAccountOffers(account: string, cache: boolean = true): Promise<RpcOffer[]>`

*Get all offers which are sent or received by an account*

`async getAccountAssets(account: string, cache: boolean = true): Promise<RpcAsset[]>`

*Gets the complete inventory of a specific account (may take long for bigger inventories)*
  
#### RpcActionGenerator

The RPC API has an `action` attribute which contains a helper class to construct contract actions 
which can be pushed on chain with eosjs. 

Detailed information about each action can be found [here](https://github.com/pinknetworkx/atomicassets-contract/wiki/Actions) 
 
#### Types

These classes represent table rows of the contract and consist of getter methods
which return the deserialized data.
The method `toObject` returns a JavaScript object representation of the class.

##### RpcAsset

`async collection(): Promise<RpcCollection>`

`async schema(): Promise<RpcSchema>`

`async template(): Promise<RpcTemplate | null>`

`async backedTokens(): Promise<string[]>`

`async immutableData(): Promise<object>`

`async mutableData(): Promise<object>`

`async data(): Promise<object>`

`async toObject(): Promise<object>`


##### RpcTemplate

`async collection(): Promise<RpcCollection>`

`async scheme(): Promise<RpcScheme>`

`async immutableData(): Promise<object>`

`async isTransferable(): Promise<boolean>`

`async isBurnable(): Promise<boolean>`

`async maxSupply(): Promise<number>`

`async circulation(): Promise<number>`

`async toObject(): Promise<object>`


##### RpcSchema
`async collection(): Promise<ISchema>`

`async format(): Promise<ISchema>`

`async toObject(): Promise<object>`


##### RpcCollection
`async author(): Promise<string>`

`async allowNotify(): Promise<boolean>`

`async authorizedAccounts(): Promise<string[]>`

`async notifyAccounts(): Promise<string[]>`

`async marketFee(): Promise<number>`

`async data(): Promise<any>`

`async toObject(): Promise<object>`


##### RpcOffer
`async sender(): Promise<string>`

`async recipient(): Promise<string>`

`async senderAssets(): Promise<Array<RpcAsset | string>>`

*If element is a string, the asset is not owned by the sender anymore and the offer is invalid*

`async recipientAssets(): Promise<Array<RpcAsset | string>>`

*If element is a string, the asset is not owned by the recipient anymore and the offer is invalid*

`async memo(): Promise<string>`

`async toObject(): Promise<object>`
