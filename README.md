# AtomicAssets JavaScript

JS Library to read data from the atomicassets NFT standard

## Usage

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
$ npm install atomicassets
```

### Initialize

```javascript
// standard import
const {RpcApi} = require("atomicassets");
// ES6 import
import {RpcApi} from "atomicassets"
// node fetch or fetch browser module
const fetch = require("node-fetch");

// init RPC Api
const api = new RpcApi("https://wax.pink.gg", "atomicassets", {fetch});

/* YOUR CODE HERE */

// stop fetch queue
api.queue.stop();
```

### Serialization

AtomicAssets uses serialization to store data on the blockchain more efficiently. 
The API classes will handle this for you but if you need to manually parse the data,
the library provides you a serialize and deserialize function

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

### RpcApi

This api only uses native nodeos api calls to fetch data about NFTs. 
It is recommended to use the Explorer API for production or application which need fast load times.

#### Methods

* `async get_asset(owner: string, id: string): Promise<RpcAsset>`
  * gets data about a specific asset owned by owner
* `async get_preset(id: number): Promise<RpcPreset>`
  * gets a specific preset by id
* `async get_scheme(name: string): Promise<RpcScheme>`
  * get a scheme by its name
* `async get_offer(id: number): Promise<RpcOffer>`
  * gets an offer by its id
* `async get_account_offers(account: string): Promise<RpcOffer[]>`
  * get all offers which are sent or received by an account
* `async get_account_assets(account: string): Promise<RpcAsset[]>`
  * gets the inventory of a specific account
  
#### Classes

These classes represent table rows of the contract and consist of getter methods
which return the deserialized data.
The method `toObject` returns a JavaScript object representation of the class. 

##### RpcAsset

* `async preset(): Promise<RpcPreset>`
* `async backedTokens(): Promise<string>`
* `async immutableData(): Promise<object | string>`
* `async mutableData(): Promise<object | string>`
* `async toObject(): Promise<object>`

##### RpcPreset

* `async collection(): Promise<RpcCollection>`
* `async scheme(): Promise<RpcScheme>`
* `async immutableData(): Promise<object | string>`
* `async mutableData(): Promise<object | string>`
* `async isTransferable(): Promise<boolean>`
* `async isBurnable(): Promise<boolean>`
* `async maxSupply(): Promise<number>`
* `async circulation(): Promise<number>`
* `async toObject(): Promise<object>`

##### RpcScheme
* `async author(): Promise<string>`
* `async format(): Promise<ISchema>`
* `async toObject(): Promise<object>`

##### RpcCollection
* `async author(): Promise<string>`
* `async authorizedAccounts(): Promise<string[]>`
* `async notifyAccounts(): Promise<string[]>`
* `async data(): Promise<any>`
* `async toObject(): Promise<object>`

##### RpcOffer
* `async sender(): Promise<string>`
* `async recipient(): Promise<string>`
* `async senderAssets(): Promise<RpcAsset[]>`
* `async recipientAssets(): Promise<RpcAsset[]>`
* `async memo(): Promise<string>`
* `async toObject(): Promise<object>`

### Explorer API

COMING SOON
