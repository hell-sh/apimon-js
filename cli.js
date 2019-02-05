#!/usr/bin/env node
// Copyright (c) 2019 Hell.sh
const apimon = require("./apimon.js");

if(process.argv.length > 2)
{
	process.argv[2] = process.argv[2].toLowerCase();
	if(process.argv[2] in apimon)
	{
		if(process.argv[2].substr(0, 4) == "myip")
		{
			apimon[process.argv[2]]().then(console.log).catch(code=>{
				console.error("HTTP", code);
			});
		}
		else if(process.argv.length > 3)
		{
			apimon.hi[process.argv[2]](process.argv[3]).then(console.log).catch(code=>{
				console.error("HTTP", code);
			});
		}
		else
		{
			console.log(process.argv[2], "requires 1 argument.");
		}
		return;
	}
}
console.log("Usage: apimon <" + Object.keys(apimon).filter(k => k!="hi").join("|") + "> [argument]");
