// Copyright (c) 2019 Hell.sh
const apimon = require("../apimon.js");
if(process.argv.length == 3)
{
	let recursiveLookup = (hostname, i) => new Promise((resolve, reject) => {
		apimon.dns(hostname).then(result => {
			if(i === null)
			{
				i = 1;
			}
			else
			{
				i++;
			}
			let ips = [];
			if(result.CNAME)
			{
				if(i == 10)
				{
					reject("Recursive lookup reached depth 10.");
				}
				else
				{
					recursiveLookup(result.CNAME, i).then(cname_ips => {
						cname_ips.forEach(ip => ips.push(ip));
						resolve(ips);
					}).catch(error => {
						console.log("An error occured whilst resolving" + result.CNAME + ":", error);
						resolve(ips);
					});
				}
			}
			else
			{
				if(result.A)
				{
					result.A.forEach(ip => ips.push(ip));
				}
				if(result.AAAA)
				{
					result.AAAA.forEach(ip => ips.push(ip));
				}
				resolve(ips);
			}
		}).catch(reject);
	});
	recursiveLookup(process.argv[2]).then(ips => {
		console.log("Found " + ips.length + " IP addresses for " + process.argv[2] + ":");
		console.log(ips);
	}).catch(code => {
		console.error("HTTP", code);
	});
}
else
{
	console.log("Syntax: node dns.js <hostname>");
}
