const TwitchBot = require('node-twitchbot');

const Bot = new TwitchBot({
	username : 'xchbito',
	oauth    : 'oauth:lyrfpe260onmdi74rvpwh0krmiqaa5',
	channel  : 'hikka_live'
});

Bot.connect().then(() => {
	Bot.listen((err, chatter) => {
		if(err)
			return console.log(err);

		let message = chatter.msg;

		if(/!пошути_про_маму/.test(message))
			Bot.msg('шутка про маму)))');

		if(/!joke @([\D\d]*)/.test(message)) {
			let match = message.match(/!joke @([\D\d]*)/);

			if (match && match[1])
				Bot.msg(`Я пошутил над @${match[1]}`);
		}

		if (/!xchbitobot/.test(message))
			Bot.msg("Hello");

		console.log(message)
	});

	setInterval(function() {
		Bot.msg("Skynet returning from hell!!!");
	}, 60000 * 10);

	console.log("Bot runned");
}).catch(err => {
	console.log('Connection error!');
	console.log(err)
});
