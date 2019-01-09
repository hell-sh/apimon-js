const apimon = require("../apimon.js");

if(process.argv.length == 3)
{
	apimon.country(process.argv[2]).then(country=>{
		// Note that the english_name and native_name properties are provided by apimon-js and not by the endpoint itself.
		console.log(country.english_name + (country.english_name == country.native_name ? "" : ", or " + country.native_name + " as the natives call it,") + " has ~" + country.population.toLocaleString() + " residents.");
	}).catch(error=>{
		console.error("An error occured:", error);
	});
}
else
{
	console.log("Syntax: node country.js <country code or name>");
}
