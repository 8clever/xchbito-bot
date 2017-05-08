const tmi = require("tmi.js");
const Collection = require('json-collections');
const safe = require("safe");
const _ = require("lodash");
const cfg = Object.freeze({
	color: "CadetBlue",
	options: {
		clientId: "aqh3wb4avo6r5ig0dvfl1n3c0vvi7r",
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
	},
	bots: [
		"chatdb",
		"faegwent",
		"nightbot",
		"xchbitobot"
	]
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
		let users = _.union(
			_.get(body, "chatters.moderators", []),
			_.get(body, "chatters.viewers", [])
		);
		users = _.reject(users, u => _.includes(this.getOptions().bots, u));
		return users;
	}));
};

_.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], n => {
	let _cfg = _.cloneDeep(cfg);
	_cfg.identity.username = `${_cfg.identity.username}_${n}`;
	const Bot = new tmi.client(_cfg);
	Bot.connect().then(() => {
		Bot.color(_cfg.color);
		require("./modules/bot")(Bot, _cfg);
	});
})


