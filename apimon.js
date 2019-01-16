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
}
if(typeof window != "undefined")
{
	window.apimon = {};	
}

let ajax = url=>new Promise((resolve, reject)=>{
	if(typeof require != "undefined")
	{
		require("follow-redirects").https.get(url, client=>{
			let data="";
			client.on("data", chunk=>data+=chunk);
			client.on("end", ()=>{
				let json = client.headers["content-type"] == "application/json" ? JSON.parse(data) : null;
				if(client.statusCode == 200)
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
					reject(json ? json : {error: "INVALID_STATUS", got: client.statusCode});
				}
			});
			client.on("error", err=>reject({error: "NETWORK_ERROR", got: err}));
		});
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
		})
		xhr.addEventListener("error", err=>reject({error: "NETWORK_ERROR", got: err}));
		xhr.open("GET", url);
		xhr.send();
	}
	else
	{
		reject({error: "NETWORK_ERROR", got: "Found no method of interacting with the internet. What environment have you put me in?!"});
	}
})

class ApimonJsonObject
{
	constructor(json, excludes = [])
	{
		for(let key in json)
		{
			if(excludes.indexOf(key) == -1)
			{
				this[key] = json[key];
			}
		}
	}
}

class ApimonCountry extends ApimonJsonObject
{
	constructor(json)
	{
		super(json);
		this.english_name = json.name.EN;
		this.native_name = json.name[json.language.code];
	}
}

class ApimonGeoipResult extends ApimonJsonObject
{
	constructor(json)
	{
		super(json, ["country", "as"]);
		if("country"in json)
		{
			this.country = new ApimonCountry(json.country);
		}
		if("as"in json)
		{
			this.as = new ApimonAS(json.as);
		}
	}
}

class ApimonAS extends ApimonJsonObject
{
	constructor(json)
	{
		super(json, ["country"]);
		if("country"in json)
		{
			this.country = new ApimonCountry(json.country);
		}
	}
}

class ApimonMcResult extends ApimonJsonObject
{
	constructor(json)
	{
		super(json);
		if(json.valid)
		{
			this.initial_name = json.history[0].name;
		}
	}
}

expose("country", country=>new Promise((resolve, reject)=>{
	ajax("https://apimon.de/country/" + encodeURIComponent(country))
	.then(json=>resolve(new ApimonCountry(json)))
	.catch(reject);
}));

expose("dns", hostname=>new Promise((resolve, reject)=>{
	ajax("https://apimon.de/dns/" + encodeURIComponent(hostname))
	.then(json=>resolve(json))
	.catch(reject);
}));

expose("geoip", ip=>new Promise((resolve, reject)=>{
	ajax("https://apimon.de/geoip/" + encodeURIComponent(ip))
	.then(json=>resolve(new ApimonGeoipResult(json)))
	.catch(reject);
}));

expose("mc", arg=>new Promise((resolve, reject)=>{
	ajax("https://apimon.de/mc/" + arg)
	.then(json=>resolve(new ApimonMcResult(json)))
	.catch(reject);
}));

expose("redirect", arg=>new Promise((resolve, reject)=>{
	ajax("https://apimon.de/redirect/" + encodeURIComponent(arg))
	.then(json=>resolve(json))
	.catch(reject);
}));

expose("ip", ()=>new Promise((resolve, reject)=>{
	ajax("https://ip.apimon.de/")
	.then(ip=>resolve(ip))
	.catch(reject);
}));
expose("ipv4", ()=>new Promise((resolve, reject)=>{
	ajax("https://ipv4.apimon.de/")
	.then(ip=>resolve(ip))
	.catch(reject);
}));
expose("ipv6", ()=>new Promise((resolve, reject)=>{
	ajax("https://ipv6.apimon.de/")
	.then(ip=>resolve(ip))
	.catch(reject);
}));
