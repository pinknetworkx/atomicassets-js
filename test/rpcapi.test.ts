import { expect } from "chai";
import RpcApi from "../src/API/Rpc";

// tslint:disable-next-line:no-var-requires
const fetch = require("node-fetch");

describe("RPC API", () => {
    const api = new RpcApi("https://testnet.wax.pink.gg", "atomicassets", "WAX", 8, {
        fetch, rateLimit: 4,
    });

    const exampleAsset = {
        owner: "leonleonleon",
        id: "1099511627780",
    };

    it("fetch asset " + exampleAsset.id, async () => {
        const asset = await api.getAsset(exampleAsset.owner, exampleAsset.id);

        const result = await asset.toObject();

        expect(result).to.deep.equal(result);
    }).timeout(10000);

    it("test caching", async () => {
        const asset = await api.getAsset(exampleAsset.owner, exampleAsset.id);

        const result = await asset.toObject();

        expect(result).to.deep.equal(result);
    }).timeout(10000);

    it("fetch offers ", async () => {
        const offers = await api.getAccountOffers(exampleAsset.owner);

        const result = await Promise.all(offers.map(async (offer) => await offer.toObject()));

        expect(result).to.deep.equal(result);
    }).timeout(20000);
});
