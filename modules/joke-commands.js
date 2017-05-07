const _ = require("lodash");
const safe = require("safe");

module.exports = function({ collections, options }, Bot) {
	let getRandomUser = function({ channel }, cb) {
		Bot.api({
		    url: `https://tmi.twitch.tv/group/user/${channel}/chatters`,
		    headers: {
		    	"Client-ID": options.clientId
		    }
		}, safe.sure_result(cb, (res, body) => {
			let users = _.union(body.chatters.moderators, body.chatters.viewers);
			return users[_.random(0, users.length - 1)];
		}));
	}
		
	let fns = {

		jokeTo: function ({ msg, channel }) {
			if(!/!joke @([\D\d]*)/.test(msg)) return;

			let match = msg.match(/!joke @([\D\d]*)/);
			if (!(match && match[1])) return;

			let jokes = collections.jokes.toJSON();
			let joke = jokes[_.random(0, collections.jokes.size() - 1)];

			if (!joke) return;

			let name = "@" + match[1];
			let string = joke.id;
			let regex = /<name>/;
			let regexRandom = /<rname>/

			if (regex.test(string))
				string = string.replace(regex, name);
			else
				string = `${string} ${name}`;
			
			if (regexRandom.test(string))
				return getRandomUser({ channel }, (err, randomName) => {
					if (err) return;
					
					string = string.replace(regexRandom, `@${randomName}`);
					this.msg(string);
				})
			
			this.msg(string);
		},

		saveJoke: function  ({ msg, username }) {
			if (!/!joke !push/.test(msg)) return;

			let match = msg.match(/!joke !push ([\d\D]*)/);
			if (!(match && match[1])) return;

			collections.jokes.add({
				id: match[1],
				username
			});
			collections.jokes.persist();

			this.msg(`Joke ${match[1]} added successfully.`);
		},

		rmJoke: function ({ msg, mod }) {
			let match = msg.match(/!joke !pop #(\d*)/);
			if (!(match && mod)) return;

			let joke = collections.jokes.toJSON()[match[1]];
			if (!joke) return;

			collections.jokes.remove(joke);
			collections.jokes.persist();

			this.msg(`Joke [${joke.id}] removed successfully.`);
		},

		getJokeList: function ({ msg, mod }) {
			if (!(/!joke !list/.test(msg) && mod)) return;

			_.each(collections.jokes.toJSON(), (joke, idx) => {
				this.msg(`${joke.id} - ${joke.username && `@${joke.username} -` || ""} #${idx}`);
			});

			if (!collections.jokes.size()) this.msg("Jokes list is empty");
		}
	};
	
	return fns;
};

