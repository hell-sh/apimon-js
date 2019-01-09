"use strict";

let isWeb = (typeof exports == "undefined"),
expose = (name, func) => {
	if(isWeb)
	{
		window.apimon[name] = func;
	}
	else
	{
		exports[name] = func;
	}
}
if(isWeb)
{
	window.apimon = {};
}

let ajax = url=>new Promise((resolve, reject)=>{
	if(isWeb)
	{
		let xhr=new XMLHttpRequest();
		xhr.addEventListener("load", ()=>{
			let res = (xhr.responseJson ? xhr.responseJson : xhr.responseText);
			if(xhr.status == 200)
			{
				resolve(res);
			}
			else
			{
				reject(res);
			}
		})
		xhr.addEventListener("error", ()=>reject());
		xhr.open("GET", url);
		xhr.send();
	}
	else
	{
		require("https").get(url, client=>{
			let data="";
			client.on("data", chunk=>data+=chunk);
			client.on("end", ()=>{
				let res = (client.headers["content-type"] == "application/json" ? JSON.parse(data) : data);
				if(client.statusCode == 200)
				{
					resolve(res);
				}
				else
				{
					reject(res);
				}
			});
			client.on("error", ()=>reject());
		});
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
	.then(json=>resolve(json))
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
