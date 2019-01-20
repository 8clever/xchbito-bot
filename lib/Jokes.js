const _ = require("lodash");
const Collection = require('./Collection');

class Jokes {

	cmdJoke (msg) {
		if(!/!joke @([\D\d]*)/.test(msg)) return;

		let match = msg.match(/!joke @([\D\d]*)/);
		let name = match && match[1];

		if (!name) return;

		let jokes = this.collection.toJSON();
		let joke = jokes[_.random(0, this.collection.size() - 1)];

		if (!joke) return;

		let dogName = "@" + name;
		let string = joke.id;
		let regex = /<name>/;
		let regexRandom = /<rname>/;

		if (regex.test(string))
			string = string.replace(regex, dogName);
		else
			string = `${string} ${dogName}`;

		if (regexRandom.test(string)) {
			this.bot.getUsers().then(users => {
				_.remove(users, u => u === name.toLowerCase());
				let rUser = users[_.random(0, users.length - 1)];
				string = string.replace(regexRandom, `@${rUser}`);
				this.bot.sendMessage(string);
			}).catch(console.log);
			return;
		}
			
		this.bot.sendMessage(string);
	}

	cmdAddJoke (msg, user) {
		if (!/!joke !push/.test(msg)) return;

		let match = msg.match(/!joke !push ([\d\D]*)/);
		if (!(match && match[1])) return;

		this.collection.add({
			id: match[1],
			username: user.username
		});
		this.collection.persist();
		this.bot.sendMessage(`Joke ${match[1]} added successfully.`);
	}

	cmdRmJoke (msg, user) {
		let match = msg.match(/!joke !pop #(\d*)/);
		if (!(match && user.mod)) return;

		let joke = this.collection.toJSON()[match[1]];
		if (!joke) return;

		this.collection.remove(joke);
		this.collection.persist();

		this.bot.sendMessage(`Joke [${joke.id}] removed successfully.`);
	}

	cmdJokeList (msg, user) {
		if (!(/!joke !list/.test(msg) && user.mod)) return;

		_.each(this.collection.toJSON(), (joke, idx) => {
			this.bot.sendMessage(`${joke.id} - ${joke.username && `@${joke.username} -` || ""} #${idx}`);
		});

		if (!this.collection.size()) this.bot.sendMessage("Jokes list is empty");
	}

	constructor (bot) {
		if (!bot) throw new Error("Bot is required");

		this.collection = new Collection({ name: "jokes" });
		this.bot = bot;

		bot.on("chat", (channel, user, msg) => {
			let mod = _.get(user, "badges.broadcaster", user.mod);
			user.mod = mod;

			this.cmdJoke(msg, user);
			this.cmdAddJoke(msg, user);
			this.cmdRmJoke(msg, user);
			this.cmdJokeList(msg, user);
		});
	}
}

module.exports = Jokes;