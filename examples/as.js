// Copyright (c) 2019 Hell.sh
const apimon = require("../apimon.js");
if(process.argv.length == 3)
{
	apimon.as(process.argv[2]).then(result => {
		console.log("AS" + result.number + " \"" + result.name + "\" is owned by " + result.org + " who are based in " + result.country.english_name + ".");
	}).catch(code => {
		console.error("HTTP", code);
	});
}
else
{
	console.log("Syntax: node as.js <asn>");
}
