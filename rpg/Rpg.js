const Player = require("./Player");
const Zone = require("./Zone");
const _ = require("lodash");

class Rpg {

    cmdLvl (msg, user) {
        if (!/^!lvl/.test(msg)) return;
        
        let player = Player.getPlayerById(user.username);
        let { lvl, exp, nextLvlExp } = player.getLvl();
        
        this.bot.sendMessage(`@${user.username} lvl ${lvl} (${exp}/${nextLvlExp})`);
    }

    cmdStat (msg, user) {
        if (!/^!stat/.test(msg)) return;
        
        let player = Player.getPlayerById(user.username);
        let gold = player.get("gold");
        let time = player.get("actionTime");

        this.bot.sendMessage(`@${user.username} gold: ${gold}, time: ${time}`);
    }

    constructor (bot) {

        this.bot = bot;

        bot.on("chat", (channel, user, msg) => {
            let mod = _.get(user, "badges.broadcaster", user.mod);
            user.mod = mod;

            this.cmdStat(msg, user);
            this.cmdLvl(msg, user);
        })

        setInterval(() => {
            bot.getUsers().then(users => {

                _.each(users, username => {
                    let player = Player.getPlayerById(username);
                    let exp = player.get("exp");
                    let actionTime = player.get("actionTime");
                    player.set("exp", exp + 1);

                    if (actionTime < 0) {
                        actionTime = _.random(30, 60);
                        player.set("actionTime", actionTime);
                        let zone = Zone.getRandomZone();
                        let zoneName = zone.get("id");
                        let action = zone.getRandomAction();

                        action.fn(player);
                        this.bot.sendMessage(`@${username} ${zoneName}: ${action.id}`);
                    }

                    player.set("actionTime", actionTime - 1);
                });
            });
        }, 60 * 1000);
    }
}

module.exports = Rpg;