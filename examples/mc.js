// Copyright (c) 2019 Hell.sh
const apimon = require("../apimon.js");
if(process.argv.length == 3)
{
	apimon.mc(process.argv[2]).then(result => {
		if(result.history.length > 1)
		{
			console.log(result.name + " was intially named " + result.initial_name);
		}
		else
		{
			console.log(result.name + " never changed their name.");
		}
	}).catch(code => {
		if(code == 404)
		{
			console.warn("Couldn't find a Minecraft account named", process.argv[2]);
		}
		else
		{
			console.error("HTTP", code);
		}
	});
}
else
{
	console.log("Syntax: node mc.js <uuid, username or old username followed by /old>");
}
