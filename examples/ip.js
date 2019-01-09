const apimon = require("../apimon.js");

apimon.ip().then(async ip=>{
	var pref, ipv4, ipv6;
	if(ip.indexOf(":") == -1)
	{
		pref = "4";
		ipv4 = ip;
		await apimon.ipv6().then(ip=>ipv6=ip).catch(()=>{});
	}
	else
	{
		pref = "6";
		ipv6 = ip;
		await apimon.ipv4().then(ip=>ipv4=ip).catch(()=>{});
	}
	console.log("Your IPv4 address: " + (ipv4 ? ipv4 : "unavailable"));
	console.log("Your IPv6 address: " + (ipv6 ? ipv6 : "unavailable"));
	if(ipv4 && ipv6)
	{
		console.log("IPv" + pref + " seems to be preferred.");
	}
}).catch(()=>{});
