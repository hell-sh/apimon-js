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
};
if(typeof window != "undefined")
{
	window.apimon = {};
}

let ajax = url=>new Promise((resolve, reject)=>{
	if(typeof require != "undefined")
	{
		let req = require("https").get(url, res=>{
			let data = "";
			res.on("data", chunk=>data+=chunk);
			res.on("end", ()=>{
				if(res.statusCode == 301 && res.headers.location)
				{
					ajax("https://apimon.de" + res.headers.location).then(resolve).catch(reject);
				}
				else
				{
					let json = (res.headers["content-type"] == "application/json" ? JSON.parse(data) : null);
					if(res.statusCode == 200)
					{
						if(json)
						{
							if(json.error)
							{
								reject(json);
							}
							else
							{
								resolve(json);
							}
						}
						else
						{
							resolve(data);
						}
					}
					else
					{
						reject(json ? json : {error: "INVALID_STATUS", got: res.statusCode});
					}
				}
			});
		});
		req.setTimeout(3000, ()=>reject({error: "NETWORK_ERROR", got: "Request timeout"}));
		req.on("error", err=>reject({error: "NETWORK_ERROR", got: err}));
		req.end();
	}
	else if(typeof XMLHttpRequest != "undefined")
	{
		let xhr=new XMLHttpRequest();
		xhr.addEventListener("load", ()=>{
			if(xhr.status == 200)
			{
				if(xhr.responseJson)
				{
					if(xhr.responseJson.error)
					{
						reject(xhr.responseJson);
					}
					else
					{
						resolve(xhr.responseJson);
					}
				}
				else
				{
					resolve(xhr.responseText);
				}
			}
			else
			{
				reject(xhr.responseJson ? xhr.responseJson : {error: "INVALID_STATUS", got: xhr.status});
			}
		});
		xhr.addEventListener("error", err=>reject({error: "NETWORK_ERROR", got: err}));
		xhr.open("GET", url);
		xhr.send();
	}
	else
	{
		reject({error: "NETWORK_ERROR", got: "Found no method of interacting with the internet. What environment have you put me in?!"});
	}
}),
processCountry = json => {
	json.english_name = json.name.EN;
	json.native_name = json.name[json.language.code];
	return json;
};

expose("country", country=>new Promise((resolve, reject)=>{
	ajax("https://apimon.de/country/" + encodeURIComponent(country))
	.then(json=>resolve(processCountry(json)))
	.catch(reject);
}));

expose("dns", hostname=>new Promise((resolve, reject)=>{
	ajax("https://apimon.de/dns/" + encodeURIComponent(hostname))
	.then(json=>resolve(json))
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
			json.as.country = processCountry(json.as.country);
		}
		resolve(json);
	}).catch(reject);
}));

expose("mc", arg=>new Promise((resolve, reject)=>{
	ajax("https://apimon.de/mc/" + arg)
	.then(json=>{
		if(json.valid)
		{
			json.initial_name = json.history[0].name;
		}
		resolve(json);
	}).catch(reject);
}));

expose("redirect", arg=>new Promise((resolve, reject)=>{
	ajax("https://apimon.de/redirect/" + encodeURIComponent(arg))
	.then(json=>resolve(json))
	.catch(reject);
}));

expose("myip", ()=>new Promise((resolve, reject)=>{
	ajax("https://ip.apimon.de/")
	.then(ip=>resolve(ip))
	.catch(reject);
}));
expose("myipv4", ()=>new Promise((resolve, reject)=>{
	ajax("https://ipv4.apimon.de/")
	.then(ip=>resolve(ip))
	.catch(reject);
}));
expose("myipv6", ()=>new Promise((resolve, reject)=>{
	ajax("https://ipv6.apimon.de/")
	.then(ip=>resolve(ip))
	.catch(reject);
}));
