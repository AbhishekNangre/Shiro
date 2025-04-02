const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const WELCOME_CONFIG = path.join(__dirname, "../welcomeConfig.json");

module.exports = {
	name: "guildMemberAdd",
	async execute(member) {
		try {
			// Load stored welcome channel ID and message
			if (!fs.existsSync(WELCOME_CONFIG)) {
				// console.warn("⚠️ No welcome configuration found.");
				return;
			}

			const config = JSON.parse(fs.readFileSync(WELCOME_CONFIG, "utf8"));
			const welcomeChannel = member.guild.channels.cache.get(config.channelID);

			if (!welcomeChannel) {
				console.warn(
					"⚠️ Welcome channel not found. Make sure to run /setup-welcome"
				);
				return;
			}

			// Replace {user} with actual user mention
			const welcomeMessage = config.message.replace(
				"{user}",
				`<@${member.id}>`
			);

			// Create embed
			const embed = new EmbedBuilder()
				.setTitle("🎉 Welcome!")
				.setDescription(welcomeMessage)
				.setColor(0x00ff00)
				.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
				.setTimestamp();

			// Send message
			await welcomeChannel.send({ embeds: [embed] });
		} catch (error) {
			console.error("❌ Error in guildMemberAdd event:", error);
		}
	},
};
