const _ = require("lodash");

const Jokes = require("./lib/Jokes");
const Bot = require("./lib/Bot");

let bot = new Bot({
	clientId: "aqh3wb4avo6r5ig0dvfl1n3c0vvi7r",
	username: "xchbitobot",
	password: "oauth:lyrfpe260onmdi74rvpwh0krmiqaa5",
	channel: "8clever"
});

bot.connect().then(() => {
	bot.color("Red");
	bot.addPlugin(Jokes);

	console.log("bot.connected!")
});