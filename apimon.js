// Copyright (c) 2019 Hell.sh
(function()
{
	"use strict";
	let expose = (name, func) => {
		if(typeof exports != "undefined")
		{
			exports[name] = func;
		}
		if(typeof window != "undefined")
		{
			window.apimon[name] = func;
		}
	},
	exposeHI = (name, func) => {
		if(typeof exports != "undefined")
		{
			exports.hi[name] = func;
		}
		if(typeof window != "undefined")
		{
			window.apimon.hi[name] = func;
		}
	},
	exposeBoth = (name, func) => {
		expose(name, func);
		exposeHI(name, func);
	};
	if(typeof exports != "undefined")
	{
		exports["hi"] = {};
	}
	if(typeof window != "undefined")
	{
		window.apimon = {hi: {}};
	}
	let ajax = url => new Promise((resolve, reject) => {
		if(typeof require != "undefined")
		{
			let req = require("https").get(url, res => {
				let data = "";
				res.on("data", chunk=>data+=chunk);
				res.on("end", ()=>{
					if(res.statusCode == 301 && res.headers.location)
					{
						ajax("https://apimon.de" + res.headers.location).then(resolve).catch(reject);
					}
					else
					{
						if(res.statusCode != 200)
						{
							reject(res.statusCode);
						}
						else if(res.headers["content-type"] == "application/json")
						{
							resolve(JSON.parse(data));
						}
						else
						{
							resolve(data);
						}
					}
				});
			});
			req.setTimeout(3000, ()=>reject(0));
			req.on("error", err=>reject(0));
			req.end();
		}
		else if(typeof XMLHttpRequest != "undefined")
		{
			let xhr=new XMLHttpRequest();
			xhr.addEventListener("load", ()=>{
				if(xhr.status != 200)
				{
					reject(xhr.status);
				}
				else if(xhr.getResponseHeader("content-type") == "application/json")
				{
					resolve(JSON.parse(xhr.responseText));
				}
				else
				{
					resolve(xhr.responseText);
				}
			});
			xhr.addEventListener("error", err=>reject(0));
			xhr.open("GET", url);
			xhr.send();
		}
		else
		{
			throw "Found no method of interacting with the internet. What environment have you put me in?!";
		}
	}),
	processAS = json => {
		if("country"in json)
		{
			json.country = processCountry(json.country);
		}
		return json;
	},
	ASforHumans = json => {
		let res = "AS" + json.number + "\nName: " + json.name;
		if(json.org)
		{
			res += "\nOwner: " + json.org;
			if(json.country)
			{
				res += "\nBased in: " + countryForHumans(json.country).split("\n").join("\n| ");
			}
		}
		if(json.abuse_contacts)
		{
			res += "\nAbuse Contacts:";
			json.abuse_contacts.forEach(contact => res += "\n- " + contact);
		}
		return res;
	},
	processCountry = json => {
		if(json.name)
		{
			json.english_name = json.name.EN;
			json.native_name = json.name[json.language.code];
		}
		return json;
	},
	countryForHumans = json => {
		let res = json.name.EN + " (" + json.alpha2_code + ")";
		if(json.name.EN != json.name[json.language.code])
		{
			res += "\nNative name: " + json.name[json.language.code];
		}
		res += "\nCapital: " + json.capital;
		res += "\nTotal Area: " + json["total_area_km²"] + " km²";
		res += "\nPopulation: " + json.population;
		res += "\nIDD Code: +" + json.idd_code;
		res += "\nccTLD: ." + json.cctld;
		res += "\nLanguage: " + json.language.name + " (" + json.language.code + ")";
		res += "\nCurrency: " + json.currency.name + " (" + json.currency.code + ")\n";
		res += json.eu_member ? "Part of the EU." : "Not a member of the EU.";
		return res;
	},
	contactForHumans=data=>{
		let res;
		if(data.name)
		{
			res = data.name;
			if(data.org)
			{
				res += "\n" + data.org;
			}
		}
		else if(data.org)
		{
			res = data.org;
		}
		else
		{
			res = "<name unknown>";
		}
		if(data.country&&data.country.name)
		{
			res += "\nCountry: " + data.country.name.EN;
		}
		if(data.city)
		{
			res += "\nCity: " + data.city;
		}
		if(data.region)
		{
			res += "\nRegion: " + data.region;
		}
		if(data.zip_code)
		{
			res += "\nZip Code: " + data.zip_code;
		}
		if(data.street)
		{
			res += "\nStreet: " + data.street;
		}
		if(data.iana_id)
		{
			res += "\nIANA ID: " + data.iana_id;
		}
		if(data.email)
		{
			res += "\nEmail: " + data.email;
		}
		if(data.phone)
		{
			res += "\nPhone: " + data.phone;
		}
		if(data.url)
		{
			res += "\nURL: " + data.url;
		}
		return res;
	};
	expose("as", asn=>new Promise((resolve, reject)=>{
		ajax("https://apimon.de/as/" + encodeURIComponent(asn))
		.then(json=>resolve(processAS(json)))
		.catch(reject);
	}));
	exposeHI("as", asn=>new Promise((resolve, reject)=>{
		ajax("https://apimon.de/as/" + encodeURIComponent(asn))
		.then(json=>resolve(ASforHumans(json)))
		.catch(reject);
	}));
	exposeHI("ASforHumans", ASforHumans);
	expose("country", country=>new Promise((resolve, reject)=>{
		ajax("https://apimon.de/country/" + encodeURIComponent(country))
		.then(json=>resolve(processCountry(json)))
		.catch(reject);
	}));
	exposeHI("country", country=>new Promise((resolve, reject)=>{
		ajax("https://apimon.de/country/" + encodeURIComponent(country))
		.then(json=>resolve(countryForHumans(json)))
		.catch(reject);
	}));
	exposeHI("countryForHumans", countryForHumans);
	expose("dns", hostname=>new Promise((resolve, reject)=>{
		ajax("https://apimon.de/dns/" + encodeURIComponent(hostname))
		.then(json=>resolve(json))
		.catch(reject);
	}));
	exposeHI("dns", hostname=>new Promise((resolve, reject)=>{
		ajax("https://apimon.de/dns/" + encodeURIComponent(hostname))
		.then(json=>{
			let res = "";
			for(let recordType in json)
			{
				if(recordType == "SOA")
				{
					res += "SOA\t" + Object.values(json.SOA).join(" ") + "\n";
				}
				else if(recordType == "CNAME")
				{
					res += "CNAME\t" + json.CNAME + "\n";
				}
				else if(recordType == "MX" || recordType == "SRV")
				{
					json[recordType].forEach(record => {
						res += recordType + "\t" + Object.values(record).join(" ") + "\n";
					});
				}
				else
				{
					json[recordType].forEach(value => {
						res += recordType + "\t" + value + "\n";
					});
				}
			}
			resolve(res.trimRight());
		})
		.catch(reject);
	}));
	expose("ip", arg=>new Promise((resolve, reject)=>{
		ajax("https://apimon.de/ip/" + encodeURIComponent(arg))
		.then(json=>{
			if("country"in json)
			{
				json.country = processCountry(json.country);
			}
			if("as"in json)
			{
				json.as = processAS(json.as);
			}
			resolve(json);
		}).catch(reject);
	}));
	exposeHI("ip", arg=>new Promise((resolve, reject)=>{
		ajax("https://apimon.de/ip/" + encodeURIComponent(arg))
		.then(json=>{
			let res = json.ip_address;
			if("hostname" in json)
			{
				res += " (" + json.hostname + ")";
			}
			if(json.country)
			{
				res += "\nCountry: " + countryForHumans(json.country).split("\n").join("\n| ");
				res += "\nRegion: " + json.region;
				res += "\nCity: " + json.city.name;
				res += "\nZip Code: " + json.zip_code;
				res += "\nUTC Offset: " + json.utc_offset;
			}
			if(json.as)
			{
				res += "\nAS: " + ASforHumans(json.as).split("\n").join("\n| ");
			}
			resolve(res);
		}).catch(reject);
	}));
	expose("mc", arg=>new Promise((resolve, reject)=>{
		ajax("https://apimon.de/mc/" + arg)
		.then(json=>{
			if("history"in json)
			{
				json.initial_name = json.history[0].name;
			}
			resolve(json);
		}).catch(reject);
	}));
	exposeHI("mc", arg=>new Promise((resolve, reject)=>{
		ajax("https://apimon.de/mc/" + arg)
		.then(json=>{
			let res=json.name;
			if(!json.paid)
			{
				if(!json.migrated)
				{
					res += "\nUnmigrated Demo Account";
				}
				else
				{
					res += "\nDemo Account";
				}
			}
			else if(!json.migrated)
			{
				res += "\nUnmigrated Account";
			}
			res += "\nUUID: " + json.id;
			if(json.history.length > 1)
			{
				json.history.forEach(entry => {
					if(entry.timestamp)
					{
						res += "\n- Changed to " + entry.name + " on " + (new Date(entry.timestamp)).toString();
					}
					else
					{
						res += "\n- Registered as " + entry.name;
					}
				});
			}
			resolve(res);
		}).catch(reject);
	}));
	expose("redirect", arg=>new Promise((resolve, reject)=>{
		ajax("https://apimon.de/redirect/" + encodeURIComponent(arg))
		.then(json=>resolve(json))
		.catch(reject);
	}));
	exposeHI("redirect", arg=>new Promise((resolve, reject)=>{
		ajax("https://apimon.de/redirect/" + encodeURIComponent(arg))
		.then(json=>{
			if(json.valid)
			{
				resolve("Destination: " + json.destination);
			}
			else
			{
				resolve("Invalid URL.");
			}
		})
		.catch(reject);
	}));
	expose("whois", arg=>new Promise((resolve, reject)=>{
		ajax("https://apimon.de/whois/" + encodeURIComponent(arg))
		.then(json=>{
			for(let k in json)
			{
				if(typeof json[k]=="object"&&"country"in json[k])
				{
					json[k].country=processCountry(json[k].country);
				}
			}
			resolve(json);
		})
		.catch(reject);
	}));
	exposeHI("whois", arg=>new Promise((resolve, reject)=>{
		ajax("https://apimon.de/whois/" + encodeURIComponent(arg))
		.then(json=>{
			let res=json.domain;
			if(json.status)
			{
				if(json.status.length > 1)
				{
					res+="\nStatus:";
					json.status.forEach(status=>res+="\n- "+status);
				}
				else
				{
					res+="\nStatus: "+json.status[0];
				}
			}
			if(json.registrar)
			{
				res+="\nRegistrar: "+contactForHumans(json.registrar).split("\n").join("\n| ");
			}
			if(json.reseller)
			{
				res+="\nReseller: "+contactForHumans(json.reseller).split("\n").join("\n| ");
			}
			if(json.registrant)
			{
				res+="\nRegistrant: "+contactForHumans(json.registrant).split("\n").join("\n| ");
			}
			if(json.admin)
			{
				res+="\nAdmin: "+contactForHumans(json.admin).split("\n").join("\n| ");
			}
			if(json.tech)
			{
				res+="\nTech: "+contactForHumans(json.tech).split("\n").join("\n| ");
			}
			resolve(res);
		})
		.catch(reject);
	}));
	exposeHI("contactForHumans", contactForHumans);
	exposeBoth("myip", ()=>new Promise((resolve, reject)=>{
		ajax("https://ip.apimon.de/")
		.then(ip=>resolve(ip))
		.catch(reject);
	}));
	exposeBoth("myipv4", ()=>new Promise((resolve, reject)=>{
		ajax("https://ipv4.apimon.de/")
		.then(ip=>resolve(ip))
		.catch(reject);
	}));
	exposeBoth("myipv6", ()=>new Promise((resolve, reject)=>{
		ajax("https://ipv6.apimon.de/")
		.then(ip=>resolve(ip))
		.catch(reject);
	}));
	exposeHI("errors", {
		0: "there was a network error",
		400: "you provided an invalid argument",
		404: "request is valid but no information was found",
		418: "you've somehow reached our kitchen",
		521: "our server is offline or overloaded",
		522: "our server is offline or overloaded",
		523: "our server is offline or overloaded",
		524: "our server is offline or overloaded"
	});
})();
