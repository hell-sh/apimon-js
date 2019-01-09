const apimon = require("../apimon.js");

if(process.argv.length == 3)
{
	apimon.geoip(process.argv[2]).then(result=>{
		if(result.as.number == "0")
		{
			console.log(result.ip_address + " is not routed.");
		}
		else
		{
			console.log(result.ip_address + " is a(n) " + result.country.english_name + " IP address owned by " + result.as.org + " who are based in " + result.as.country.english_name + ".");
		}
	}).catch(error=>{
		console.error("An error occured:", error);
	});
}
else
{
	console.log("Syntax: node geoip.js <ip address>");
}
