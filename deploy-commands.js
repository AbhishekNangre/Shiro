const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const commands = [];
const commandFolders = fs.readdirSync("./commands");

for (const folder of commandFolders) {
	const folderPath = path.join("./commands", folder);
	const commandFiles = fs
		.readdirSync(folderPath)
		.filter((file) => file.endsWith(".js"));

	for (const file of commandFiles) {
		const command = require(path.join(__dirname, folderPath, file));
		if (command.data) {
			commands.push(command.data.toJSON());
		}
	}
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
	try {
		console.log(`🚀 Registering ${commands.length} slash commands...`);
		await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
			body: commands,
		});
		console.log("✅ Successfully registered all slash commands!");
	} catch (error) {
		console.error("❌ Error registering commands:", error);
	}
})();
