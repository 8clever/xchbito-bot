const _ = require("lodash");
const Collection = require('json-collections');
const async = require("async");
const __rpgPlayer = Collection({ name: "rpg_player" });
const __q = async.queue(async task => {
    await task();
}, 1);

class Player {

    /**
     * 
     * @param {*} data
     * @param {*} data.id - name of player
     * @param {*} data.exp - experiance
     * @param {*} data.zone - zone of player
     * @param {*} data.arena - player on arena or not
     * @param {*} data.arenaWins - count of wins on arena
     * @param {*} data.actionTime - remaining time to action
     * @param {*} data.gold - player gold
     */
    constructor (data) {
        if (!(data && data.id)) throw new Error("Id of player is required");

        data.exp = data.exp || 0;
        data.zone = data.zone || "Still on Heaven";
        data.arena = data.arena || 0;
        data.arenaWins = data.arenaWins || 0;
        data.actionTime = data.actionTime || 0;
        data.gold = data.gold || 0;

        this.lvlExpMultiplier = 100;
        this.data = data;
    }

    get (key) {
        return this.data[key];
    }

    set (key, value) {

        if (key === "gold" && value < 0) value = 0;

        this.data[key] = value;
        this.persist();
    }

    getLvl () {
        let lvl = 1;
        let exp = this.data.exp;
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

    persist () {
        let data = __rpgPlayer.findOne({ id: this.data.id });
        data.set(this.data);
        Player.persist();
    }

    static getPlayerById (id) {
        if (!id) throw new Error("ID for player is required");

        id = id.toLowerCase();
        let player = __rpgPlayer.findOne({ id });
        if (player) return new Player(player.toJSON());

        __rpgPlayer.add({
            id,
            exp: 0,
            actionTime: 0,
            gold: 10
        });

        Player.persist();
        return Player.getPlayerById(id);
    }

    static getPlayers () {
        let players = _.map(__rpgPlayer.toJSON(), data => new Player(data));
        return players;
    }

    static persist () {
        __q.push(__rpgPlayer.persist);
    }
}

module.exports = Player;