let CollectionJSON = require("json-collections");

class Collection extends CollectionJSON {
    constructor (options) {
        options.dataDir = options.dataDir || process.env.APP_DATA_DIR;
        super(options);
    }
}

module.exports = Collection;