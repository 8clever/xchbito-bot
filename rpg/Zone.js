const _ = require("lodash");

class Zone {

    /**
     * 
     * @param {*} data 
     * @param {*} data.id = Name of zone
     * @param data.actions[].id - action id 
     * @param data.actions[].fn - function which will apeaer to player
     */
    constructor (data) {
        this.data = data;
    }

    get (key) {
        return this.data[key];
    }

    getRandomAction () {
        let idxAction = _.random(0, this.data.actions.length - 1);
        return this.data.actions[idxAction];
    }

    static getRandomZone () {
        let zones = Zone.getZones();
        let idxZone = _.random(0, zones.length - 1);
        return zones[idxZone];
    }

    static getZones () {
        return [
            new Zone({
                id: "Dark Wood",
                actions: [
                    {
                        id: "Make a bonfire. -1 gold",
                        fn: player => {
                            let gold = player.get("gold");
                            player.set("gold", gold - 1);
                        }
                    },
                    {
                        id: "Excelent fight with dark minion. +2 gold",
                        fn: player => {
                            let gold = player.get("gold");
                            player.set("gold", gold + 2);
                        }
                    },
                    {
                        id: "Good fight with dark minion. +1 gold",
                        fn: player => {
                            let gold = player.get("gold");
                            player.set("gold", gold + 1);
                        }
                    },
                    {
                        id: "Goblin attacked you when you tired. -1 gold",
                        fn: player => {
                            let gold = player.get("gold");
                            player.set("gold", gold - 2);
                        }
                    }
                ]
            }),
            new Zone({
                id: "Broken Castle",
                actions: [
                    {
                        id: "Make a bonfire. -1 gold",
                        fn: player => {
                            let gold = player.get("gold");
                            player.set("gold", gold - 1);
                        }
                    },
                    {
                        id: "Excelent fight with skeleton. +2 gold",
                        fn: player => {
                            let gold = player.get("gold");
                            player.set("gold", gold + 2);
                        }
                    },
                    {
                        id: "Necromant steel your soul. +10 time",
                        fn: player => {
                            let time = player.get("actionTime");
                            player.set("actionTime", time + 10);
                        }
                    },
                    {
                        id: "You find a treasure. +10 gold",
                        fn: player => {
                            let gold = player.get("gold");
                            player.set("gold", gold + 10);
                        }
                    }
                ]
            }),
            new Zone({
                id: "Alone Lake",
                actions: [
                    {
                        id: "Make a bonfire. -1 gold",
                        fn: player => {
                            let gold = player.get("gold");
                            player.set("gold", gold - 1);
                        }
                    },
                    {
                        id: "You go through bridge and can't find anything. -10 time",
                        fn: player => {
                            let time = player.get("actionTime");
                            player.set("actionTime", time - 10);
                        }
                    },
                    {
                        id: "You find something in lake. +1 gold",
                        fn: player => {
                            let gold = player.get("gold");
                            player.set("gold", gold + 1);
                        }
                    },
                    {
                        id: "In deep of current place you receive difficult fight with boss. +10 gold, +20 time",
                        fn: player => {
                            let gold = player.get("gold");
                            let time = player.get("time");

                            player.set("gold", gold + 10);
                            player.set("time", time + 20);
                        }
                    }
                ]
            }),
            new Zone({
                id: "Hot Wasteland",
                actions: [
                    {
                        id: "Make a bonfire. -1 gold",
                        fn: player => {
                            let gold = player.get("gold");
                            player.set("gold", gold - 1);
                        }
                    }
                ]
            })
        ]
    }
}

module.exports = Zone;