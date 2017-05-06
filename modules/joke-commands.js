const _ = require("lodash");

module.exports = function({ collections }) {
	return {

		jokeTo: function (msg) {
			if(!/!joke @([\D\d]*)/.test(msg)) return;

			let match = msg.match(/!joke @([\D\d]*)/);
			if (!(match && match[1])) return;

			let jokes = collections.jokes.toJSON();
			let joke = jokes[_.random(0, collections.jokes.size() - 1)];

			if (!joke) return;

			let name = "@" + match[1];
			let string = joke.id;
			let regex = /<name>/;

			if (regex.test(string))
				string = string.replace(regex, name);
			else
				string = `${string} ${name}`;

			this.msg(string);
		},

		saveJoke: function  (msg) {
			if (!/!joke !push/.test(msg)) return;

			let match = msg.match(/!joke !push ([\d\D]*)/);
			if (!(match && match[1])) return;

			collections.jokes.add({id: match[1]});
			collections.jokes.persist();

			this.msg(`Joke ${match[1]} added successfully.`);
		},

		rmJoke: function (msg, level) {
			let match = msg.match(/!joke !pop #(\d*)/);
			if (!(match && level)) return;

			let joke = collections.jokes.toJSON()[match[1]];
			if (!joke) return;

			collections.jokes.remove(joke);
			collections.jokes.persist();

			this.msg(`Joke [${joke.id}] removed successfully.`);
		},

		getJokeList: function (msg, level) {
			if (!(/!joke !list/.test(msg) && level)) return;

			let send = _.map(collections.jokes.toJSON(), (joke, idx) => {
				return `${joke.id} - #${idx}`;
			});

			if (!send.length) return this.msg("Joke list is empty.");

			this.msg(send.join(" | "));
		}
	}
};

