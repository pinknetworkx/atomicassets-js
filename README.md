# AtomicAssets JavaScript

JS Library to read data from the atomicassets NFT standard.

Contract / General Documentation can be found on [https://github.com/pinknetworkx/atomicassets-contracts/wiki](https://github.com/pinknetworkx/atomicassets-contracts/wiki)

## Usage

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
$ npm install atomicassets
```

### Initialize

Web library can be found in the `dist` folder

```javascript
// standard import
const {RpcApi} = require("atomicassets");
// ES6 import
import {RpcApi} from "atomicassets"
// node fetch or fetch browser module
const fetch = require("node-fetch");

// init RPC Api
// node: standard rpc node which will be used to fetch data (no v1 or v2 history needed)
// contract: account name where the contract is deployed
// options:
// - fetch: either node-fetch module or the browser equivalent
// - rateLimit: defines how much requests per second can be made to not exceed the rate limit of the node
const api = new RpcApi("https://testnet.wax.pink.gg", "atomicassets", {fetch, rateLimit: 4});

// fetch preset data
const asset = await api.getAsset("leonleonleon", "1099511627786");

// create the action to mint an asset
const actions = api.action.mintasset(
    [{actor: "pinknetworkx", permission: "active"}],
    "collection", "scheme", -1, "pinknetworkx", {"name": "test"}, {"species": "test2"}
)

```

### Serialization

AtomicAssets uses serialization to store data on the blockchain more efficiently. 
The API classes will handle this for you but if you need to manually parse the data,
the library provides you a serialize and deserialize function

More information can be found [here](https://github.com/pinknetworkx/atomicassets-contracts/wiki/Serialization)

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

* **RpcAPI**: uses only native nodeos calls
* **ExplorerAPI**: uses an hosted API which proves simple and fast REST API endpoints

### RpcActionGenerator

Both APIs have a `action` attribute which contains a helper class to construct contract actions 
which can be pushed on chain with eosjs. See an example on top of the page.

Detailed information about each action can be found [here](https://github.com/pinknetworkx/atomicassets-contracts/wiki/Actions)

### RpcApi

This api only uses native nodeos api calls to fetch data about NFTs. 
It is recommended to use the Explorer API for production or applications which require fast load times.

#### Methods

Caching can be disabled by explicitly setting cache to false

* `async getAsset(owner: string, id: string, cache: boolean = true): Promise<RpcAsset>`
  * gets data about a specific asset owned by owner
* `async getPreset(id: string, cache: boolean = true): Promise<RpcPreset>`
  * gets a specific preset by id
* `async getScheme(collection: string, name: string, cache: boolean = true): Promise<RpcScheme>`
  * get a scheme by its name
* `async getCollection(name: string, cache: boolean = true): Promise<RpcCollection>`
  * gets an offer by its id
* `async getOffer(id: string, cache: boolean = true): Promise<RpcOffer>`
  * gets an offer by its id
* `async getAccountOffers(account: string, cache: boolean = true): Promise<RpcOffer[]>`
  * get all offers which are sent or received by an account
* `async getAccountAssets(account: string, cache: boolean = true): Promise<RpcAsset[]>`
  * gets the complete inventory of a specific account (may take long for bigger inventories)
  
#### Types

These classes represent table rows of the contract and consist of getter methods
which return the deserialized data.
The method `toObject` returns a JavaScript object representation of the class.

##### RpcAsset

* `async collection(): Promise<RpcCollection>`
* `async scheme(): Promise<RpcScheme>`
* `async preset(): Promise<RpcPreset | null>`
* `async backedTokens(): Promise<string[]>`
* `async immutableData(): Promise<object>`
* `async mutableData(): Promise<object>`
* `async data(): Promise<object>`
* `async toObject(): Promise<object>`

##### RpcPreset

* `async collection(): Promise<RpcCollection>`
* `async scheme(): Promise<RpcScheme>`
* `async immutableData(): Promise<object>`
* `async isTransferable(): Promise<boolean>`
* `async isBurnable(): Promise<boolean>`
* `async maxSupply(): Promise<number>`
* `async circulation(): Promise<number>`
* `async toObject(): Promise<object>`

##### RpcScheme
* `async format(): Promise<ISchema>`
* `async toObject(): Promise<object>`

##### RpcCollection
* `async author(): Promise<string>`
* `async allowNotify(): Promise<boolean>`
* `async authorizedAccounts(): Promise<string[]>`
* `async notifyAccounts(): Promise<string[]>`
* `async marketFee(): Promise<number>`
* `async data(): Promise<any>`
* `async toObject(): Promise<object>`

##### RpcOffer
* `async sender(): Promise<string>`
* `async recipient(): Promise<string>`
* `async senderAssets(): Promise<Array<RpcAsset | string>>`
  * if element is a string, the asset is not owned by the sender anymore and the offer is invalid
* `async recipientAssets(): Promise<Array<RpcAsset | string>>`
  * if element is a string, the asset is not owned by the recipient anymore and the offer is invalid
* `async memo(): Promise<string>`
* `async toObject(): Promise<object>`

### Explorer API

COMING SOON
