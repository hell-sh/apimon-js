// Copyright (c) 2019 Hell.sh
const apimon = require("../apimon.js");
if(process.argv.length == 3)
{
	apimon.ip(process.argv[2]).then(result=>{
		if(result.as.number == "0")
		{
			console.log(result.ip_address + " is not routed.");
		}
		else
		{
			console.log(result.ip_address + " is an IP address from " + result.country.english_name + " owned by " + result.as.org + " who are based in " + result.as.country.english_name + ".");
		}
	}).catch(code => {
		console.error("HTTP", code);
	});
}
else
{
	console.log("Syntax: node ip.js <ip address>");
}
