const _ = require("lodash");
const tmi = require("tmi.js");

class Bot extends tmi.client {

	async getUsers () {
		return new Promise((resolve, reject) => {
			this.api({
				url: `https://tmi.twitch.tv/group/user/${this.channel}/chatters`,
				headers: {
					"Client-ID": this.config.options.clientId
				}
			}, (err, res, body) => {
				if (err) return reject(err);

				let users = _.union(
					_.get(body, "chatters.moderators", []),
					_.get(body, "chatters.viewers", [])
				);
	
				users = _.reject(users, u => _.includes(this.getOptions().bots, u));
				resolve(users);
			});
		});
	};

	addPlugin (Module) {
		new Module(this);
	}

	sendMessage (message) {
		this.action(this.channel, message);
	}

	/**
	 * 
	 * Initial params for create bot
	 * 
	 * @param {*} cfg 
	 * @param {*} cfg.clientId - id of tmi client
	 * @param {*} cfg.username - account which will use bot
	 * @param {*} cfg.password
	 * @param {*} cfg.channel - connect to channel
	 */
	constructor (cfg) {

		if (!(
			cfg.clientId &&
			cfg.username &&
			cfg.password &&
			cfg.channel
		)) throw new Error("color, clientId, username, password, channel is required options");
		
		let config = {
			options: {
				clientId: cfg.clientId,
				debug: true
			},
			connection: {
				reconnect: true
			},
			identity: {
				username: cfg.username,
				password: cfg.password
			},
			channels: [
				cfg.channel
			],
			bots: [
				"chatdb",
				"faegwent",
				"nightbot",
				"xchbitobot",
				"skinnyseahorse",
				"streamlabs",
				"p0sitivitybot",
				"host_giveaway",
				"eloooooooooooooooooonmusk",
				"commanderroot"
			]
		};

		super(config);

		this.channel = cfg.channel;
		this.config = config;
	}
}

module.exports = Bot;