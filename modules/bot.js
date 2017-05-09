const _ = require("lodash");

module.exports = function(Bot, cfg) {
	let countMsg = 0;
	let commands = _.union(
		_.values(require('./joke-commands')(cfg, Bot)),
		_.values(require('./mark-commands')(cfg, Bot))
	);

	Bot.on("chat", function (channel, { username, mod }, msg, self) {
		if (username !== cfg.identity.username)
			countMsg++;

		function msgFn (message) {
			Bot.action(channel, message);
		}

		_.each(commands, fn => {
			fn.call({ msg: msgFn }, { msg, mod, channel, username });
		});
	});

	setInterval(function() {
		if (countMsg > 5) {
			_.each(cfg.channels, ch => {
				Bot.action(ch, "@milana_lol + @Hikka_live = <3 <3 <3");
			});

			countMsg = 0;
		}
	}, 60000 * 10);

	console.log("Bot runned!");
};
