import { expect } from 'chai';
import ExplorerApi from '../src/API/Explorer';

// tslint:disable-next-line:no-var-requires
const fetch = require('node-fetch');

describe('Explorer API', () => {
    const api = new ExplorerApi('https://wax-test.api.atomicassets.io', 'atomicassets', {fetch});

    const exampleAsset = {
        owner: 'testuser2222',
        id: '1099511627784'
    };

    it('fetch asset ' + exampleAsset.id, async () => {
        const asset = await api.getAsset(exampleAsset.id);

        expect(asset).to.deep.equal(asset);
    }).timeout(10000);
});
