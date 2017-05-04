const auth = require("./auth");
const safe = require("safe");
const cb = function(err) {
	if (err)
		console.error(err);
};

auth(safe.sure(cb, token => {
	console.log(token);
}));