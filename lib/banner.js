'use strict';

const BaseModel = require('./base');

class BannerModel extends BaseModel {
    /**
     * Construct a BannerModel object
     * @method constructor
     * @param {Object} config
     * @param {String} config.message         The banner message
     */
    constructor(config) {
        super('banner', config);
    }
}

module.exports = BannerModel;
