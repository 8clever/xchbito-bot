const tmi = require("tmi.js");
const Collection = require('json-collections');
const cfg = Object.freeze({
	color: "CadetBlue",
	options: {
		//clientId: "aqh3wb4avo6r5ig0dvfl1n3c0vvi7r",
		debug: true
	},
	connection: {
		reconnect: true
	},
	identity: {
		username: "xchbitobot",
		password: "oauth:lyrfpe260onmdi74rvpwh0krmiqaa5"
	},
	channels: [
		"hikka_live",
		"8clever"
	],
	collections: {
		jokes: Collection({name: 'jokes', filepath: 'jokes' })
	}
});

const Bot = new tmi.client(cfg);
Bot.connect().then(() => {
	Bot.color(cfg.color);
	require("./modules/bot")(Bot, cfg);
});

