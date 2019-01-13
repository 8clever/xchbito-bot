const Player = require("./Player");
const Zone = require("./Zone");
const _ = require("lodash");

class Rpg {

    cmdLvl (msg, user) {
        if (!/^!lvl/.test(msg)) return;
        let player = new Player(user.username);
        let { lvl, exp, nextLvlExp } = player.getLvl();
        this.bot.sendMessage(`@${user.username} lvl ${lvl} (${exp}/${nextLvlExp})`);
    }

    cmdZone (msg, user) {
        if (!/^!zone$/.test(msg)) return;
        let player = new Player(user.username);
        this.bot.sendMessage(`@${user.username} your are in ${player.player.zone}`);
    }

    cmdRmZone (msg, user) {
        if (!user.mod) return;

        let regex = /^!zone_rm #(\d)$/;
        if (!regex.test(msg)) return;

        let idx = parseInt(msg.match(regex)[1]);
        if (!_.isFinite(idx)) return;

        let zones = Zone.getZones();
        let zone = zones[idx - 1];

        Zone.rmZone(zone.id);
        this.bot.sendMessage(`@${user.username} Zone removed successfully: ${zone.id}`);
    }

    cmdZoneList (msg, user) {
        if (!/^!zone_list/.test(msg)) return;
        _.each(Zone.getZones(), (zone, idx) => {
            this.bot.sendMessage(`#${idx + 1} - ${zone.id}`);
        });
    }

    cmdAddZone (msg, user) {
        let regex = /^!add_zone ([\D\d\s]+)/;

        if (!regex.test(msg)) return;

        let zone = msg.match(regex)[1];
        if (!zone) return;

        Zone.addZone(zone);
        this.bot.sendMessage(`@${user.username} Zone added succesfully: ${zone}`);
    }

    constructor (bot) {

        this.bot = bot;

        bot.on("chat", (channel, user, msg) => {
            let mod = _.get(user, "badges.broadcaster", user.mod);
            user.mod = mod;

            this.cmdRmZone(msg, user);
            this.cmdZoneList(msg, user);
            this.cmdZone(msg, user);
            this.cmdAddZone(msg, user);
            this.cmdLvl(msg, user);
        })

        setInterval(() => {
            bot.getUsers().then(users => {

                _.each(users, username => {
                    let player = new Player(username);
                    player.addExp(1);

                    let actionTime = _.get(player, "player.actionTime", -1);
                    if (actionTime < 0) {
                        actionTime = _.random(30, 60);
                        player.setActionTime(actionTime);
                        player.setZone(Zone.getRandomZoneId());
                    }

                    player.setActionTime(actionTime - 1);
                });
            });
        }, 60 * 1000);
    }
}

module.exports = Rpg;