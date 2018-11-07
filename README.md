# What for ?
Send SMS and MMS using Buzz Expert API.

# More
Minimalist module.
Messages are sent on MARKETING type.
Module changes between OADC and label by itself, in case of an SMS or MMS to be pushed.

# Warning
Max 2 medias.
Media must not be > than 60Ko (500 000 bytes). 

# How to use it ?
```javascript
const BEAPI = require('buzz-expert');
const BuzzExpert = new BEAPI({
	login: "login",
	password: "password",
	label: "label created withing your Buzz Expert account, OADC or label is selected by the module itself"
});

BuzzExpert.connect((err) => {
	if (err) return console.error(err);
	
	BuzzExpert.sendMMS('0123456789', [
		{ type: "file", filename: "/var/toto.gif" },
		{ type: "text", content: "Hello World !" }
	], (err) => {
		if (err) return console.error(err);

		console.log("Message sent!");
	});
});
```

# GitHub Repository
