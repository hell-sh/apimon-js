// Copyright (c) 2019 Hell.sh
const apimon = require("../apimon.js");
// JSHint doesn't yet support async so it goes completely nuts here.
/* jshint ignore:start */
async function a(ip)
{
	var pref, ipv4, ipv6;
	if(ip.indexOf(":") == -1)
	{
		pref = "4";
		ipv4 = ip;
		await apimon.myipv6().then(ip=>ipv6=ip).catch(()=>{});
	}
	else
	{
		pref = "6";
		ipv6 = ip;
		await apimon.myipv4().then(ip=>ipv4=ip).catch(()=>{});
	}
	console.log("Your IPv4 address: " + (ipv4 ? ipv4 : "unavailable"));
	console.log("Your IPv6 address: " + (ipv6 ? ipv6 : "unavailable"));
	if(ipv4 && ipv6)
	{
		console.log("IPv" + pref + " seems to be preferred.");
	}
}
apimon.myip().then(a).catch(code => {
	console.error("HTTP", code);
});
/* jshint ignore:end */
