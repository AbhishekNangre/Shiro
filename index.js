const { 
    Client,
    GatewayIntentBits,
    Collection
} = require("discord.js");
require("dotenv").config();
const fs = require("fs");
const path = require("path");


const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

const express = require("express");
const { Activity } = require("discord.js");
const app = express();
const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
	res.send("Bot is running!");
});

app.listen(PORT, () => {
	console.log(`Web server running on port ${PORT}`);
});

global.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
	const folderPath = path.join(commandsPath, folder);
	if (!fs.lstatSync(folderPath).isDirectory()) continue;

	const commandFiles = fs
		.readdirSync(folderPath)
		.filter((file) => file.endsWith(".js"));
	for (const file of commandFiles) {
		const command = require(path.join(folderPath, file));
		if (!command.data || !command.data.name) {
			console.warn(
				`⚠️ Warning: Command file '${file}' is missing 'data.name'. Skipping.`
			);
			continue;
		}
		global.commands.set(command.data.name, command);
	}
}

const eventsPath = path.join(__dirname, "events");
if (fs.existsSync(eventsPath)) {
	const eventFiles = fs
		.readdirSync(eventsPath)
		.filter((file) => file.endsWith(".js"));
	for (const file of eventFiles) {
		const event = require(path.join(eventsPath, file));
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args, client));
		} else {
			client.on(event.name, (...args) => event.execute(...args, client));
		}
	}
} else {
	console.warn(
		"⚠️ Warning: 'events' folder is missing. Skipping event loading."
	);
}

client
	.login(process.env.TOKEN)
	.then(() => console.log("✅ Bot is online!"))
	.catch((err) => console.error("❌ Login failed! Check your token.", err));
console.log("Bot Token:", process.env.TOKEN ? "✅ Loaded" : "❌ Not Loaded");


const PING_INTERVAL = 5 * 60 * 1000; 
const SELF_URL = process.env.SELF_URL;

if (!SELF_URL) {
    console.error("❌ SELF_URL is not set! Keep-alive ping disabled.");
} else {
    setInterval(() => {
        fetch(SELF_URL)
            .then((res) => res.text())
            .then((body) => console.log(`✅ Keep-alive ping successful: ${body}`))
            .catch((err) => console.error("❌ Keep-alive ping failed!", err));
    }, PING_INTERVAL);
}
