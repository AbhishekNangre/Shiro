const { REST, Routes, ActivityType, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

module.exports = {
	name: "ready",
	once: true,
	async execute(client) {
		console.log(`✅ Logged in as ${client.user.tag}`);

		
		client.commands = new Collection();
		const commands = [];
		const commandFolders = fs.readdirSync("./commands");

		
		for (const folder of commandFolders) {
			const folderPath = path.join("./commands", folder);
			const commandFiles = fs
				.readdirSync(folderPath)
				.filter((file) => file.endsWith(".js"));

			for (const file of commandFiles) {
				const command = require(path.join(__dirname, "..", folderPath, file));
				if (command.data) {
					commands.push(command.data.toJSON());
					client.commands.set(command.data.name, command); // Store command in client
				}
			}
		}

		
		const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
		try {
			console.log(`🚀 Registering ${commands.length} slash commands...`);
			await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
			console.log("✅ Successfully registered all slash commands!");
		} catch (error) {
			console.error("❌ Error registering commands:", error);
		}

	
		const updateStatus = () => {
			if (!client.user) return;
			const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
			client.user.setPresence({
				activities: [{ name: `${totalMembers} users`, type: ActivityType.Watching }],
				status: "idle",
			});
		};

		
		updateStatus();
		setInterval(updateStatus, 60 * 1000);
	},
};
