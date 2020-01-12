import { expect } from "chai";
import RpcApi from "../src/API/Rpc";

// tslint:disable-next-line:no-var-requires
const fetch = require("node-fetch");

describe("RPC API", () => {
    it("fetch asset 100000000000001", async (done) => {
        const api = new RpcApi("https://testnet.wax.pink.gg", "atomicassets", { fetch });
        const asset = await api.get_asset("leonleonleon", "1099511627780");

        const result = await asset.toObject();
        api.queue.stop();

        expect(result).to.deep.equal(JSON.parse("{\"id\":\"1099511627780\",\"backedTokens\":\"0.00000000\",\"immutableData\":{\"type\":\"SMG\",\"weapon\":\"P90\"},\"mutableData\":{\"img\":\"QmeF7Wwkp1evwN23iU1TvHCJAwnshACfFg9pbJTBhxwhq9\",\"tags\":[\"T-side\",\"CT-side\",\"$2350\"],\"name\":\"P90 | Specialist (Battle Scarred)\",\"stattrak\":true,\"recorded_kills\":0},\"preset\":{\"id\":0,\"collection\":{\"author\":\"leonleonleon\",\"authorizedAccounts\":[\"leonleonleon\"],\"notifyAccounts\":[],\"data\":{\"name\":\"CSGO Mockup\",\"description\":\"This is a mockup of CSGO skins to demonstrate the capabilities of atomicassets\",\"website\":\"https://blog.counter-strike.net/\"}},\"scheme\":{\"author\":\"leonleonleon\",\"format\":[{\"name\":\"name\",\"type\":\"string\",\"parent\":0},{\"name\":\"img\",\"type\":\"ipfs\",\"parent\":0},{\"name\":\"type\",\"type\":\"string\",\"parent\":0},{\"name\":\"weapon\",\"type\":\"string\",\"parent\":0},{\"name\":\"wear\",\"type\":\"float\",\"parent\":0},{\"name\":\"stattrak\",\"type\":\"bool\",\"parent\":0},{\"name\":\"recorded_kills\",\"type\":\"uint32\",\"parent\":0},{\"name\":\"tags\",\"type\":\"string[]\",\"parent\":0}]},\"immutableData\":{\"type\":\"SMG\",\"weapon\":\"P90\"},\"mutableData\":{\"img\":\"QmeF7Wwkp1evwN23iU1TvHCJAwnshACfFg9pbJTBhxwhq9\",\"tags\":[\"T-side\",\"CT-side\",\"$2350\"]},\"transferable\":true,\"burnable\":true,\"maxSupply\":0,\"circulation\":0}}"));
        done();
    }).timeout(10000);

    it("fetch offers ", async (done) => {
        const api = new RpcApi("https://testnet.wax.pink.gg", "atomicassets", { fetch });
        const offers = await api.get_account_offers("leonleonleon");

        const result = await Promise.all(offers.map(async (offer) => await offer.toObject()));
        api.queue.stop();

        expect(result).to.deep.equal([]);
        done();
    }).timeout(20000);
});
