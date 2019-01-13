const _ = require("lodash");
const Collection = require("json-collections");
const async = require("async");
const __zones = Collection({ name: "rpg_zone" });
const __q = async.queue(async task => {
    await task();
}, 1);

class Zone {

    static getZones () {
        return __zones.toJSON();
    }

    static addZone (name) {
        __zones.add({ 
            id: name, 
            actions: []
        });
        Zone.persist();
    }

    static rmZone (id) {
        __zones.remove({ id });
        Zone.persist();
    }

    static persist () {
        __q.push(__zones.persist);
    }

    static getRandomZoneId () {
        let zones = Zone.getZones();
        if (!zones.length) return "Newerwhere";
        let idx = _.random(0, zones.length - 1);
        return zones[idx].id;
    }
}

module.exports = Zone;