const express = require("express");
const app = express();
const OAuth2 = require("oauth").OAuth2;

const clientID = "aqh3wb4avo6r5ig0dvfl1n3c0vvi7r";
const clientSecret = "jd47lcd5vhfitewy8qxtpbsp06bdo1";

const PORT = 3000;
const oauth2 = new OAuth2(
	clientID,
	clientSecret,
	'https://api.twitch.tv/',
	'kraken/oauth2/authorize',
	'kraken/oauth2/token',
	null
);

const authURL = oauth2.getAuthorizeUrl({
	redirect_uri: `http://localhost:${PORT}/code`,
	scope: ['chat_login']
});

let token = false;

module.exports = function(cb) {
	app.get("/code", function(req, res, next) {
		oauth2.getOAuthAccessToken(
			req.query.code,
			{'redirect_uri': `http://localhost:${PORT}/code/`},
			safe.sure(cb, (access_token, refresh_token, results) => {
				if (results.error)
					return cb(results.error);

				cb(null, access_token);
			})
		);
	});

	app.listen(PORT);
	console.log("server for auth runned!");
	oauth2.get(authURL, null, function(err, html){
		if (/redirected/.test(html))
			console.log("redirected success!");
	});
};

