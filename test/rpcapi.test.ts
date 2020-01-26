import { expect } from "chai";
import RpcApi from "../src/API/Rpc";

// tslint:disable-next-line:no-var-requires
const fetch = require("node-fetch");

describe("RPC API", () => {
    it("fetch asset 1099511627782", async () => {
        const api = new RpcApi("https://testnet.wax.pink.gg", "atomicassets", { fetch });
        const asset = await api.get_asset("karlkarlkarl", "1099511627782");

        const result = await asset.toObject();
        api.queue.stop();

        expect(result).to.deep.equal(JSON.parse("{\"backedTokens\":\"0.00000000\",\"id\":\"1099511627782\",\"immutableData\":{\"name\":\"Tom\",\"region\":\"Africa\"},\"mutableData\":{\"age\":1},\"preset\":{\"burnable\":true,\"circulation\":0,\"collection\":{\"author\":\"leonleonleon\",\"authorizedAccounts\":[\"leonleonleon\"],\"data\":{\"name\":\"Lion Collection\",\"website\":\"https://lions.com\"},\"notifyAccounts\":[]},\"id\":0,\"immutableData\":{\"region\":\"Africa\"},\"maxSupply\":0,\"mutableData\":{},\"scheme\":{\"author\":\"leonleonleon\",\"format\":[{\"name\":\"name\",\"type\":\"string\"},{\"name\":\"age\",\"type\":\"uint8\"},{\"name\":\"children\",\"type\":\"string[]\"},{\"name\":\"region\",\"type\":\"string\"}]},\"transferable\":true}}"));
    }).timeout(10000);

    it("fetch offers ", async () => {
        const api = new RpcApi("https://testnet.wax.pink.gg", "atomicassets", { fetch });
        const offers = await api.get_account_offers("karlkarlkarl");

        const result = await Promise.all(offers.map(async (offer) => await offer.toObject()));
        api.queue.stop();

        expect(result).to.deep.equal(result);
    }).timeout(20000);
});
