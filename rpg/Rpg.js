const Player = require("./Player");
const Zone = require("./Zone");
const Fight = require("./Fight");
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
        let arena = player.get("arena");
        let arenaWins = player.get("arenaWins");
        let zone = arena ? this.arenaName : player.get("zone");

        this.bot.sendMessage(`@${user.username} gold: ${gold}, time: ${time}, zone: ${zone}, wins: ${arenaWins}`);
    }

    cmdArena (msg, user) {
        if (!/^!arena/.test(msg)) return;

        let player = Player.getPlayerById(user.username);
        let gold = player.get("gold");

        if (gold <= 0) {
            return this.bon.sendMessage(`@${user.username} you not have enough gold to join in ${this.actionArena}`);
        }

        player.set("arena", 1);
        this.bot.sendMessage(`@${user.username} you go to ${this.arenaName}`);
    }

    cmdNotArena (msg, user) {
        if (!/^!!arena/.test(msg)) return;

        let player = Player.getPlayerById(user.username);
        player.set("arena", 0);

        this.bot.sendMessage(`@${user.username} you go out from ${this.arenaName}`);
    }

    action (player) {
        let time = player.get("actionTime");

        if (time < 0) {
            time = _.random(30, 60);
            player.set("actionTime", time);
            
            this.actionZone(player);
            this.actionArena(player);
            
            return;
        }

        player.set("actionTime", time - 1);
    }

    actionZone (player) {
        let arena = player.get("arena");
        if (arena) return;

        let username = player.get("id");
        let zone = Zone.getRandomZone();
        let zoneName = zone.get("id");
        let action = zone.getRandomAction();

        player.set("zone", zone);
        action.fn(player);
        this.bot.sendMessage(`@${username} ${zoneName}: ${action.id}`);
    }

    actionArena (player) {
        let arena = player.get("arena");
        if (!arena) return;

        let gold = player.get("gold");
        if (gold <= 0) {
            return player.set("arena", 0);
        }

        let username = player.get("id");
        let pvpPlayers = _.filter(Player.getPlayers(), player => {
            if (player.get("id") === username) return false;
            if (player.get("arena")) return true;
        });

        if (pvpPlayers.length < 1) {
            return this.bot.sendMessage(`@${username} You are alone on ${this.arenaName}`)
        }

        let player2idx = _.random(0, pvpPlayers.length - 1);
        let player2 = pvpPlayers[player2idx];
        let fight = new Fight(player, player2);
        let stats = fight.getResultOfGame();

        _.each(stats, stat => {
            this.bot.sendMessage(stat);
        });
    }   

    plusExp (player) {
        let exp = player.get("exp");
        player.set("exp", exp + 1);
    }

    constructor (bot) {

        this.bot = bot;
        this.arenaName = "Arena Of Fame";

        bot.on("chat", (channel, user, msg) => {
            let mod = _.get(user, "badges.broadcaster", user.mod);
            user.mod = mod;

            this.cmdStat(msg, user);
            this.cmdLvl(msg, user);
            this.cmdArena(msg, user);
            this.cmdNotArena(msg, user);
        })

        setInterval(() => {
            bot.getUsers().then(users => {

                _.each(users, username => {
                    let player = Player.getPlayerById(username);
                    this.plusExp(player);
                    this.action(player);
                });
            });
        }, 60 * 1000);
    }
}

module.exports = Rpg;