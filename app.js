const TwitchBot = require('node-twitchbot');
const BOT_NAME = "xchbitobot";
const Collection = require('json-collections');
const _ = require("lodash");
const collectoins = Object.freeze({
	jokes: Collection({name: 'jokes', filepath: '/db/jokes' })
})

const Bot = new TwitchBot({
	username : BOT_NAME,
	oauth    : 'oauth:lyrfpe260onmdi74rvpwh0krmiqaa5',
	channel  : 'hikka_live'
});

function jokeForMom (msg) {
	if(!/!пошути_про_маму/.test(msg)) return;
	this.msg('шутка про маму)))');
}

function jokeTo (msg) {
	if(!/!joke @([\D\d]*)/.test(msg)) return;
	
	let match = msg.match(/!joke @([\D\d]*)/);

	if (!(match && match[1])) return;
	
	let jokes = collectoins.jokes.toJSON();
	let joke = jokes[_.random(0, jokes.lenght - 1)];
	this.msg(`${joke} @${match[1]}`);
}

function sayHello (msg) {
	if (!/!xchbitobot/.test(msg)) return;
	this.msg("Hello");
}

function saveJoke (msg) {
	if (!/!joke !push/.test(msg)) return;
	
	let match = msg.match(/!joke !push ([\d\D]*)/);
	if (!(match && match[1])) return;
	
	collectoins.jokes.add({id: match[1]});
	collections.jokes.persist();
}

Bot.connect().then(() => {
	var countMsg = 0;
	
	Bot.listen((err, chatter) => {
		if(err) return console.log(err);

		if (chatter.user != BOT_NAME)
			countMsg++;
		
		jokeForMom.call(Bot, chatter.msg);
		jokeTo.call(Bot, chatter.msg);
		sayHello.call(Bot, chatter.msg);
		saveJoke.call(Bot, chatter.msg);
	});

	setInterval(function() {
		if (countMsg > 5) {
			Bot.msg("Skynet returning from hell!!!");
			countMsg = 0;
		}
	}, 60000 * 10);

	console.log("Bot runned");
}).catch(err => {
	console.log('Connection error!');
	console.log(err)
});
