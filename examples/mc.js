const apimon = require("../apimon.js");

if(process.argv.length == 3)
{
	apimon.mc(process.argv[2]).then(result=>{
		if(result.valid)
		{
			if(result.history.length > 1)
			{
				console.log(result.name + " was intially named " + result.initial_name);
			}
			else
			{
				console.log(result.name + " never changed their name.");
			}
		}
		else
		{
			console.log("Couldn't find a Minecraft account named", process.argv[2]);
		}
	}).catch(error=>{
		console.error("An error occured:", error);
	});
}
else
{
	console.log("Syntax: node mc.js <uuid, username or old username followed by /old>");
}
