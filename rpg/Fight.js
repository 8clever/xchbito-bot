const _ = require("lodash");

class Warrior {
    constructor (player) {
        this.player = player;
        this.points = 0;
        this.hand = null;
    }

    getPlayer () {
        return this.player;
    }

    throw () {
        let idx = _.random(0, Fight.hand.length - 1);
        this.hand = Fight.hand[idx];
    }

    getHand () {
        if (!this.hand) throw new Error("Hand not throwed yet!");
        return this.hand;
    }

    addPoint () {
        this.points += 1;
    }

    getPoints () {
        return this.points;
    }
}

class Fight {

    constructor(player1, player2) {
        this.warrior1 = new Warrior(player1);
        this.warrior2 = new Warrior(player2);
        this.winner = null;
        this.round = 0;
        this.stats = [];
    }

    static get rock () {
        return "rock";
    }

    static get paper () {
        return "paper";
    }

    static get scissors () {
        return "scissors"
    }

    static get hand () {
        return [
            Fight.rock,
            Fight.paper,
            Fight.scissors
        ]
    }

    checkHands () {
        let box = {
            [this.warrior1.getHand()]: this.warrior1,
            [this.warrior2.getHand()]: this.warrior2
        };

        if (_.size(box) === 1) 
            return this.winner = null;

        if (box[Fight.paper] && box[Fight.rock]) 
            return this.winner = box[Fight.paper];
        
        if (box[Fight.rock] && box[Fight.scissors]) 
            return this.winner = box[Fight.scissors];
        
        if (box[Fight.scissors] && box[Fight.paper]) 
            return this.winner = box[Fight.scissors];
    }

    playRound () {
        this.round += 1;

        this.warrior1.throw();
        this.warrior2.throw();
        this.checkHands();
        
        if (!this.winner) {
            this.stats.push(`round:${this.round} 2x-${this.warrior1.getHand()} Winner Frienship`);
            return this.playRound();
        }
        
        this.winner.addPoint();

        let player1Name = this.warrior1.getPlayer().get("id");
        let player2Name = this.warrior2.getPlayer().get("id");
        let winnerName = this.winner.getPlayer().get("id");
        let stat = `round:${this.round} @${player1Name}:${this.warrior1.getHand()} @${player2Name}:${this.warrior2.getHand()} winner:@${winnerName};`;

        this.stats.push(stat);
    }

    playGame () {
        this.playRound();
        this.playRound();
        this.playRound();

        let fightLooser = (
            this.warrior1.getPoints() < this.warrior2.getPoints() 
            ? this.warrior1 : this.warrior2
        )
        let fightWinner = (
            this.warrior1.getPoints() > this.warrior2.getPoints() 
            ? this.warrior1 : this.warrior2
        );

        let looser = fightLooser.getPlayer();
        let winner = fightWinner.getPlayer();
        
        winner.set("arenaWins", winner.get("arenaWins") + 1);
        winner.set("gold", winner.get("gold") + 1);
        looser.set("gold", looser.get("gold") - 1);

        let stat = `${winner.get("id")} vs ${looser.get("id")}. Winner @${winner.get("id")}. Congratulation!`;
        this.stats.push(stat);
    }

    getResultOfGame () {
        this.playGame();
        return this.stats;
    }
}

module.exports = Fight;