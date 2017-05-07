const tmi = require("tmi.js");
const Collection = require('json-collections');
const safe = require("safe");
const _ = require("lodash");
const cfg = Object.freeze({
	color: "CadetBlue",
	options: {
		clientId: "aqh3wb4avo6r5ig0dvfl1n3c0vvi7r",
		debug: false
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

tmi.client.prototype.getUsers = function(channel, cb) {
	let hashRegex = /#/;

	if (hashRegex.test(channel))
		channel = channel.replace(hashRegex, "");

	this.api({
		url: `https://tmi.twitch.tv/group/user/${channel}/chatters`,
		headers: {
			"Client-ID": this.getOptions().options.clientId
		}
	}, safe.sure_result(cb, (res, body) => {
		return _.union(
			_.get(body, "chatters.moderators", []),
			_.get(body, "chatters.viewers", [])
		);
	}));
};

const Bot = new tmi.client(cfg);
Bot.connect().then(() => {
	Bot.color(cfg.color);
	require("./modules/bot")(Bot, cfg);
});

