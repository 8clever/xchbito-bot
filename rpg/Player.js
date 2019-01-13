const _ = require("lodash");
const Collection = require('json-collections');
const async = require("async");
const __rpgPlayer = Collection({ name: "rpg_player" });
const __q = async.queue(async task => {
    await task();
}, 1);

class Player {
    constructor (name) {
        if (!name) throw new Error("Name of player is required");

        this.name = name.toLowerCase();
        this.lvlExpMultiplier = 100;
        this.player = this.getPlayer().toJSON();
    }

    getPlayer () {
        let player = __rpgPlayer.findOne({ id: this.name });
        if (player) return player;

        __rpgPlayer.add({
            id: this.name,
            exp: 0,
            actionTime: 0
        });

        Player.persist();
        return this.getPlayer();
    }

    setZone (zone) {
        this.player.zone = zone;
        this.saveUser();
    }

    setActionTime (value) {
        this.player.actionTime = value;
        this.saveUser();
    }

    getLvl () {
        let lvl = 1;
        let exp = this.player.exp;
        let nextLvlExp = lvl * this.lvlExpMultiplier;

        while (exp > nextLvlExp) {
            exp = exp - nextLvlExp;
            lvl ++;
            nextLvlExp = lvl * this.lvlExpMultiplier;
        }

        return {
            lvl,
            exp,
            nextLvlExp
        };
    }

    addExp (value) {
        this.player.exp += value;
        this.saveUser();
    }

    delete () {
        this.player.exp = 0;
        this.saveUser();
    }

    saveUser () {
        let player = this.getPlayer();
        player.set(this.player);
        Player.persist();
    }

    static getPlayers () {
        let players = _.map(__rpgPlayer.toJSON(), player => new Player(player.id));
        return players;
    }

    static persist () {
        __q.push(__rpgPlayer.persist);
    }
}

module.exports = Player;