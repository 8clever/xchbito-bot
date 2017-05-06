const _ = require("lodash");

module.exports = function(Bot, cfg) {
	let countMsg = 0;
	let commands = _.union(
		_.values(require('./joke-commands')(cfg, Bot)),
		_.values(require('./mark-commands')(cfg, Bot))
	);

	Bot.on("chat", function (channel, { user, mod }, message, self) {
		if (user !== cfg.identity.username)
			countMsg++;

		function msg (message) {
			Bot.action(channel, message);
		}

		_.each(commands, fn => {
			fn.call({ msg }, message, mod, channel);
		});
	});

	setInterval(function() {
		if (countMsg > 5) {
			_.each(cfg.channels, ch => {
				Bot.action(ch, "Skynet returning from hell!!!");
			});

			countMsg = 0;
		}
	}, 60000 * 10);

	console.log("Bot runned!");
};
