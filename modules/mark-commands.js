const _ = require("lodash");
const moment = require("moment");

let uptime = moment();
module.exports = function() {
	return {
		uptime: function({ msg }) {
			if ("!uptime" !== msg) return;

			this.msg(`Bot in live: ${uptime.fromNow()}`);
		},

		uptimeRefresh: function({ msg, mod }) {
			if (!(/!uptime !refresh/.test(msg) && mod)) return;

			uptime = moment();
			this.msg(`Bot uptime refreshed successfully`);
		}
	}
};
