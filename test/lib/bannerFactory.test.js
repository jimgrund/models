'use strict';

const assert = require('chai').assert;
const mockery = require('mockery');
const sinon = require('sinon');

sinon.assert.expose(assert, { prefix: '' });

describe('Banner Factory', () => {
    const message = 'Test banner';
    const bannerData = {
        message
    };
    const expected = {
        message
    };

    let BannerFactory;
    let datastore;
    let factory;
    let Banner;

    before(() => {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false
        });
    });

    beforeEach(() => {
        datastore = {
            save: sinon.stub(),
            get: sinon.stub()
        };

        /* eslint-disable global-require */
        Banner = require('../../lib/banner');
        BannerFactory = require('../../lib/bannerFactory');
        /* eslint-disable global-require */

        factory = new BannerFactory({ datastore });
    });

    afterEach(() => {
        mockery.resetCache();
    });

    after(() => {
        mockery.deregisterAll();
        mockery.disable();
    });

    describe('createClass', () => {
        it('should return a Collection', () => {
            const model = factory.createClass(bannerData);

            assert.instanceOf(model, Banner);
        });
    });

    describe('create', () => {
        it('should create a Banner', () => {
            datastore.save.resolves(bannerData);

            return factory.create({
                message
            }).then((model) => {
                assert.isTrue(datastore.save.calledOnce);
                assert.calledWith(datastore.save, {
                    params: expected,
                    table: 'banners'
                });
                assert.instanceOf(model, Banner);
                Object.keys(bannerData).forEach((key) => {
                    assert.strictEqual(model[key], bannerData[key]);
                });
            });
        });
    });

    describe('getInstance', () => {
        let config;

        beforeEach(() => {
            config = { datastore };

            /* eslint-disable global-require */
            BannerFactory = require('../../lib/bannerFactory');
            /* eslint-enable global-require */
        });

        it('should get an instance', () => {
            const f1 = BannerFactory.getInstance(config);
            const f2 = BannerFactory.getInstance(config);

            assert.instanceOf(f1, BannerFactory);
            assert.instanceOf(f2, BannerFactory);

            assert.equal(f1, f2);
        });

        it('should throw an error when config not supplied', () => {
            assert.throw(BannerFactory.getInstance,
                Error, 'No datastore provided to BannerFactory');
        });
    });
});
